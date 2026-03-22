"use client";

import React, { useState, useCallback, useMemo, useId } from "react";
import { Plus, Trash2, Zap, Brain, Trophy, TrendingDown, Copy, Check, ChevronUp, ChevronDown, ChevronsUpDown, Clock, Search, Filter, Sparkles, Calculator, ArrowRight, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

// ─── 2026 Pricing Data with Context Windows ────────────────────────────────────

export const PRICING_DATA = {
    last_updated: "March 22, 2026",
    providers: [
        {
            name: "OpenAI",
            models: [
                { name: "GPT-5.2 Pro", input_1m: 21.0, output_1m: 168.0, maxContext: 128000 },
                { name: "GPT-5.2 (Flagship)", input_1m: 1.75, output_1m: 14.0, maxContext: 128000 },
                { name: "GPT-5 Mini", input_1m: 0.25, output_1m: 2.0, maxContext: 128000 },
                { name: "GPT-5 Nano", input_1m: 0.05, output_1m: 0.4, maxContext: 128000 },
            ],
        },
        {
            name: "Anthropic",
            models: [
                { name: "Claude 4.6 Opus", input_1m: 5.0, output_1m: 25.0, maxContext: 200000 },
                { name: "Claude 4.6 Sonnet", input_1m: 3.0, output_1m: 15.0, maxContext: 200000 },
                { name: "Claude 4.5 Haiku", input_1m: 1.0, output_1m: 5.0, maxContext: 200000 },
            ],
        },
        {
            name: "Google",
            models: [
                { name: "Gemini 3.1 Pro", input_1m: 2.0, output_1m: 12.0, maxContext: 2000000 },
                { name: "Gemini 3.1 Flash", input_1m: 0.25, output_1m: 1.5, maxContext: 1000000 },
                { name: "Gemini 3.1 Flash-Lite", input_1m: 0.125, output_1m: 0.75, maxContext: 1000000 },
            ],
        },
        {
            name: "DeepSeek",
            models: [{ name: "DeepSeek V3.2", input_1m: 0.28, output_1m: 0.42, maxContext: 128000 }],
        },
        {
            name: "xAI",
            models: [
                { name: "Grok 4", input_1m: 3.0, output_1m: 15.0, maxContext: 128000 },
                { name: "Grok 4 Fast", input_1m: 0.2, output_1m: 0.5, maxContext: 128000 },
            ],
        },
    ],
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ModelRow {
    id: string;
    provider: string;
    model: string;
}

type TokenPreset = "1K" | "10K" | "100K" | "1M" | "custom";
type SortColumn = "model" | "provider" | "input" | "output" | "context" | null;
type SortDirection = "asc" | "desc" | null;

const PRESET_VALUES: Record<Exclude<TokenPreset, "custom">, number> = {
    "1K": 1_000,
    "10K": 10_000,
    "100K": 100_000,
    "1M": 1_000_000,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getModelTier(modelName: string): "intelligence" | "speed" | null {
    const n = modelName.toLowerCase();
    if (
        n.includes("pro") ||
        n.includes("opus") ||
        n.includes("flagship") ||
        n.includes("ultra")
    )
        return "intelligence";
    if (
        n.includes("flash") ||
        n.includes("nano") ||
        n.includes("mini") ||
        n.includes("fast") ||
        n.includes("lite") ||
        n.includes("haiku")
    )
        return "speed";
    return null;
}

function formatCost(cost: number): string {
    if (cost === 0) return "$0.00";
    if (cost < 0.00001) return `$${cost.toExponential(2)}`;
    if (cost < 0.01) return `$${cost.toFixed(6)}`;
    if (cost < 1) return `$${cost.toFixed(4)}`;
    return `$${cost.toFixed(2)}`;
}

function formatContext(ctx: number): string {
    if (ctx >= 1000000) return `${(ctx / 1000000).toFixed(1)}M`;
    if (ctx >= 1000) return `${(ctx / 1000).toFixed(0)}K`;
    return ctx.toString();
}

function calcCosts(
    inputTokens: number,
    outputTokens: number,
    inputRate: number,
    outputRate: number
) {
    const inputCost = (inputTokens / 1_000_000) * inputRate;
    const outputCost = (outputTokens / 1_000_000) * outputRate;
    return { inputCost, outputCost, total: inputCost + outputCost };
}

function getHeatmapColor(value: number, min: number, max: number): string {
    if (min === max) return "transparent";
    const ratio = (value - min) / (max - min);
    if (ratio <= 0.33) return "rgba(34, 197, 94, 0.15)"; // Green for low (cheap)
    if (ratio >= 0.67) return "rgba(239, 68, 68, 0.15)"; // Red for high (expensive)
    return "transparent";
}

function getRealCostEstimate(inputRate: number, outputRate: number): string {
    // Sample: 500 input + 300 output tokens
    const cost = (500 / 1_000_000) * inputRate + (300 / 1_000_000) * outputRate;
    return `~${formatCost(cost)} per 1,000 avg. queries`;
}

let rowCounter = 0;
function makeRow(provider = "", model = ""): ModelRow {
    return { id: `row-${++rowCounter}`, provider, model };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: "intelligence" | "speed" }) {
    if (tier === "intelligence")
        return (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-purple-400 whitespace-nowrap">
                <Brain className="w-2.5 h-2.5" />
                Intelligence
            </span>
        );
    return (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-400 whitespace-nowrap">
            <Zap className="w-2.5 h-2.5" />
            Speed
        </span>
    );
}

function SortHeader({
    label,
    column,
    currentSort,
    currentDir,
    onClick,
}: {
    label: string;
    column: SortColumn;
    currentSort: SortColumn;
    currentDir: SortDirection;
    onClick: () => void;
}) {
    const isActive = currentSort === column;
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer select-none py-2"
            aria-label={`Sort by ${label}`}
        >
            {label}
            {isActive ? (
                currentDir === "asc" ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-cyan-400" />
                )
            ) : (
                <ChevronsUpDown className="w-4 h-4 text-slate-600" />
            )}
        </button>
    );
}

