"use client";

import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, AlertCircle, DollarSign,Zap } from "lucide-react";

const MODELS = [
  { name: 'GPT-4o', input: 5, output: 15, color: 'text-emerald-400' },
  { name: 'Claude 3.5 Sonnet', input: 3, output: 15, color: 'text-orange-400' },
  { name: 'Gemini 1.5 Pro', input: 3.5, output: 10.5, color: 'text-blue-400' },
  { name: 'GPT-4o Mini', input: 0.15, output: 0.60, color: 'text-emerald-500' },
];

export default function OutputCostSimulator() {
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputMultiplier, setOutputMultiplier] = useState(2);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);

  const outputTokens = inputTokens * outputMultiplier;
  const inputCost = (inputTokens / 1000000) * selectedModel.input;
  const outputCost = (outputTokens / 1000000) * selectedModel.output;
  const totalCost = inputCost + outputCost;
  
  const outputPercentage = ((outputCost / totalCost) * 100).toFixed(0);
  const costRatio = (selectedModel.output / selectedModel.input).toFixed(1);

  return (
    <Card className="p-6 md:p-8 bg-slate-950 border-white/10 shadow-2xl space-y-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <TrendingUp className="w-64 h-64 text-indigo-500" />
      </div>

      <div className="relative z-10 space-y-2">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          The Output Inflation Simulator
        </h3>
        <p className="text-slate-400 text-sm font-medium">
          Visualize how output verbosity secretly dominates your LLM expenses.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Model Selection */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target Model</label>
            <div className="grid grid-cols-2 gap-2">
              {MODELS.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setSelectedModel(m)}
                  className={cn(
                    "p-3 rounded-xl border text-xs font-bold transition-all",
                    selectedModel.name === m.name 
                      ? "bg-white/10 border-white/20 text-white ring-1 ring-white/20" 
                      : "bg-white/5 border-transparent text-slate-500 hover:bg-white/10"
                  )}
                >
                  {m.name}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 italic">
              * This model charges <span className="text-white font-bold">{costRatio}x</span> more for output tokens than input.
            </p>
          </div>

          {/* Input Tokens Slider */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Input Tokens (Your Prompt)</label>
              <span className="text-xs font-bold text-white">{inputTokens.toLocaleString()}</span>
            </div>
            <Slider 
              value={[inputTokens]} 
              onValueChange={(v) => setInputTokens(v[0])} 
              max={10000} 
              step={100}
              className="py-4"
            />
          </div>

          {/* Output Multiplier Slider */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Output Multiplier (Verbosity)</label>
              <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/20 text-indigo-400">
                {outputMultiplier}x Input
              </Badge>
            </div>
            <Slider 
              value={[outputMultiplier]} 
              onValueChange={(v) => setOutputMultiplier(v[0])} 
              max={10} 
              step={0.5}
              className="py-4"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-bold px-1">
              <span>CONCISE</span>
              <span>BALANCED</span>
              <span>VERBOSE</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="text-center space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Estimated Total Cost</p>
                <p className="text-5xl font-black text-white flex items-start justify-center">
                    <span className="text-xl mt-2 mr-1 text-slate-500">$</span>
                    {totalCost.toFixed(4)}
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase">Input Share</p>
                        <p className="text-sm font-bold text-white">${inputCost.toFixed(4)}</p>
                    </div>
                    <div className="text-right space-y-1">
                        <p className="text-[9px] font-black text-indigo-400 uppercase">Output Share</p>
                        <p className="text-sm font-bold text-indigo-400">${outputCost.toFixed(4)}</p>
                    </div>
                </div>
                
                <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div 
                        className="h-full bg-slate-400 transition-all duration-500" 
                        style={{ width: `${(inputCost / totalCost) * 100}%` }} 
                    />
                    <div 
                        className="h-full bg-indigo-500 transition-all duration-500" 
                        style={{ width: `${(outputCost / totalCost) * 100}%` }} 
                    />
                </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
                <p className="text-xs font-bold text-white">The Reveal:</p>
                <p className="text-[11px] text-indigo-200/70 leading-relaxed">
                    Output tokens account for <span className="text-white font-bold">{outputPercentage}%</span> of your total bill. 
                    Even if you halve your prompt size, a verbose response can keep your costs high.
                </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
