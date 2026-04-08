"use client";

import React from "react";
import { CostEstimate, PROVIDER_MODELS } from "../lib/providerPricing";
import { VideoMetadata } from "../lib/videoAnalyzer";
import { TokenConfig, calculateTokens } from "../lib/tokenCalculator";
import { ProviderTable } from "./ProviderTable";
import { LayoutGrid } from "lucide-react";
import { useTranslations } from "next-intl";

interface BatchResultsPanelProps {
  batchItems: VideoMetadata[];
  config: TokenConfig;
}

export function BatchResultsPanel({ batchItems, config }: BatchResultsPanelProps) {
  const t = useTranslations("video_planner.batch");

  const batchEstimates = React.useMemo(() => {
    // Calculate total cost for each provider across all items in batch
    return PROVIDER_MODELS.map(model => {
      let totalBatchCost = 0;
      let totalTokens = 0;
      
      batchItems.forEach(item => {
        const breakdown = calculateTokens(item, config);
        const effectiveTokens = model.supportsAudio
          ? breakdown.total
          : breakdown.total - breakdown.audioTokens;
        
        totalBatchCost += (effectiveTokens / 1000) * model.inputPricePerKToken;
        totalTokens += effectiveTokens;
      });

      return {
        model,
        totalCost: totalBatchCost,
        effectiveTokens: totalTokens,
        withinContextWindow: true, // We assume batch items are individually within window
        mode: "estimate" as const,
      };
    }).sort((a, b) => a.totalCost - b.totalCost);
  }, [batchItems, config]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <LayoutGrid className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">{t("comparison_title")}</h3>
            <p className="text-xs text-muted-foreground font-medium">{t("comparison_desc", { count: batchItems.length })}</p>
          </div>
        </div>
      </div>

      <ProviderTable estimates={batchEstimates} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{t("cheapest_option")}</p>
          <p className="text-lg font-bold text-white leading-tight">{batchEstimates[0].model.displayName}</p>
          <p className="text-2xl font-black text-emerald-400 font-mono">${batchEstimates[0].totalCost.toFixed(2)}</p>
        </div>
        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-4 space-y-2">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{t("enterprise_premium")}</p>
          <p className="text-lg font-bold text-white leading-tight">{batchEstimates.find(e => e.model.provider === "Anthropic")?.model.displayName || "N/A"}</p>
          <p className="text-2xl font-black text-indigo-400 font-mono">${batchEstimates.find(e => e.model.provider === "Anthropic")?.totalCost.toFixed(2) || "0.00"}</p>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 space-y-2">
          <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">{t("potential_savings")}</p>
          <p className="text-lg font-bold text-white leading-tight">{t("by_switching")}</p>
          <p className="text-2xl font-black text-amber-400 font-mono">
            ${(batchEstimates[batchEstimates.length - 1].totalCost - batchEstimates[0].totalCost).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
