"use client";

import React, { useState } from "react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area,
    ReferenceLine
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Zap, Sparkles, TrendingDown, Layers, Activity } from "lucide-react";
import { pricingData, timelineEvents } from "@/lib/pricingData";
import PricingOptimizationSuite from "./PricingOptimizationSuite";
import PriceBenchmarkChart from "./PriceBenchmarkChart";

export default function PricingHistoryClient() {
    const [activeDate, setActiveDate] = useState<string | null>(null);

    // Calculate Deflation Index
    const initialPrice = pricingData[0].openai;
    const currentPrice = pricingData[pricingData.length - 1].openai;
    const deflationPercent = (((initialPrice - currentPrice) / initialPrice) * 100).toFixed(0);

    // Format dates for ReferenceLine match (timeline events use like "March 2026", pricingData uses "2026-03")
    // Simple mapping to map the text to chart data key
    const formatTimelineDateToChartKey = (dateStr: string) => {
        const parts = dateStr.split(" ");
        if (parts.length !== 2) return null;
        const monthMap: Record<string, string> = {
            "January": "01", "February": "02", "March": "03", "April": "04",
            "May": "05", "June": "06", "July": "07", "August": "08",
            "September": "09", "October": "10", "November": "11", "December": "12"
        };
        const month = monthMap[parts[0]];
        if (!month) return null;
        return `${parts[1]}-${month}`;
    };

    return (
        <div className="space-y-12">
            {/* Deflation Index Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-3 bg-indigo-600/10 border-indigo-500/30 overflow-hidden relative shadow-2xl shadow-indigo-900/20">
                    <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none">
                        <TrendingDown className="w-48 h-48 text-indigo-400" />
                    </div>
                    <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-400" />
                                <h2 className="text-sm font-black uppercase tracking-widest text-indigo-400">TokenSense Deflation Index</h2>
                            </div>
                            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed font-medium">
                                The average cost of Frontier Intelligence (per 1M tokens) compared to the start of tracking. The intelligence deflation trend is actively destroying previous pricing models.
                            </p>
                        </div>
                        <div className="text-center md:text-right shrink-0">
                            <span className="text-6xl font-black font-mono text-white">-{deflationPercent}%</span>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Price Drop</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content (Charts & Timeline) */}
                <div className="lg:col-span-3 space-y-12">
                    {/* Charts Section */}
                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md shadow-2xl">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <TrendingDown className="w-4 h-4 text-indigo-400" />
                                    Cost of Frontier Intelligence (Input / 1M Tokens)
                                </CardTitle>
                                <Badge variant="outline" className="text-[10px] border-indigo-500/30 text-indigo-400">USD per 1M</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={pricingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorOpenai" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorAnthropic" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis 
                                            dataKey="date" 
                                            stroke="#64748b" 
                                            fontSize={10} 
                                            tickLine={false} 
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis 
                                            stroke="#64748b" 
                                            fontSize={10} 
                                            tickLine={false} 
                                            axisLine={false}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <ChartTooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '12px', fontSize: '12px' }}
                                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} />
                                        
                                        {activeDate && (
                                            <ReferenceLine 
                                                x={formatTimelineDateToChartKey(activeDate) || undefined} 
                                                stroke="#f59e0b" 
                                                strokeDasharray="3 3" 
                                                strokeWidth={2} 
                                                label={{ position: 'top', value: 'Event', fill: '#f59e0b', fontSize: 10, fontWeight: 'bold' }}
                                            />
                                        )}

                                        <Area type="monotone" dataKey="openai" name="OpenAI" stroke="#6366f1" fillOpacity={1} fill="url(#colorOpenai)" strokeWidth={3} />
                                        <Area type="monotone" dataKey="anthropic" name="Anthropic" stroke="#a855f7" fillOpacity={1} fill="url(#colorAnthropic)" strokeWidth={3} />
                                        <Area type="monotone" dataKey="google" name="Google" stroke="#10b981" fillOpacity={1} fill="url(#colorGoogle)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <PriceBenchmarkChart />

                    {/* Timeline Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Milestone <span className="text-indigo-500">Timeline</span></h2>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>

                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-indigo-500/50 before:to-transparent">
                            {timelineEvents.map((item, i) => (
                                <div 
                                    key={i} 
                                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active cursor-pointer"
                                    onMouseEnter={() => setActiveDate(item.date)}
                                    onMouseLeave={() => setActiveDate(null)}
                                >
                                    {/* Icon */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-slate-900 text-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors group-hover:border-indigo-500 group-hover:text-indigo-400 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                                        {item.type === 'cut' ? <TrendingDown className="w-4 h-4" /> : 
                                         item.type === 'release' ? <Sparkles className="w-4 h-4" /> : 
                                         <Zap className="w-4 h-4" />}
                                    </div>
                                    {/* Card */}
                                    <div className={`w-[calc(100%-4rem)] md:w-[45%] p-6 rounded-3xl bg-slate-900/50 border shadow-xl backdrop-blur-sm transition-all duration-300 ${activeDate === item.date ? 'border-amber-500/50 bg-slate-800/80 scale-[1.02]' : 'border-white/10 group-hover:border-indigo-500/30'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <time className={`text-[10px] font-black uppercase tracking-widest ${activeDate === item.date ? 'text-amber-400' : 'text-indigo-400'}`}>{item.date}</time>
                                            <Badge className={`${
                                                item.type === 'cut' ? 'bg-emerald-500/10 text-emerald-400' :
                                                item.type === 'release' ? 'bg-indigo-500/10 text-indigo-400' :
                                                'bg-amber-500/10 text-amber-400'
                                            } border-0 text-[9px] font-black uppercase`}>
                                                {item.change}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-slate-100 flex items-center gap-2">
                                                <span className="text-slate-500 text-[10px] uppercase font-black">{item.provider}</span>
                                                {item.model}
                                            </h3>
                                            <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.details}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Optimization Suite */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <PricingOptimizationSuite />
                    </div>
                </div>
            </div>

            {/* Price Floor Tracker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <Card className="bg-slate-900/50 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-indigo-400" />
                            Model Tier Price Floors (per 1M)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <span className="text-xs font-bold text-slate-300 uppercase">Frontier (Opus/GPT-5)</span>
                            <span className="text-sm font-mono font-black text-white">$1.75 - $5.00</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <span className="text-xs font-bold text-slate-300 uppercase">Balanced (Sonnet/Pro)</span>
                            <span className="text-sm font-mono font-black text-white">$1.25 - $3.00</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <span className="text-xs font-bold text-slate-300 uppercase">Efficient (Flash/Haiku)</span>
                            <span className="text-sm font-mono font-black text-white">$0.05 - $0.50</span>
                        </div>
                    </CardContent>
                </Card>

                <div className="p-8 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Info className="w-24 h-24 text-white" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">The 2026 Outlook</h3>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            Industry analysts predict another 30% reduction in costs by the end of 2026 as inference optimization reaches the hardware abstraction layer. TokenSense AI will continue to track these changes daily.
                        </p>
                        <div className="pt-2">
                            <Badge className="bg-indigo-500 text-white border-0 font-black uppercase text-[10px]">Real-time Tracking Enabled</Badge>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

