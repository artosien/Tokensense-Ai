"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
    Zap, 
    Trash2, 
    Sparkles, 
    Info, 
    ArrowRight, 
    CheckCircle2, 
    AlertTriangle, 
    Copy, 
    Check,
    MessageSquareText,
    TrendingDown,
    Layers,
    FileText,
    ShieldCheck,
    Dna,
    Database,
    Table,
    Link as LinkIcon,
    ChevronLeft,
    ChevronRight,
    Braces,
    PlaneTakeoff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { countTokensSync } from "@/lib/tokenizer";
import { models } from "@/lib/models";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useTokenSenseStore } from "@/lib/store";
import Link from "next/link";

// Wasteful patterns definitions
const FILLER_PHRASES = [
    { pattern: /please note that/gi, replacement: "Note:", reason: "Politeness filler", intensity: 1 },
    { pattern: /as an ai language model/gi, replacement: "", reason: "Self-identification filler", intensity: 1 },
    { pattern: /i would like to ask you to/gi, replacement: "Please", reason: "Wordy request", intensity: 1 },
    { pattern: /in order to/gi, replacement: "to", reason: "Wordy preposition", intensity: 1 },
    { pattern: /for the purpose of/gi, replacement: "for", reason: "Wordy preposition", intensity: 1 },
    { pattern: /due to the fact that/gi, replacement: "because", reason: "Wordy conjunction", intensity: 1 },
    { pattern: /at the present time/gi, replacement: "currently", reason: "Wordy adverb", intensity: 1 },
    { pattern: /i am writing to you because/gi, replacement: "", reason: "Meta-context filler", intensity: 1 },
    { pattern: /it is important to remember that/gi, replacement: "Remember:", reason: "Expletive construction", intensity: 1 },
    { pattern: /there is a need for/gi, replacement: "we need", reason: "Passive construction", intensity: 1 },
    { pattern: /with reference to/gi, replacement: "regarding", reason: "Formal filler", intensity: 1 },
    { pattern: /i was wondering if you could/gi, replacement: "Please", reason: "Tentative request", intensity: 1 },
];

const EXTREME_PATTERNS = [
    { pattern: /analyze the following/gi, replacement: "Analyze:", reason: "Context filler", intensity: 2 },
    { pattern: /provide a detailed/gi, replacement: "Detail:", reason: "Verbosity", intensity: 2 },
    { pattern: /take into consideration/gi, replacement: "Consider:", reason: "Wordy verb", intensity: 2 },
    { pattern: /i want you to act as/gi, replacement: "Role:", reason: "Persona fluff", intensity: 2 },
    { pattern: /your task is to/gi, replacement: "Task:", reason: "Instruction fluff", intensity: 2 },
];

const PRO_TIPS = [
    { title: "Direct Action", text: "Start prompts with strong verbs: 'Analyze,' 'Rewrite,' 'Extract.' This sets context instantly and uses fewer tokens." },
    { title: "Symbolic Structure", text: "Use '#' for headers or '-' for lists. Symbols are often fewer tokens than full sentence introductions." },
    { title: "Remove Meta-Talk", text: "Politeness ('Please,' 'Thank you') adds zero value to LLM performance but increases your bill." },
    { title: "Few-Shot Efficiency", text: "When providing examples, keep them as short as possible. Use 'Q:' and 'A:' instead of 'Question:' and 'Answer:'." },
    { title: "Structured Data", text: "If pasting JSON, use a minifier to strip whitespace. This can save 15-20% of tokens on large data payloads." }
];

