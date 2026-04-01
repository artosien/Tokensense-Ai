"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTokenSenseStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Leaf, Activity, Weight } from "lucide-react";
import { useTranslations } from "next-intl";

export function SamplePromptSelection() {
  const t = useTranslations("samples");
  const { setUserPrompt } = useTokenSenseStore();
  const [activeType, setActiveType] = useState<string | null>(null);

  const SAMPLE_PROMPTS = {
    light: {
      label: t("light_label"),
      icon: <Leaf className="w-3.5 h-3.5" />,
      description: t("light_desc"),
      text: t("light_text"),
    },
    medium: {
      label: t("medium_label"),
      icon: <Activity className="w-3.5 h-3.5" />,
      description: t("medium_desc"),
      text: t("medium_text"),
    },
    heavy: {
      label: t("heavy_label"),
      icon: <Weight className="w-3.5 h-3.5" />,
      description: t("heavy_desc"),
      text: t("heavy_text"),
    },
  };

  const applySample = (type: keyof typeof SAMPLE_PROMPTS) => {
    setActiveType(type);
    setUserPrompt(SAMPLE_PROMPTS[type].text);
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {t("title")}
        </span>
        <div className="flex-1 h-px bg-border/40" />
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.entries(SAMPLE_PROMPTS) as [keyof typeof SAMPLE_PROMPTS, typeof SAMPLE_PROMPTS['light']][]).map(([key, sample]) => {
          const isActive = activeType === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => applySample(key)}
              title={sample.description}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200",
                isActive
                  ? "border-indigo-400 bg-indigo-500/15 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                  : "border-border/50 bg-card/30 text-muted-foreground hover:border-indigo-500/60 hover:bg-indigo-500/8 hover:text-indigo-400"
              )}
            >
              <span className={cn("transition-colors", isActive ? "text-indigo-400" : "text-muted-foreground")}>
                {sample.icon}
              </span>
              <span>{sample.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-indigo-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
