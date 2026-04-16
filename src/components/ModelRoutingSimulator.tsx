"use client";

import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Zap, Target, TrendingDown, Layout, ArrowRight } from "lucide-react";

export default function ModelRoutingSimulator() {
  const [totalQueries, setTotalQueries] = useState(1000);
  const [easyPercentage, setEasyPercentage] = useState(80);
  
  const stats = useMemo(() => {
    const cheapPrice = 0.15; // e.g., 4o-mini
    const frontierPrice = 5.00; // e.g., o1
    
    // Scenario A: Everything to Frontier
    const standardCost = (totalQueries / 1000) * frontierPrice;
    
    // Scenario B: Routing
    const easyCount = totalQueries * (easyPercentage / 100);
    const hardCount = totalQueries - easyCount;
    
    const easyCost = (easyCount / 1000) * cheapPrice;
    const hardCost = (hardCount / 1000) * frontierPrice;
    const routedCost = easyCost + hardCost;
    
    const savings = ((standardCost - routedCost) / standardCost) * 100;

    return { standardCost, routedCost, savings, easyCount, hardCount };
  }, [totalQueries, easyPercentage]);

  return (
    <Card className="p-6 md:p-8 bg-slate-900/50 border-white/10 shadow-2xl space-y-8">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Layout className="w-5 h-5 text-plasma-400" />
          Model Routing Cost Simulator
        </h3>
        <p className="text-sm text-slate-400 font-medium">
          Prove "The Good Enough Principle" by routing simple tasks to cheaper models.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Queries</label>
              <span className="text-xs font-mono font-bold text-white">{totalQueries.toLocaleString()}</span>
            </div>
            <Slider 
              value={[totalQueries]} 
              min={100} 
              max={10000} 
              step={100} 
              onValueChange={([v]) => setTotalQueries(v)}
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">% of "Easy" Tasks</label>
              <span className="text-xs font-mono font-bold text-plasma-400">{easyPercentage}%</span>
            </div>
            <Slider 
              value={[easyPercentage]} 
              min={0} 
              max={100} 
              step={5} 
              onValueChange={([v]) => setEasyPercentage(v)}
              className="py-4"
            />
          </div>

          <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Routing Architecture</h4>
            <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-white">Input</div>
                <ArrowRight className="w-3 h-3 text-slate-600" />
                <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 rounded text-[10px] font-bold text-indigo-400">Router</div>
                <div className="flex flex-col gap-1">
                    <ArrowRight className="w-3 h-3 text-emerald-500 rotate-[-30deg]" />
                    <ArrowRight className="w-3 h-3 text-red-500 rotate-[30deg]" />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-bold text-emerald-400">Flash (Easy)</div>
                    <div className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[8px] font-bold text-red-400">Frontier (Hard)</div>
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Everything to Frontier</p>
              <p className="text-3xl font-black text-white font-mono">${stats.standardCost.toFixed(2)}</p>
            </div>
            <div className="p-6 bg-plasma-500/10 border border-plasma-500/30 rounded-3xl space-y-1">
              <p className="text-[10px] font-black text-plasma-400 uppercase tracking-widest">Routed Bill (Flash + Frontier)</p>
              <p className="text-3xl font-black text-white font-mono">${stats.routedCost.toFixed(2)}</p>
            </div>
          </div>

          <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] text-center space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Total Savings</h4>
            <p className="text-5xl font-black text-white font-mono">{stats.savings.toFixed(0)}%</p>
            <p className="text-[10px] text-slate-500 font-medium italic">
                Equivalent to ${ (stats.standardCost - stats.routedCost).toFixed(2) } extra profit
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
