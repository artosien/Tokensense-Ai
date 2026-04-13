"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { 
    Trash2, Zap, Brain, Trophy, TrendingDown, Copy, Check, 
    ChevronUp, ChevronDown, ChevronRight, ChevronsUpDown, Clock, Search, 
    Filter, Sparkles, Calculator, ArrowRight, MousePointer2, 
    MessageSquareText, Layers, Key, History, BarChart3,
    Share2, Download, Timer, Activity, Info, Star,
    ShieldCheck, ZapOff, RefreshCcw, Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { countTokensSync } from "@/lib/tokenizer";
import { models, ModelConfig, getModelById } from "@/lib/models";
import { useTokenSenseStore } from "@/lib/store";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SortMode = "total" | "input" | "output" | "value" | "latency";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCost(cost: number): string {
    if (cost === 0) return "$0.00";
    if (cost < 0.0001) return `$${cost.toFixed(6)}`;
    if (cost < 0.01) return `$${cost.toFixed(5)}`;
    if (cost < 1) return `$${cost.toFixed(4)}`;
    return `$${cost.toFixed(2)}`;
}

function formatContext(ctx: number): string {
    if (ctx >= 1000000) return `${(ctx / 1000000).toFixed(1)}M`;
    if (ctx >= 1000) return `${(ctx / 1000).toFixed(0)}K`;
    return ctx.toString();
}

function getBarColor(ratio: number): string {
    if (ratio < 0.15) return "#00e5ff"; // plasma cyan
    if (ratio < 0.35) return "#14b8a6"; // teal
    if (ratio < 0.6) return "#64748b";  // slate
    if (ratio < 0.85) return "#a855f7"; // purple
    return "#6b21a8"; // dark purple
}

// ─── Latency Sparkline ────────────────────────────────────────────────────────

function LatencySparkline({ latency }: { latency?: number }) {
    // Hooks must be called unconditionally
    const points = useMemo(() => {
        if (!latency) return [];
        const base = latency;
        // Deterministic-ish random based on latency to keep it "stable" for same latency
        // or just accept it's a mock. To fix the "impure" error, 
        // we use a simple sine wave for the mock sparkline.
        return Array.from({ length: 8 }, (_, i) => base + Math.sin(i * 1.5) * (base * 0.1));
    }, [latency]);

    if (!latency || points.length === 0) return null;

    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;

    return (
        <div className="flex items-center gap-2">
            <svg width="40" height="12" className="overflow-visible">
                <polyline
                    fill="none"
                    stroke={latency > 1000 ? "#ef4444" : "#10b981"}
                    strokeWidth="1.5"
                    points={points.map((p, i) => `${(i / (points.length - 1)) * 40},${12 - ((p - min) / range) * 12}`).join(" ")}
                />
            </svg>
            <span className={cn(
                "text-[10px] font-mono font-bold",
                latency > 1000 ? "text-red-400" : "text-emerald-400"
            )}>
                {latency}ms
            </span>
        </div>
    );
}

// ─── Animated Cost Bar ────────────────────────────────────────────────────────

