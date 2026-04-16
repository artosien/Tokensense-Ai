"use client";

import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, TrendingDown, Users, DollarSign, AlertCircle } from "lucide-react";

export default function UnitEconomicsSimulator() {
  const [queriesPerUser, setQueriesPerUser] = useState(50);
  const [revenuePerUser, setRevenuePerUser] = useState(20);
  const [costPerQuery, setCostPerQuery] = useState(0.05);

  const stats = useMemo(() => {
    const totalCost = queriesPerUser * costPerQuery;
    const profit = revenuePerUser - totalCost;
    const margin = (profit / revenuePerUser) * 100;
    const isLoss = profit < 0;

    return { totalCost, profit, margin, isLoss };
  }, [queriesPerUser, revenuePerUser, costPerQuery]);

  return (
    <Card className="p-6 md:p-8 bg-slate-900/50 border-white/10 shadow-2xl space-y-8">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          AI SaaS Unit Economics Simulator
        </h3>
        <p className="text-sm text-slate-400 font-medium">
          Visualize how "Power Users" and high query frequency can flip your margins from green to red.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subscription Price / Mo</label>
              <span className="text-xs font-mono font-bold text-emerald-400">${revenuePerUser}</span>
            </div>
            <Slider 
              value={[revenuePerUser]} 
              min={5} 
              max={100} 
              step={5} 
              onValueChange={([v]) => setRevenuePerUser(v)}
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Queries / User / Mo</label>
              <span className="text-xs font-mono font-bold text-indigo-400">{queriesPerUser}</span>
            </div>
            <Slider 
              value={[queriesPerUser]} 
              min={1} 
              max={1000} 
              step={10} 
              onValueChange={([v]) => setQueriesPerUser(v)}
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Avg Cost / Query</label>
              <span className="text-xs font-mono font-bold text-plasma-400">${costPerQuery.toFixed(3)}</span>
            </div>
            <Slider 
              value={[costPerQuery * 1000]} 
              min={1} 
              max={500} 
              step={1} 
              onValueChange={([v]) => setCostPerQuery(v / 1000)}
              className="py-4"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Monthly Cost</p>
              <p className="text-3xl font-black text-white font-mono">${stats.totalCost.toFixed(2)}</p>
            </div>
            <div className={cn("p-6 border rounded-3xl space-y-1 transition-colors duration-500", 
              stats.isLoss ? "bg-red-500/10 border-red-500/30" : "bg-emerald-500/10 border-emerald-500/30"
            )}>
              <p className={cn("text-[10px] font-black uppercase tracking-widest", 
                stats.isLoss ? "text-red-400" : "text-emerald-400"
              )}>Monthly Net Profit</p>
              <div className="flex items-center gap-2">
                {stats.isLoss ? <TrendingDown className="w-6 h-6 text-red-400" /> : <TrendingUp className="w-6 h-6 text-emerald-400" />}
                <p className="text-3xl font-black text-white font-mono">${stats.profit.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Profit Margin</span>
                <span className={stats.isLoss ? "text-red-400" : "text-emerald-400"}>{stats.margin.toFixed(1)}%</span>
            </div>
            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                    className={cn("h-full transition-all duration-1000", stats.isLoss ? "bg-red-500" : "bg-emerald-500")}
                    style={{ width: `${Math.max(0, Math.min(100, stats.margin))}%` }}
                />
            </div>
          </div>
        </div>
      </div>

      <div className={cn("flex items-center gap-3 p-4 rounded-2xl text-[10px] font-medium italic transition-colors",
        stats.isLoss ? "bg-red-500/5 border border-red-500/20 text-red-400" : "bg-indigo-500/5 border border-indigo-500/20 text-slate-400"
      )}>
        <AlertCircle className={cn("w-4 h-4 shrink-0", stats.isLoss ? "text-red-400" : "text-indigo-400")} />
        {stats.isLoss 
          ? `WARNING: You are losing $${Math.abs(stats.profit).toFixed(2)} per user. Consider implementing token quotas or a higher tier.`
          : `You are currently profitable. Your break-even point is ${Math.floor(revenuePerUser / costPerQuery)} queries per month.`
        }
      </div>
    </Card>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
