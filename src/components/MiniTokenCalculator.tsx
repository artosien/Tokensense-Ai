"use client";

import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Calculator, ShieldCheck, Zap } from "lucide-react";
import { countTokensSync } from "@/lib/tokenizer";

export default function MiniTokenCalculator() {
  const [text, setText] = useState("TokenSense-AI processes everything locally. Your data never leaves this browser window.");
  
  const tokenCount = useMemo(() => {
    return countTokensSync(text);
  }, [text]);

  return (
    <Card className="p-4 md:p-6 bg-slate-900 border-indigo-500/20 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                <Calculator className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-tight">Mini Token Counter</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase">100% Client-Side</span>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="w-full h-24 p-3 rounded-xl bg-slate-950 border border-white/5 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all resize-none font-medium"
      />

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
            <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Tokens</p>
                <p className="text-2xl font-black text-white font-mono">{tokenCount}</p>
            </div>
            <div className="h-8 w-px bg-white/5" />
            <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Processing Time</p>
                <p className="text-sm font-black text-indigo-400 font-mono">≈ 0.01ms</p>
            </div>
        </div>

        <div className="p-2 bg-indigo-500/5 rounded-lg border border-indigo-500/10 text-center px-4">
            <Zap className="w-3 h-3 text-indigo-400 mx-auto mb-1" />
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Zero Network Wait</p>
        </div>
      </div>
    </Card>
  );
}
