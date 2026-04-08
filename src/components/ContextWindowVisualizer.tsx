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
    ChevronDown,
    Search,
    Scissors,
    Crosshair,
    Trash2,
    MoveVertical,
    Activity,
    Folder,
    BookOpen,
    Brain,
    Timer
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { models, ModelConfig } from "@/lib/models";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { countTokensSync } from "@/lib/tokenizer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useTokenSenseStore } from "@/lib/store";
import Link from "next/link";

interface ChatTurn {
    id: string;
    text: string;
    tokens: number;
    role: 'user' | 'assistant';
}

const SYSTEM_PRESETS = [
    { name: "RAG Search Agent", tokens: 1250, text: "You are a professional research assistant. Your task is to analyze the provided context and answer questions strictly based on that information. Cite sources using [1], [2] notation." },
    { name: "Coding Assistant", tokens: 850, text: "You are an expert senior software engineer. Focus on clean, performant, and secure code. Always provide explanations for your architectural choices." },
    { name: "Roleplay Bot", tokens: 450, text: "You are acting as a guide in a medieval fantasy world. Speak in a formal, slightly archaic tone. Do not break character." }
];

export default function ContextWindowVisualizer() {
    const { setOptimizationStep } = useTokenSenseStore();
    const [selectedModelId, setSelectedModelId] = useState(models[0].id);
    const [systemPromptText, setSystemPromptText] = useState("You are a helpful AI assistant tasked with analyzing complex data structures. Please provide concise and accurate summaries.");
    const [systemTokens, setSystemTokens] = useState<number>(0);
    const [userTokens, setUserTokens] = useState<number>(2000);
    const [outputHeadroom, setOutputHeadroom] = useState<number>(4096);
    
    // 4. Draggable History Blocks State
    const [historyTurns, setHistoryTurns] = useState<ChatTurn[]>([
        { id: '1', role: 'user', text: "Can you explain quantum entanglement?", tokens: 4500 },
        { id: '2', role: 'assistant', text: "Quantum entanglement is a phenomenon where particles become linked...", tokens: 6200 },
        { id: '3', role: 'user', text: "How does this apply to computing?", tokens: 3800 },
        { id: '4', role: 'assistant', text: "In quantum computing, entanglement allows qubits to process information...", tokens: 5500 },
    ]);

    // 1. Needle-in-a-Haystack Simulator
    const [showNeedle, setShowNeedle] = useState(false);
    const [needlePosition, setNeedlePosition] = useState(50); // 0-100%

    // 1. Context Pruner State
    const [isPruned, setIsPruned] = useState(false);
    const [prunePercent, setPrunedPercent] = useState(70);

    const model = models.find(m => m.id === selectedModelId) || models[0];
    const maxContext = model.maxContext;

    // Update system tokens
    useEffect(() => {
        setSystemTokens(countTokensSync(systemPromptText));
    }, [systemPromptText]);

    const historyTokens = useMemo(() => {
        const raw = historyTurns.reduce((acc, turn) => acc + turn.tokens, 0);
        return isPruned ? Math.ceil(raw * (1 - prunePercent / 100)) : raw;
    }, [historyTurns, isPruned, prunePercent]);

    const totalUsed = systemTokens + historyTokens + userTokens + outputHeadroom;
    const remaining = Math.max(0, maxContext - totalUsed);
    const percentUsed = (totalUsed / maxContext) * 100;
    const isOverLimit = totalUsed > maxContext;

    // Latency Estimate (Mock Heuristic)
    const latencyEstimate = useMemo(() => {
        if (totalUsed < 10000) return "Instant (< 500ms)";
        if (totalUsed < 100000) return "~1.5s - 2.5s";
        if (totalUsed < 500000) return "~4s - 7s";
        return "~10s+";
    }, [totalUsed]);

    // Needle Recall Probability (Mock Heuristic based on "Lost in the Middle")
    const recallProbability = useMemo(() => {
        const pos = needlePosition;
        if (pos < 10 || pos > 90) return 99;
        if (pos > 40 && pos < 60) return 72;
        return 85;
    }, [needlePosition]);

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

    const deleteTurn = (id: string) => {
        setHistoryTurns(historyTurns.filter(t => t.id !== id));
    };

    const applyScenario = (type: 'chat' | 'rag' | 'doc') => {
        if (type === 'chat') {
            setHistoryTurns([
                { id: 'chat-1', role: 'user', text: "Example short history...", tokens: 2500 },
                { id: 'chat-2', role: 'assistant', text: "Understood.", tokens: 2500 },
            ]);
            setUserTokens(1000);
            setOutputHeadroom(4096);
        } else if (type === 'rag') {
            setHistoryTurns([
                { id: 'rag-1', role: 'user', text: "Retrieving large codebase context...", tokens: 22500 },
                { id: 'rag-2', role: 'assistant', text: "Context processed.", tokens: 22500 },
            ]);
            setUserTokens(8000);
            setOutputHeadroom(2048);
        } else {
            setHistoryTurns([
                { id: 'doc-1', role: 'user', text: "Analyzing 500-page document...", tokens: 75000 },
                { id: 'doc-2', role: 'assistant', text: "Summary generated.", tokens: 75000 },
            ]);
            setUserTokens(50000);
            setOutputHeadroom(8192);
        }
    };

    return (
        <div className="space-y-10">
            {/* 1. Needle-in-a-Haystack Simulator Overlay & Visualizer */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em]">Context Architecture</h2>
                            <Badge variant="outline" className="text-[9px] border-indigo-500/30 text-indigo-400 uppercase">Interactive Workbench</Badge>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-white tracking-tighter">{formatTokens(totalUsed)}</span>
                            <span className="text-slate-500 font-bold uppercase text-xs">/ {formatTokens(maxContext)} total capacity</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <div className="text-[9px] font-black text-slate-500 uppercase flex items-center justify-end gap-1.5 mb-1">
                                <Timer className="w-3 h-3" /> Latency Estimate
                            </div>
                            <span className="text-sm font-bold text-slate-300">{latencyEstimate}</span>
                        </div>
                        <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border transition-all duration-500 ${isOverLimit ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse" : outputHeadroom < 2048 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
                            {isOverLimit ? "Context Overflow" : `${(100 - percentUsed).toFixed(1)}% Headroom`}
                        </span>
                    </div>
                </div>

                {/* The Big Visual Bar with HEATMAP & NEEDLE */}
                <div className="relative group">
                    <div className="relative h-24 w-full bg-slate-900/50 rounded-3xl border-4 border-white/5 overflow-hidden shadow-2xl flex backdrop-blur-xl transition-all duration-500">
                        {/* 2. Context Rot Heatmap Layer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-red-500/20 to-emerald-500/10 pointer-events-none z-0" />
                        
                        {segments.map((seg, i) => {
                            const width = (seg.value / maxContext) * 100;
                            if (width <= 0) return null;
                            return (
                                <TooltipProvider key={i}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div 
                                                className={`${seg.color} h-full border-r border-black/20 relative group/seg transition-all duration-500 hover:brightness-110 z-10`}
                                                style={{ width: `${width}%` }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                                                {width > 5 && (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/seg:opacity-100 transition-opacity">
                                                        {seg.icon}
                                                    </div>
                                                )}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-slate-950 border-white/10 p-3">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{seg.label}</p>
                                                <p className="text-lg font-bold text-white">{seg.value.toLocaleString()} <span className="text-xs font-medium text-slate-400">tokens</span></p>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            );
                        })}
                        
                        {/* Remaining Space */}
                        {!isOverLimit && (
                            <div className="h-full bg-slate-800/20 flex-1 relative flex items-center justify-center group z-10">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
                                    {formatTokens(remaining)} Free
                                </span>
                            </div>
                        )}

                        {/* 1. Needle-in-a-Haystack Simulator Marker */}
                        {showNeedle && (
                            <div 
                                className="absolute inset-y-0 w-1 bg-white shadow-[0_0_15px_white] z-20 cursor-move transition-all duration-300"
                                style={{ left: `${needlePosition}%` }}
                            >
                                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2">
                                    <Crosshair className="w-4 h-4 text-white" />
                                </div>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-black text-[9px] font-black px-2 py-1 rounded-lg whitespace-nowrap shadow-2xl">
                                    {recallProbability}% RECALL ACCURACY
                                </div>
                            </div>
                        )}

                        {/* 3. Headroom Guardrail (Pulsing Red if low) */}
                        {outputHeadroom < 2048 && !isOverLimit && (
                            <div className="absolute inset-y-0 right-0 w-2 bg-red-500/50 animate-pulse z-20" />
                        )}
                    </div>
                </div>

                {/* Scenario Toggles */}
                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" onClick={() => applyScenario('chat')} className="h-8 text-[10px] font-bold uppercase border-white/5 bg-slate-900/50 hover:bg-indigo-500/10">
                        <MessageSquare className="w-3 h-3 mr-2" /> Classic Chat
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => applyScenario('rag')} className="h-8 text-[10px] font-bold uppercase border-white/5 bg-slate-900/50 hover:bg-purple-500/10">
                        <Search className="w-3 h-3 mr-2" /> RAG Engine
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => applyScenario('doc')} className="h-8 text-[10px] font-bold uppercase border-white/5 bg-slate-900/50 hover:bg-blue-500/10">
                        <FileText className="w-3 h-3 mr-2" /> Long Doc Analysis
                    </Button>
                    <div className="h-8 w-px bg-white/5 mx-2" />
                    <div className="flex items-center gap-2 px-3 bg-white/5 rounded-lg border border-white/5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Needle Sim</span>
                        <Switch checked={showNeedle} onCheckedChange={setShowNeedle} className="scale-75" />
                    </div>
                </div>
            </div>

            {/* Main Workbench Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: System & History */}
                <div className="lg:col-span-7 space-y-6">
                    {/* System Prompt with Preset Library */}
                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md shadow-2xl overflow-hidden relative">
                        <CardHeader className="pb-4 border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                        <Cpu className="w-4 h-4" />
                                        Permanent Instructions
                                    </CardTitle>
                                    <CardDescription className="text-[10px] font-medium text-slate-500">The core logic that defines model behavior.</CardDescription>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Select onValueChange={(val) => {
                                        const preset = SYSTEM_PRESETS.find(p => p.name === val);
                                        if (preset) setSystemPromptText(preset.text);
                                    }}>
                                        <SelectTrigger className="h-8 w-[140px] bg-white/5 border-white/10 text-[10px] uppercase font-bold">
                                            <Folder className="w-3 h-3 mr-2 text-indigo-400" /> Presets
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-950 border-white/10">
                                            {SYSTEM_PRESETS.map(p => <SelectItem key={p.name} value={p.name} className="text-[10px] font-bold uppercase">{p.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-indigo-400 font-mono">{systemTokens.toLocaleString()} TOKENS</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Textarea 
                                className="min-h-[180px] bg-white/5 border-white/10 text-sm leading-relaxed font-mono"
                                value={systemPromptText}
                                onChange={(e) => setSystemPromptText(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    {/* 2. Draggable Chat History */}
                    <Card className="bg-slate-900/50 border-white/10 overflow-hidden shadow-2xl">
                        <CardHeader className="pb-4 border-b border-white/5 bg-slate-800/20">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-purple-400 flex items-center gap-2">
                                        <History className="w-4 h-4" />
                                        Sliding Conversation History
                                    </CardTitle>
                                    <CardDescription className="text-[10px] font-medium text-slate-500">Manage individual chat turns to optimize window space.</CardDescription>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button 
                                        variant={isPruned ? "secondary" : "outline"} 
                                        size="sm" 
                                        className="h-7 text-[9px] font-black uppercase gap-1.5"
                                        onClick={() => setIsPruned(!isPruned)}
                                    >
                                        <Scissors className="w-3 h-3" /> {isPruned ? "Pruned" : "Prune Context"}
                                    </Button>
                                    <span className="text-[10px] font-black text-purple-400 font-mono">{historyTokens.toLocaleString()} TOKENS</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isPruned && (
                                <div className="p-4 bg-indigo-500/5 border-b border-white/5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                            <Brain className="w-3 h-3" /> Pruning Intensity: {prunePercent}%
                                        </span>
                                        <span className="text-[9px] text-slate-500 italic uppercase">Replaces turns with a summary</span>
                                    </div>
                                    <Slider value={[prunePercent]} onValueChange={(val) => setPrunedPercent(val[0])} max={90} step={5} />
                                </div>
                            )}
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar divide-y divide-white/5">
                                {historyTurns.map((turn) => (
                                    <div key={turn.id} className="p-4 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <MoveVertical className="w-3.5 h-3.5 text-slate-700 cursor-grab group-hover:text-slate-500" />
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${turn.role === 'user' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                                        {turn.role}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-500">{turn.tokens.toLocaleString()} tokens</span>
                                                </div>
                                                <p className="text-xs text-slate-400 line-clamp-1 italic">"{turn.text}"</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteTurn(turn.id)}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Configuration & Insights */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Target Environment */}
                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                Execution Engine
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Model Selection</Label>
                                <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                                    <SelectTrigger className="h-12 bg-white/5 border-white/10 text-sm rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-950 border-white/10">
                                        {Array.from(new Set(models.map(m => m.provider))).map(provider => (
                                            <SelectGroup key={provider}>
                                                <SelectLabel className="text-[10px] font-black uppercase text-indigo-400 px-2 py-1.5 opacity-70">{provider}</SelectLabel>
                                                {models.filter(m => m.provider === provider).map(m => (
                                                    <SelectItem key={m.id} value={m.id} className="text-xs">
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

                            {/* 1. Needle Position Slider (if enabled) */}
                            {showNeedle && (
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Needle Position</span>
                                        <span className="text-[10px] font-mono text-slate-400">{needlePosition}% through window</span>
                                    </div>
                                    <Slider value={[needlePosition]} onValueChange={(val) => setNeedlePosition(val[0])} max={100} step={1} />
                                    <p className="text-[10px] text-slate-500 leading-relaxed italic">
                                        The "Lost in the Middle" effect suggests LLMs are less accurate when retrieving facts from the center of large context windows.
                                    </p>
                                </div>
                            )}

                            {/* Multi-Numeric Inputs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">User Query</Label>
                                    <Input type="number" value={userTokens} onChange={(e) => setUserTokens(parseInt(e.target.value) || 0)} className="h-10 bg-white/5 border-white/5 font-mono text-xs" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Output Buffer</Label>
                                    <Input type="number" value={outputHeadroom} onChange={(e) => setOutputHeadroom(parseInt(e.target.value) || 0)} className="h-10 bg-white/5 border-white/5 font-mono text-xs" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Breakdown & Tips */}
                    <Card className="bg-slate-900/50 border-white/10 overflow-hidden relative group">
                        <CardHeader className="pb-3 border-b border-white/5">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Resource Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {segments.map((seg, i) => (
                                <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${seg.color}`} />
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

                    {/* Proceed CTA */}
                    <div className="pt-2">
                        <Button 
                            asChild
                            onClick={() => setOptimizationStep(3)}
                            className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-base shadow-lg shadow-indigo-500/20 gap-3 group"
                        >
                            <Link href="/tools/compression">
                                <Zap className="w-5 h-5 fill-white group-hover:animate-pulse" />
                                Stress Test Passed. Proceed to Weight Reduction ➔
                            </Link>
                        </Button>
                    </div>

                    <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <BookOpen className="w-12 h-12 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">🧱 The Memory Budget</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Rules of the House</p>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">System Prompts should stay at the top and never be erased. They define your model's soul.</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Conversation Memory</p>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">History grows linearly. If you hit the wall, you must prune or summarize old turns.</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Thinking Space</p>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">Headroom is the output buffer. No headroom = cut-off responses. Always leave at least 4k.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
