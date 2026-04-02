"use client";

import React from "react";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    ResponsiveContainer,
    ZAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { models } from "@/lib/models";
import { Target } from "lucide-react";

export default function PriceBenchmarkChart() {
    const data = models
        .filter(m => m.benchmarks?.mmlu !== undefined)
        .map(m => ({
            name: m.name,
            provider: m.provider,
            cost: m.inputPricePer1M,
            mmlu: m.benchmarks!.mmlu,
            fill: m.provider === "OpenAI" ? "#6366f1" :
                  m.provider === "Anthropic" ? "#a855f7" :
                  m.provider === "Google" ? "#10b981" :
                  m.provider === "Meta (DeepInfra)" ? "#3b82f6" :
                  "#f59e0b" // xAI / others
        }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-slate-900 border border-white/10 p-3 rounded-xl shadow-xl space-y-1">
                    <p className="text-xs font-black text-white">{data.name}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{data.provider}</p>
                    <div className="pt-2 space-y-1">
                        <p className="text-[10px] text-slate-300">Cost: <span className="font-mono text-indigo-400 font-bold">${data.cost.toFixed(2)}/1M</span></p>
                        <p className="text-[10px] text-slate-300">MMLU: <span className="font-mono text-emerald-400 font-bold">{data.mmlu.toFixed(1)}</span></p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md shadow-2xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Target className="w-4 h-4 text-emerald-400" />
                            Value Outliers (Price vs. Performance)
                        </CardTitle>
                        <CardDescription className="text-[10px]">MMLU Score vs Input Cost</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis 
                                type="number" 
                                dataKey="mmlu" 
                                name="MMLU Score" 
                                domain={['dataMin - 5', 'dataMax + 2']} 
                                stroke="#64748b" 
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: 'Intelligence (MMLU Benchmark)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10, fontWeight: 'bold', textAnchor: 'middle' }}
                            />
                            <YAxis 
                                type="number" 
                                dataKey="cost" 
                                name="Input Cost" 
                                stroke="#64748b" 
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                                label={{ value: 'Cost per 1M Input Tokens (USD)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10, fontWeight: 'bold', textAnchor: 'middle' }}
                            />
                            <ZAxis range={[60, 60]} />
                            <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                            
                            {data.map((entry, index) => (
                                <Scatter key={index} name={entry.name} data={[entry]} fill={entry.fill} />
                            ))}
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <p className="text-[10px] text-slate-400 font-medium">
                        <strong className="text-emerald-400">Value Outliers:</strong> Models located in the <strong className="text-white">bottom right</strong> quadrant offer the highest intelligence for the lowest price.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
