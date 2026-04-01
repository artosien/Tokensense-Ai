"use client";

import React from "react";
import { TokenBreakdown, tokensToReadable } from "../lib/tokenCalculator";
import { CostEstimate } from "../lib/providerPricing";
import { Recommendation } from "../lib/recommendationEngine";
import { TokenBreakdownBar } from "./TokenBreakdownBar";
import { RecommendationBanner } from "./RecommendationBanner";
import { ProviderTable } from "./ProviderTable";
import { Button } from "@/components/ui/button";
import { Zap, Loader2, RefreshCcw, Info } from "lucide-react";
import { useTranslations } from "next-intl";

interface ResultsPanelProps {
  breakdown: TokenBreakdown;
  estimates: CostEstimate[];
  recommendation: Recommendation | null;
  onMeasureExactly: () => void;
  isMeasuring: boolean;
  hasApiKeys: boolean;
  onReset: () => void;
}

export function ResultsPanel({
  breakdown,
  estimates,
  recommendation,
  onMeasureExactly,
  isMeasuring,
  hasApiKeys,
  onReset,
}: ResultsPanelProps) {
  const t = useTranslations("video_planner.results");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {recommendation && <RecommendationBanner recommendation={recommendation} />}

      <div className="bg-card border border-border/40 rounded-3xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">{t("title")}</h3>
            <p className="text-sm text-muted-foreground font-medium">
              {t("footprint", { tokens: tokensToReadable(breakdown.total) })}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground hover:text-white gap-2">
            <RefreshCcw className="w-4 h-4" />
            {t("reset")}
          </Button>
        </div>

        <TokenBreakdownBar breakdown={breakdown} />

        <div className="pt-6 border-t border-border/40 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("cost_comparison")}</h4>
            <div className="flex items-center gap-2">
              {hasApiKeys ? (
                <Button 
                  size="sm" 
                  onClick={onMeasureExactly} 
                  disabled={isMeasuring}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-8 px-3 text-[10px] uppercase gap-2"
                >
                  {isMeasuring ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 fill-white" />}
                  {t("measure_exactly")}
                </Button>
              ) : (
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/20 px-2 py-1 rounded-md">
                  <Info className="w-3 h-3" />
                  {t("estimate_mode")}
                </div>
              )}
            </div>
          </div>

          <ProviderTable estimates={estimates} />
          
          <p className="text-[10px] text-muted-foreground/60 text-center italic">
            {t("pricing_disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
