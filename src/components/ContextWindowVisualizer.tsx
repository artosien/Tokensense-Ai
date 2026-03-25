"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
    Layout, 
    Zap, 
    MessageSquare, 
    History, 
    CornerDownRight, 
    AlertCircle, 
    Info, 
    Maximize2,
    Database,
    Cpu,
    ArrowRight,
    MessageSquareText,
    FileText,
    Layers,
    ChevronDown
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { models } from "@/lib/models";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { countTokensSync } from "@/lib/tokenizer";

export default function ContextWindowVisualizer() {
    const [selectedModelId, setSelectedModelId] = useState(models[0].id);
    const [systemPromptText, setSystemPromptText] = useState("You are a helpful AI assistant tasked with analyzing complex data structures. Please provide concise and accurate summaries.");
    const [systemTokens, setSystemTokens] = useState<number>(0);
    const [historyTokens, setHistoryTokens] = useState<number>(20000);
    const [userTokens, setUserTokens] = useState<number>(2000);
    const [outputHeadroom, setOutputHeadroom] = useState<number>(4096);

    // Update system tokens whenever text changes
    useEffect(() => {
        setSystemTokens(countTokensSync(systemPromptText));
    }, [systemPromptText]);

    const model = models.find(m => m.id === selectedModelId) || models[0];
    const maxContext = model.maxContext;

    const totalUsed = systemTokens + historyTokens + userTokens + outputHeadroom;
    const remaining = Math.max(0, maxContext - totalUsed);
    const percentUsed = (totalUsed / maxContext) * 100;
    const isOverLimit = totalUsed > maxContext;

    const segments = useMemo(() => [
        { id: 'system', label: "System Prompt", value: systemTokens, color: "bg-indigo-500", icon: <Cpu className="w-3 h-3" /> },
        { id: 'history', label: "History", value: historyTokens, color: "bg-purple-500", icon: <History className="w-3 h-3" /> },
        { id: 'user', label: "User Message", value: userTokens, color: "bg-blue-500", icon: <MessageSquare className="w-3 h-3" /> },
        { id: 'output', label: "Output Headroom", value: outputHeadroom, color: "bg-emerald-500", icon: <CornerDownRight className="w-3 h-3" /> },
    ], [systemTokens, historyTokens, userTokens, outputHeadroom]);

    const formatTokens = (val: number) => {
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
        return val.toString();
    };

    return (
        <div className="space-y-10">
            {/* Visualizer Bar Section */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em]">Live Visualization</h2>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-white tracking-tighter">{formatTokens(totalUsed)}</span>
                            <span className="text-slate-500 font-bold uppercase text-xs">/ {formatTokens(maxContext)} tokens used</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${isOverLimit ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
                            {isOverLimit ? "Context Overflow" : `${(100 - percentUsed).toFixed(1)}% Capacity Left`}
                        </span>
                    </div>
                </div>

                {/* The Big Visual Bar */}
                <div className="relative h-24 w-full bg-slate-900/50 rounded-3xl border-4 border-white/5 overflow-hidden shadow-2xl flex backdrop-blur-xl">
                    {segments.map((seg, i) => {
                        const width = (seg.value / maxContext) * 100;
                        if (width <= 0) return null;
                        return (
                            <TooltipProvider key={i}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div 
                                            className={`${seg.color} h-full border-r border-black/20 relative group transition-all duration-500 hover:brightness-110`}
                                            style={{ width: `${width}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                                            {width > 5 && (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {seg.icon}
                                                </div>
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-950 border-white/10 p-3">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{seg.label}</p>
                                            <p className="text-lg font-bold text-white">{seg.value.toLocaleString()} <span className="text-xs font-medium text-slate-400">tokens</span></p>
                                            <p className="text-[10px] font-bold text-indigo-400">{((seg.value / maxContext) * 100).toFixed(2)}% of total window</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                    
                    {/* Remaining Space */}
                    {!isOverLimit && (
                        <div 
                            className="h-full bg-slate-800/20 flex-1 relative flex items-center justify-center group"
                        >
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
                                {formatTokens(remaining)} Remaining
                            </span>
                        </div>
                    )}

                    {/* Overflow Marker */}
                    {isOverLimit && (
                        <div className="absolute inset-y-0 right-0 w-1 bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                    )}
                </div>

                {isOverLimit && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 animate-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-bold">
                            Warning: You are {Math.abs(remaining).toLocaleString()} tokens over the context limit. The model will truncate or fail.
                        </p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: System Prompt Input (The Main Feature) */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Cpu className="w-24 h-24 text-indigo-400" />
                        </div>
                        <CardHeader className="pb-4 border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                        <Cpu className="w-4 h-4" />
                                        System Prompt Instruction
                                    </CardTitle>
                                    <CardDescription className="text-[10px] font-medium text-slate-500">The "personality" and rules for your AI agent.</CardDescription>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">System Tokens</span>
                                    <span className="text-xl font-black text-indigo-400 font-mono leading-none">{systemTokens.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            <Textarea 
                                placeholder="Enter your system instructions here..."
                                className="min-h-[220px] bg-white/5 border-white/10 focus-visible:ring-indigo-500 text-sm leading-relaxed placeholder:text-slate-600 resize-none shadow-inner"
                                value={systemPromptText}
                                onChange={(e) => setSystemPromptText(e.target.value)}
                            />
                            <div className="mt-4 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Token Calculation Active</span>
                                </div>
                                <div className="text-[10px] font-black text-indigo-400/70 uppercase">
                                    {((systemTokens / maxContext) * 100).toFixed(2)}% of window
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Numeric Inputs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-slate-900/50 border-white/10 hover:border-purple-500/30 transition-colors group">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 group-hover:text-purple-400 transition-colors">
                                        <History className="w-3.5 h-3.5" /> History
                                    </Label>
                                    <span className="text-[10px] font-mono text-purple-400/60 font-bold">{((historyTokens / maxContext) * 100).toFixed(1)}%</span>
                                </div>
                                <Input 
                                    type="number" 
                                    value={historyTokens} 
                                    onChange={(e) => setHistoryTokens(parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/5 h-10 font-mono text-lg font-black text-slate-200 focus-visible:ring-purple-500"
                                />
                                <p className="text-[9px] text-slate-600 font-bold uppercase leading-none">Past conversation turns</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/50 border-white/10 hover:border-blue-500/30 transition-colors group">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 group-hover:text-blue-400 transition-colors">
                                        <MessageSquareText className="w-3.5 h-3.5" /> User Input
                                    </Label>
                                    <span className="text-[10px] font-mono text-blue-400/60 font-bold">{((userTokens / maxContext) * 100).toFixed(1)}%</span>
                                </div>
                                <Input 
                                    type="number" 
                                    value={userTokens} 
                                    onChange={(e) => setUserTokens(parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/5 h-10 font-mono text-lg font-black text-slate-200 focus-visible:ring-blue-500"
                                />
                                <p className="text-[9px] text-slate-600 font-bold uppercase leading-none">Current request size</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/50 border-white/10 hover:border-emerald-500/30 transition-colors group">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 group-hover:text-emerald-400 transition-colors">
                                        <CornerDownRight className="w-3.5 h-3.5" /> Headroom
                                    </Label>
                                    <span className="text-[10px] font-mono text-emerald-400/60 font-bold">{((outputHeadroom / maxContext) * 100).toFixed(1)}%</span>
                                </div>
                                <Input 
                                    type="number" 
                                    value={outputHeadroom} 
                                    onChange={(e) => setOutputHeadroom(parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/5 h-10 font-mono text-lg font-black text-slate-200 focus-visible:ring-emerald-500"
                                />
                                <p className="text-[9px] text-slate-600 font-bold uppercase leading-none">Reserved for output</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Side: Model Selection & Breakdown */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Target Environment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Model Pricing & Window</Label>
                                <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                                    <SelectTrigger className="h-12 bg-white/5 border-white/10 text-sm rounded-xl">
                                        <SelectValue placeholder="Select a model" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10">
                                        {Array.from(new Set(models.map(m => m.provider))).map(provider => (
                                            <SelectGroup key={provider}>
                                                <SelectLabel className="text-[10px] font-black uppercase text-indigo-400 px-2 py-1.5 opacity-70 tracking-tighter">{provider}</SelectLabel>
                                                {models.filter(m => m.provider === provider).map(m => (
                                                    <SelectItem key={m.id} value={m.id} className="text-xs cursor-pointer">
                                                        <div className="flex items-center justify-between w-full gap-8">
                                                            <span className="font-bold">{m.name}</span>
                                                            <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">{formatTokens(m.maxContext)} Window</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-slate-900/50 border-white/10 shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-5">
                                <Maximize2 className="w-8 h-8 text-indigo-400" />
                            </div>
                            <CardContent className="p-5 flex flex-col gap-1">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Available</p>
                                <p className="text-3xl font-black text-white font-mono leading-none tracking-tighter">{remaining.toLocaleString()}</p>
                                <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">Free tokens</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-900/50 border-white/10 shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-5">
                                <Database className="w-8 h-8 text-emerald-400" />
                            </div>
                            <CardContent className="p-5 flex flex-col gap-1">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Fullness</p>
                                <p className="text-3xl font-black text-white font-mono leading-none tracking-tighter">{percentUsed.toFixed(1)}%</p>
                                <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">Utilization</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-slate-900/50 border-white/10 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                        <CardHeader className="pb-3 border-b border-white/5">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Resource Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {segments.map((seg, i) => (
                                <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${seg.color} shadow-[0_0_8px_${seg.color.replace('bg-', '')}]`} />
                                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{seg.label}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[11px] font-mono text-slate-500">{seg.value.toLocaleString()}</span>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded w-14 text-center ${seg.color} text-white bg-opacity-20`}>
                                            {((seg.value / maxContext) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex gap-3">
                        <Info className="w-5 h-5 text-amber-500 shrink-0" />
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Memory Management Tip</p>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                When approaching the limit, consider <strong>context compression</strong> or summarizing the <strong>Conversation History</strong> to make room for complex system instructions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}