function AnimatedCostBar({ ratio }: { ratio: number }) {
    const [scale, setScale] = useState(0);
    const color = getBarColor(ratio);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setScale(ratio);
        });
        return () => cancelAnimationFrame(frame);
    }, [ratio]);

    return (
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-1">
            <div 
                className="h-full transition-all duration-1000 ease-out origin-left"
                style={{ 
                    width: `${scale * 100}%`,
                    backgroundColor: color,
                    boxShadow: ratio < 0.15 ? `0 0 10px ${color}44` : 'none'
                }}
            />
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ModelComparisonTable() {
    const { setOptimizationStep } = useTokenSenseStore();
    // Live token sliders state
    const [inputTokens, setInputTokens] = useState(10000);
    const [outputTokens, setOutputTokens] = useState(2000);
    const [isRecurring, setIsRecurring] = useState(false);
    const [cachePercent, setCachePercent] = useState(80);
    
    // UI state
    const [searchQuery, setSearchQuery] = useState("");
    const [sortMode, setSortMode] = useState<SortMode>("total");
    const [activeProviderFilter, setActiveProviderFilter] = useState<string>("All");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [collapsedProviders, setCollapsedProviders] = useState<string[]>([]);

    const toggleProvider = (provider: string) => {
        setCollapsedProviders(prev => 
            prev.includes(provider) 
                ? prev.filter(p => p !== provider) 
                : [...prev, provider]
        );
    };

    // Smart Picker State
    const [pickerTask, setPickerTask] = useState<string>("general");
    const [pickerPriority, setPickerPriority] = useState<string>("balance");

    // Scroll tracking for sticky header
    const [isSticky, setIsSticky] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (headerRef.current) {
                const rect = headerRef.current.getBoundingClientRect();
                setIsSticky(rect.top <= 0);
            }
        };
        window.addEventListener("scroll", handleScroll);

        // On mobile, show picker by default once if not seen
        const pickerSeen = localStorage.getItem("tokensense-picker-seen");
        if (window.innerWidth < 768 && !pickerSeen) {
            setShowPicker(true);
            localStorage.setItem("tokensense-picker-seen", "true");
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Load state from URL if present
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const i = params.get("i");
        const o = params.get("o");
        const c = params.get("c");
        if (i) setInputTokens(parseInt(i));
        if (o) setOutputTokens(parseInt(o));
        if (c) {
            setIsRecurring(true);
            setCachePercent(parseInt(c));
        }
    }, []);

    const generateShareUrl = () => {
        const url = new URL(window.location.href);
        url.searchParams.set("i", inputTokens.toString());
        url.searchParams.set("o", outputTokens.toString());
        if (isRecurring) url.searchParams.set("c", cachePercent.toString());
        
        navigator.clipboard.writeText(url.toString());
        setCopiedId("share");
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Data calculation
    const tableData = useMemo(() => {
        let data = models.map((m) => {
            let totalInputCost = 0;
            
            if (isRecurring && m.cacheReadPricePer1M && m.cacheWritePricePer1M) {
                const cachedTokens = inputTokens * (cachePercent / 100);
                const freshTokens = inputTokens - cachedTokens;
                // Simplified caching: assume first call writes, subsequent reads.
                // For a "recurring" estimate, we use the read price for the cached portion.
                totalInputCost = (cachedTokens / 1_000_000) * m.cacheReadPricePer1M + 
                                (freshTokens / 1_000_000) * m.inputPricePer1M;
            } else {
                totalInputCost = (inputTokens / 1_000_000) * m.inputPricePer1M;
            }

            const totalOutputCost = (outputTokens / 1_000_000) * m.outputPricePer1M;
            const totalCost = totalInputCost + totalOutputCost;
            
            // Value Index: (MMLU / Total Cost) scaled
            const mmlu = m.benchmarks?.mmlu || 0;
            const valueIndex = totalCost > 0 ? (mmlu / (totalCost * 1000)) : 0;
            
            return { 
                ...m, 
                totalInputCost,
                totalOutputCost,
                totalCost,
                valueIndex
            };
        });

        if (activeProviderFilter !== "All") {
            data = data.filter((item) => item.provider === activeProviderFilter);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            data = data.filter(m => m.name.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q));
        }

        // Sorting
        data.sort((a, b) => {
            if (sortMode === "total") return a.totalCost - b.totalCost;
            if (sortMode === "input") return a.inputPricePer1M - b.inputPricePer1M;
            if (sortMode === "output") return a.outputPricePer1M - b.outputPricePer1M;
            if (sortMode === "value") return b.valueIndex - a.valueIndex;
            if (sortMode === "latency") return (a.latencyMs || 9999) - (b.latencyMs || 9999);
            return 0;
        });

        return data.map((m, idx) => ({ ...m, globalRank: idx + 1 }));
    }, [inputTokens, outputTokens, isRecurring, cachePercent, activeProviderFilter, searchQuery, sortMode]);

    const groupedData = useMemo(() => {
        const groups: Record<string, any[]> = {};
        tableData.forEach(m => {
            if (!groups[m.provider]) groups[m.provider] = [];
            groups[m.provider].push(m);
        });
        
        return Object.entries(groups).map(([provider, models]) => ({
            provider,
            models
        })).sort((a, b) => a.provider.localeCompare(b.provider));
    }, [tableData]);

    const maxTotalCost = useMemo(() => {
        if (tableData.length === 0) return 1;
        return Math.max(...tableData.map(m => m.totalCost));
    }, [tableData]);

    const handleCopyRow = (model: any) => {
        const text = `${model.name} (${model.provider}): ${formatCost(model.totalCost)} total for ${inputTokens} in / ${outputTokens} out`;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(model.id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const providerList = ["All", ...new Set(models.map((p) => p.provider))];

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* ── Smart Picker Wizard ── */}
            {showPicker && (
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-8 rounded-3xl animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Wand2 className="w-5 h-5 text-indigo-400" />
                                Smart Model Picker
                            </h3>
                            <p className="text-sm text-slate-400">Answer 2 questions to find your ideal model.</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setShowPicker(false)}>Close</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Task Type</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: "chat", label: "General Chat", icon: MessageSquareText },
                                    { id: "coding", label: "Complex Coding", icon: Key },
                                    { id: "extraction", label: "Data Extraction", icon: BarChart3 },
                                    { id: "creative", label: "Creative Writing", icon: Sparkles }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setPickerTask(t.id)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all",
                                            pickerTask === t.id ? "bg-indigo-500 border-indigo-400 text-white" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                                        )}
                                    >
                                        <t.icon className="w-4 h-4" />
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Primary Goal</Label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: "cost", label: "Lowest Possible Cost", desc: "Cheapest models that get the job done." },
                                    { id: "quality", label: "Maximum Intelligence", desc: "Highest benchmarks, cost is secondary." },
                                    { id: "speed", label: "Blazing Fast Response", desc: "Lowest latency models for real-time apps." },
                                    { id: "balance", label: "Balanced Performance", desc: "The sweet spot of cost and quality." }
                                ].map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setPickerPriority(p.id)}
                                        className={cn(
                                            "flex flex-col items-start px-4 py-3 rounded-xl border transition-all text-left",
                                            pickerPriority === p.id ? "bg-purple-500 border-purple-400 text-white" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                                        )}
                                    >
                                        <span className="text-xs font-bold">{p.label}</span>
                                        <span className={cn("text-[10px] opacity-70", pickerPriority === p.id ? "text-white" : "text-slate-500")}>{p.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                        <Button 
                            className="bg-indigo-500 hover:bg-indigo-600 font-bold"
                            onClick={() => {
                                // Simple routing logic
                                if (pickerPriority === "cost") setSortMode("total");
                                else if (pickerPriority === "quality") setSortMode("value");
                                else if (pickerPriority === "speed") setSortMode("latency");
                                else setSortMode("value");
                                setShowPicker(false);
                            }}
                        >
                            Find Recommendations
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Sticky Header & Sliders ── */}
            <div ref={headerRef} className={cn(
                "z-30 transition-all duration-300",
                isSticky ? "fixed top-0 left-0 right-0 bg-[#040c0e]/90 backdrop-blur-xl border-b border-white/10 py-4 shadow-2xl" : "relative"
            )}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={cn(
                        "grid grid-cols-1 gap-6",
                        isSticky ? "md:grid-cols-3 items-center" : "md:grid-cols-2"
                    )}>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <MessageSquareText className="w-3 h-3 text-plasma-400" />
                                    Input Tokens
                                </label>
                                <span className="text-xs font-mono font-bold text-plasma-400">
                                    {inputTokens.toLocaleString()}
                                </span>
                            </div>
                            <Slider 
                                value={[inputTokens]} 
                                onValueChange={([v]) => setInputTokens(v)}
                                max={100000}
                                min={100}
                                step={100}
                                className="py-2"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-purple-400" />
                                    Output Tokens
                                </label>
                                <span className="text-xs font-mono font-bold text-purple-400">
                                    {outputTokens.toLocaleString()}
                                </span>
                            </div>
                            <Slider 
                                value={[outputTokens]} 
                                onValueChange={([v]) => setOutputTokens(v)}
                                max={32000}
                                min={10}
                                step={50}
                                className="py-2"
                            />
                        </div>

                        {isSticky && (
                            <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold border-white/10" onClick={() => setShowPicker(true)}>
                                    <Wand2 className="w-3 h-3 mr-1.5" /> Picker
                                </Button>
                                <Button size="sm" className="h-8 text-[10px] font-bold bg-plasma-500 text-black hover:bg-plasma-400" onClick={generateShareUrl}>
                                    <Share2 className="w-3 h-3 mr-1.5" /> {copiedId === "share" ? "Copied!" : "Share"}
                                </Button>
                            </div>
                        )}
                    </div>
                    
                    {!isSticky && (
                        <div className="mt-6 flex flex-wrap items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <Switch checked={isRecurring} onCheckedChange={setIsRecurring} id="recurring" />
                                <Label htmlFor="recurring" className="text-xs font-bold text-slate-300 flex items-center gap-2 cursor-pointer">
                                    Recurring Prompt (Cache Awareness)
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger><Info className="w-3 h-3 text-slate-500" /></TooltipTrigger>
                                            <TooltipContent className="bg-slate-900 border-white/10 max-w-xs">
                                                <p className="text-[10px] leading-relaxed">Most providers offer 80-90% discounts for tokens that repeat across requests. Toggle this to see the impact of prompt caching on your bill.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                            </div>
                            {isRecurring && (
                                <div className="flex items-center gap-4 flex-1 max-w-xs animate-in slide-in-from-left-2">
                                    <span className="text-[10px] font-mono font-bold text-plasma-400 whitespace-nowrap">{cachePercent}% Static</span>
                                    <Slider value={[cachePercent]} onValueChange={([v]) => setCachePercent(v)} max={99} min={10} className="flex-1" />
                                </div>
                            )}
                            <div className="ml-auto flex gap-2">
                                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold text-slate-400 hover:text-white" onClick={() => setShowPicker(true)}>
                                    <Wand2 className="w-3.5 h-3.5 mr-1.5" /> Model Picker
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold text-slate-400 hover:text-white" onClick={generateShareUrl}>
                                    <Share2 className="w-3.5 h-3.5 mr-1.5" /> {copiedId === "share" ? "Copied!" : "Share Link"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Sort & Filter Toolset ── */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                    {[
                        { id: "total", label: "Best Total", icon: Calculator, activeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
                        { id: "value", label: "Bang-for-Buck", icon: Trophy, activeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
                        { id: "latency", label: "Low Latency", icon: Timer, activeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
                        { id: "input", label: "Input Price", icon: ChevronDown, activeColor: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
                        { id: "output", label: "Output Price", icon: ChevronUp, activeColor: "bg-slate-500/20 text-slate-300 border-slate-500/30" }
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setSortMode(mode.id as SortMode)}
                            className={cn(
                                "group flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border border-transparent",
                                sortMode === mode.id 
                                    ? mode.activeColor
                                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                            )}
                        >
                            <mode.icon className={cn("w-3 h-3", sortMode === mode.id ? "opacity-100" : "opacity-50 group-hover:opacity-100")} />
                            {mode.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <Input 
                            placeholder="Filter models..." 
                            className="pl-9 h-9 text-xs bg-white/5 border-white/10 rounded-xl focus-visible:ring-plasma-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={activeProviderFilter} onValueChange={setActiveProviderFilter}>
                        <SelectTrigger className="w-[120px] h-9 text-[10px] bg-white/5 border-white/10 rounded-xl">
                            <SelectValue placeholder="Provider" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#040c0e] border-white/10">
                            {providerList.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* ── Main Comparison Table ── */}
            <div className="bg-[#040c0e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="py-4 pl-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] w-12">Rank</th>
                                <th className="py-4 px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Model Architecture</th>
                                <th 
                                    className="py-4 px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right cursor-pointer hover:text-indigo-400 transition-colors"
                                    onClick={() => setSortMode("value")}
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        Bench (MMLU)
                                        {sortMode === "value" && <ChevronDown className="w-3 h-3 text-indigo-400" />}
                                    </div>
                                </th>
                                <th 
                                    className="py-4 px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right cursor-pointer hover:text-amber-400 transition-colors"
                                    onClick={() => setSortMode("latency")}
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        Latency
                                        {sortMode === "latency" && <ChevronDown className="w-3 h-3 text-amber-400" />}
                                    </div>
                                </th>
                                <th 
                                    className="py-4 px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right cursor-pointer hover:text-emerald-400 transition-colors"
                                    onClick={() => setSortMode("total")}
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        Total Cost
                                        {sortMode === "total" && <ChevronDown className="w-3 h-3 text-emerald-400" />}
                                    </div>
                                </th>
                                <th className="py-4 pr-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {groupedData.map((group) => {
                                const isCollapsed = collapsedProviders.includes(group.provider);
                                
                                return (
                                    <React.Fragment key={group.provider}>
                                        {/* Provider Header Row */}
                                        <tr 
                                            className="bg-white/5 cursor-pointer hover:bg-white/10 transition-colors group/provider"
                                            onClick={() => toggleProvider(group.provider)}
                                        >
                                            <td colSpan={6} className="py-3 px-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "p-1 rounded-md bg-white/5 border border-white/10 transition-transform duration-200",
                                                            !isCollapsed && "rotate-90"
                                                        )}>
                                                            <ChevronRight className="w-3 h-3 text-slate-400" />
                                                        </div>
                                                        <span className="font-black text-[10px] uppercase tracking-[0.3em] text-indigo-400">
                                                            {group.provider}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 font-bold">
                                                            ({group.models.length} models)
                                                        </span>
                                                    </div>
                                                    <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest opacity-0 group-hover/provider:opacity-100 transition-opacity">
                                                        {isCollapsed ? "Click to Expand" : "Click to Collapse"}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                        {!isCollapsed && group.models.map((model) => {
                                            const isCheapest = model.globalRank === 1 && sortMode === "total";
                                            const isBestValue = model.globalRank === 1 && sortMode === "value";
                                            const isFastest = model.globalRank === 1 && sortMode === "latency";
                                            const ratio = model.totalCost / maxTotalCost;

                                            return (
                                                <tr 
                                                    key={model.id}
                                                    className={cn(
                                                        "group transition-all duration-200 hover:bg-white/[0.035]",
                                                        (isCheapest || isBestValue || isFastest) ? "bg-plasma-500/[0.03] border-l-2 border-l-plasma-500" : "border-l-2 border-l-transparent"
                                                    )}
                                                >
                                                    <td className={cn(
                                                        "py-5 pl-6 font-mono text-xs",
                                                        (isCheapest || isBestValue || isFastest) ? "text-plasma-400 font-black" : "text-slate-600"
                                                    )}>
                                                        {model.globalRank}
                                                    </td>
                                                    <td className="py-5 px-4">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn(
                                                                    "text-sm font-bold tracking-tight",
                                                                    (isCheapest || isBestValue || isFastest) ? "text-white" : "text-slate-300"
                                                                )}>
                                                                    {model.name}
                                                                </span>
                                                                {isCheapest && <span title="Cheapest Option"><Trophy className="w-3 h-3 text-yellow-500" /></span>}
                                                                {isBestValue && <span title="Best Bang for Buck"><Star className="w-3 h-3 text-indigo-400" /></span>}
                                                                {isFastest && <span title="Fastest Response"><Zap className="w-3 h-3 text-amber-400" /></span>}
                                                            </div>
                                                            <span className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">
                                                                {model.tier || "Standard"} • {formatContext(model.maxContext)} context
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4 text-right">
                                                        <div className="flex flex-col items-end">
                                                            <span className="font-mono text-xs text-white font-bold">{model.benchmarks?.mmlu || "-" }</span>
                                                            <span className="text-[8px] text-slate-600 uppercase font-black">Accuracy Score</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4 text-right">
                                                        <div className="flex justify-end">
                                                            <LatencySparkline latency={model.latencyMs} />
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4 text-right">
                                                        <div className="flex flex-col items-end">
                                                            <span className={cn(
                                                                "text-sm font-black font-mono",
                                                                (isCheapest || isBestValue || isFastest) ? "text-plasma-400" : "text-white"
                                                            )}>
                                                                {formatCost(model.totalCost)}
                                                            </span>
                                                            <div className="w-24 mt-1">
                                                                <AnimatedCostBar ratio={ratio} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 pr-6 text-right">
                                                        <button 
                                                            onClick={() => handleCopyRow(model)}
                                                            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-white/10 text-slate-500 transition-all"
                                                        >
                                                            {copiedId === model.id ? <Check className="w-3.5 h-3.5 text-plasma-400" /> : <Copy className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Next Step CTA ── */}
            <div className="mt-20 pt-12 border-t border-white/10 flex flex-col items-center text-center">
                <div className="mb-8 flex flex-col items-center">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-4">
                        <Check className="w-3 h-3" />
                        Comms Review Complete
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Mission Analysis Finalized</h2>
                    <p className="text-slate-400 text-sm max-w-md font-medium">
                        Your cost comparison is ready. Generate the final flight report to see the optimized workflow manifest.
                    </p>
                </div>
                <Button 
                    asChild
                    onClick={() => setOptimizationStep(6)}
                    className="w-full max-w-md h-20 rounded-3xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl shadow-2xl shadow-indigo-500/20 gap-4 group uppercase tracking-tighter"
                >
                    <Link href="/workflow">
                        <Sparkles className="w-6 h-6 fill-white group-hover:animate-spin-slow" />
                        Generate Final Report ➔
                    </Link>
                </Button>
                <p className="mt-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Trajectory Optimized: Mission Ready
                </p>
            </div>
        </div>
    );
}
