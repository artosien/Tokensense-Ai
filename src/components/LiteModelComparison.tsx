"use client";

import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Trophy, Zap, TrendingDown, Info, ArrowRight } from "lucide-react";

const LITE_MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', input: 0.15, output: 0.60, mmlu: 82.0, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', input: 0.25, output: 1.25, mmlu: 75.2, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', input: 0.10, output: 0.40, mmlu: 78.9, color: 'text-blue-400', bg: 'bg-blue-500/10' },
];

export default function LiteModelComparison() {
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(500);

  const results = useMemo(() => {
    return LITE_MODELS.map(m => {
      const cost = (inputTokens / 1000000) * m.input + (outputTokens / 1000000) * m.output;
      return { ...m, totalCost: cost };
    }).sort((a, b) => a.totalCost - b.totalCost);
  }, [inputTokens, outputTokens]);

  const maxCost = Math.max(...results.map(r => r.totalCost));

  return (
    <Card className="p-6 md:p-8 bg-slate-900 border-white/10 shadow-2xl space-y-8">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          The "Lite" Model Battleground
        </h3>
        <p className="text-slate-400 text-sm font-medium">
          Compare the industry's most efficient models in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Input Tokens</label>
                    <span className="text-xs font-bold text-white">{inputTokens.toLocaleString()}</span>
                </div>
                <Slider value={[inputTokens]} onValueChange={(v) => setInputTokens(v[0])} max={10000} step={100} />
            </div>
            <div className="space-y-4">
                <div className="flex justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Output Tokens</label>
                    <span className="text-xs font-bold text-white">{outputTokens.toLocaleString()}</span>
                </div>
                <Slider value={[outputTokens]} onValueChange={(v) => setOutputTokens(v[0])} max={10000} step={100} />
            </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-indigo-400 mt-0.5" />
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    These "Lite" models are up to <span className="text-white font-bold">50x cheaper</span> than flagship counterparts while retaining ~80% of the intelligence.
                </p>
            </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="border-b border-white/5">
                    <th className="py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Model</th>
                    <th className="py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">IQ (MMLU)</th>
                    <th className="py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Est. Total Cost</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {results.map((m, idx) => (
                    <tr key={m.id} className={cn("group transition-colors", idx === 0 ? "bg-emerald-500/[0.03]" : "")}>
                        <td className="py-4">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white flex items-center gap-2">
                                    {m.name}
                                    {idx === 0 && <Badge className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black border-none uppercase">Cheapest</Badge>}
                                </span>
                                <span className="text-[10px] text-slate-500">{m.provider}</span>
                            </div>
                        </td>
                        <td className="py-4 text-right">
                            <span className="text-xs font-mono font-bold text-slate-300">{m.mmlu}</span>
                        </td>
                        <td className="py-4 text-right">
                            <div className="flex flex-col items-end gap-1">
                                <span className={cn("text-sm font-black font-mono", idx === 0 ? "text-emerald-400" : "text-white")}>
                                    ${m.totalCost.toFixed(5)}
                                </span>
                                <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className={cn("h-full transition-all duration-500", idx === 0 ? "bg-emerald-500" : "bg-white/20")}
                                        style={{ width: `${(m.totalCost / maxCost) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </Card>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
