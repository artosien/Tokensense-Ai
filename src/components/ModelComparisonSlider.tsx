"use client";

import React, { useState, useMemo } from "react";
import { models, getModelById } from "@/lib/models";
import { calculateCost } from "@/lib/costEngine";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { ModelPickerModal } from "./ModelPickerModal";
import { Zap, ArrowRight, ArrowDown } from "lucide-react";

export default function ModelComparisonSlider() {
    const [inputTokens, setInputTokens] = useState(1000);
    const [outputTokens, setOutputTokens] = useState(500);
    
    const [modelA, setModelA] = useState("gpt-4o");
    const [modelB, setModelB] = useState("claude-3-5-sonnet");
    const [modelC, setModelC] = useState("gpt-4o-mini");

    const getModelData = (id: string) => {
        const m = getModelById(id) ?? models[0];
        const cost = calculateCost(inputTokens, outputTokens, m);
        return { model: m, cost };
    };

    const dataA = useMemo(() => getModelData(modelA), [inputTokens, outputTokens, modelA]);
    const dataB = useMemo(() => getModelData(modelB), [inputTokens, outputTokens, modelB]);
    const dataC = useMemo(() => getModelData(modelC), [inputTokens, outputTokens, modelC]);

    const formatCost = (v: number) => {
        if (v === 0) return "$0.00";
        if (v < 0.001) return `$${v.toFixed(5)}`;
        return `$${v.toFixed(4)}`;
    };

    const maxCost = Math.max(dataA.cost.totalCost, dataB.cost.totalCost, dataC.cost.totalCost);

    return (
        <div className="space-y-8 py-4">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sliders Side */}
                <div className="flex-1 space-y-8 bg-muted/20 p-6 rounded-3xl border border-border/40">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <ArrowRight className="w-3 h-3 text-indigo-400" />
                                Prompt Tokens
                            </label>
                            <span className="font-mono text-sm font-bold text-indigo-400">{inputTokens.toLocaleString()}</span>
                        </div>
                        <Slider 
                            value={[inputTokens]} 
                            max={128000} 
                            step={100} 
                            onValueChange={([v]) => setInputTokens(v)} 
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground/50 font-mono">
                            <span>100</span>
                            <span>128k</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <ArrowDown className="w-3 h-3 text-purple-400" />
                                Output Tokens
                            </label>
                            <span className="font-mono text-sm font-bold text-purple-400">{outputTokens.toLocaleString()}</span>
                        </div>
                        <Slider 
                            value={[outputTokens]} 
                            max={8192} 
                            step={50} 
                            onValueChange={([v]) => setOutputTokens(v)} 
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground/50 font-mono">
                            <span>0</span>
                            <span>8k</span>
                        </div>
                    </div>
                </div>

                {/* Comparison Grid */}
                <div className="flex-[2] grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { id: modelA, setId: setModelA, data: dataA, color: "indigo" },
                        { id: modelB, setId: setModelB, data: dataB, color: "orange" },
                        { id: modelC, setId: setModelC, data: dataC, color: "emerald" },
                    ].map((item, idx) => {
                        const relativeHeight = maxCost > 0 ? (item.data.cost.totalCost / maxCost) * 100 : 0;
                        
                        return (
                            <Card key={idx} className="border-border/40 bg-card/50 overflow-hidden group">
                                <div className="p-3 border-b border-border/40">
                                    <ModelPickerModal selectedModelId={item.id} onChange={item.setId} />
                                </div>
                                <CardContent className="pt-6 flex flex-col items-center">
                                    <div className="text-2xl font-black font-mono mb-1">
                                        {formatCost(item.data.cost.totalCost)}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-tighter font-bold mb-6">
                                        Per Request
                                    </div>

                                    {/* Visual Bar */}
                                    <div className="w-full h-32 bg-muted/20 rounded-t-xl relative flex items-end overflow-hidden">
                                        <div 
                                            className={`w-full transition-all duration-1000 ease-out bg-gradient-to-t from-${item.color}-500/40 to-${item.color}-400/20`}
                                            style={{ height: `${relativeHeight}%` }}
                                        >
                                            <div className={`h-1 w-full bg-${item.color}-400/60`} />
                                        </div>
                                        {/* Cost Label Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="text-[10px] font-black opacity-20 rotate-90 whitespace-nowrap">
                                                {item.data.model.name}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full mt-4 space-y-2">
                                        <div className="flex justify-between text-[10px]">
                                            <span className="text-muted-foreground">Input</span>
                                            <span className="font-mono">{formatCost(item.data.cost.inputCost)}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px]">
                                            <span className="text-muted-foreground">Output</span>
                                            <span className="font-mono">{formatCost(item.data.cost.outputCost)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