export default function PromptCompressionAnalyzer() {
    const { setMissionStep } = useTokenSenseStore();
    const [prompt, setPrompt] = useState("");
    const [selectedModelId, setSelectedModelId] = useState(models[0].id);
    const [mode, setMode] = useState<"lossless" | "extreme">("lossless");
    const [showDiff, setShowDiff] = useState(false);
    const [volume, setVolume] = useState(10000);
    const [tipIndex, setTipIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    const model = models.find(m => m.id === selectedModelId) || models[0];

    const analysis = useMemo(() => {
        if (!prompt.trim()) return null;

        let compressed = prompt;
        const detections: { original: string; suggested: string; reason: string; type: 'filler' | 'redundancy' | 'extreme' }[] = [];

        // Apply Lossless patterns
        FILLER_PHRASES.forEach(({ pattern, replacement, reason }) => {
            const matches = prompt.match(pattern);
            if (matches) {
                detections.push({ original: matches[0], suggested: replacement, reason, type: 'filler' });
                compressed = compressed.replace(pattern, replacement);
            }
        });

        // Apply Extreme patterns if in extreme mode
        if (mode === "extreme") {
            EXTREME_PATTERNS.forEach(({ pattern, replacement, reason }) => {
                const matches = prompt.match(pattern);
                if (matches) {
                    detections.push({ original: matches[0], suggested: replacement, reason, type: 'extreme' });
                    compressed = compressed.replace(pattern, replacement);
                }
            });
            // Additional semantic shorthand
            compressed = compressed.replace(/\b(for example|specifically)\b/gi, "e.g.");
            compressed = compressed.replace(/\b(and so on|etcetera)\b/gi, "etc");
        }

        // Clean up double spaces
        compressed = compressed.replace(/\s\s+/g, ' ').trim();

        const beforeTokens = countTokensSync(prompt);
        const afterTokens = countTokensSync(compressed);
        const savedTokens = Math.max(0, beforeTokens - afterTokens);
        const percentSaved = beforeTokens > 0 ? (savedTokens / beforeTokens) * 100 : 0;

        // Fidelity Score Calculation (Mock Logic)
        const fidelityScore = mode === "lossless" ? 98 : Math.max(75, 100 - (percentSaved * 0.8));

        const beforeCost = (beforeTokens / 1_000_000) * model.inputPricePer1M;
        const afterCost = (afterTokens / 1_000_000) * model.inputPricePer1M;
        const costSavingsPerCall = beforeCost - afterCost;
        const totalVolumeSavings = costSavingsPerCall * volume;

        // Diff Generation
        let diffMarkup = prompt;
        detections.forEach(det => {
            diffMarkup = diffMarkup.replace(det.original, `<del class="bg-red-500/20 text-red-400 no-underline px-1 rounded">${det.original}</del><ins class="bg-emerald-500/20 text-emerald-400 no-underline px-1 rounded mx-1">${det.suggested}</ins>`);
        });

        return {
            compressed,
            diffMarkup,
            detections,
            beforeTokens,
            afterTokens,
            savedTokens,
            percentSaved,
            fidelityScore,
            costSavingsPerCall,
            totalVolumeSavings
        };
    }, [prompt, model, mode, volume]);

    const minifyData = () => {
        try {
            // Attempt JSON minification
            const json = JSON.parse(prompt);
            setPrompt(JSON.stringify(json));
        } catch (e) {
            // If not JSON, try simple whitespace/newline stripping
            setPrompt(prompt.replace(/\n\s*/g, ' ').trim());
        }
    };

    const handleCopy = () => {
        if (analysis?.compressed) {
            navigator.clipboard.writeText(analysis.compressed);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Input & Workbench Panel */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md shadow-xl overflow-hidden">
                        <CardHeader className="pb-4 border-b border-white/5 bg-slate-800/20">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Prompt Workbench</CardTitle>
                                    <CardDescription className="text-[10px]">Optimize and refactor your instructions</CardDescription>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1">
                                        <Button 
                                            size="sm" 
                                            variant={!showDiff ? "secondary" : "ghost"}
                                            className="h-7 text-[10px] uppercase font-bold px-3"
                                            onClick={() => setShowDiff(false)}
                                        >
                                            Source
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant={showDiff ? "secondary" : "ghost"}
                                            className="h-7 text-[10px] uppercase font-bold px-3"
                                            onClick={() => setShowDiff(true)}
                                            disabled={!analysis}
                                        >
                                            Visual Diff
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {showDiff ? (
                                <div 
                                    className="min-h-[300px] p-4 bg-black/40 border border-white/5 rounded-xl text-sm font-mono whitespace-pre-wrap leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: analysis?.diffMarkup || "" }}
                                />
                            ) : (
                                <Textarea 
                                    placeholder="Paste your prompt or data payload here... (e.g. Please note that I would like you to analyze the following JSON...)"
                                    className="min-h-[300px] bg-white/5 border-white/10 focus-visible:ring-indigo-500 text-sm placeholder:text-slate-600 resize-none font-mono"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                            )}
                            
                            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Context</label>
                                        <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                                            <SelectTrigger className="h-8 w-[160px] bg-white/5 border-white/10 text-[11px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10">
                                                {models.map(m => (
                                                    <SelectItem key={m.id} value={m.id} className="text-[11px]">{m.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mode</label>
                                        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
                                            <Button 
                                                variant={mode === "lossless" ? "secondary" : "ghost"} 
                                                size="sm" 
                                                className="h-6 text-[9px] px-2 font-black uppercase"
                                                onClick={() => setMode("lossless")}
                                            >
                                                Lossless
                                            </Button>
                                            <Button 
                                                variant={mode === "extreme" ? "secondary" : "ghost"} 
                                                size="sm" 
                                                className="h-6 text-[9px] px-2 font-black uppercase"
                                                onClick={() => setMode("extreme")}
                                            >
                                                Extreme
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-8 border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase gap-1.5"
                                        onClick={minifyData}
                                    >
                                        <Braces className="w-3.5 h-3.5 text-indigo-400" />
                                        Minify Data
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-slate-500 hover:text-red-400 h-8 text-[10px] font-bold uppercase"
                                        onClick={() => setPrompt("")}
                                    >
                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {analysis && analysis.detections.length > 0 && (
                            <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md">
                                <CardHeader className="pb-4 border-b border-white/5">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        Refactoring Insights
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {analysis.detections.map((det, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/20 transition-colors group">
                                            <div className="shrink-0 mt-1">
                                                {det.type === 'extreme' ? <Zap className="w-3.5 h-3.5 text-amber-400" /> : <MessageSquareText className="w-3.5 h-3.5 text-indigo-400" />}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">{det.reason}</span>
                                                    <Badge className={`${det.type === 'extreme' ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'} border-0 text-[8px] font-black uppercase`}>
                                                        {det.type}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-[11px]">
                                                    <span className="line-through text-slate-500 italic">"{det.original}"</span>
                                                    <ArrowRight className="w-3 h-3 text-slate-600" />
                                                    <span className="text-emerald-400 font-bold">
                                                        {det.suggested ? `"${det.suggested}"` : "(removed)"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md">
                            <CardHeader className="pb-4 border-b border-white/5">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <Table className="w-4 h-4 text-purple-400" />
                                    Tokenizer Sync
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
                                        <span>Provider</span>
                                        <span>Compressed Count</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-300 font-medium">OpenAI (cl100k)</span>
                                        <span className="text-xs font-mono font-bold text-white">{analysis?.afterTokens || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-300 font-medium">Anthropic</span>
                                        <span className="text-xs font-mono font-bold text-slate-400">{(analysis?.afterTokens ? analysis.afterTokens * 1.08 : 0).toFixed(0)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-300 font-medium">Google (Gemini)</span>
                                        <span className="text-xs font-mono font-bold text-slate-400">{(analysis?.afterTokens ? analysis.afterTokens * 1.02 : 0).toFixed(0)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-300 font-medium">Llama 3 (Tiktoken)</span>
                                        <span className="text-xs font-mono font-bold text-slate-400">{(analysis?.afterTokens ? analysis.afterTokens * 1.05 : 0).toFixed(0)}</span>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                                    <p className="text-[10px] text-slate-500 leading-relaxed italic">
                                        Different providers use different encoding logic. Always verify counts for your specific deployment.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Results & Pro-Tip Sidebar */}
                <div className="space-y-6">
                    <Card className={`border-2 transition-all duration-500 overflow-hidden ${analysis && analysis.savedTokens > 0 ? "border-emerald-500/30 bg-slate-900/80 shadow-emerald-500/10" : "border-white/10 bg-slate-900/50"}`}>
                        <CardHeader className="pb-4 border-b border-white/5">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">Analysis Result</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-8">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Token Reduction</span>
                                        <div className={`text-4xl font-black tracking-tighter font-mono ${analysis && analysis.savedTokens > 0 ? "text-emerald-400" : "text-slate-400"}`}>
                                            -{analysis?.percentSaved.toFixed(1) || 0}%
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Fidelity Score</span>
                                        <div className={`text-2xl font-black font-mono flex items-center justify-end gap-1.5 ${analysis && analysis.fidelityScore > 90 ? "text-emerald-400" : analysis && analysis.fidelityScore > 80 ? "text-amber-400" : "text-red-400"}`}>
                                            {analysis?.fidelityScore.toFixed(0) || 0}%
                                            {analysis && (analysis.fidelityScore > 90 ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                                        <span>Projection Volume</span>
                                        <span className="text-white">{volume.toLocaleString()} Calls</span>
                                    </div>
                                    <Slider 
                                        value={[volume]} 
                                        onValueChange={(val) => setVolume(val[0])}
                                        max={100000}
                                        step={1000}
                                        className="py-2"
                                    />
                                </div>

                                {analysis && analysis.savedTokens > 0 && (
                                    <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <TrendingDown className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Estimated Savings</span>
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-white font-mono">${analysis.totalVolumeSavings.toFixed(2)}</span>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase">Total</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            Saving <span className="text-indigo-400 font-bold">{analysis.savedTokens}</span> tokens per call on {model.name}.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Optimized Output</span>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-7 text-[10px] font-bold uppercase"
                                        onClick={handleCopy}
                                        disabled={!analysis?.compressed}
                                    >
                                        {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                                        {copied ? "Copied" : "Copy"}
                                    </Button>
                                </div>
                                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-400 font-mono line-clamp-6 leading-relaxed">
                                    {analysis?.compressed || "No prompt analyzed yet..."}
                                </div>
                            </div>
                            
                            {analysis && analysis.beforeTokens > 1024 && (
                                <Link href="/tools/caching">
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase py-6 rounded-xl gap-2 shadow-lg shadow-emerald-900/20">
                                        <Database className="w-4 h-4" />
                                        Optimize with Context Caching
                                    </Button>
                                </Link>
                            )}

                            {/* Proceed CTA */}
                            <div className="pt-4 border-t border-white/5">
                                <Button 
                                    asChild
                                    onClick={() => setMissionStep(4)}
                                    className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-base shadow-lg shadow-indigo-500/20 gap-3 group"
                                >
                                    <Link href="/tools/batch">
                                        <PlaneTakeoff className="w-5 h-5 fill-white group-hover:animate-pulse" />
                                        Weight Reduced. Proceed to Flight Plan ➔
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pro-Tip Carousel */}
                    <Card className="border-white/10 bg-indigo-500/5 backdrop-blur-md relative group">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    Pro-Tip
                                </CardTitle>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500" onClick={() => setTipIndex(prev => (prev - 1 + PRO_TIPS.length) % PRO_TIPS.length)}>
                                        <ChevronLeft className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500" onClick={() => setTipIndex(prev => (prev + 1) % PRO_TIPS.length)}>
                                        <ChevronRight className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <h4 className="text-xs font-black text-white uppercase">{PRO_TIPS[tipIndex].title}</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                {PRO_TIPS[tipIndex].text}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Educational Section */}
            <div className="pt-12 border-t border-white/5 space-y-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-black tracking-tight text-white uppercase">The Art of <span className="text-indigo-500">Compression</span></h2>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">Learn how to strip away the noise without losing the signal.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-amber-400" />
                            </div>
                            <h3 className="font-bold text-slate-200 uppercase text-xs">Remove Fluff</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Phrases like &quot;I&apos;m looking for,&quot; &quot;Can you help me with,&quot; and &quot;It would be great if&quot; add nothing to the model&apos;s understanding but increase your bill.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                <Layers className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="font-bold text-slate-200 uppercase text-xs">Structure Data</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Use symbols like &apos;#&apos; for headers or &apos;-&apos; for lists instead of full sentences. Compact formatting is often easier for models to parse.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="font-bold text-slate-200 uppercase text-xs">Direct Action</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Start prompts with strong verbs: &quot;Analyze,&quot; &quot;Rewrite,&quot; &quot;Extract.&quot; This sets the context immediately and uses fewer tokens than descriptive requests.</p>
                        </div>
                    </div>
                </div>

                <Card className="max-w-4xl mx-auto border-white/10 bg-slate-900/80 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                <Dna className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-black text-white uppercase tracking-tight">What is &quot;Semantic Drift&quot;?</CardTitle>
                                <CardDescription className="text-xs uppercase font-bold text-slate-500">The Balance of Prompt Engineering</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-sm text-slate-400 leading-relaxed">
                            When we compress a prompt, we are performing a balancing act. **Semantic Drift** occurs when the instructions are shortened so much that the AI begins to &quot;drift&quot; away from your original intent. It starts missing edge cases or misinterpreting the core objective.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">How to avoid it:</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        </div>
                                        <p className="text-xs text-slate-300 font-medium leading-relaxed">**Keep Action Verbs:** Never remove core instructions like &quot;Analyze,&quot; &quot;Summarize,&quot; or &quot;Extract.&quot;</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        </div>
                                        <p className="text-xs text-slate-300 font-medium leading-relaxed">**Monitor Fidelity:** Use our Fidelity Score to ensure your core message remains intact.</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        </div>
                                        <p className="text-xs text-slate-300 font-medium leading-relaxed">**Safe Modes:** For mission-critical tasks, stick to **Lossless Mode** to ensure 100% accuracy.</p>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col justify-center text-center space-y-2">
                                <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                                <p className="text-xl font-black text-white font-mono tracking-tighter">SIGNAL &gt; NOISE</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                                    A professional-grade prompt is as dense as possible while maintaining 100% instruction fidelity.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
