"use client";

import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Scissors, Zap, ShieldCheck } from "lucide-react";
import { countTokensSync } from "@/lib/tokenizer";

const SCENARIOS = [
  {
    title: "The Polite Assistant",
    inefficient: "Hello there, I was wondering if you could please be so kind as to write a very short summary of the following text for me? I would really appreciate it. Thank you so much!",
    optimized: "Summarize:",
    description: "Removing politeness and filler words that LLMs don't need."
  },
  {
    title: "Data Formatting",
    inefficient: "The user's name is Alice. She is 28 years old. Her job title is Software Engineer and she lives in San Francisco, California.",
    optimized: '{"name":"Alice","age":28,"job":"Eng","city":"SF"}',
    description: "Switching from prose to structured JSON for data-heavy inputs."
  },
  {
    title: "Instruction Consolidation",
    inefficient: "Please analyze the sentiment of this text. Tell me if it is positive, negative or neutral. Do not provide any explanation, just the label.",
    optimized: "Sentiment (Positive/Negative/Neutral):",
    description: "Condensing complex instructions into direct commands."
  }
];

export default function PromptCompressionDemo() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const scenario = SCENARIOS[scenarioIdx];

  const inTokens = countTokensSync(scenario.inefficient);
  const outTokens = countTokensSync(scenario.optimized);
  const savings = (((inTokens - outTokens) / inTokens) * 100).toFixed(0);

  return (
    <Card className="p-6 md:p-8 bg-slate-900 border-white/10 shadow-2xl space-y-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Scissors className="w-64 h-64 text-emerald-500" />
      </div>

      <div className="relative z-10 space-y-2">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
          <Scissors className="w-5 h-5 text-emerald-400" />
          Prompt Compression Demo
        </h3>
        <p className="text-slate-400 text-sm font-medium">
          See how small tweaks can lead to massive token savings.
        </p>
      </div>

      <div className="relative z-10 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {SCENARIOS.map((s, idx) => (
          <button
            key={s.title}
            onClick={() => setScenarioIdx(idx)}
            className={cn(
              "px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all",
              scenarioIdx === idx 
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" 
                : "bg-slate-800/50 border-white/5 text-slate-500 hover:bg-slate-800"
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inefficient Prompt</label>
                <Badge variant="outline" className="text-[9px] border-rose-500/20 text-rose-400 bg-rose-500/5">{inTokens} Tokens</Badge>
            </div>
            <div className="w-full h-32 p-4 rounded-2xl bg-slate-950 border border-white/5 text-xs text-slate-400 leading-relaxed italic">
                "{scenario.inefficient}"
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Optimized Prompt</label>
                <Badge variant="outline" className="text-[9px] border-emerald-500/20 text-emerald-400 bg-emerald-500/5">{outTokens} Tokens</Badge>
            </div>
            <div className="w-full h-32 p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 text-xs text-white leading-relaxed font-mono">
                {scenario.optimized}
            </div>
        </div>
      </div>

      <div className="relative z-10 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-400 fill-emerald-400" />
            </div>
            <div>
                <p className="text-sm font-bold text-white">Efficiency Gain: {savings}%</p>
                <p className="text-xs text-slate-500">{scenario.description}</p>
            </div>
        </div>
        
        <div className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Same Result, <span className="text-white">{inTokens - outTokens}</span> Less Tokens
            </p>
        </div>
      </div>
    </Card>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
