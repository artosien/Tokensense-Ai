"use client";

import React from "react";
import { CostEstimate } from "../lib/providerPricing";
import { ExternalLink, AlertTriangle, CheckCircle2, TrendingDown, Star, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ProviderTableProps {
  estimates: CostEstimate[];
}

export function ProviderTable({ estimates }: ProviderTableProps) {
  const t = useTranslations("video_planner.table");
  const cheapest = estimates[0];
  const mostExpensive = estimates[estimates.length - 1];

  const formatCost = (v: number) => {
    if (v === 0) return "$0.00";
    if (v < 0.0001) return `$${v.toFixed(6)}`;
    if (v < 0.01) return `$${v.toFixed(4)}`;
    return `$${v.toFixed(4)}`;
  };

  const getQualityScore = (estimate: CostEstimate) => {
    let score = 50;
    if (estimate.model.supportsNativeVideo) score += 20;
    if (estimate.model.supportsAudio) score += 10;
    if (estimate.withinContextWindow) score += 10;
    // Penalize high cost slightly for "value" score, but we want quality
    if (estimate.totalCost > 0.01) score -= 5;
    return Math.min(100, score);
  };

  return (
    <div className="rounded-3xl border border-border/40 overflow-hidden bg-card/50">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/40 bg-muted/20">
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("col_model")}</th>
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Quality Score</th>
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">{t("col_cost")}</th>
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("col_status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {estimates.map((estimate) => {
              const isCheapest = estimate.model.id === cheapest.model.id;
              const qualityScore = getQualityScore(estimate);

              return (
                <tr 
                  key={estimate.model.id}
                  className={cn(
                    "transition-colors hover:bg-white/5",
                    isCheapest ? "bg-indigo-500/5" : ""
                  )}
                >
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{estimate.model.displayName}</span>
                        {isCheapest && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-tighter border border-indigo-500/30">
                            <TrendingDown className="w-2.5 h-2.5" />
                            {t("best_value")}
                          </span>
                        )}
                        {qualityScore >= 80 && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-tighter border border-amber-500/30">
                            <Star className="w-2.5 h-2.5 fill-amber-400" />
                            Premium
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground font-medium">{estimate.model.provider}</span>
                        <a 
                          href={estimate.model.apiDocsUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground/40 hover:text-indigo-400 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000",
                            qualityScore > 75 ? "bg-emerald-500" : qualityScore > 50 ? "bg-indigo-500" : "bg-amber-500"
                          )} 
                          style={{ width: `${qualityScore}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground font-mono">{qualityScore}/100</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className={cn(
                        "text-lg font-black font-mono",
                        isCheapest ? "text-indigo-400" : "text-white"
                      )}>
                        {formatCost(estimate.totalCost)}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        ${estimate.model.inputPricePerKToken}/1K
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2">
                      {estimate.warningMessage ? (
                        <div className="flex items-center gap-2 text-amber-400">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span className="text-[10px] font-bold leading-tight max-w-[120px]">{estimate.warningMessage}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{t("ready")}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 w-fit">
                        <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                        <span className="text-[9px] font-black uppercase text-emerald-400">Live</span>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
