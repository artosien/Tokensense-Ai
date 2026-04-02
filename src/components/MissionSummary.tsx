"use client";

import React, { useMemo } from "react";
import { useTokenSenseStore } from "@/lib/store";
import { models } from "@/lib/models";
import { 
    CheckCircle2, 
    FileText, 
    TrendingDown, 
    Database, 
    Download, 
    FileSpreadsheet,
    Zap,
    ShieldCheck,
    Cpu,
    ArrowRightLeft,
    Layers,
    Share2,
    PlaneLanding
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    PieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    Tooltip as ChartTooltip,
    Legend
} from "recharts";

export default function MissionSummary() {
    const { 
        rawPrompt,
        optimizedPrompt,
        inputTokenCount,
        fileTokenCount,
        expectedOutputTokens,
        staticTokenCount,
        selectedModelId,
        deliveryMode
    } = useTokenSenseStore();

    const model = models.find(m => m.id === selectedModelId) || models[0];
    
    const totalTokens = inputTokenCount + fileTokenCount + expectedOutputTokens + staticTokenCount;
    const discount = deliveryMode === "batch" ? (model.batchDiscount || 1) : 1;
    
    const standardPricePer1M = model.inputPricePer1M;
    const effectivePricePer1M = model.inputPricePer1M * discount;
    
    // Heuristic: Compression savings (if optimizedPrompt is set)
    const compressionRatio = optimizedPrompt && rawPrompt ? (1 - optimizedPrompt.length / rawPrompt.length) : 0.12; // fallback to 12% if not set
    const totalSavingsPercent = ((1 - (effectivePricePer1M * (1 - compressionRatio) / standardPricePer1M)) * 100).toFixed(0);

    const pieData = [
        { name: "Input", value: inputTokenCount, color: "#6366f1" },
        { name: "File Context", value: fileTokenCount, color: "#8b5cf6" },
        { name: "Static (Cached)", value: staticTokenCount, color: "#3b82f6" },
        { name: "Output Headroom", value: expectedOutputTokens, color: "#10b981" },
    ].filter(d => d.value > 0);

    const downloadFlightLog = () => {
        const data = {
            missionDate: new Date().toISOString(),
            model: model.name,
            provider: model.provider,
            payload: {
                totalTokens,
                breakdown: {
                    input: inputTokenCount,
                    file: fileTokenCount,
                    static: staticTokenCount,
                    output: expectedOutputTokens
                }
            },
            configuration: {
                deliveryMode,
                savings: `${totalSavingsPercent}%`
            },
            manifest: optimizedPrompt || rawPrompt
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Flight_Log_${new Date().getTime()}.json`;
        a.click();
    };

    return (
        <div className="space-y-8 font-mono">
            {/* Header: Executive Summary */}
            <Card className="bg-indigo-600/10 border-indigo-500/30 overflow-hidden relative shadow-2xl">
                <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none">
                    <PlaneLanding className="w-48 h-48 text-indigo-400" />
                </div>
                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-indigo-400">
                            <ShieldCheck className="w-6 h-6" />
                            <h2 className="text-sm font-black uppercase tracking-[0.3em]">Mission Summary: SUCCESS</h2>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                            You reduced mission costs by <span className="text-emerald-400">~{totalSavingsPercent}%</span>
                        </h3>
                        <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                            By leveraging {model.name}&apos;s {deliveryMode === 'batch' ? 'Batch API' : 'architecture'} and optimizing your payload weight, you&apos;ve cleared the way for a high-efficiency production launch.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 shrink-0">
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                            <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Final Weight</span>
                            <span className="text-2xl font-black text-white">{totalTokens.toLocaleString()}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                            <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Fuel Burn</span>
                            <span className="text-2xl font-black text-emerald-400">${effectivePricePer1M.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. The Manifest (Prompt) */}
                <Card className="lg:col-span-2 bg-slate-900/50 border-white/10 shadow-xl overflow-hidden flex flex-col">
                    <CardHeader className="pb-4 border-b border-white/5 bg-slate-800/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-indigo-400" />
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Mission Manifest</CardTitle>
                            </div>
                            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 font-black uppercase">Optimized version</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 flex-1">
                        <div className="bg-black/40 rounded-xl p-6 border border-white/5 font-mono text-sm leading-relaxed text-slate-300 max-h-[500px] overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                            {optimizedPrompt || rawPrompt || "No payload loaded in hangar."}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-4">
                            <Button variant="outline" className="h-12 border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold gap-2 flex-1 uppercase tracking-widest" onClick={() => navigator.clipboard.writeText(optimizedPrompt || rawPrompt)}>
                                <Layers className="w-4 h-4" /> Copy Manifest
                            </Button>
                            <Button className="h-12 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold gap-2 flex-1 uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                                <Share2 className="w-4 h-4" /> Deploy to Production
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Visual Analytics & Export */}
                <div className="space-y-8">
                    <Card className="bg-slate-900/50 border-white/10 shadow-xl overflow-hidden">
                        <CardHeader className="pb-4 border-b border-white/5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Token Allocation</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="h-[240px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <ChartTooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase', paddingTop: '20px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-white/10 shadow-xl overflow-hidden">
                        <CardHeader className="pb-4 border-b border-white/5 bg-slate-800/20">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">Post-Flight Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-3">
                            <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black gap-3 uppercase tracking-widest" onClick={downloadFlightLog}>
                                <Download className="w-4 h-4 text-indigo-400" /> Download Flight Log (JSON)
                            </Button>
                            <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black gap-3 uppercase tracking-widest">
                                <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export CSV for Finance
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col items-center text-center space-y-2">
                        <Cpu className="w-8 h-8 text-indigo-400 mb-2" />
                        <p className="text-sm font-black text-white uppercase tracking-tighter">Ready for Next Mission?</p>
                        <Button variant="link" className="text-indigo-400 text-[10px] font-black uppercase" onClick={() => window.location.href = '/'}>
                            Reset Hangar Trajectory ➔
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
