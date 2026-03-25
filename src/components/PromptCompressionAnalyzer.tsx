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
    FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { countTokensSync } from "@/lib/tokenizer";
import { models } from "@/lib/models";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Wasteful patterns definitions
const FILLER_PHRASES = [
    { pattern: /please note that/gi, replacement: "Note:", reason: "Politeness filler" },
    { pattern: /as an ai language model/gi, replacement: "", reason: "Self-identification filler" },
    { pattern: /i would like to ask you to/gi, replacement: "Please", reason: "Wordy request" },
    { pattern: /in order to/gi, replacement: "to", reason: "Wordy preposition" },
    { pattern: /for the purpose of/gi, replacement: "for", reason: "Wordy preposition" },
    { pattern: /due to the fact that/gi, replacement: "because", reason: "Wordy conjunction" },
    { pattern: /at the present time/gi, replacement: "currently", reason: "Wordy adverb" },
    { pattern: /i am writing to you because/gi, replacement: "", reason: "Meta-context filler" },
    { pattern: /it is important to remember that/gi, replacement: "Remember:", reason: "Expletive construction" },
    { pattern: /there is a need for/gi, replacement: "we need", reason: "Passive construction" },
    { pattern: /with reference to/gi, replacement: "regarding", reason: "Formal filler" },
    { pattern: /i was wondering if you could/gi, replacement: "Please", reason: "Tentative request" },
];

const REDUNDANCY_PATTERNS = [
    { pattern: /basic fundamentals/gi, replacement: "fundamentals", reason: "Tautology" },
    { pattern: /added bonus/gi, replacement: "bonus", reason: "Tautology" },
    { pattern: /actual facts/gi, replacement: "facts", reason: "Tautology" },
    { pattern: /advance planning/gi, replacement: "planning", reason: "Tautology" },
    { pattern: /close proximity/gi, replacement: "proximity", reason: "Tautology" },
    { pattern: /end result/gi, replacement: "result", reason: "Tautology" },
    { pattern: /future plans/gi, replacement: "plans", reason: "Tautology" },
];

