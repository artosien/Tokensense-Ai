"use client";

import React from "react";
import { TokenBreakdown } from "../lib/tokenCalculator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TokenBreakdownBarProps {
  breakdown: TokenBreakdown;
}

export function TokenBreakdownBar({ breakdown }: TokenBreakdownBarProps) {
  const { frameTokens, audioTokens, promptTokens, total } = breakdown;

  if (total === 0) return null;

  const framePct = (frameTokens / total) * 100;
  const audioPct = (audioTokens / total) * 100;
  const promptPct = (promptTokens / total) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-mono mb-1">
        <span className="text-muted-foreground uppercase tracking-widest font-bold">Token Composition</span>
        <span className="text-white font-bold">{total.toLocaleString()} total</span>
      </div>
      
      <div className="h-4 w-full flex rounded-full overflow-hidden bg-muted/20 border border-border/20">
        <TooltipProvider>
          {frameTokens > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  style={{ width: `${framePct}%` }} 
                  className="h-full bg-indigo-500 hover:brightness-110 transition-all cursor-help"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-xs">Frames: {frameTokens.toLocaleString()} ({framePct.toFixed(1)}%)</p>
              </TooltipContent>
            </Tooltip>
          )}
          {audioTokens > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  style={{ width: `${audioPct}%` }} 
                  className="h-full bg-purple-500 hover:brightness-110 transition-all cursor-help"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-xs">Audio: {audioTokens.toLocaleString()} ({audioPct.toFixed(1)}%)</p>
              </TooltipContent>
            </Tooltip>
          )}
          {promptTokens > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  style={{ width: `${promptPct}%` }} 
                  className="h-full bg-emerald-500 hover:brightness-110 transition-all cursor-help"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-xs">Prompt: {promptTokens.toLocaleString()} ({promptPct.toFixed(1)}%)</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
        <LegendItem color="bg-indigo-500" label="Frames" value={frameTokens} />
        {audioTokens > 0 && <LegendItem color="bg-purple-500" label="Audio" value={audioTokens} />}
        <LegendItem color="bg-emerald-500" label="Prompt" value={promptTokens} />
      </div>
    </div>
  );
}

function LegendItem({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", color)} />
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-[10px] font-mono text-white">{value.toLocaleString()}</span>
    </div>
  );
}

import { cn } from "@/lib/utils";
