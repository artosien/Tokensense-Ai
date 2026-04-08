"use client";

import React, { useState } from "react";
import { CostEstimate } from "../lib/providerPricing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface BudgetReverseCalculatorProps {
  estimates: CostEstimate[];
}

export function BudgetReverseCalculator({ estimates }: BudgetReverseCalculatorProps) {
  const [budget, setBudget] = useState<number>(10);
  const t = useTranslations("video_planner.budget");

  return (
    <div className="bg-card border border-border/40 rounded-3xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">{t("title")}</h3>
          <p className="text-xs text-muted-foreground font-medium">{t("subtitle")}</p>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("monthly_budget")}</Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">$</span>
          <Input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Math.max(0, parseFloat(e.target.value) || 0))}
            className="pl-8 bg-background/50 border-border/40 h-12 text-lg font-black font-mono text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {estimates.slice(0, 5).map((est) => {
          const count = est.totalCost > 0 ? Math.floor(budget / est.totalCost) : 0;
          return (
            <div 
              key={est.model.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-white uppercase tracking-tight">{est.model.displayName}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{t("per_video", { cost: `$${est.totalCost.toFixed(4)}` })}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xl font-black text-indigo-400 font-mono">{count.toLocaleString()}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">{t("videos_per_month")}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-border/40">
        <div className="flex items-start gap-2 text-amber-400/80">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <p className="text-[10px] italic leading-tight">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
