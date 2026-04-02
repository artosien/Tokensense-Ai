"use client";

import React from "react";
import { ProviderModel } from "../lib/providerPricing";
import { TokenBreakdown } from "../lib/tokenCalculator";
import { cn } from "@/lib/utils";
import { Layers, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ContextWindowVisualizerProps {
  model: ProviderModel;
  breakdown: TokenBreakdown;
}

export function ContextWindowVisualizer({ model, breakdown }: ContextWindowVisualizerProps) {
  const usagePercent = Math.min(100, (breakdown.total / model.contextWindowTokens) * 100);
  const isDanger = usagePercent > 90;
  const isWarning = usagePercent > 70;

  return (
    <div className="space-y-3 bg-card/30 border border-border/20 rounded-2xl p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Layers className={cn("w-4 h-4", isDanger ? "text-red-400" : isWarning ? "text-amber-400" : "text-indigo-400")} />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Context Window Usage</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
          <span className={cn(isDanger ? "text-red-400" : isWarning ? "text-amber-400" : "text-white")}>
            {Math.round(breakdown.total / 1000)}k
          </span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{(model.contextWindowTokens / 1000).toFixed(0)}k tokens</span>
        </div>
      </div>

      <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            isDanger ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]" : 
            isWarning ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]" : 
            "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
          )}
          style={{ width: `${usagePercent}%` }}
        />
      </div>

      <div className="flex justify-between items-center px-1">
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          {usagePercent > 100 ? "Exceeds model capacity" : `${usagePercent.toFixed(1)}% capacity used`}
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3 h-3 text-muted-foreground/50" />
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900 border-white/10 text-[10px] max-w-[200px]">
              The context window includes the video frames, audio tokens, and your prompt. Exceeding this limit will cause API errors or requires chunking.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
