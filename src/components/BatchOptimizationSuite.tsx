"use client";

import React, { useState, useMemo } from "react";
import { 
    Zap, 
    Clock, 
    TrendingDown, 
    Info, 
    ArrowRight, 
    AlertTriangle, 
    MessageSquareText,
    Layers,
    Sparkles,
    ShieldAlert,
    Gauge,
    Lightbulb,
    FileText
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { countTokensSync } from "@/lib/tokenizer";
import { ModelConfig } from "@/lib/models";

interface BatchOptimizationSuiteProps {
    volume: number;
    selectedModel: ModelConfig | undefined;
    onBufferChange: (buffer: number) => void;
    onBatchModeChange: (enabled: boolean) => void;
    onPromptTokensChange?: (tokens: number) => void;
}

const COMPRESSION_TIPS = [
    "Use XML tags instead of JSON to reduce syntax overhead.",
    "Remove stop words (the, a, is) from system prompts where possible.",
    "Switch to a smaller system prompt for simple classification tasks.",
    "Use few-shot examples sparingly; 2-3 are often enough.",
    "Tell the model to 'Be concise' to reduce output token variance."
];

export default function BatchOptimizationSuite({ 
    volume, 
    selectedModel, 
    onBufferChange, 
    onBatchModeChange,
    onPromptTokensChange 
}: BatchOptimizationSuiteProps) {
    const [promptText, setPromptText] = useState("");
    const [buffer, setBuffer] = useState(5);
    const [isBatchMode, setIsBatchMode] = useState(false);
    const [reductionPercent, setReductionPercent] = useState(20);

    const promptTokens = useMemo(() => countTokensSync(promptText), [promptText]);

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setPromptText(text);
        if (onPromptTokensChange) {
            onPromptTokensChange(countTokensSync(text));
        }
    };

    const handleBufferChange = (val: number[]) => {
        setBuffer(val[0]);
        onBufferChange(val[0]);
    };

    const handleBatchToggle = (enabled: boolean) => {
        setIsBatchMode(enabled);
        onBatchModeChange(enabled);
    };

    // Forecaster Logic
    const forecast = useMemo(() => {
        if (!selectedModel || volume <= 0) return null;
        
        const tpm = selectedModel.tpmLimit || 1_000_000;
        const rpm = selectedModel.rpmLimit || 5_000;
        
        const estTokensPerRequest = promptTokens + 500; // estimated output
        const totalTokens = volume * estTokensPerRequest;
        
        const minutesByTPM = totalTokens / tpm;
        const minutesByRPM = volume / rpm;
        
        const totalMinutes = Math.max(minutesByTPM, minutesByRPM);
        const hours = totalMinutes / 60;
        
        return {
            minutes: totalMinutes,
            hours: hours,
            days: hours / 24,
            isLimitedBy: minutesByTPM > minutesByRPM ? "TPM" : "RPM"
        };
    }, [selectedModel, volume, promptTokens]);

    return (
        <div className="space-y-6">
            {/* 1. Tokenizer & Prompt Auditor */}
            <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <MessageSquareText className="w-4 h-4 text-indigo-400" />
                        Prompt Token Auditor
                    </CardTitle>
                    <CardDescription className="text-[10px]">Paste your actual prompt for exact counts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea 
                        placeholder="Paste your prompt here..."
                        className="min-h-[100px] bg-white/5 border-white/10 text-xs font-mono"
                        value={promptText}
                        onChange={handlePromptChange}
                    />
                    <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Exact Token Count</span>
                        <span className="text-lg font-black text-indigo-400 font-mono">{promptTokens.toLocaleString()}</span>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Batch vs Real-time Toggle */}
            <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md overflow-hidden relative">
                <div className="absolute top-0 right-0 p-2">
                    <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">-50% Cost</span>
                </div>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-400" />
                                Batch API Mode
                            </h3>
                            <p className="text-[10px] text-slate-500">Enable for 24-hour asynchronous processing</p>
                        </div>
                        <Switch 
                            checked={isBatchMode}
                            onCheckedChange={handleBatchToggle}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* 3. Latency & Throughput Forecaster */}
            <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-purple-400" />
                        Throughput Forecaster
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {forecast ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Est. Time</span>
                                    <span className="text-lg font-black text-white font-mono">
                                        {forecast.hours < 1 ? `${Math.ceil(forecast.minutes)}m` : `${forecast.hours.toFixed(1)}h`}
                                    </span>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Bottleneck</span>
                                    <span className="text-lg font-black text-purple-400 font-mono">{forecast.isLimitedBy}</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-500 italic text-center">
                                Based on typical tier-1 rate limits ({selectedModel?.tpmLimit?.toLocaleString()} TPM).
                            </p>
                        </div>
                    ) : (
                        <p className="text-[10px] text-slate-500 text-center py-4">Select a model and volume to see forecast.</p>
                    )}
                </CardContent>
            </Card>

            {/* 4. Model Switching "Breakeven" Analysis */}
            <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-emerald-400" />
                        Efficiency Breakeven
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Prompt Reduction</label>
                            <span className="text-[10px] font-bold text-emerald-400">{reductionPercent}%</span>
                        </div>
                        <Slider 
                            value={[reductionPercent]} 
                            onValueChange={(val) => setReductionPercent(val[0])}
                            max={50}
                            step={5}
                            className="py-4"
                        />
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                            If using a smarter model allows you to reduce your prompt by <span className="text-emerald-400 font-bold">{reductionPercent}%</span> (e.g. fewer examples), your new cost basis would be <span className="text-white font-bold">{(100-reductionPercent)}%</span> of the estimate.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* 6. Batch Error Buffer */}
            <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                        Reliability Buffer
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Est. Error/Retry Rate</label>
                            <span className="text-[10px] font-bold text-red-400">+{buffer}%</span>
                        </div>
                        <Slider 
                            value={[buffer]} 
                            onValueChange={handleBufferChange}
                            max={15}
                            step={1}
                            className="py-4"
                        />
                    </div>
                    <p className="text-[10px] text-slate-500 italic">Adds margin for retries and outliers.</p>
                </CardContent>
            </Card>

            {/* 8. Token Compression Recommender */}
            <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Optimization Tips
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {COMPRESSION_TIPS.map((tip, i) => (
                            <li key={i} className="flex gap-2 text-[10px] text-slate-400 leading-relaxed">
                                <span className="text-indigo-500 mt-0.5">•</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
