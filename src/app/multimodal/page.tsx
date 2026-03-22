"use client";

import { useState, useCallback, useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { ImageIcon, ArrowRight, Lock, AlertCircle, Sparkles, Settings2, Info } from "lucide-react";
import { models } from "@/lib/models";
import { calculateImageTokens } from "@/lib/imageTokenMath";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function MultimodalPage() {
    const visionModels = models.filter((m) => m.visionPricing);
    const [selectedModelId, setSelectedModelId] = useState(visionModels.length > 0 ? visionModels[0].id : "");
    const [detailMode, setDetailMode] = useState<"low" | "high">("high");

    const [imageWidth, setImageWidth] = useState<number | null>(null);
    const [imageHeight, setImageHeight] = useState<number | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSample, setIsSample] = useState(true);

    // Preload sample image
    useEffect(() => {
        const sampleUrl = "/hero-banner.jpg";
        setImagePreview(sampleUrl);
        setFileName("sample-image.jpg");
        
        const img = new window.Image();
        img.onload = () => {
            setImageWidth(img.width);
            setImageHeight(img.height);
        };
        img.src = sampleUrl;
    }, []);

    const model = visionModels.find((m) => m.id === selectedModelId) || visionModels[0];

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
        setError(null);
        
        if (fileRejections.length > 0) {
            const rejection = fileRejections[0];
            if (rejection.file.size > 10 * 1024 * 1024) {
                setError("File is too large. Max size is 10MB.");
            } else {
                setError("Unsupported file format. Please use PNG, JPG, WEBP, or GIF.");
            }
            return;
        }

        const file = acceptedFiles[0];
        if (!file) return;

        setFileName(file.name);
        setIsSample(false);

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setImagePreview(dataUrl);

            const img = new window.Image();
            img.onload = () => {
                setImageWidth(img.width);
                setImageHeight(img.height);
            };
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "image/webp": [".webp"],
            "image/gif": [".gif"],
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    // Calculate Token Estimations
    const result = (imageWidth && imageHeight && model)
        ? calculateImageTokens(imageWidth, imageHeight, model, detailMode)
        : { tokens: 0 };

    const estimatedCost = model ? (result.tokens / 1_000_000) * model.inputPricePer1M : 0;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SiteHeader />

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="space-y-4 mb-10 text-center md:text-left relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2 animate-pulse">
                        <Lock className="w-3 h-3" />
                        Private & Local Processing
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                        Multimodal <span className="text-indigo-500">Vision</span> Estimator
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl border-l-4 border-indigo-500 pl-4">
                        Image token costs are calculated based on pixel scaling, not file size.
                        Every model resizes and tiles images differently. Compare OpenAI, Anthropic, and Google vision costs side-by-side.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Controls Panel */}
                    <div className="space-y-6">
                        <Card className="shadow-xl border-white/5 bg-slate-900/50 backdrop-blur-md overflow-hidden relative">
                            {isDragActive && (
                                <div className="absolute inset-0 z-50 bg-indigo-600/20 border-4 border-dashed border-indigo-500 rounded-xl animate-in fade-in duration-200 flex items-center justify-center backdrop-blur-sm">
                                    <div className="text-center">
                                        <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-2 animate-bounce" />
                                        <p className="text-lg font-bold text-white uppercase tracking-tighter">Drop image to analyze</p>
                                    </div>
                                </div>
                            )}
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Upload Image</CardTitle>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                        Processed Locally
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div
                                    {...getRootProps()}
                                    className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer group
                                        ${isDragActive
                                            ? "border-indigo-500 bg-indigo-500/10"
                                            : "border-white/10 bg-white/5 hover:bg-indigo-500/5 hover:border-indigo-500/40"}`}
                                >
                                    <input {...getInputProps()} />
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                          <ImageIcon className="w-8 h-8 text-indigo-400" />
                                        </div>
                                        <p className="mb-1 text-base text-slate-200 font-bold">
                                            <span className="text-indigo-400">Click to upload</span> or drag image
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium">PNG, JPG, WEBP, or GIF (Max 10MB)</p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-xs font-bold text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-in shake-1 duration-300">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}

                                {imageWidth && imageHeight && (
                                    <div className={`flex items-center justify-between p-3 rounded-xl border animate-in slide-in-from-bottom-2 duration-500 ${isSample ? 'bg-amber-500/10 border-amber-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Active File</span>
                                            <span className="text-sm font-bold text-slate-200 truncate max-w-[180px]">{fileName}</span>
                                        </div>
                                        {isSample && (
                                            <span className="text-[10px] font-black bg-amber-500 text-black px-2 py-0.5 rounded-md">SAMPLE</span>
                                        )}
                                        <div className="text-right">
                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Native Res</span>
                                            <span className="text-sm font-mono font-bold text-indigo-400">{imageWidth}x{imageHeight}</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-xl border-white/5 bg-slate-900/50 backdrop-blur-md">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Vision Parameters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Model Selection</Label>
                                    <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                                        <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 text-slate-200">
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10">
                                            {visionModels.map((m) => (
                                                <SelectItem key={m.id} value={m.id} className="cursor-pointer">
                                                    {m.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {model?.visionPricing?.strategy === "openai-tiles" && (
                                    <div className="pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Settings2 className="w-4 h-4 text-indigo-400" />
                                                <Label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Detail Level</Label>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] font-bold ${detailMode === 'low' ? 'text-indigo-400' : 'text-slate-500'}`}>LOW</span>
                                                <Switch 
                                                    checked={detailMode === "high"} 
                                                    onCheckedChange={(val) => setDetailMode(val ? "high" : "low")} 
                                                />
                                                <span className={`text-[10px] font-bold ${detailMode === 'high' ? 'text-indigo-400' : 'text-slate-500'}`}>HIGH</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-500 leading-relaxed italic">
                                            {detailMode === 'low' 
                                                ? "Low detail mode uses a flat 85 tokens regardless of image size." 
                                                : "High detail mode uses tiling and incurs more tokens for higher resolutions."}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results Panel */}
                    <div className="space-y-6">
                        <Card className="shadow-2xl border-indigo-500/20 bg-slate-900/80 backdrop-blur-xl h-full flex flex-col">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Analysis Results
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col space-y-6">
                                {imagePreview ? (
                                    <div className="space-y-6 animate-in zoom-in-95 duration-500">
                                        <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-white/10 bg-black shadow-inner flex items-center justify-center group">
                                            <Image 
                                              src={imagePreview} 
                                              alt="Preview" 
                                              fill
                                              unoptimized
                                              className="object-contain transition-transform duration-700 group-hover:scale-105" 
                                            />
                                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[9px] font-mono text-white/70 border border-white/5">
                                                {imageWidth}x{imageHeight}px
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="p-5 rounded-2xl border border-white/5 bg-white/5 shadow-xl relative overflow-hidden group">
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Token Payload</div>
                                                <div className="text-4xl font-black tracking-tighter text-white tabular-nums font-mono">
                                                    {result.tokens.toLocaleString()}
                                                </div>
                                                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                                    <Info className="w-12 h-12 text-white" />
                                                </div>
                                            </div>
                                            <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 shadow-xl relative overflow-hidden group">
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Est. API Cost</div>
                                                <div className="text-4xl font-black tracking-tighter text-indigo-400 tabular-nums font-mono">
                                                    ${estimatedCost.toFixed(5)}
                                                </div>
                                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                                    <ArrowRight className="w-12 h-12 text-indigo-400 -rotate-45" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="h-px flex-1 bg-white/5" />
                                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Tokenization Breakdown</span>
                                                <div className="h-px flex-1 bg-white/5" />
                                            </div>
                                            
                                            <div className="grid grid-cols-1 gap-2">
                                                <TooltipProvider>
                                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Processing Strategy</span>
                                                            <Tooltip>
                                                                <TooltipTrigger><Info className="w-3 h-3 text-slate-600" /></TooltipTrigger>
                                                                <TooltipContent className="bg-slate-900 border-white/10 text-[10px] p-2">Different models use different math to convert pixels to tokens.</TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded">{model?.visionPricing?.strategy.replace(/-/g, ' ')}</span>
                                                    </div>

                                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Effective Resolution</span>
                                                        <span className="text-xs font-mono font-bold text-slate-200">{result.scaledWidth}x{result.scaledHeight}px</span>
                                                    </div>

                                                    {model?.visionPricing?.strategy === "openai-tiles" && (
                                                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tile Count (512px)</span>
                                                            <span className="text-xs font-mono font-bold text-slate-200">{result.tiles || 0} Tiles</span>
                                                        </div>
                                                    )}
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
                                          <ImageIcon className="w-10 h-10 text-slate-700" />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-300 uppercase tracking-tight mb-2">Awaiting Image</h3> 
                                        <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">     
                                            Upload an image to see its exact token dimensions and estimated API cost.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Image / Multimodal FAQ Section */}
                <div className="pt-16 border-t border-white/5 mt-16">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-black tracking-tight text-white uppercase">Vision <span className="text-indigo-500">Insights</span></h2>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>
                        <p className="text-lg text-slate-400">
                            Common questions about image tokenization and vision model pricing.
                        </p>

                        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">      
                            <Accordion type="single" collapsible className="w-full">

                                <AccordionItem value="item-1" className="border-white/5">
                                    <AccordionTrigger className="text-left text-base font-bold text-slate-200 hover:no-underline hover:text-indigo-400 transition-colors">
                                        Why does image size affect token cost more than file size?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-400 leading-relaxed font-medium">        
                                        LLM image pricing is based on the image&apos;s pixel dimensions (width x height), not the file size in bytes. A 10MB JPEG compressed at low quality and a 2MB PNG at high resolution will have very different token costs. This is because models process the actual visual information (pixels), not the compressed file format.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-2" className="border-white/5">
                                    <AccordionTrigger className="text-left text-base font-bold text-slate-200 hover:no-underline hover:text-indigo-400 transition-colors">
                                        What&apos;s the difference between "high detail" and "low detail" mode?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-400 leading-relaxed font-medium">        
                                        GPT-4o offers two detail modes: &quot;low&quot; (fixed at 85 tokens) and &quot;high&quot;. High detail mode preserves resolution by tiling the image into 512px chunks. For high-res images, switching to &quot;low&quot; can save 90% in token costs if fine details aren&apos;t required for the analysis.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-3" className="border-white/5">
                                    <AccordionTrigger className="text-left text-base font-bold text-slate-200 hover:no-underline hover:text-indigo-400 transition-colors">
                                        Is my image data secure?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-400 leading-relaxed font-medium">        
                                        Yes. This estimator processes your image entirely within your browser using local JavaScript. Your images are never uploaded to our servers or any third-party APIs. The pixel dimensions are extracted locally to perform the token math.
                                    </AccordionContent>
                                </AccordionItem>

                            </Accordion>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}