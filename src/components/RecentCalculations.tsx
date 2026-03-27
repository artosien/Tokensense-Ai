"use client";

import React, { useEffect, useState } from "react";
import { historyService, CalculationEntry } from "@/lib/historyService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Trash2, ArrowUpRight, Clock } from "lucide-react";
import { useTokenSenseStore } from "@/lib/store";
import { triggerHaptic } from "@/lib/utils";

export default function RecentCalculations() {
    const [history, setHistory] = useState<CalculationEntry[]>([]);
    const { setSelectedModelId, setUserPrompt, setExpectedOutputTokens } = useTokenSenseStore();

    const loadHistory = () => {
        setHistory(historyService.getAll());
    };

    useEffect(() => {
        loadHistory();
        window.addEventListener('storage', loadHistory);
        return () => window.removeEventListener('storage', loadHistory);
    }, []);

    const handleRestore = (entry: CalculationEntry) => {
        triggerHaptic(15);
        setSelectedModelId(entry.modelId);
        setUserPrompt(entry.promptSnippet); // In a real app we might store full prompt, but snippet is safer for localStorage
        setExpectedOutputTokens(entry.outputTokens);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClear = () => {
        if (confirm("Clear all calculation history?")) {
            historyService.clear();
        }
    };

    if (history.length === 0) return null;

    return (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <History className="w-3.5 h-3.5" />
                    Recent Calculations
                </CardTitle>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClear}
                    className="h-7 text-[10px] text-muted-foreground hover:text-red-400"
                >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Clear
                </Button>
            </CardHeader>
            <CardContent className="space-y-2">
                {history.map((entry) => (
                    <div 
                        key={entry.id}
                        className="group relative flex flex-col p-3 rounded-xl border border-border/20 bg-background/30 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all cursor-pointer"
                        onClick={() => handleRestore(entry)}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tight bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                {entry.modelName}
                            </span>
                            <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        
                        <div className="flex items-baseline justify-between">
                            <div className="text-sm font-mono font-bold text-foreground">
                                ${entry.totalCost.toFixed(4)}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                                {entry.totalTokens.toLocaleString()} tokens
                            </div>
                        </div>

                        <p className="text-[10px] text-muted-foreground/60 truncate mt-1 italic">
                            "{entry.promptSnippet.substring(0, 60)}..."
                        </p>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="w-3 h-3 text-indigo-400" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
