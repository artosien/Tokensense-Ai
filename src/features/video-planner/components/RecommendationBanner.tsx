"use client";

import React from "react";
import { Recommendation } from "../lib/recommendationEngine";
import { Lightbulb } from "lucide-react";
import { useTranslations } from "next-intl";

interface RecommendationBannerProps {
  recommendation: Recommendation;
}

export function RecommendationBanner({ recommendation }: RecommendationBannerProps) {
  const t = useTranslations("video_planner.recommendation");

  return (
    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-10">
        <Lightbulb className="w-24 h-24 text-indigo-400" />
      </div>
      
      <div className="relative space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
          {t("strategy_label")}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-white tracking-tight">{recommendation.headline}</h3>
          <p className="text-indigo-300/80 text-sm font-medium leading-relaxed max-w-xl">
            {recommendation.body}
          </p>
        </div>

        {recommendation.tips.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-[10px] font-black text-indigo-400/60 uppercase tracking-widest">{t("tips_label")}</p>
            <ul className="space-y-1.5">
              {recommendation.tips.map((tip, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-white/70 font-medium">
                  <div className="w-1 h-1 rounded-full bg-indigo-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