export default function PromptCompressionAnalyzer() {
    const [prompt, setPrompt] = useState("");
    const [selectedModelId, setSelectedModelId] = useState(models[0].id);
    const [copied, setCopied] = useState(false);

    const model = models.find(m => m.id === selectedModelId) || models[0];

    const analysis = useMemo(() => {
        if (!prompt.trim()) return null;

        let compressed = prompt;
        const detections: { original: string; suggested: string; reason: string; type: 'filler' | 'redundancy' | 'list' }[] = [];

        // Filler phrases
        FILLER_PHRASES.forEach(({ pattern, replacement, reason }) => {
            const matches = prompt.match(pattern);
            if (matches) {
                detections.push({ original: matches[0], suggested: replacement, reason, type: 'filler' });
                compressed = compressed.replace(pattern, replacement);
            }
        });

        // Redundancy
        REDUNDANCY_PATTERNS.forEach(({ pattern, replacement, reason }) => {
            const matches = prompt.match(pattern);
            if (matches) {
                detections.push({ original: matches[0], suggested: replacement, reason, type: 'redundancy' });
                compressed = compressed.replace(pattern, replacement);
            }
        });

        // List compression detection (simple detection of "List of" or bullet points)
        const listRegex = /(?:here is a )?list of (.+?):/gi;
        const listMatch = compressed.match(listRegex);
        if (listMatch) {
            detections.push({ 
                original: listMatch[0], 
                suggested: listMatch[0].replace(listRegex, "$1:"), 
                reason: "List intro optimization", 
                type: 'list' 
            });
            compressed = compressed.replace(listRegex, "$1:");
        }

        // Clean up double spaces resulting from removals
        compressed = compressed.replace(/\s\s+/g, ' ').trim();

        const beforeTokens = countTokensSync(prompt);
        const afterTokens = countTokensSync(compressed);
        const savedTokens = Math.max(0, beforeTokens - afterTokens);
        const percentSaved = beforeTokens > 0 ? (savedTokens / beforeTokens) * 100 : 0;

        const beforeCost = (beforeTokens / 1_000_000) * model.inputPricePer1M;
        const afterCost = (afterTokens / 1_000_000) * model.inputPricePer1M;
        const costSavings = beforeCost - afterCost;

        return {
            compressed,
            detections,
            beforeTokens,
            afterTokens,
            savedTokens,
            percentSaved,
            beforeCost,
            afterCost,
            costSavings
        };
    }, [prompt, model]);

    const handleCopy = () => {
        if (analysis?.compressed) {
            navigator.clipboard.writeText(analysis.compressed);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md shadow-xl overflow-hidden">
                        <CardHeader className="pb-4 border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Original Prompt</CardTitle>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Input Tokens</span>
                                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                                        {analysis?.beforeTokens || 0}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Textarea 
                                placeholder="Paste your prompt here... (e.g. Please note that I would like to ask you to provide a list of actual facts regarding...)"
                                className="min-h-[300px] bg-white/5 border-white/10 focus-visible:ring-indigo-500 text-sm placeholder:text-slate-600 resize-none"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pricing Model</label>
                                    <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                                        <SelectTrigger className="h-8 w-[180px] bg-white/5 border-white/10 text-[11px]">
                                            <SelectValue placeholder="Select model" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10">
                                            {models.map(m => (
                                                <SelectItem key={m.id} value={m.id} className="text-[11px]">{m.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-slate-500 hover:text-red-400 h-8"
                                    onClick={() => setPrompt("")}
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                    Clear
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {analysis && analysis.detections.length > 0 && (
                        <Card className="border-white/10 bg-slate-900/50 backdrop-blur-md">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Detected Wasteful Patterns
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {analysis.detections.map((det, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/20 transition-colors group">
                                        <div className={`mt-1 p-1.5 rounded-lg shrink-0 ${
                                            det.type === 'filler' ? 'bg-amber-500/10 text-amber-400' :
                                            det.type === 'redundancy' ? 'bg-red-500/10 text-red-400' :
                                            'bg-indigo-500/10 text-indigo-400'
                                        }`}>
                                            {det.type === 'filler' && <MessageSquareText className="w-3.5 h-3.5" />}
                                            {det.type === 'redundancy' && <AlertTriangle className="w-3.5 h-3.5" />}
                                            {det.type === 'list' && <Layers className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">{det.reason}</span>
                                                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                                                    det.type === 'filler' ? 'bg-amber-500/20 text-amber-400' :
                                                    det.type === 'redundancy' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-indigo-500/20 text-indigo-400'
                                                }`}>
                                                    {det.type}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
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
                </div>

                {/* Results Panel */}
                <div className="space-y-6">
                    <Card className={`border-2 transition-all duration-500 overflow-hidden ${analysis && analysis.savedTokens > 0 ? "border-emerald-500/30 bg-slate-900/80 shadow-emerald-500/10" : "border-white/10 bg-slate-900/50"}`}>
                        <CardHeader className="pb-4 border-b border-white/5">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Analysis Result</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="text-center space-y-2">
                                <div className={`text-5xl font-black tracking-tighter font-mono ${analysis && analysis.savedTokens > 0 ? "text-emerald-400" : "text-slate-400"}`}>
                                    -{analysis?.percentSaved.toFixed(1) || 0}%
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Token Reduction</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Before</span>
                                    <span className="text-xl font-bold text-slate-200 font-mono">{analysis?.beforeTokens || 0}</span>
                                    <span className="text-[9px] text-slate-500 block uppercase">Tokens</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block">After</span>
                                    <span className="text-xl font-bold text-emerald-400 font-mono">{analysis?.afterTokens || 0}</span>
                                    <span className="text-[9px] text-emerald-500/70 block uppercase">Tokens</span>
                                </div>
                            </div>

                            {analysis && analysis.savedTokens > 0 && (
                                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                                    <div className="flex items-center gap-2 text-indigo-400">
                                        <TrendingDown className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Est. Savings</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-white font-mono">${analysis.costSavings.toFixed(6)}</span>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase">per request</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                        Saving <span className="text-indigo-400 font-bold">{analysis.savedTokens}</span> tokens per call on {model.name}.
                                    </p>
                                </div>
                            )}

                            <div className="pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between mb-2">
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
                        </CardContent>
                    </Card>

                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center gap-2 text-amber-500">
                            <Info className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Pro Tip</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            LLMs don&apos;t need excessive politeness or meta-talk. &quot;Please note that I would like you to write a summary&quot; costs <span className="text-amber-400 font-bold">14 tokens</span>, while &quot;Write a summary&quot; costs only <span className="text-emerald-400 font-bold">3 tokens</span>. Over 1,000 calls, these small changes add up to significant savings.
                        </p>
                    </div>
                </div>
            </div>

            {/* Educational Section */}
            <div className="pt-12 border-t border-white/5">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-black tracking-tight text-white uppercase">The Art of <span className="text-indigo-500">Prompt Compression</span></h2>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">Learn how to strip away the noise without losing instructions.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-amber-400" />
                            </div>
                            <h3 className="font-bold text-slate-200">Remove Fluff</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Phrases like &quot;I&apos;m looking for,&quot; &quot;Can you help me with,&quot; and &quot;It would be great if&quot; add nothing to the model&apos;s understanding but increase your bill.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                <Layers className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="font-bold text-slate-200">Structure Data</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Use symbols like &apos;#&apos; for headers or &apos;-&apos; for lists instead of full sentences. Compact formatting is often easier for models to parse.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="font-bold text-slate-200">Direct Action</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Start prompts with strong verbs: &quot;Analyze,&quot; &quot;Rewrite,&quot; &quot;Extract.&quot; This sets the context immediately and uses fewer tokens than descriptive requests.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}