"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileJson, FileSpreadsheet, X, Loader2, Database, Zap, PieChart } from "lucide-react";
import { useTokenSenseStore } from "@/lib/store";
import { getModelById, models } from "@/lib/models";
import { calculateCost } from "@/lib/costEngine";
import { countTokens } from "@/lib/tokenizer";

interface BatchResult {
    totalInputTokens: number;
    totalOutputTokens: number;
    totalCost: number;
    rowCount: number;
}

export default function BatchAnalysisTool() {
    const { selectedModelId, expectedOutputTokens } = useTokenSenseStore();
    const [results, setResults] = useState<BatchResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const model = getModelById(selectedModelId) ?? models[0];

    const processFile = useCallback(async (file: File) => {
        setIsProcessing(true);
        setError(null);
        
        try {
            const text = await file.text();
            let prompts: string[] = [];

            if (file.type === "application/json" || file.name.endsWith(".json")) {
                const json = JSON.parse(text);
                prompts = Array.isArray(json) ? json : [json.prompt || json.text].filter(Boolean);
            } else if (file.type === "text/csv" || file.name.endsWith(".csv")) {
                const rows = text.split("\n").filter(r => r.trim());
                // Simple CSV parsing: assume prompt is the first column or column named "prompt"
                const header = rows[0].toLowerCase().split(",");
                const promptIdx = header.indexOf("prompt") !== -1 ? header.indexOf("prompt") : 0;
                prompts = rows.slice(1).map(row => row.split(",")[promptIdx]?.replace(/"/g, "").trim()).filter(Boolean);
            }

            if (prompts.length === 0) throw new Error("No prompts found in file.");

            const tokenCounts = await Promise.all(prompts.map(p => countTokens(p)));
            const totalIn = tokenCounts.reduce((sum, count) => sum + count, 0);

            const totalOut = prompts.length * expectedOutputTokens;
            const costResult = calculateCost(totalIn, totalOut, model);

            setResults({
                totalInputTokens: totalIn,
                totalOutputTokens: totalOut,
                totalCost: costResult.totalCost,
                rowCount: prompts.length
            });
        } catch (e: any) {
            setError(e.message || "Failed to process file.");
        } finally {
            setIsProcessing(false);
        }
    }, [model, expectedOutputTokens]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    return (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    Batch Analysis Tool
                </CardTitle>
                <CardDescription className="text-xs">
                    Upload a CSV or JSON file to estimate costs for a large batch of prompts.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!results ? (
                    <div className="relative group">
                        <input
                            type="file"
                            accept=".csv,.json"
                            onChange={onFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={isProcessing}
                        />
                        <div className="border-2 border-dashed border-border/40 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 group-hover:border-indigo-500/40 transition-all bg-background/20">
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                                    <p className="text-xs font-medium">Tokenizing prompts...</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                        <Upload className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold">Drop CSV or JSON here</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">Supports column 'prompt' or arrays</p>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <FileSpreadsheet className="w-4 h-4 text-emerald-500/60" />
                                        <FileJson className="w-4 h-4 text-orange-500/60" />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Rows</p>
                                <p className="text-xl font-black font-mono">{results.rowCount.toLocaleString()}</p>
                            </div>
                            <div className="bg-plasma-500/5 border border-plasma-500/10 rounded-xl p-3">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Cost</p>
                                <p className="text-xl font-black font-mono text-plasma-400">${results.totalCost.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Total Tokens</span>
                                <span className="font-mono font-bold">{(results.totalInputTokens + results.totalOutputTokens).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Avg. Cost / Row</span>
                                <span className="font-mono">${(results.totalCost / results.rowCount).toFixed(5)}</span>
                            </div>
                        </div>

                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setResults(null)}
                            className="w-full text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-3 h-3 mr-2" />
                            Analyze another file
                        </Button>
                    </div>
                )}

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                        {error}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

