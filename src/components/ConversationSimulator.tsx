"use client";

import React, { useMemo } from "react";
import { useTokenSenseStore } from "@/lib/store";
import { getModelById, models } from "@/lib/models";
import { cn } from "@/lib/utils";
import { MessageSquare, ArrowDown, Zap, History, User, Bot } from "lucide-react";

export default function ConversationSimulator() {
    const {
        inputTokenCount,
        fileTokenCount,
        expectedOutputTokens,
        selectedModelId,
    } = useTokenSenseStore();

    const model = getModelById(selectedModelId) ?? models[0];
    const baseInput = inputTokenCount + fileTokenCount;

    // Simulate 4 turns of a real conversation
    const turns = useMemo(() => {
        if (baseInput === 0) return [];
        
        const data = [];
        let accumulatedContext = 0;
        let totalCost = 0;

        for (let i = 1; i <= 4; i++) {
            // In a real chat, Turn 1 input is just the prompt.
            // Turn 2 input is Turn 1 Input + Turn 1 Output + New Question
            const turnNewInput = i === 1 ? baseInput : 300; // Assume ~300 tokens for follow-up questions
            const currentInput = accumulatedContext + turnNewInput;
            const currentOutput = expectedOutputTokens || 500;
            
            const inputCost = (currentInput / 1_000_000) * model.inputPricePer1M;
            const outputCost = (currentOutput / 1_000_000) * model.outputPricePer1M;
            const turnCost = inputCost + outputCost;
            
            totalCost += turnCost;
            
            data.push({
                turn: i,
                input: currentInput,
                output: currentOutput,
                cost: turnCost,
                cumulative: totalCost,
                isCompounded: i > 1
            });

            // For next turn, context is previous input + previous output
            accumulatedContext = currentInput + currentOutput;
        }
        return data;
    }, [baseInput, expectedOutputTokens, model]);

    const formatCost = (v: number) => {
        if (v < 0.001) return `$${v.toFixed(5)}`;
        return `$${v.toFixed(3)}`;
    };

    if (baseInput === 0) return null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-plasma-500/10 flex items-center justify-center">
                    <History className="w-4 h-4 text-plasma-400" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-tight">The Compounding Effect</h3>
                    <p className="text-[10px] text-muted-foreground">Visualizing how memory costs grow every turn</p>
                </div>
            </div>

            <div className="relative space-y-8 pl-4 border-l-2 border-plasma-500/20 ml-2">
                {turns.map((turn, idx) => (
                    <div key={turn.turn} className="relative group">
                        {/* Connecting Line Dots */}
                        <div className="absolute -left-[25px] top-4 w-4 h-4 rounded-full bg-[#040c0e] border-2 border-plasma-500/40 group-hover:border-plasma-400 transition-colors" />
                        
                        <div className={cn(
                            "p-4 rounded-2xl border transition-all duration-300",
                            turn.turn === 1 
                                ? "bg-plasma-500/5 border-plasma-500/20" 
                                : "bg-card/30 border-border/40 hover:border-plasma-500/30"
                        )}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black bg-plasma-500/20 text-plasma-400 px-2 py-0.5 rounded uppercase">Turn {turn.turn}</span>
                                    {turn.isCompounded && (
                                        <span className="text-[9px] text-amber-400/80 font-bold flex items-center gap-1">
                                            <Zap className="w-3 h-3 fill-amber-400/20" />
                                            +History Memory
                                        </span>
                                    )}
                                </div>
                                <span className="font-mono text-sm font-bold text-white">{formatCost(turn.cost)}</span>
                            </div>

                            <div className="space-y-3">
                                {/* Message Bars */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                                        <User className="w-3 h-3" /> 
                                        <span>INPUT: {turn.input.toLocaleString()} tokens</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                                        {/* History Part */}
                                        {turn.isCompounded && (
                                            <div 
                                                className="h-full bg-plasma-500/40" 
                                                style={{ width: `${( (turn.input - 300) / turn.input) * 100}%` }} 
                                            />
                                        )}
                                        {/* New Prompt Part */}
                                        <div 
                                            className="h-full bg-plasma-500" 
                                            style={{ width: `${( (turn.isCompounded ? 300 : turn.input) / turn.input) * 100}%` }} 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                                        <Bot className="w-3 h-3" />
                                        <span>REPLY: {turn.output.toLocaleString()} tokens</span>
                                    </div>
                                    <div className="h-2 bg-indigo-500/40 rounded-full overflow-hidden" style={{ width: '60%' }}>
                                        <div className="h-full bg-indigo-400" />
                                    </div>
                                </div>
                            </div>

                            {idx < turns.length - 1 && (
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground/30">
                                    <ArrowDown className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-plasma-500 border border-plasma-400 text-black flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Total simulated chat session</p>
                    <p className="text-2xl font-black font-mono">{formatCost(turns[turns.length-1]?.cumulative || 0)}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">End Context</p>
                    <p className="text-sm font-bold font-mono">{(turns[turns.length-1]?.input + turns[turns.length-1]?.output).toLocaleString()} tokens</p>
                </div>
            </div>
            
            <p className="text-[10px] text-muted-foreground text-center italic">
                * Based on your current prompt + 3 follow-up turns (~300 tokens each)
            </p>
        </div>
    );
}
