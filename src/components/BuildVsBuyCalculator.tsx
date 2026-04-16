"use client";

import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Cpu, Zap, TrendingUp, TrendingDown, Info } from "lucide-react";

export default function BuildVsBuyCalculator() {
  const [tokensPerMo, setTokensPerMo] = useState(100); // Millions
  const [gpuHourlyRate, setGpuHourlyRate] = useState(1.50);
  const [apiPricePer1M, setApiPricePer1M] = useState(2.50);

  const stats = useMemo(() => {
    const apiMonthlyCost = tokensPerMo * apiPricePer1M;
    const gpuMonthlyCost = gpuHourlyRate * 24 * 30; // Sustained 24/7 run
    const buildIsCheaper = gpuMonthlyCost < apiMonthlyCost;
    const breakEvenTokens = (gpuMonthlyCost / apiPricePer1M);

    return { apiMonthlyCost, gpuMonthlyCost, buildIsCheaper, breakEvenTokens };
  }, [tokensPerMo, gpuHourlyRate, apiPricePer1M]);

  return (
    <Card className="p-6 md:p-8 bg-slate-900/50 border-white/10 shadow-2xl space-y-8">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          "Build vs. Buy" Break-Even Calculator
        </h3>
        <p className="text-sm text-slate-400 font-medium">
          Find the exact moment renting a dedicated GPU becomes cheaper than paying per token.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Volume (M tokens/mo)</label>
              <span className="text-xs font-mono font-bold text-white">{tokensPerMo}M</span>
            </div>
            <Slider 
              value={[tokensPerMo]} 
              min={10} 
              max={2000} 
              step={10} 
              onValueChange={([v]) => setTokensPerMo(v)}
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">API Price (per 1M)</label>
              <span className="text-xs font-mono font-bold text-indigo-400">${apiPricePer1M.toFixed(2)}</span>
            </div>
            <Slider 
              value={[apiPricePer1M * 100]} 
              min={10} 
              max={1500} 
              step={10} 
              onValueChange={([v]) => setApiPricePer1M(v / 100)}
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">GPU Rent (per hour)</label>
              <span className="text-xs font-mono font-bold text-plasma-400">${gpuHourlyRate.toFixed(2)}</span>
            </div>
            <Slider 
              value={[gpuHourlyRate * 100]} 
              min={20} 
              max={1000} 
              step={10} 
              onValueChange={([v]) => setGpuHourlyRate(v / 100)}
              className="py-4"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Managed API Cost</p>
              <p className="text-3xl font-black text-white font-mono">${stats.apiMonthlyCost.toLocaleString()}</p>
              <p className="text-[9px] text-slate-500 uppercase">Pay-per-token</p>
            </div>
            <div className={cn("p-6 border rounded-3xl space-y-1 transition-colors", 
              stats.buildIsCheaper ? "bg-indigo-500/10 border-indigo-500/30" : "bg-white/5 border-white/5"
            )}>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">GPU Rental (24/7)</p>
              <p className="text-3xl font-black text-white font-mono">${stats.gpuMonthlyCost.toLocaleString()}</p>
              <p className="text-[9px] text-slate-500 uppercase">Fixed Hourly</p>
            </div>
          </div>

          <div className={cn("p-6 rounded-[2rem] text-center space-y-2 transition-all",
            stats.buildIsCheaper ? "bg-indigo-500/20 border border-indigo-500/40" : "bg-slate-800/50 border border-white/5"
          )}>
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Recommended Strategy</h4>
            <p className={cn("text-2xl font-black uppercase italic", stats.buildIsCheaper ? "text-indigo-400" : "text-slate-400")}>
                {stats.buildIsCheaper ? "Rent & Host (Build)" : "Managed API (Buy)"}
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
                Break-even volume: <span className="text-white">{stats.breakEvenTokens.toFixed(0)}M tokens/mo</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl text-[10px] text-slate-400 font-medium italic">
        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
        If your traffic is "spiky" or inconsistent, stick to APIs even if Build is cheaper on paper. Rental costs accrue even when the GPU is idle!
      </div>
    </Card>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
