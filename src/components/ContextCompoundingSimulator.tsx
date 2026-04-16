"use client";

import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { MessageSquare, Zap, TrendingUp, AlertCircle, History } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContextCompoundingSimulator() {
  const [turns, setTurns] = useState(10);
  const [userTokens, setUserTokens] = useState(50);
  const [aiTokens, setAiTokens] = useState(150);

  const stats = useMemo(() => {
    const data = [];
    let totalInput = 0;
    let totalCost = 0;
    
    for (let i = 1; i <= turns; i++) {
      // In Turn i, input is all previous turns (User + AI) + Current User Prompt
      const currentInput = (i === 1) ? userTokens : totalInput + userTokens;
      const currentOutput = aiTokens;
      const turnTotal = currentInput + currentOutput;
      
      data.push({
        turn: i,
        input: currentInput,
        output: currentOutput,
        total: turnTotal
      });
      
      totalInput += userTokens + aiTokens;
      totalCost += turnTotal;
    }
    
    return { data, totalCost };
  }, [turns, userTokens, aiTokens]);

  return (
    <Card className="p-6 md:p-8 bg-slate-900/50 border-white/10 shadow-2xl space-y-8">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          Compounding Cost Simulator
        </h3>
        <p className="text-sm text-slate-400 font-medium">
          Visualize how "Stateless" APIs cause your bill to snowball as the conversation grows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Conversation Turns</label>
              <span className="text-xs font-mono font-bold text-indigo-400">{turns}</span>
            </div>
            <Slider 
              value={[turns]} 
              min={1} 
              max={20} 
              step={1} 
              onValueChange={([v]) => setTurns(v)}
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">User Tokens / Turn</label>
              <span className="text-xs font-mono font-bold text-indigo-400">{userTokens}</span>
            </div>
            <Slider 
              value={[userTokens]} 
              min={10} 
              max={500} 
              step={10} 
              onValueChange={([v]) => setUserTokens(v)}
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Tokens / Turn</label>
              <span className="text-xs font-mono font-bold text-indigo-400">{aiTokens}</span>
            </div>
            <Slider 
              value={[aiTokens]} 
              min={50} 
              max={1000} 
              step={50} 
              onValueChange={([v]) => setAiTokens(v)}
              className="py-4"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="bg-black/40 rounded-2xl border border-white/5 p-4 h-[300px] overflow-y-auto custom-scrollbar space-y-2">
            {stats.data.map((d) => (
              <div key={d.turn} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-indigo-500/30 transition-all">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[10px] font-black text-indigo-400">
                  T{d.turn}
                </div>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-indigo-500/60" 
                    style={{ width: `${Math.min(100, (d.input / stats.data[stats.data.length-1].total) * 100)}%` }} 
                  />
                  <div 
                    className="h-full bg-emerald-500/60" 
                    style={{ width: `${Math.min(100, (d.output / stats.data[stats.data.length-1].total) * 100)}%` }} 
                  />
                </div>
                <div className="text-[10px] font-mono font-bold text-slate-400 w-24 text-right">
                  {d.total.toLocaleString()} tkns
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Session Payload</p>
              <p className="text-2xl font-black text-white font-mono">{stats.totalCost.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Inefficiency Ratio</p>
              <p className="text-2xl font-black text-white font-mono">{(stats.totalCost / (turns * (userTokens + aiTokens))).toFixed(1)}x</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl text-[10px] text-slate-400 font-medium italic">
        <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
        Notice how Turn {turns} costs {Math.round(stats.data[stats.data.length-1].total / stats.data[0].total)}x more than Turn 1, even though you only typed {userTokens} tokens.
      </div>
    </Card>
  );
}
