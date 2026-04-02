"use client";

import React, { useState, useMemo } from "react";
import { 
    Zap, 
    TrendingDown, 
    ArrowRight,
    Calculator,
    Bell,
    Clock,
    Flame,
    ArrowRightLeft,
    Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { models } from "@/lib/models";
import { priceWarData } from "@/lib/pricingData";

export default function PricingOptimizationSuite() {
    // Wait or Buy state
    const [monthlyVolume, setMonthlyVolume] = useState<number>(500); // in millions
    // Migration state
    const [fromModel, setFromModel] = useState<string>("gpt-4o");
    const [toModel, setToModel] = useState<string>("gemini-2.5-flash-lite");
    // Burn Rate State
    const [burnTokens, setBurnTokens] = useState<number>(1000); // 1B tokens

    const handleWaitOrBuy = useMemo(() => {
        const currentAvgPrice = 2.0; // Current average
        const predictedPrice = 1.4; // 30% drop
        const currentCost = (monthlyVolume * currentAvgPrice);
        const futureCost = (monthlyVolume * predictedPrice);
        const savings = currentCost - futureCost;
        
        return { currentCost, futureCost, savings };
    }, [monthlyVolume]);

    const handleMigration = useMemo(() => {
        const from = models.find(m => m.id === fromModel);
        const to = models.find(m => m.id === toModel);
        if (!from || !to) return null;

        const fromPrice = from.inputPricePer1M;
        const toPrice = to.inputPricePer1M;
        const savingsPercent = ((fromPrice - toPrice) / fromPrice) * 100;
        
        const mmluDiff = (to.benchmarks?.mmlu || 0) - (from.benchmarks?.mmlu || 0);

        return { fromPrice, toPrice, savingsPercent, mmluDiff };
    }, [fromModel, toModel]);

    const handleBurnRate = useMemo(() => {
        // Assume 2024 price was ~$15/1M, today is ~$2/1M
        const cost2024 = burnTokens * 15;
        const costToday = burnTokens * 2;
        return { cost2024, costToday };
    }, [burnTokens]);

    return (
        <div className="space-y-6">
            {/* 1. Wait or Buy Calculator */}
            <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md">
                <CardHeader className="pb-4 border-b border-white/5">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        Wait or Buy Calculator
                    </CardTitle>
                    <CardDescription className="text-[10px]">Predictive 6-Month Savings</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                            Monthly Volume (Millions)
                        </label>
                        <Input 
                            type="number" 
                            value={monthlyVolume} 
                            onChange={(e) => setMonthlyVolume(parseInt(e.target.value) || 0)}
                            className="bg-white/5 border-white/10 h-10 font-mono text-xs"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[9px] font-bold text-slate-500 uppercase block">Scale Now</span>
                            <span className="text-sm font-black text-white font-mono">${handleWaitOrBuy.currentCost.toLocaleString()}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                            <span className="text-[9px] font-bold text-indigo-400 uppercase block">Wait 6 Months (-30%)</span>
                            <span className="text-sm font-black text-indigo-400 font-mono">${handleWaitOrBuy.futureCost.toLocaleString()}</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                        Delaying launch could save you <span className="text-emerald-400 font-bold">${handleWaitOrBuy.savings.toLocaleString()}/mo</span>, but costs you 6 months of market share.
                    </p>
                </CardContent>
            </Card>

            {/* 2. Interactive Model Migration Forecaster */}
            <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md">
                <CardHeader className="pb-4 border-b border-white/5">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                        Model Migration ROI
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-5 gap-2 items-center">
                        <div className="col-span-2 space-y-1">
                            <label className="text-[9px] font-bold text-slate-500 uppercase">From</label>
                            <Select value={fromModel} onValueChange={setFromModel}>
                                <SelectTrigger className="h-8 bg-white/5 border-white/10 text-[10px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10">
                                    {models.map(m => <SelectItem key={`from-${m.id}`} value={m.id} className="text-[10px]">{m.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-1 flex justify-center text-slate-500 mt-4">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                        <div className="col-span-2 space-y-1">
                            <label className="text-[9px] font-bold text-slate-500 uppercase">To</label>
                            <Select value={toModel} onValueChange={setToModel}>
                                <SelectTrigger className="h-8 bg-white/5 border-white/10 text-[10px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10">
                                    {models.map(m => <SelectItem key={`to-${m.id}`} value={m.id} className="text-[10px]">{m.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {handleMigration && (
                        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400">Cost Savings</span>
                                <span className={`text-sm font-black font-mono ${handleMigration.savingsPercent > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {handleMigration.savingsPercent > 0 ? '-' : '+'}{Math.abs(handleMigration.savingsPercent).toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400">Intelligence Shift (MMLU)</span>
                                <span className={`text-[10px] font-black font-mono ${handleMigration.mmluDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {handleMigration.mmluDiff > 0 ? '+' : ''}{handleMigration.mmluDiff.toFixed(1)} pts
                                </span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 6. Personal Burn Rate Time Machine */}
            <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md">
                <CardHeader className="pb-4 border-b border-white/5">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-400" />
                        Burn Rate Time Machine
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Your Monthly Tokens (Millions)
                        </label>
                        <Input 
                            type="number" 
                            value={burnTokens} 
                            onChange={(e) => setBurnTokens(parseInt(e.target.value) || 0)}
                            className="bg-white/5 border-white/10 h-10 font-mono text-xs"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center z-10">
                            <ArrowRight className="w-3 h-3 text-slate-500" />
                        </div>
                        <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
                            <span className="text-[9px] font-bold text-red-400/70 uppercase block">2024 (GPT-4)</span>
                            <span className="text-sm font-black text-red-400 font-mono">${handleBurnRate.cost2024.toLocaleString()}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                            <span className="text-[9px] font-bold text-emerald-400/70 uppercase block">Today (GPT-5.2)</span>
                            <span className="text-sm font-black text-emerald-400 font-mono">${handleBurnRate.costToday.toLocaleString()}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 7. Provider Price War Heatmap */}
            <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md">
                <CardHeader className="pb-4 border-b border-white/5">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        Price War Heatmap
                    </CardTitle>
                    <CardDescription className="text-[10px]">Days since last price cut</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                    {priceWarData.sort((a,b) => a.daysSinceCut - b.daysSinceCut).map(p => (
                        <div key={p.provider} className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-300">{p.provider}</span>
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${p.daysSinceCut < 90 ? 'bg-emerald-500' : p.daysSinceCut < 180 ? 'bg-amber-500' : 'bg-red-500'}`}
                                        style={{ width: `${Math.max(10, 100 - (p.daysSinceCut / 365) * 100)}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-mono text-slate-400 w-12 text-right">{p.daysSinceCut}d</span>
                            </div>
                        </div>
                    ))}
                    <p className="text-[9px] text-slate-500 pt-2 border-t border-white/5">
                        Providers with &gt;180 days are highly likely to announce cuts soon.
                    </p>
                </CardContent>
            </Card>

            {/* 4. Price Change Alerts */}
            <Card className="border-indigo-500/30 bg-indigo-500/5 backdrop-blur-md">
                <CardHeader className="pb-3">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Price Cut Alerts
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input 
                            placeholder="Enter your email"
                            className="pl-9 bg-slate-900 border-white/10 h-9 text-xs"
                        />
                    </div>
                    <Button className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-[10px] font-bold uppercase tracking-widest">
                        Notify Me
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