function CostTooltip({ inputRate, outputRate }: { inputRate: number; outputRate: number }) {
    const [visible, setVisible] = React.useState(false);
    const estimate = getRealCostEstimate(inputRate, outputRate);

    return (
        <span className="relative inline-group">
            <button
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                className="text-slate-500 hover:text-cyan-400 transition-colors cursor-help ml-1"
                aria-label="Cost estimate"
            >
                ⓘ
            </button>
            {visible && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded bg-slate-900 border border-cyan-400/30 text-xs font-mono text-slate-200 whitespace-nowrap shadow-xl pointer-events-none">
                    {estimate}
                </div>
            )}
        </span>
    );
}

function ContextBar({ value, max }: { value: number; max: number }) {
    const percentage = Math.min((value / max) * 100, 100);
    return (
        <div className="relative w-full flex items-center gap-2">
            <div className="flex-1 h-5 bg-white/5 rounded-md overflow-hidden border border-white/10">
                <div
                    className="h-full bg-cyan-400/30 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="text-xs font-mono text-slate-300 whitespace-nowrap w-12 text-right">
                {formatContext(value)}
            </span>
        </div>
    );
}

function PresetButton({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${active
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-sm shadow-indigo-500/20"
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-indigo-500/50 hover:text-indigo-300"
                }`}
        >
            {label}
        </button>
    );
}

function ProviderPill({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${active
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-400"
                    : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-cyan-400/50 hover:text-cyan-300"
                }`}
        >
            {label}
        </button>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ModelComparisonTable() {
    const uid = useId();

    const [rows, setRows] = useState<ModelRow[]>([
        makeRow("OpenAI", "GPT-5.2 (Flagship)"),
        makeRow("Anthropic", "Claude 4.6 Sonnet"),
    ]);

    // Global token inputs
    const [inputPreset, setInputPreset] = useState<TokenPreset>("10K");
    const [outputPreset, setOutputPreset] = useState<TokenPreset>("1K");
    const [customInput, setCustomInput] = useState<string>("10000");
    const [customOutput, setCustomOutput] = useState<string>("1000");

    // Sorting and filtering for pricing table
    const [sortColumn, setSortColumn] = useState<SortColumn>(null);
    const [sortDir, setSortDir] = useState<SortDirection>(null);
    const [activeProviderFilter, setActiveProviderFilter] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Recommendation State
    const [recStep, setRecStep] = useState(0);
    const [recAnswers, setRecAnswers] = useState<Record<string, string>>({});
    const [showRecResult, setShowRecResult] = useState(false);

    const inputTokens = useMemo(() => {
        if (inputPreset === "custom") return parseInt(customInput) || 0;
        return PRESET_VALUES[inputPreset];
    }, [inputPreset, customInput]);

    const outputTokens = useMemo(() => {
        if (outputPreset === "custom") return parseInt(customOutput) || 0;
        return PRESET_VALUES[outputPreset];
    }, [outputPreset, customOutput]);

    // Row actions
    const addRow = useCallback(() => setRows((r) => [...r, makeRow()]), []);
    const removeRow = useCallback(
        (id: string) => setRows((r) => r.filter((row) => row.id !== id)),
        []
    );
    const updateRow = useCallback(
        (id: string, patch: Partial<Omit<ModelRow, "id">>) => {
            setRows((r) =>
                r.map((row) => {
                    if (row.id !== id) return row;
                    const updated = { ...row, ...patch };
                    // Reset model when provider changes
                    if (patch.provider && patch.provider !== row.provider) {
                        updated.model = "";
                    }
                    return updated;
                })
            );
        },
        []
    );

    // Common Use Case preset
    const applyCommonPreset = () => {
        setInputPreset("custom");
        setOutputPreset("custom");
        setCustomInput("500");
        setCustomOutput("200");
    };

    // Compute costs per row
    const rowCosts = useMemo(() => {
        return rows.map((row) => {
            const provider = PRICING_DATA.providers.find(
                (p) => p.name === row.provider
            );
            const model = provider?.models.find((m) => m.name === row.model);
            if (!model) return { inputCost: 0, outputCost: 0, total: 0, valid: false };
            return {
                ...calcCosts(inputTokens, outputTokens, model.input_1m, model.output_1m),
                valid: true,
            };
        });
    }, [rows, inputTokens, outputTokens]);

    // Find the cheapest valid row
    const cheapestIdx = useMemo(() => {
        let best = -1;
        let bestTotal = Infinity;
        rowCosts.forEach((c, i) => {
            if (c.valid && c.total < bestTotal) {
                bestTotal = c.total;
                best = i;
            }
        });
        return best;
    }, [rowCosts]);

    // Build filtered and sorted pricing table data
    const pricingTableData = useMemo(() => {
        let data = PRICING_DATA.providers.flatMap((prov) =>
            prov.models.map((m) => ({ ...m, provider: prov.name, id: `${prov.name}-${m.name}` }))
        );

        // Filter by provider
        if (activeProviderFilter !== "All") {
            data = data.filter((item) => item.provider === activeProviderFilter);
        }

        // Filter by search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            data = data.filter(
                (item) =>
                    item.name.toLowerCase().includes(q) ||
                    item.provider.toLowerCase().includes(q)
            );
        }

        // Filter by highlights
        if (activeHighlight) {
            if (activeHighlight === "Cheapest") {
                const minInput = Math.min(...data.map(m => m.input_1m));
                data = data.filter(m => m.input_1m <= minInput * 1.5);
            } else if (activeHighlight === "Fastest") {
                data = data.filter(m => getModelTier(m.name) === "speed");
            } else if (activeHighlight === "Intelligence") {
                data = data.filter(m => getModelTier(m.name) === "intelligence");
            } else if (activeHighlight === "Max Context") {
                const maxCtx = Math.max(...data.map(m => m.maxContext || 0));
                data = data.filter(m => (m.maxContext || 0) >= maxCtx * 0.8);
            }
        }

        // Sort
        if (sortColumn && sortDir) {
            data.sort((a, b) => {
                let aVal: any = a[sortColumn as keyof typeof a];
                let bVal: any = b[sortColumn as keyof typeof b];

                if (typeof aVal === "string") {
                    aVal = aVal.toLowerCase();
                    bVal = (bVal as string).toLowerCase();
                }

                const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                return sortDir === "asc" ? comparison : -comparison;
            });
        } else {
            // Default: sort by provider then model name
            data.sort((a, b) => {
                const provCmp = a.provider.localeCompare(b.provider);
                if (provCmp !== 0) return provCmp;
                return a.name.localeCompare(b.name);
            });
        }

        return data;
    }, [activeProviderFilter, searchQuery, activeHighlight, sortColumn, sortDir]);

    // Calculate heat map values
    const heatmapStats = useMemo(() => {
        if (pricingTableData.length === 0) return { inputMin: 0, inputMax: 1, outputMin: 0, outputMax: 1, contextMax: 1 };
        const inputs = pricingTableData.map((m) => m.input_1m);
        const outputs = pricingTableData.map((m) => m.output_1m);
        return {
            inputMin: Math.min(...inputs),
            inputMax: Math.max(...inputs),
            outputMin: Math.min(...outputs),
            outputMax: Math.max(...outputs),
            contextMax: Math.max(...pricingTableData.map((m) => m.maxContext || 200000)),
        };
    }, [pricingTableData]);

    // Recommendation Logic
    const recommendedModel = useMemo(() => {
        if (!showRecResult) return null;
        const { useCase, volume, budget } = recAnswers;
        
        let targetProvider = "";
        let targetModel = "";

        if (useCase === "Coding") {
            if (budget === "High") {
                targetProvider = "Anthropic";
                targetModel = "Claude 4.6 Opus";
            } else {
                targetProvider = "DeepSeek";
                targetModel = "DeepSeek V3.2";
            }
        } else if (useCase === "Creative") {
            targetProvider = "Anthropic";
            targetModel = "Claude 4.6 Sonnet";
        } else { // General
            if (volume === "High") {
                targetProvider = "OpenAI";
                targetModel = "GPT-5.2 (Flagship)";
            } else {
                targetProvider = "OpenAI";
                targetModel = "GPT-5 Nano";
            }
        }

        const provider = PRICING_DATA.providers.find(p => p.name === targetProvider);
        const model = provider?.models.find(m => m.name === targetModel);
        
        return model ? { ...model, provider: targetProvider } : null;
    }, [showRecResult, recAnswers]);

    // Find best value in filtered set
    const bestValueId = useMemo(() => {
        let best = "";
        let bestScore = Infinity;
        pricingTableData.forEach((m) => {
            const score = m.input_1m + m.output_1m * 4; // Weight output higher
            if (score < bestScore) {
                bestScore = score;
                best = m.id;
            }
        });
        return best;
    }, [pricingTableData]);

    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            if (sortDir === "asc") setSortDir("desc");
            else setSortDir(null);
            if (sortDir === null) setSortColumn(null);
        } else {
            setSortColumn(column);
            setSortDir("asc");
        }
    };

    const handleCopyRow = (model: (typeof pricingTableData)[number]) => {
        const text = `Model: ${model.name} | Provider: ${model.provider} | Input: $${model.input_1m}/M | Output: $${model.output_1m}/M | Context: ${formatContext(model.maxContext || 200000)}`;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(model.id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const providerList = ["All", ...new Set(PRICING_DATA.providers.map((p) => p.name))];

    return (
        <div className="space-y-12">
            {/* ── AI Model Matchmaker ── */}
            <div className="space-y-4">
                <div className="space-y-1 ml-1">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">AI Model Matchmaker</h3>
                    <p className="text-sm text-slate-400">Tell us your job, we&apos;ll find your best-fit models. Choose your use case (General, Coding, or Creative) to get personalized recommendations.</p>
                </div>
                <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-md p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="w-12 h-12 text-indigo-400" />
                    </div>
                    
                    {!showRecResult ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-indigo-400">
                                <Brain className="w-5 h-5" />
                                <h3 className="font-bold text-lg">AI Model Matchmaker</h3>
                            </div>
                            
                            {recStep === 0 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                    <p className="text-slate-300">What is your primary use case?</p>
                                    <div className="flex flex-wrap gap-2">
                                        {["General", "Coding", "Creative"].map(v => (
                                            <Button key={v} variant="outline" size="sm" onClick={() => { setRecAnswers({...recAnswers, useCase: v}); setRecStep(1); }} className="bg-white/5 border-white/10 hover:bg-indigo-500/20">{v}</Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {recStep === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-left-2">
                                    <p className="text-slate-300">What is your expected message volume?</p>
                                    <div className="flex flex-wrap gap-2">
                                        {["Low", "Medium", "High"].map(v => (
                                            <Button key={v} variant="outline" size="sm" onClick={() => { setRecAnswers({...recAnswers, volume: v}); setRecStep(2); }} className="bg-white/5 border-white/10 hover:bg-indigo-500/20">{v}</Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {recStep === 2 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-left-2">
                                    <p className="text-slate-300">Prioritize performance or cost?</p>
                                    <div className="flex flex-wrap gap-2">
                                        {["Cost-First", "High-Performance"].map(v => (
                                            <Button key={v} variant="outline" size="sm" onClick={() => { setRecAnswers({...recAnswers, budget: v === "Cost-First" ? "Low" : "High"}); setShowRecResult(true); }} className="bg-white/5 border-white/10 hover:bg-indigo-500/20">{v}</Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row items-center gap-6 animate-in zoom-in-95 duration-300">
                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500 px-2.5 py-0.5 text-[11px] font-bold text-white mb-2 uppercase tracking-wider">
                                    Recommended Match
                                </div>
                                <h4 className="text-2xl font-bold text-white">{recommendedModel?.name}</h4>
                                <p className="text-slate-400 text-sm">Best for {recAnswers.useCase} with {recAnswers.volume} volume.</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => { setRecStep(0); setShowRecResult(false); }}
                                    className="bg-white/5 border-white/10"
                                >
                                    Start Over
                                </Button>
                                {recommendedModel && (
                                    <Link href={`/?model=${encodeURIComponent(recommendedModel.name)}`}>
                                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                                            Use in Calculator
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Global Token Volume ── */}
            <div className="space-y-4">
                <div className="space-y-1 ml-1">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Global Token Volume</h3>
                    <p className="text-sm text-slate-400">Set your exact token needs. Pick input/output volumes or use common scenarios to calculate real costs for your workload.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-xl space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold text-slate-100 tracking-wide uppercase">
                            Global Token Volume
                        </h2>
                        <button
                            onClick={applyCommonPreset}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 hover:border-amber-400/50 transition-all"
                        >
                            <TrendingDown className="w-3.5 h-3.5" />
                            Common Use Case
                            <span className="hidden sm:inline text-amber-300/60">
                                (500 in / 200 out)
                            </span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Input tokens */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Input Tokens
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {(["1K", "10K", "100K", "1M"] as const).map((p) => (
                                    <PresetButton
                                        key={p}
                                        label={p}
                                        active={inputPreset === p}
                                        onClick={() => setInputPreset(p)}
                                    />
                                ))}
                                <PresetButton
                                    label="Custom"
                                    active={inputPreset === "custom"}
                                    onClick={() => setInputPreset("custom")}
                                />
                            </div>
                            {inputPreset === "custom" && (
                                <Input
                                    type="number"
                                    min="0"
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    placeholder="e.g. 50000"
                                    className="bg-white/5 border-white/10 text-slate-100 h-8 text-sm focus-visible:ring-indigo-500"
                                />
                            )}
                            <p className="text-xs text-slate-500">
                                ={" "}
                                <span className="text-slate-300 font-mono">
                                    {inputTokens.toLocaleString()}
                                </span>{" "}
                                tokens
                            </p>
                        </div>

                        {/* Output tokens */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Output Tokens
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {(["1K", "10K", "100K", "1M"] as const).map((p) => (
                                    <PresetButton
                                        key={p}
                                        label={p}
                                        active={outputPreset === p}
                                        onClick={() => setOutputPreset(p)}
                                    />
                                ))}
                                <PresetButton
                                    label="Custom"
                                    active={outputPreset === "custom"}
                                    onClick={() => setOutputPreset("custom")}
                                />
                            </div>
                            {outputPreset === "custom" && (
                                <Input
                                    type="number"
                                    min="0"
                                    value={customOutput}
                                    onChange={(e) => setCustomOutput(e.target.value)}
                                    placeholder="e.g. 2000"
                                    className="bg-white/5 border-white/10 text-slate-100 h-8 text-sm focus-visible:ring-indigo-500"
                                />
                            )}
                            <p className="text-xs text-slate-500">
                                ={" "}
                                <span className="text-slate-300 font-mono">
                                    {outputTokens.toLocaleString()}
                                </span>{" "}
                                tokens
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Best Value Highlight ── */}
            <div className="space-y-4">
                <div className="space-y-1 ml-1">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Best Value Highlight</h3>
                    <p className="text-sm text-slate-400">Instant cost winner. See the top 2 models side-by-side with full cost breakdowns—input, output, and total—for your volume.</p>
                </div>
                <div className="space-y-3">
                    {rows.map((row, idx) => {
                    const providerData = PRICING_DATA.providers.find(
                        (p) => p.name === row.provider
                    );
                    const modelData = providerData?.models.find(
                        (m) => m.name === row.model
                    );
                    const costs = rowCosts[idx];
                    const isBest = idx === cheapestIdx && costs.valid;
                    const tier = modelData ? getModelTier(modelData.name) : null;

                    return (
                        <div
                            key={row.id}
                            className={`relative rounded-2xl border backdrop-blur-md p-5 transition-all duration-300 shadow-lg ${isBest
                                    ? "border-green-500/50 bg-green-500/5 shadow-green-500/10"
                                    : "border-white/10 bg-white/5"
                                }`}
                        >
                            {/* Best Value Badge */}
                            {isBest && (
                                <div className="absolute -top-3 left-4 inline-flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-0.5 text-[11px] font-bold text-black shadow-md shadow-green-500/30">
                                    <Trophy className="w-3 h-3" />
                                    Best Value
                                </div>
                            )}

                            {/* Row number + remove */}
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Model {idx + 1}
                                </span>
                                {rows.length > 1 && (
                                    <button
                                        onClick={() => removeRow(row.id)}
                                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                        aria-label="Remove row"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Provider Select */}
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor={`${uid}-provider-${row.id}`}
                                        className="text-xs font-medium text-slate-400"
                                    >
                                        Provider
                                    </label>
                                    <Select
                                        value={row.provider}
                                        onValueChange={(v) => updateRow(row.id, { provider: v })}
                                    >
                                        <SelectTrigger
                                            id={`${uid}-provider-${row.id}`}
                                            className="bg-white/5 border-white/10 text-slate-100 hover:border-indigo-500/40 focus:ring-indigo-500 h-9"
                                        >
                                            <SelectValue placeholder="Select provider" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10">
                                            {PRICING_DATA.providers.map((p) => (
                                                <SelectItem key={p.name} value={p.name}>
                                                    {p.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Model Select */}
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor={`${uid}-model-${row.id}`}
                                        className="text-xs font-medium text-slate-400"
                                    >
                                        Model{" "}
                                        {tier && (
                                            <span className="ml-1 align-middle">
                                                <TierBadge tier={tier} />
                                            </span>
                                        )}
                                    </label>
                                    <Select
                                        value={row.model}
                                        onValueChange={(v) => updateRow(row.id, { model: v })}
                                        disabled={!row.provider}
                                    >
                                        <SelectTrigger
                                            id={`${uid}-model-${row.id}`}
                                            className="bg-white/5 border-white/10 text-slate-100 hover:border-indigo-500/40 focus:ring-indigo-500 h-9 disabled:opacity-40"
                                        >
                                            <SelectValue placeholder="Select model" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10">
                                            {providerData?.models.map((m) => {
                                                const t = getModelTier(m.name);
                                                return (
                                                    <SelectItem key={m.name} value={m.name}>
                                                        <span className="flex items-center gap-2">
                                                            {m.name}
                                                            {t === "speed" && (
                                                                <Zap className="w-3 h-3 text-cyan-400 inline" />
                                                            )}
                                                            {t === "intelligence" && (
                                                                <Brain className="w-3 h-3 text-purple-400 inline" />
                                                            )}
                                                        </span>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Pricing info */}
                                {modelData && (
                                    <div className="space-y-1.5">
                                        <p className="text-xs font-medium text-slate-400">
                                            Rates (per 1M tokens)
                                        </p>
                                        <div className="flex gap-3 text-xs text-slate-300 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                                            <span>
                                                In:{" "}
                                                <span className="font-mono text-indigo-300">
                                                    ${modelData.input_1m.toFixed(3)}
                                                </span>
                                            </span>
                                            <span className="text-slate-600">|</span>
                                            <span>
                                                Out:{" "}
                                                <span className="font-mono text-indigo-300">
                                                    ${modelData.output_1m.toFixed(3)}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Cost output */}
                                <div className="space-y-1.5">
                                    <p className="text-xs font-medium text-slate-400">
                                        Estimated Cost
                                    </p>
                                    {costs.valid ? (
                                        <div
                                            className={`rounded-xl px-3 py-2 border space-y-0.5 ${isBest
                                                    ? "bg-green-500/10 border-green-500/20"
                                                    : "bg-white/5 border-white/5"
                                                }`}
                                        >
                                            <div className="flex justify-between text-xs text-slate-400">
                                                <span>Input</span>
                                                <span className="font-mono text-slate-300">
                                                    {formatCost(costs.inputCost)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xs text-slate-400">
                                                <span>Output</span>
                                                <span className="font-mono text-slate-300">
                                                    {formatCost(costs.outputCost)}
                                                </span>
                                            </div>
                                            <div
                                                className={`flex justify-between text-sm font-bold border-t mt-1 pt-1 ${isBest
                                                        ? "border-green-500/20 text-green-400"
                                                        : "border-white/10 text-slate-100"
                                                    }`}
                                            >
                                                <span>Total</span>
                                                <span className="font-mono">
                                                    {formatCost(costs.total)}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-xl px-3 py-2 bg-white/5 border border-white/5 text-xs text-slate-500 italic">
                                            Select a model to calculate
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Add Row Button ── */}
            <Button
                variant="outline"
                onClick={addRow}
                className="w-full border-dashed border-white/20 bg-white/5 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all h-11 text-sm font-medium"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add Model for Comparison
            </Button>

            {/* ── Full Pricing Reference Table ── */}
            <div className="space-y-4">
                <div className="space-y-1 ml-1">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Full Pricing Reference Table</h3>
                    <p className="text-sm text-slate-400">Browse all models at once. Filter by provider, search by name, sort by price/speed/intelligence, and view context windows to compare every option.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden space-y-4 p-5">
                    <div className="space-y-4">
                        {/* Header */}
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                        <span>Full Pricing Reference</span>
                                        <Clock className="w-4 h-4 text-slate-500" />
                                    </h3>
                                    <div className="text-xs font-mono text-slate-600 flex items-center gap-1.5">
                                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        Prices last verified: {PRICING_DATA.last_updated}
                                    </div>
                                </div>

                                {/* Search & Filter Bar */}
                                <div className="space-y-2 flex-1 max-w-xl">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Search & Filter Bar</p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input 
                                                placeholder="Search models or providers..." 
                                                className="pl-9 bg-white/5 border-white/10 h-9 text-sm focus-visible:ring-indigo-500"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <Select value={activeProviderFilter} onValueChange={setActiveProviderFilter}>
                                            <SelectTrigger className="w-full sm:w-[160px] bg-white/5 border-white/10 h-9 text-sm">
                                                <Filter className="w-3.5 h-3.5 mr-2 text-slate-500" />
                                                <SelectValue placeholder="Provider" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10">
                                                {providerList.map(p => (
                                                    <SelectItem key={p} value={p}>{p}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <p className="text-[10px] text-slate-500 ml-1">Find fast. Search model names or providers, then filter results to narrow down your options in seconds.</p>
                                </div>
                            </div>

                            {/* Quick Filters/Highlights */}
                            <div className="space-y-3 border-t border-white/5 pt-4">
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest self-center mr-2">Quick Filters:</span>
                                    {["Cheapest", "Fastest", "Intelligence", "Max Context"].map(h => (
                                        <button
                                            key={h}
                                            onClick={() => setActiveHighlight(activeHighlight === h ? null : h)}
                                            className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                                                activeHighlight === h
                                                    ? "bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-sm shadow-indigo-500/10"
                                                    : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
                                            }`}
                                        >
                                            {h === "Cheapest" && <TrendingDown className="w-3 h-3" />}
                                            {h === "Fastest" && <Zap className="w-3 h-3" />}
                                            {h === "Intelligence" && <Brain className="w-3 h-3" />}
                                            {h === "Max Context" && <MousePointer2 className="w-3 h-3" />}
                                            {h}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-500">Jump to what matters. Tap Cheapest, Fastest, Intelligence, or Max Context badges to instantly surface models that match your priority.</p>
                            </div>
                        </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-xs text-left border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-slate-900/95 backdrop-blur-sm shadow-sm">
                                    <th className="py-4 pr-4 pl-2 text-slate-400 border-b border-white/10 first:rounded-tl-lg">
                                        <SortHeader
                                            label="Provider"
                                            column="provider"
                                            currentSort={sortColumn}
                                            currentDir={sortDir}
                                            onClick={() => handleSort("provider")}
                                        />
                                    </th>
                                    <th className="py-4 pr-4 text-slate-400 border-b border-white/10">
                                        <SortHeader
                                            label="Model"
                                            column="model"
                                            currentSort={sortColumn}
                                            currentDir={sortDir}
                                            onClick={() => handleSort("model")}
                                        />
                                    </th>
                                    <th className="py-4 pr-4 text-right text-slate-400 border-b border-white/10">
                                        <div className="flex items-center justify-end">
                                            <SortHeader
                                                label="Input / 1M"
                                                column="input"
                                                currentSort={sortColumn}
                                                currentDir={sortDir}
                                                onClick={() => handleSort("input")}
                                            />
                                            <CostTooltip inputRate={1} outputRate={0} />
                                        </div>
                                    </th>
                                    <th className="py-4 pr-4 text-right text-slate-400 border-b border-white/10">
                                        <div className="flex items-center justify-end">
                                            <SortHeader
                                                label="Output / 1M"
                                                column="output"
                                                currentSort={sortColumn}
                                                currentDir={sortDir}
                                                onClick={() => handleSort("output")}
                                            />
                                            <CostTooltip inputRate={0} outputRate={1} />
                                        </div>
                                    </th>
                                    <th className="py-4 pr-4 text-right text-slate-400 border-b border-white/10">
                                        <SortHeader
                                            label="Context"
                                            column="context"
                                            currentSort={sortColumn}
                                            currentDir={sortDir}
                                            onClick={() => handleSort("context")}
                                        />
                                    </th>
                                    <th className="py-4 pr-2 text-right text-slate-400 border-b border-white/10 last:rounded-tr-lg">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pricingTableData.map((model, idx) => {
                                    const tier = getModelTier(model.name);
                                    const isBest = model.id === bestValueId;
                                    const inputBg = getHeatmapColor(model.input_1m, heatmapStats.inputMin, heatmapStats.inputMax);
                                    const outputBg = getHeatmapColor(model.output_1m, heatmapStats.outputMin, heatmapStats.outputMax);

                                    return (
                                        <tr
                                            key={model.id}
                                            className={`border-b border-white/5 hover:bg-white/5 transition-colors group ${
                                                idx % 2 === 0 ? "bg-white/[0.01]" : "bg-transparent"
                                            }`}
                                        >
                                            <td className="py-3.5 pr-4 pl-2 text-slate-400 font-medium">{model.provider}</td>
                                            <td className="py-3.5 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-100 font-semibold">{model.name}</span>
                                                    {tier && <TierBadge tier={tier} />}
                                                </div>
                                            </td>
                                            <td
                                                className="py-3.5 pr-4 text-right font-mono text-slate-200"
                                                style={{ backgroundColor: inputBg }}
                                            >
                                                ${model.input_1m.toFixed(3)}
                                            </td>
                                            <td
                                                className="py-3.5 pr-4 text-right font-mono text-slate-200"
                                                style={{ backgroundColor: outputBg }}
                                            >
                                                ${model.output_1m.toFixed(3)}
                                            </td>
                                            <td className="py-3.5 pr-4 text-right">
                                                <ContextBar value={model.maxContext || 200000} max={heatmapStats.contextMax} />
                                            </td>
                                            <td className="py-3.5 pr-2 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/?model=${encodeURIComponent(model.name)}`}>
                                                        <button
                                                            className="p-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors"
                                                            title="Use in Calculator"
                                                        >
                                                            <Calculator className="w-3.5 h-3.5" />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleCopyRow(model)}
                                                        className="p-1.5 rounded hover:bg-white/10 text-slate-400 transition-colors"
                                                        title="Copy Info"
                                                    >
                                                        {copiedId === model.id ? (
                                                            <Check className="w-3.5 h-3.5 text-green-400" />
                                                        ) : (
                                                            <Copy className="w-3.5 h-3.5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View - Enhanced */}
                    <div className="md:hidden space-y-4">
                        {pricingTableData.map((model) => {
                            const tier = getModelTier(model.name);
                            return (
                                <div
                                    key={model.id}
                                    className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-4 hover:border-indigo-500/30 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                                    {model.provider}
                                                </span>
                                                {tier && <TierBadge tier={tier} />}
                                            </div>
                                            <h4 className="font-bold text-slate-100">{model.name}</h4>
                                        </div>
                                        <button
                                            onClick={() => handleCopyRow(model)}
                                            className="p-2 rounded bg-white/5 text-slate-400"
                                        >
                                            {copiedId === model.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white/5 rounded-lg p-2.5 space-y-0.5 border border-white/5">
                                            <span className="text-[10px] text-slate-500 uppercase font-bold">Input / 1M</span>
                                            <p className="font-mono text-sm text-indigo-300">${model.input_1m.toFixed(3)}</p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-2.5 space-y-0.5 border border-white/5">
                                            <span className="text-[10px] text-slate-500 uppercase font-bold">Output / 1M</span>
                                            <p className="font-mono text-sm text-indigo-300">${model.output_1m.toFixed(3)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 uppercase font-bold">Context Window</span>
                                            <span className="text-xs text-slate-300 font-mono">{formatContext(model.maxContext || 200000)}</span>
                                        </div>
                                        <Link href={`/?model=${encodeURIComponent(model.name)}`} className="flex-1 max-w-[160px]">
                                            <Button size="sm" variant="outline" className="w-full h-9 text-xs border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-400 gap-2">
                                                Use in Calculator
                                                <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {pricingTableData.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 text-slate-600">
                                <Search className="w-6 h-6" />
                            </div>
                            <p className="text-slate-500 text-sm">No models found matching your filters.</p>
                            <Button variant="link" onClick={() => { setSearchQuery(""); setActiveProviderFilter("All"); setActiveHighlight(null); }} className="text-indigo-400">Clear all filters</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
</div>
    );
}
