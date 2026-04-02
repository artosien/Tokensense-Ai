"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { 
    ImageIcon, ArrowRight, Lock, AlertCircle, Sparkles, Settings2, Info, 
    Plus, Trash2, Download, Scale, Gauge, MousePointer2, FileText, Layout,
    TrendingDown, Upload, MessageSquare, CheckCircle2, ChevronRight, Maximize2,
    Crop, Target
} from "lucide-react";
import { models, ModelConfig } from "@/lib/models";
import { calculateImageTokens, getVisionOptimization, ImageContentType } from "@/lib/imageTokenMath";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { countTokensSync } from "@/lib/tokenizer";

interface ZoomCrop {
    id: string;
    x: number; // percentage 0-100
    y: number;
    w: number;
    h: number;
}

interface ImageItem {
    id: string;
    width: number;
    height: number;
    preview: string;
    fileName: string;
    contentType: ImageContentType;
    zoomCrops: ZoomCrop[];
}

const TASK_PRESETS = {
    captioning: 50,
    extraction: 500,
    vqa: 200,
    custom: 0
};

const SWEET_SPOTS = [
    { model: "GPT-4o", zone: "Under 512x512", reward: "Low-Res Discount (85 tkn)", limit: "2048x2048 max" },
    { model: "Gemini 1.5", zone: "Under 384x384", reward: "Flat Frame (258 tkn)", limit: "Tiled at 768px" },
    { model: "Claude 3.5", zone: "Under 1MP", reward: "Variable (avg 1.6k)", limit: "1568x1568 max" },
];

// ─── Tile Overlay Component ───────────────────────────────────────────────────

