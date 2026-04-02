"use client";

import React, { useState, useMemo } from "react";
import { 
    Calculator, 
    Layers, 
    Download, 
    TrendingUp, 
    TrendingDown, 
    Calendar, 
    Clock, 
    Zap, 
    Info,
    ArrowRight,
    Search,
    Database,
    FileSpreadsheet,
    FileText,
    ShieldAlert,
    Printer,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { models, ModelConfig } from "@/lib/models";
import NumberCounter from "@/components/NumberCounter";
import BatchOptimizationSuite from "./BatchOptimizationSuite";

export default function BatchCostPlanner() {
    const [promptTokens, setPromptTokens] = useState<number>(1000);
    const [outputTokens, setOutputTokens] = useState<number>(500);
    const [volume, setVolume] = useState<number>(50000);
    const [searchQuery, setSearchQuery] = useState("");
    const [buffer, setBuffer] = useState(0);
    const [isBatchMode, setIsBatchMode] = useState(false);

    const filteredModels = useMemo(() => {
        return models.filter(m => 
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            m.provider.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const calculations = useMemo(() => {
        return filteredModels.map(model => {
            const discount = isBatchMode ? (model.batchDiscount || 1) : 1;
            const inputPrice = model.inputPricePer1M * discount;
            const outputPrice = model.outputPricePer1M * discount;

            const inputCostPerRequest = (promptTokens / 1_000_000) * inputPrice;
            const outputCostPerRequest = (outputTokens / 1_000_000) * outputPrice;
            let costPerRequest = inputCostPerRequest + outputCostPerRequest;

            // Add reliability buffer
            costPerRequest = costPerRequest * (1 + (buffer / 100));

            const totalBatchCost = costPerRequest * volume;
            const dailyCost = totalBatchCost;
            const monthlyCost = totalBatchCost * 30;

            return {
                model,
                costPerRequest,
                totalBatchCost,
                dailyCost,
                monthlyCost,
                isDiscounted: discount < 1
            };
        }).sort((a, b) => a.totalBatchCost - b.totalBatchCost);
    }, [filteredModels, promptTokens, outputTokens, volume, isBatchMode, buffer]);

    const cheapestModel = calculations[0]?.model;

    const exportToCSV = () => {
        const headers = ["Model", "Provider", "Cost Per Request", "Total Batch Cost", "Monthly Projection (30x)", "Batch Mode"];
        const rows = calculations.map(calc => [
            calc.model.name,
            calc.model.provider,
            calc.costPerRequest.toFixed(6),
            calc.totalBatchCost.toFixed(2),
            calc.monthlyCost.toFixed(2),
            calc.isDiscounted ? "Yes" : "No"
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `batch_cost_projection_${volume}_requests.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const printReport = () => {
        window.print();
    };

    return (
        <div className="space-y-8 print:bg-white print:text-black">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Inputs Panel */}
                <div className="lg:col-span-1 space-y-6 print:hidden">
                    <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md shadow-xl">
                        <CardHeader className="pb-4 border-b border-white/5">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Batch Parameters</CardTitle>
                            <CardDescription className="text-xs">Define your workload scale</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <Database className="w-3 h-3" />
                                    Total Volume (Requests)
                                </label>
                                <Input 
                                    type="number" 
                                    value={volume} 
                                    onChange={(e) => setVolume(parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/10 h-11 font-mono text-indigo-400 font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <Zap className="w-3 h-3 text-indigo-400" />
                                    Prompt Tokens
                                </label>
                                <Input 
                                    type="number" 
                                    value={promptTokens} 
                                    onChange={(e) => setPromptTokens(parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/10 h-11 font-mono"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <ArrowRight className="w-3 h-3 text-purple-400" />
                                    Expected Output Tokens
                                </label>
                                <Input 
                                    type="number" 
                                    value={outputTokens} 
                                    onChange={(e) => setOutputTokens(parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/10 h-11 font-mono"
                                />
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-2 text-center">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Batch Tokens</p>
                                    <p className="text-2xl font-black text-white font-mono">
                                        {((promptTokens + outputTokens) * volume).toLocaleString()}
                                    </p>
                                    {buffer > 0 && (
                                        <p className="text-[9px] text-red-400 font-bold uppercase tracking-tight">
                                            Inc. {buffer}% Reliability Buffer
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button 
                                onClick={exportToCSV}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 py-6 rounded-xl shadow-lg shadow-emerald-900/20"
                            >
                                <FileSpreadsheet className="w-5 h-5" />
                                Export CSV
                            </Button>
                            <Button 
                                onClick={printReport}
                                variant="outline"
                                className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold gap-2 py-6 rounded-xl"
                            >
                                <Printer className="w-5 h-5" />
                                Print Executive Report
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Comparison Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between gap-4 print:hidden">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input 
                                placeholder="Filter models by name or provider..."
                                className="pl-10 bg-slate-900/50 border-white/10 h-10 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[1200px] overflow-y-auto pr-2 custom-scrollbar print:max-h-none print:overflow-visible">
                        {calculations.map(({ model, totalBatchCost, costPerRequest, monthlyCost, isDiscounted }, idx) => (
                            <Card key={model.id} className={`group border-white/10 bg-slate-900/50 backdrop-blur-md hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden print:bg-white print:border-black/10 print:shadow-none ${idx === 0 ? "border-emerald-500/30 ring-1 ring-emerald-500/20" : ""}`}>
                                {idx === 0 && (
                                    <div className="absolute top-0 right-0 p-2">
                                        <div className="bg-emerald-500 text-black text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Best Value</div>
                                    </div>
                                )}
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded print:text-indigo-600 print:bg-indigo-100">{model.provider}</span>
                                                {isDiscounted && (
                                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                                                        <Zap className="w-2.5 h-2.5" />
                                                        Batch Price
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-black text-white tracking-tight print:text-black">{model.name}</h3>
                                            <div className="flex gap-3 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                                                <span>TPM: {model.tpmLimit?.toLocaleString() || "N/A"}</span>
                                                <span>RPM: {model.rpmLimit?.toLocaleString() || "N/A"}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1">
                                                    <Database className="w-2.5 h-2.5" />
                                                    Batch Total
                                                </span>
                                                <div className="text-2xl font-black text-white font-mono print:text-black">
                                                    $<NumberCounter value={totalBatchCost} decimals={2} />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1">
                                                    <Calendar className="w-2.5 h-2.5" />
                                                    Monthly (30x)
                                                </span>
                                                <div className="text-xl font-bold text-slate-300 font-mono print:text-slate-700">
                                                    ${monthlyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                </div>
                                            </div>
                                            <div className="hidden md:block space-y-1 text-right">
                                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center justify-end gap-1">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    Unit Cost
                                                </span>
                                                <div className="text-sm font-bold text-indigo-400 font-mono print:text-indigo-700">
                                                    ${costPerRequest.toFixed(5)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Optimization Suite Panel */}
                <div className="lg:col-span-1 print:hidden">
                    <div className="sticky top-6">
                        <div className="mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-white">Optimization Suite</h2>
                        </div>
                        <BatchOptimizationSuite 
                            volume={volume}
                            selectedModel={cheapestModel}
                            onBufferChange={setBuffer}
                            onBatchModeChange={setIsBatchMode}
                            onPromptTokensChange={setPromptTokens}
                        />
                    </div>
                </div>
            </div>

            {/* Projections Section */}
            <div className="pt-12 border-t border-white/5 mt-12 print:hidden">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-black tracking-tight text-white uppercase">Understanding <span className="text-indigo-500">Batch Dynamics</span></h2>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">Scaling from one prompt to millions requires different strategies.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h3 className="font-black text-slate-200 uppercase tracking-tight">Batch APIs</h3>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Many providers (OpenAI, Anthropic) offer a **Batch API** that provides a **50% discount** if you can wait up to 24 hours for results. Toggle "Batch Mode" in the optimization suite to see these prices.
                            </p>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                    <TrendingDown className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="font-black text-slate-200 uppercase tracking-tight">Output Variability</h3>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Unlike input tokens which are static, output tokens vary per request. When planning a 50,000 row batch, use the **Reliability Buffer** to account for unexpected verbosity and outliers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}