"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { 
    Trash2, Zap, Brain, Trophy, TrendingDown, Copy, Check, 
    ChevronUp, ChevronDown, ChevronsUpDown, Clock, Search, 
    Filter, Sparkles, Calculator, ArrowRight, MousePointer2, 
    MessageSquareText, Layers, Key, History, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countTokensSync } from "@/lib/tokenizer";
import { models, ModelConfig, getModelById } from "@/lib/models";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SortMode = "total" | "input" | "output";

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
    // Live token sliders state
    const [inputTokens, setInputTokens] = useState(10000);
    const [outputTokens, setOutputTokens] = useState(2000);
    
    // UI state
    const [searchQuery, setSearchQuery] = useState("");
    const [sortMode, setSortMode] = useState<SortMode>("total");
    const [activeProviderFilter, setActiveProviderFilter] = useState<string>("All");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [showAPIIntegration, setShowAPIIntegration] = useState(false);

    // Prompt mode (optional override)
    const [promptText, setPromptText] = useState("");

    useEffect(() => {
        if (promptText.trim()) {
            setInputTokens(countTokensSync(promptText));
        }
    }, [promptText]);

    // Data calculation
    const tableData = useMemo(() => {
        let data = models.map((m) => {
            const totalInputCost = (inputTokens / 1_000_000) * m.inputPricePer1M;
            const totalOutputCost = (outputTokens / 1_000_000) * m.outputPricePer1M;
            const totalCost = totalInputCost + totalOutputCost;
            
            return { 
                ...m, 
                totalInputCost,
                totalOutputCost,
                totalCost
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
            return a.outputPricePer1M - b.outputPricePer1M;
        });

        return data;
    }, [inputTokens, outputTokens, activeProviderFilter, searchQuery, sortMode]);

    const maxTotalCost = useMemo(() => Math.max(...tableData.map(m => m.totalCost)), [tableData]);

    const handleCopyRow = (model: any) => {
        const text = `${model.name} (${model.provider}): ${formatCost(model.totalCost)} total for ${inputTokens} in / ${outputTokens} out`;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(model.id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const providerList = ["All", ...new Set(models.map((p) => p.provider))];

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* ── Live Token Controls ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#040c0e]/50 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <MessageSquareText className="w-3 h-3 text-plasma-400" />
                            Input Tokens (Workload)
                        </label>
                        <span className="text-sm font-mono font-bold text-plasma-400 bg-plasma-500/10 px-2 py-0.5 rounded">
                            {inputTokens.toLocaleString()}
                        </span>
                    </div>
                    <Slider 
                        value={[inputTokens]} 
                        onValueChange={([v]) => setInputTokens(v)}
                        max={100000}
                        min={100}
                        step={100}
                        className="py-4"
                    />
                    <div className="flex justify-between text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
                        <span>Short Prompt</span>
                        <span>Large Context (100k)</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Zap className="w-3 h-3 text-purple-400" />
                            Expected Output
                        </label>
                        <span className="text-sm font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                            {outputTokens.toLocaleString()}
                        </span>
                    </div>
                    <Slider 
                        value={[outputTokens]} 
                        onValueChange={([v]) => setOutputTokens(v)}
                        max={32000}
                        min={10}
                        step={50}
                        className="py-4"
                    />
                    <div className="flex justify-between text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
                        <span>One Sentence</span>
                        <span>Long Form (32k)</span>
                    </div>
                </div>
            </div>

            {/* ── Sort & Filter Toolset ── */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
                    {[
                        { id: "total", label: "Best Total" },
                        { id: "input", label: "Lowest Input" },
                        { id: "output", label: "Lowest Output" }
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setSortMode(mode.id as SortMode)}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                sortMode === mode.id 
                                    ? "bg-plasma-500 text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                            )}
                        >
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
                                <th className="py-4 pl-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] w-12">#</th>
                                <th className="py-4 px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Model Architecture</th>
                                <th className="py-4 px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Input / 1M</th>
                                <th className="py-4 px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Output / 1M</th>
                                <th className="py-4 px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Total Cost</th>
                                <th className="py-4 pr-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {tableData.map((model, idx) => {
                                const isCheapest = idx === 0 && sortMode === "total";
                                const ratio = model.totalCost / maxTotalCost;

                                return (
                                    <tr 
                                        key={model.id}
                                        className={cn(
                                            "group transition-all duration-200 hover:bg-white/[0.035]",
                                            isCheapest ? "bg-plasma-500/[0.03] border-l-2 border-l-plasma-500" : "border-l-2 border-l-transparent"
                                        )}
                                    >
                                        <td className={cn(
                                            "py-5 pl-6 font-mono text-xs",
                                            isCheapest ? "text-plasma-400 font-black" : "text-slate-600"
                                        )}>
                                            {idx + 1}
                                        </td>
                                        <td className="py-5 px-4">
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "text-sm font-bold tracking-tight",
                                                    isCheapest ? "text-white" : "text-slate-300"
                                                )}>
                                                    {model.name}
                                                </span>
                                                <span className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">
                                                    {model.provider}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-4 text-right font-mono text-xs text-slate-500">
                                            ${model.inputPricePer1M.toFixed(2)}
                                        </td>
                                        <td className="py-5 px-4 text-right font-mono text-xs text-slate-500">
                                            ${model.outputPricePer1M.toFixed(2)}
                                        </td>
                                        <td className="py-5 px-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className={cn(
                                                    "text-sm font-black font-mono",
                                                    isCheapest ? "text-plasma-400" : "text-white"
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
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    );
}
