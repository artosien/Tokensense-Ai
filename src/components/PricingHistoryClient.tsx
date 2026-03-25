"use client";

import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Zap, Sparkles, TrendingDown, Layers } from "lucide-react";

const pricingData = [
    { date: "2024-03", openai: 15.0, anthropic: 15.0, google: 10.0 },
    { date: "2024-05", openai: 5.0, anthropic: 15.0, google: 7.0, event: "GPT-4o Release (-50%)" },
    { date: "2024-08", openai: 2.5, anthropic: 15.0, google: 3.5, event: "GPT-4o mini release" },
    { date: "2024-11", openai: 2.5, anthropic: 3.0, google: 3.5, event: "Claude 3.5 Sonnet v2" },
    { date: "2025-02", openai: 2.0, anthropic: 3.0, google: 1.25, event: "Gemini 2.0 Price Cut" },
    { date: "2025-06", openai: 1.75, anthropic: 3.0, google: 1.25, event: "GPT-5 Preview" },
    { date: "2025-10", openai: 1.75, anthropic: 3.0, google: 1.25, event: "Claude 4.5 Release" },
    { date: "2026-01", openai: 1.75, anthropic: 3.0, google: 1.25, event: "Grok 4 Release" },
    { date: "2026-03", openai: 1.75, anthropic: 3.0, google: 1.25, event: "Claude 4.6 Release" },
];

const timelineEvents = [
    {
        date: "March 2026",
        provider: "Anthropic",
        model: "Claude 4.6 Series",
        change: "New Release",
        details: "Claude 4.6 series launched with significant intelligence gains while maintaining 4.5 pricing levels.",
        type: "release"
    },
    {
        date: "January 2026",
        provider: "OpenAI",
        model: "GPT-5.2 Series",
        change: "-15% Input Cost",
        details: "OpenAI optimized inference for GPT-5.2, reducing input costs across the board.",
        type: "cut"
    },
    {
        date: "October 2025",
        provider: "DeepSeek",
        model: "DeepSeek V3",
        change: "Market Disruptor",
        details: "V3 set a new floor for open-weights performance at proprietary-beating prices.",
        type: "disruptor"
    },
    {
        date: "July 2025",
        provider: "Google",
        model: "Gemini 2.5 Flash",
        change: "-40% Output Cost",
        details: "Google slashed output costs for Flash models to compete with GPT-4o mini.",
        type: "cut"
    },
    {
        date: "May 2025",
        provider: "OpenAI",
        model: "GPT-5",
        change: "Generational Launch",
        details: "GPT-5 launched with 400k context window and improved reasoning capabilities.",
        type: "release"
    },
    {
        date: "November 2024",
        provider: "Anthropic",
        model: "Claude 3.5 Sonnet",
        change: "Performance Leader",
        details: "Sonnet v2 became the industry benchmark for coding and reasoning efficiency.",
        type: "release"
    },
    {
        date: "July 2024",
        provider: "OpenAI",
        model: "GPT-4o mini",
        change: "-90% vs GPT-3.5",
        details: "The death of GPT-3.5. A massive leap in cost-efficiency for small tasks.",
        type: "cut"
    }
];

export default function PricingHistoryClient() {
    return (
        <div className="space-y-16">
            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-8">
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
                                    <Area type="monotone" dataKey="openai" name="OpenAI" stroke="#6366f1" fillOpacity={1} fill="url(#colorOpenai)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="anthropic" name="Anthropic" stroke="#a855f7" fillOpacity={1} fill="url(#colorAnthropic)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="google" name="Google" stroke="#10b981" fillOpacity={1} fill="url(#colorGoogle)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Timeline Section */}
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Milestone <span className="text-indigo-500">Timeline</span></h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-indigo-500/50 before:to-transparent">
                    {timelineEvents.map((item, i) => (
                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            {/* Icon */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-slate-900 text-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors group-hover:border-indigo-500/50">
                                {item.type === 'cut' ? <TrendingDown className="w-4 h-4 text-emerald-400" /> : 
                                 item.type === 'release' ? <Sparkles className="w-4 h-4 text-indigo-400" /> : 
                                 <Zap className="w-4 h-4 text-amber-400" />}
                            </div>
                            {/* Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[45%] p-6 rounded-3xl bg-slate-900/50 border border-white/10 shadow-xl backdrop-blur-sm group-hover:border-indigo-500/20 transition-all duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <time className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{item.date}</time>
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

            {/* Price Floor Tracker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