const TileOverlay = ({ width, height, model, detailMode }: { width: number, height: number, model: ModelConfig, detailMode: string }) => {
    const strategy = model.visionPricing?.strategy;
    
    if (!strategy) return null;

    // OpenAI 512px Tiling Logic
    if (strategy === "openai-tiles" && detailMode === 'high') {
        let scaledW = width;
        let scaledH = height;

        if (Math.max(scaledW, scaledH) > 2048) {
            const ratio = 2048 / Math.max(scaledW, scaledH);
            scaledW = Math.round(scaledW * ratio);
            scaledH = Math.round(scaledH * ratio);
        }

        const shortSide = Math.min(scaledW, scaledH);
        if (shortSide > 768) {
            const ratio = 768 / shortSide;
            scaledW = Math.round(scaledW * ratio);
            scaledH = Math.round(scaledH * ratio);
        }

        const cols = Math.ceil(scaledW / 512);
        const rows = Math.ceil(scaledH / 512);

        return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl border border-white/10">
                <div className="grid w-full h-full" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
                    {Array.from({ length: cols * rows }).map((_, i) => (
                        <div key={i} className="border-[0.5px] border-[#00dcb4]/40 bg-[#00dcb4]/5 flex flex-col items-center justify-center p-1">
                            <span className="text-[8px] font-mono text-[#00dcb4] font-bold uppercase tracking-tighter">GPT Tile {i + 1}</span>
                            <span className="text-[9px] font-bold text-white/80">170 tkn</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Gemini 768px Tiling Logic
    if (strategy === "gemini-flat") {
        const isMini = width <= 384 && height <= 384;
        const cols = isMini ? 1 : Math.ceil(width / 768);
        const rows = isMini ? 1 : Math.ceil(height / 768);

        return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl border border-white/10">
                <div className="grid w-full h-full" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
                    {Array.from({ length: cols * rows }).map((_, i) => (
                        <div key={i} className="border-[0.5px] border-cyan-400/40 bg-cyan-400/5 flex flex-col items-center justify-center p-1">
                            <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-tighter">
                                {isMini ? "Low-Res Frame" : `Gemini Tile ${i + 1}`}
                            </span>
                            <span className="text-[9px] font-bold text-white/80">258 tkn</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

// ─── Main Multimodal Tool ─────────────────────────────────────────────────────

export default function MultimodalEstimator() {
    const t = useTranslations("multimodal");
    const visionModels = models.filter((m) => m.visionPricing);
    const [selectedModelId, setSelectedModelId] = useState(visionModels.length > 0 ? visionModels[0].id : "");
    const [detailMode, setDetailMode] = useState<"low" | "high">("high");
    const [images, setImages] = useState<ImageItem[]>([]);
    const [taskPreset, setTaskPreset] = useState<keyof typeof TASK_PRESETS>("captioning");
    const [promptText, setPromptText] = useState("");
    const [isDenseText, setIsDenseText] = useState(false);
    const [customOutputTokens, setCustomOutputTokens] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Zooming state
    const [isZoomMode, setIsZoomMode] = useState(false);
    const [activeImageId, setActiveImageId] = useState<string | null>(null);
    const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
    const [dragCurrent, setDragCurrent] = useState<{ x: number, y: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const model = visionModels.find((m) => m.id === selectedModelId) || visionModels[0];

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
        setError(null);
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                const img = new window.Image();
                img.onload = () => {
                    setImages(prev => [
                        ...prev.filter(i => i.id !== 'sample'),
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            width: img.width,
                            height: img.height,
                            preview: dataUrl,
                            fileName: file.name,
                            contentType: "natural",
                            zoomCrops: []
                        }
                    ]);
                };
                img.src = dataUrl;
            };
            reader.readAsDataURL(file);
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
        maxSize: 10 * 1024 * 1024,
    });

    const handleMouseDown = (e: React.MouseEvent, imgId: string) => {
        if (!isZoomMode) return;
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setDragStart({ x, y });
        setDragCurrent({ x, y });
        setActiveImageId(imgId);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isZoomMode || !dragStart) return;
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setDragCurrent({ x, y });
    };

    const handleMouseUp = () => {
        if (!isZoomMode || !dragStart || !dragCurrent || !activeImageId) {
            setDragStart(null);
            setDragCurrent(null);
            return;
        }

        const x = Math.min(dragStart.x, dragCurrent.x);
        const y = Math.min(dragStart.y, dragCurrent.y);
        const w = Math.abs(dragStart.x - dragCurrent.x);
        const h = Math.abs(dragStart.y - dragCurrent.y);

        if (w > 2 && h > 2) {
            setImages(prev => prev.map(img => {
                if (img.id === activeImageId) {
                    return {
                        ...img,
                        zoomCrops: [...img.zoomCrops, { id: Math.random().toString(), x, y, w, h }]
                    };
                }
                return img;
            }));
        }

        setDragStart(null);
        setDragCurrent(null);
    };

    const removeCrop = (imgId: string, cropId: string) => {
        setImages(prev => prev.map(img => {
            if (img.id === imgId) {
                return { ...img, zoomCrops: img.zoomCrops.filter(c => c.id !== cropId) };
            }
            return img;
        }));
    };

    const totals = useMemo(() => {
        let inputTokensCount = 0;
        let zoomTokensCount = 0;
        
        const perImageResults = images.map(img => {
            const res = calculateImageTokens(img.width, img.height, model, detailMode, img.contentType);
            inputTokensCount += res.tokens;
            
            // Agentic Zoom logic: Each crop is treated as a high-res patch (258 tokens for Gemini, 170 for GPT)
            const zoomTokenRate = model.visionPricing?.strategy === 'gemini-flat' ? 258 : 170;
            const imageZoomTokens = img.zoomCrops.length * zoomTokenRate;
            zoomTokensCount += imageZoomTokens;

            return { ...img, ...res, imageZoomTokens };
        });

        const promptTokens = promptText ? countTokensSync(promptText) : 0;
        const totalInput = inputTokensCount + promptTokens + zoomTokensCount;
        const outputTokens = taskPreset === "custom" ? customOutputTokens : TASK_PRESETS[taskPreset];
        const totalTokens = totalInput + outputTokens;
        const totalCost = (totalInput / 1_000_000) * model.inputPricePer1M + (outputTokens / 1_000_000) * model.outputPricePer1M;

        return { inputTokens: inputTokensCount, zoomTokens: zoomTokensCount, promptTokens, totalInput, outputTokens, totalTokens, totalCost, perImageResults };
    }, [images, model, detailMode, taskPreset, customOutputTokens, promptText]);

    const contextPercent = Math.min(100, (totals.totalTokens / model.maxContext) * 100);

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* ── Left Column: Configuration & Gallery ── */}
                <div className="lg:col-span-7 space-y-6">
                    
                    {/* Primary Upload Zone */}
                    <Card className="shadow-2xl border-indigo-500/20 bg-indigo-500/5 backdrop-blur-md overflow-hidden relative">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Master Upload Zone
                                </CardTitle>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Client-Side Analysis
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div {...getRootProps()} className={cn(
                                "relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all duration-500 cursor-pointer group",
                                isDragActive ? "border-indigo-400 bg-indigo-500/20" : "border-white/10 bg-white/5 hover:border-indigo-500/40"
                            )}>
                                <input {...getInputProps()} />
                                <div className="text-center">
                                    <ImageIcon className="w-10 h-10 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                    <p className="text-lg text-slate-200 font-black tracking-tight uppercase">Analyze Multimodal Input</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Drag images or click to browse</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Agentic Vision Section */}
                    <Card className="border-cyan-500/20 bg-cyan-500/5 overflow-hidden">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    Agentic Vision Simulation
                                </CardTitle>
                                <div className="flex items-center space-x-2">
                                    <Switch id="zoom-mode" checked={isZoomMode} onCheckedChange={setIsZoomMode} />
                                    <Label htmlFor="zoom-mode" className="text-[10px] font-black uppercase text-slate-500 cursor-pointer">Enable Zoom Mode</Label>
                                </div>
                            </div>
                            <CardDescription className="text-[10px] uppercase font-bold text-slate-500">
                                Simulate Gemini 3 Flash / GPT-4o "Attention Zooms." Draw boxes on your images to calculate extra patch costs.
                            </CardDescription>
                        </CardHeader>
                        {isZoomMode && (
                            <CardContent>
                                <div className="flex items-center gap-2 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] font-bold text-cyan-400 animate-in fade-in">
                                    <Info className="w-3.5 h-3.5" />
                                    INSTRUCTIONS: Draw a box over any image below to zoom in on specific details.
                                </div>
                            </CardContent>
                        )}
                        
                        {/* Agentic Vision Explanation */}
                        <div className="px-6 pb-6 pt-2 border-t border-cyan-500/10 bg-cyan-500/[0.02]">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h4 className="text-[11px] font-black text-cyan-400 uppercase tracking-widest">What is Agentic Vision Simulation?</h4>
                                    <p className="text-[11px] text-slate-400 leading-relaxed">
                                        In 2026, leading AI development has moved from static analysis to <strong>Agentic Vision</strong>. Models like GPT-5 and Gemini 3.1 no longer just process a single image. Instead, agents autonomously decide to crop, zoom, and re-examine specific regions to achieve higher accuracy. This isn&apos;t a single call; it&apos;s a multi-turn visual conversation.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <h5 className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                                            <div className="w-1 h-1 rounded-full bg-cyan-500" />
                                            Cost Multiplication
                                        </h5>
                                        <ul className="space-y-1.5 text-[10px] text-slate-500 leading-tight">
                                            <li><strong className="text-slate-400">Discovery Pass:</strong> The initial low-res look at the whole scene.</li>
                                            <li><strong className="text-slate-400">Focus Crop:</strong> A high-detail zoom on a specific detail.</li>
                                            <li><strong className="text-slate-400">Recursive Scan:</strong> Agents may perform 3-5 crops per image.</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <h5 className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                                            <div className="w-1 h-1 rounded-full bg-cyan-500" />
                                            Why Simulate?
                                        </h5>
                                        <ul className="space-y-1.5 text-[10px] text-slate-500 leading-tight">
                                            <li><strong className="text-slate-400">Token Accumulation:</strong> High-res tiles "weight" the entire history.</li>
                                            <li><strong className="text-slate-400">ROI Calculation:</strong> Find the point where more zooms drain ROI.</li>
                                            <li><strong className="text-slate-400">Latency vs Precision:</strong> Visualize the cost of a "deep look."</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Multimodal Prompt Buffer */}
                    <Card className="border-white/5 bg-slate-900/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-indigo-400" />
                                Multimodal Prompt Buffer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea 
                                placeholder="Describe the image or provide instructions... (e.g., 'Extract all text from this invoice')"
                                className="min-h-[100px] bg-white/5 border-white/10 text-sm font-medium focus-visible:ring-indigo-500 rounded-xl"
                                value={promptText}
                                onChange={(e) => setPromptText(e.target.value)}
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch id="dense-text" checked={isDenseText} onCheckedChange={setIsDenseText} />
                                        <Label htmlFor="dense-text" className="text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer">Dense Text / OCR</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="detail-toggle" checked={detailMode === 'high'} onCheckedChange={(v) => setDetailMode(v ? 'high' : 'low')} />
                                        <Label htmlFor="detail-toggle" className="text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer">High Detail</Label>
                                    </div>
                                </div>
                                <div className="text-[10px] font-mono font-bold text-indigo-400 uppercase">
                                    {totals.promptTokens.toLocaleString()} text tokens
                                </div>
                            </div>
                            {isDenseText && (
                                <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] font-bold text-amber-400 animate-in fade-in slide-in-from-left-2">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    TIP: High-detail mode is recommended for this image to ensure accurate OCR extraction.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Global Parameters */}
                    <Card className="border-white/5 bg-slate-900/50 backdrop-blur-md">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Settings2 className="w-4 h-4 text-indigo-400" />
                                Processing Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Target Model</Label>
                                <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                                    <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl">
                                        <SelectValue placeholder="Model" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10">
                                        {visionModels.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t("task_preset")}</Label>
                                <Select value={taskPreset} onValueChange={(v: any) => setTaskPreset(v)}>
                                    <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl">
                                        <SelectValue placeholder="Task" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10">
                                        <SelectItem value="captioning">{t("captioning")}</SelectItem>
                                        <SelectItem value="vqa">{t("vqa")}</SelectItem>
                                        <SelectItem value="extraction">{t("extraction")}</SelectItem>
                                        <SelectItem value="custom">{t("custom")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Image Gallery */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-1 gap-4">
                            {totals.perImageResults.map((img) => (
                                <Card key={img.id} className="bg-white/5 border-white/5 rounded-2xl overflow-hidden group hover:border-indigo-500/20 transition-all">
                                    <div className="flex flex-col md:flex-row">
                                        <div 
                                            className={cn(
                                                "relative w-full md:w-64 h-64 bg-black shadow-inner overflow-hidden select-none",
                                                isZoomMode ? "cursor-crosshair" : "cursor-default"
                                            )}
                                            onMouseDown={(e) => handleMouseDown(e, img.id)}
                                            onMouseMove={handleMouseMove}
                                            onMouseUp={handleMouseUp}
                                            onMouseLeave={handleMouseUp}
                                        >
                                            <Image src={img.preview} alt="Preview" fill className="object-contain pointer-events-none" unoptimized />
                                            <TileOverlay width={img.width} height={img.height} model={model} detailMode={detailMode} />
                                            
                                            {/* Render Active Zoom Crops */}
                                            {img.zoomCrops.map(crop => (
                                                <div 
                                                    key={crop.id}
                                                    className="absolute border-2 border-cyan-400 bg-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.5)] group/crop"
                                                    style={{ left: `${crop.x}%`, top: `${crop.y}%`, width: `${crop.w}%`, height: `${crop.h}%` }}
                                                >
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); removeCrop(img.id, crop.id); }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/crop:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Render Current Drag */}
                                            {dragStart && activeImageId === img.id && dragCurrent && (
                                                <div 
                                                    className="absolute border-2 border-white border-dashed bg-white/10"
                                                    style={{
                                                        left: `${Math.min(dragStart.x, dragCurrent.x)}%`,
                                                        top: `${Math.min(dragStart.y, dragCurrent.y)}%`,
                                                        width: `${Math.abs(dragStart.x - dragCurrent.x)}%`,
                                                        height: `${Math.abs(dragStart.y - dragCurrent.y)}%`
                                                    }}
                                                />
                                            )}

                                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[8px] font-mono text-white/80 font-bold uppercase tracking-widest">
                                                {model.visionPricing?.strategy === 'openai-tiles' ? "512px Tile Analysis" : "768px Frame Analysis"}
                                            </div>
                                        </div>
                                        <CardContent className="flex-1 p-6 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-white truncate max-w-[240px]">{img.fileName}</p>
                                                    <p className="text-[10px] font-mono text-indigo-400 font-black uppercase tracking-tighter">{img.width}x{img.height} Native Res</p>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))}
                                                    className="text-slate-500 hover:text-red-400 h-8 w-8"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3">
                                                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Base Tokens</div>
                                                    <div className="text-lg font-black text-white font-mono">{img.tokens.toLocaleString()}</div>
                                                </div>
                                                <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-3">
                                                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Zoom Patches</div>
                                                    <div className="text-lg font-black text-cyan-400 font-mono">+{img.imageZoomTokens.toLocaleString()}</div>
                                                </div>
                                            </div>

                                            {/* Smart Optimization */}
                                            {(() => {
                                                const opt = getVisionOptimization(img.width, img.height, img.tokens);
                                                if (opt.improvementPercent < 10) return null;
                                                return (
                                                    <div className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                                                        <div className="space-y-0.5">
                                                            <div className="text-[10px] font-black text-emerald-400 uppercase flex items-center gap-1">
                                                                <TrendingDown className="w-3 h-3" />
                                                                {opt.improvementPercent}% Saving Potential
                                                            </div>
                                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Target: {opt.recommendedWidth}px max</p>
                                                        </div>
                                                        <Button variant="outline" size="sm" className="h-7 text-[9px] font-black uppercase border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10">
                                                            Optimize
                                                        </Button>
                                                    </div>
                                                );
                                            })()}
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Resolution Sweet Spot Guide */}
                    <Card className="border-indigo-500/10 bg-indigo-500/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                <Scale className="w-4 h-4" />
                                Resolution "Sweet Spot" Guide
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 divide-y divide-white/5">
                                {SWEET_SPOTS.map((s, idx) => (
                                    <div key={idx} className="py-3 flex items-center justify-between text-[10px] font-bold">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-white uppercase tracking-tight">{s.model}</span>
                                            <span className="text-slate-500 font-black uppercase tracking-widest">{s.zone}</span>
                                        </div>
                                        <div className="text-right flex flex-col gap-0.5">
                                            <span className="text-emerald-400 uppercase tracking-tighter">{s.reward}</span>
                                            <span className="text-slate-600 font-mono">{s.limit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Right Column: Summary & Analysis ── */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="shadow-2xl border-indigo-500/20 bg-slate-900/80 backdrop-blur-xl h-full flex flex-col sticky top-6 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
                        <CardHeader className="pb-4 border-b border-white/5">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center justify-between">
                                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Comprehensive Multimodal Bill</span>
                                <span className="text-slate-500 font-mono">APRIL 2026</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-8">
                            <div className="text-center space-y-1">
                                <div className="text-6xl font-black tracking-tighter text-white tabular-nums font-mono">
                                    ${totals.totalCost.toFixed(5)}
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Estimated Total Cost per Request</p>
                            </div>

                            {/* Token Distribution Bar */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-indigo-400">{totals.inputTokens.toLocaleString()} Vision</span>
                                    <span className="text-cyan-400">{totals.zoomTokens.toLocaleString()} Zoom</span>
                                    <span className="text-indigo-200">{totals.promptTokens.toLocaleString()} Text</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${(totals.inputTokens / totals.totalTokens) * 100}%` }} />
                                    <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${(totals.zoomTokens / totals.totalTokens) * 100}%` }} />
                                    <div className="h-full bg-indigo-300 transition-all duration-1000" style={{ width: `${(totals.promptTokens / totals.totalTokens) * 100}%` }} />
                                    <div className="h-full bg-slate-600 transition-all duration-1000" style={{ width: `${(totals.outputTokens / totals.totalTokens) * 100}%` }} />
                                </div>
                            </div>

                            {/* Context Window Occupancy */}
                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-slate-400">
                                        <Gauge className={cn("w-4 h-4", contextPercent > 80 ? "text-red-400" : "text-emerald-400")} />
                                        Context Occupancy
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-white">{totals.totalTokens.toLocaleString()} / {(model.maxContext / 1000).toFixed(0)}k</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className={cn("h-full transition-all duration-1000", contextPercent > 90 ? "bg-red-500" : contextPercent > 70 ? "bg-amber-500" : "bg-indigo-500")} 
                                        style={{ width: `${contextPercent}%` }} 
                                    />
                                </div>
                                <p className="text-[9px] text-center font-black uppercase tracking-tighter text-slate-500">
                                    {contextPercent > 90 ? "⚠️ Danger: Nearing Context Boundary" : "✅ Safe: Significant Headroom Remaining"}
                                </p>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-slate-400 uppercase tracking-widest flex items-center gap-2"><ImageIcon className="w-3.5 h-3.5" /> Initial Pass</span>
                                    <span className="text-white font-mono">{totals.inputTokens.toLocaleString()} tokens</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-cyan-400 uppercase tracking-widest flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Zoomed Detail</span>
                                    <span className="text-white font-mono">{totals.zoomTokens.toLocaleString()} tokens</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-slate-400 uppercase tracking-widest flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Text Prompt</span>
                                    <span className="text-white font-mono">{totals.promptTokens.toLocaleString()} tokens</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-slate-400 uppercase tracking-widest flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5" /> Est. Response</span>
                                    <span className="text-white font-mono">{totals.outputTokens.toLocaleString()} tokens</span>
                                </div>
                                <div className="flex items-center justify-between text-xl font-black pt-6 border-t border-white/10 text-white uppercase tracking-tighter">
                                    <span>Total Bill</span>
                                    <span className="font-mono text-indigo-400">{totals.totalTokens.toLocaleString()}</span>
                                </div>
                            </div>

                            <Link href="/comparison" className="block w-full">
                                <Button className="w-full h-14 bg-white text-black hover:bg-slate-200 font-black uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95 transition-all">
                                    <Scale className="w-4 h-4 mr-2" />
                                    Compare Vision Models
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
