"use client";

import React, { useMemo } from "react";
import { useTokenSenseStore } from "@/lib/store";
import { models } from "@/lib/models";
import { 
    Zap, 
    Database, 
    Activity, 
    AlertTriangle, 
    CheckCircle2, 
    ArrowRight,
    Gauge,
    Layers,
    BarChart3
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function OptimizationProgressHUD() {
    const { 
        inputTokenCount, 
        fileTokenCount, 
        expectedOutputTokens, 
        staticTokenCount,
        selectedModelId,
        deliveryMode
    } = useTokenSenseStore();

    const pathname = usePathname();
    const model = models.find(m => m.id === selectedModelId) || models[0];
    
    const totalTokens = inputTokenCount + fileTokenCount + expectedOutputTokens + staticTokenCount;
    const utilization = (totalTokens / model.maxContext) * 100;
    
    const costPer1M = useMemo(() => {
        const discount = deliveryMode === "batch" ? (model.batchDiscount || 1) : 1;
        return model.inputPricePer1M * discount;
    }, [model, deliveryMode]);

    const status = useMemo(() => {
        if (totalTokens === 0) return { label: "Awaiting Input", color: "text-slate-500", icon: <Activity className="w-3 h-3" /> };
        if (totalTokens > model.maxContext) return { label: "Context Exceeded", color: "text-red-400", icon: <AlertTriangle className="w-3 h-3 animate-pulse" /> };
        if (utilization > 80) return { label: "Nearing Context Limit", color: "text-amber-400", icon: <AlertTriangle className="w-3 h-3" /> };
        return { label: "Ready to Analyze", color: "text-emerald-400", icon: <CheckCircle2 className="w-3 h-3" /> };
    }, [totalTokens, model.maxContext, utilization]);

    const steps = [
        { label: "Input", path: "/" },
        { label: "Context", path: "/tools/context" },
        { label: "Compression", path: "/tools/compression" },
        { label: "Batch Planner", path: "/tools/batch" },
        { label: "Comparison", path: "/comparison" },
        { label: "Final Report", path: "/workflow" }
    ];

    const currentStepIndex = steps.findIndex(s => s.path === pathname);

    return (
        <div className="w-full bg-slate-950/80 backdrop-blur-md border-b border-white/5 sticky top-16 z-40 overflow-hidden print:hidden font-mono">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Status Indicators */}
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                <Database className="w-2.5 h-2.5" /> Total Tokens
                            </span>
                            <span className="text-xs font-black text-white">{totalTokens.toLocaleString()} <span className="text-slate-500 opacity-50">TKN</span></span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                <BarChart3 className="w-2.5 h-2.5" /> Price/1M
                            </span>
                            <span className="text-xs font-black text-white">${costPer1M.toFixed(2)}<span className="text-slate-500 opacity-50">/1M</span></span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                <Gauge className="w-2.5 h-2.5" /> Context Window
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-500 ${utilization > 90 ? 'bg-red-500' : utilization > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${Math.min(100, utilization)}%` }}
                                    />
                                </div>
                                <span className="text-xs font-black text-white">{utilization.toFixed(1)}%</span>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Optimization Status</span>
                            <div className={`flex items-center gap-1.5 text-xs font-black ${status.color}`}>
                                {status.icon}
                                {status.label}
                            </div>
                        </div>
                    </div>

                    {/* Optimization Pipeline Navigation */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                        {steps.map((step, i) => {
                            const isPast = i < currentStepIndex;
                            const isCurrent = i === currentStepIndex;
                            
                            return (
                                <React.Fragment key={step.path}>
                                    <Link 
                                        href={step.path}
                                        className={`step-nav-item flex items-center gap-2 px-2 py-1 rounded transition-all whitespace-nowrap ${isCurrent ? 'active' : isPast ? 'completed' : ''}`}
                                    >
                                        <span className={`text-[9px] font-black border rounded-sm w-4 h-4 flex items-center justify-center ${isCurrent ? 'border-indigo-500/50 bg-indigo-500 text-white' : isPast ? 'border-emerald-500/50 bg-emerald-500 text-black' : 'border-slate-700'}`}>
                                            {isPast ? "✓" : i + 1}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-tighter">{step.label}</span>
                                    </Link>
                                    {i < steps.length - 1 && <ArrowRight className="w-3 h-3 text-slate-800 shrink-0" />}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Subtle Progress Bar */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent relative" />
        </div>
    );
}
