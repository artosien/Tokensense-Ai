"use client";

import { useEffect, useRef, useState } from "react";

interface CostBreakdownBarProps {
  inputCost: number;
  outputCost: number;
  cacheSavings?: number;
}

export function CostBreakdownBar({ inputCost, outputCost, cacheSavings = 0 }: CostBreakdownBarProps) {
  const [mounted, setMounted] = useState(false);
  const total = inputCost + outputCost;

  useEffect(() => {
    // Small delay to trigger CSS transition from 0
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  if (total === 0) return null;

  const inputPct = (inputCost / total) * 100;
  const outputPct = (outputCost / total) * 100;

  const fmt = (v: number) => {
    if (v === 0) return "$0.00";
    if (v < 0.0001) return `$${v.toFixed(6)}`;
    if (v < 0.01) return `$${v.toFixed(4)}`;
    return `$${v.toFixed(4)}`;
  };

  const pct = (v: number) => `${v.toFixed(1)}%`;

  return (
    <div className="space-y-2">
      <div className="text-xs font-mono text-muted-foreground/60 tracking-wider uppercase mb-1.5">
        Cost Breakdown
      </div>

      {/* Stacked bar */}
      <div className="relative h-5 rounded-full overflow-hidden bg-slate-800/60 border border-slate-700/40">
        <div className="absolute inset-0 flex h-full">
          {/* Input segment */}
          <div
            className="h-full relative group transition-all duration-700 ease-out"
            style={{ width: mounted ? `${inputPct}%` : "0%" }}
          >
            <div className="h-full bg-gradient-to-r from-plasma-500 to-plasma-400" />
            {/* Hover label */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[9px] font-mono font-bold text-navy-950 text-[#0d1117] whitespace-nowrap px-1">
                Input {pct(inputPct)}
              </span>
            </div>
          </div>

          {/* Output segment */}
          <div
            className="h-full relative group transition-all duration-700 ease-out delay-100"
            style={{ width: mounted ? `${outputPct}%` : "0%" }}
          >
            <div className="h-full bg-gradient-to-r from-slate-500 to-slate-400" />
            {/* Hover label */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[9px] font-mono font-bold text-slate-900 whitespace-nowrap px-1">
                Output {pct(outputPct)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/70">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-plasma-400 inline-block" />
          Input
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-slate-400 inline-block" />
          Output
        </span>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-800/40">
        {[
          { label: "Input", value: fmt(inputCost), sub: pct(inputPct) },
          { label: "Output", value: fmt(outputCost), sub: pct(outputPct) },
          { label: "Total", value: fmt(total), sub: "100%" },
        ].map((col) => (
          <div key={col.label} className="flex flex-col items-end">
            <span className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-wider">
              {col.label}
            </span>
            <span className="text-xs font-mono font-semibold text-foreground tabular-nums">
              {col.value}
            </span>
            <span className="text-[9px] font-mono text-muted-foreground/40">{col.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

