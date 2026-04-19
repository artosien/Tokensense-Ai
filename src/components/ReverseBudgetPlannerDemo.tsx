"use client";

import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calculator, Wallet, Repeat, Zap } from "lucide-react";
import { models } from "@/lib/models";

export default function ReverseBudgetPlannerDemo() {
  const [monthlyBudget, setMonthlyBudget] = useState(100);
  const [inputTokens, setInputTokens] = useState(500);
  const [outputTokens, setOutputTokens] = useState(200);
  const [selectedModelIdx, setSelectedModelIdx] = useState(0);

  const demoModels = [
    { name: 'GPT-4o', input: 5, output: 15 },
    { name: 'Claude 3.5 Sonnet', input: 3, output: 15 },
    { name: 'Gemini 1.5 Flash', input: 0.1, output: 0.4 },
    { name: 'GPT-4o Mini', input: 0.15, output: 0.6 },
  ];

  const model = demoModels[selectedModelIdx];
  
  const costPerRequest = useMemo(() => {
    const inputCost = (inputTokens / 1000000) * model.input;
    const outputCost = (outputTokens / 1000000) * model.output;
    return inputCost + outputCost;
  }, [inputTokens, outputTokens, model]);

  const requestsPerMonth = costPerRequest > 0 ? Math.floor(monthlyBudget / costPerRequest) : 0;
  const requestsPerDay = Math.floor(requestsPerMonth / 30);

  return (
    <Card className="p-6 md:p-8 bg-slate-900 border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Wallet className="w-64 h-64 text-indigo-500" />
      </div>

      <div className="relative z-10 space-y-2">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-400" />
          Reverse Budget Demo
        </h3>
        <p className="text-slate-400 text-sm font-medium">
          Start with your budget. See how many requests you can actually afford.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Budget Slider */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Monthly Budget</label>
              <span className="text-sm font-bold text-indigo-400">${monthlyBudget}</span>
            </div>
            <Slider 
              value={[monthlyBudget]} 
              onValueChange={(v) => setMonthlyBudget(v[0])} 
              max={2000} 
              step={10}
              className="py-4"
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Select Model</label>
            <div className="grid grid-cols-2 gap-2">
              {demoModels.map((m, idx) => (
                <button
                  key={m.name}
                  onClick={() => setSelectedModelIdx(idx)}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-[10px] font-bold transition-all",
                    selectedModelIdx === idx 
                      ? "bg-indigo-500/20 border-indigo-500/50 text-white" 
                      : "bg-slate-800/50 border-white/5 text-slate-500 hover:bg-slate-800"
                  )}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Token Sliders */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Input Tokens</label>
              <input 
                type="number" 
                value={inputTokens} 
                onChange={(e) => setInputTokens(Number(e.target.value))}
                className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Output Tokens</label>
              <input 
                type="number" 
                value={outputTokens} 
                onChange={(e) => setOutputTokens(Number(e.target.value))}
                className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>
        </div>

        <div className="bg-indigo-500/5 rounded-3xl p-6 border border-indigo-500/10 flex flex-col justify-center space-y-6">
            <div className="space-y-1 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Monthly Capacity</p>
                <p className="text-5xl font-black text-white">{requestsPerMonth.toLocaleString()}</p>
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-tighter">Total Requests</p>
            </div>

            <div className="h-px bg-white/5 w-full" />

            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Daily Limit</p>
                    <p className="text-xl font-black text-white">≈ {requestsPerDay.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Cost/Request</p>
                    <p className="text-xl font-black text-white">${costPerRequest.toFixed(4)}</p>
                </div>
            </div>

            <div className="pt-2">
                <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <p className="text-[10px] text-amber-200/70 leading-tight">
                        Switching to <span className="text-amber-400 font-bold">GPT-4o Mini</span> would give you <span className="text-white font-bold">{Math.floor(monthlyBudget / ((inputTokens*0.00015 + outputTokens*0.0006)/1000000)).toLocaleString()}</span> requests for the same budget.
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
