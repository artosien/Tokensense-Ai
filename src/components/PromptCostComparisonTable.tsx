"use client";

import React, { useMemo } from "react";
import { models } from "@/lib/models";
import { calculateCost } from "@/lib/costEngine";
import { countTokens } from "@/lib/tokenizer";
import { useTokenSenseStore } from "@/lib/store";
import { Trophy } from "lucide-react";
import { InfoTooltip } from "./InfoTooltip";

interface PromptCostComparisonTableProps {
  prompt: string;
  systemPrompt: string;
}

export default function PromptCostComparisonTable({
  prompt,
  systemPrompt,
}: PromptCostComparisonTableProps) {
  const { expectedOutputTokens, fileText } = useTokenSenseStore();

  const data = useMemo(() => {
    const combined = [systemPrompt, prompt, fileText].filter(Boolean).join("\n");
    const inputTokens = countTokens(combined);

    const rows = models.map((model) => {
      const cost = calculateCost(inputTokens, expectedOutputTokens, model);
      return {
        id: model.id,
        name: model.name,
        provider: model.provider,
        inputTokens,
        outputTokens: expectedOutputTokens,
        inputCost: cost.inputCost,
        outputCost: cost.outputCost,
        totalCost: cost.totalCost,
      };
    });

    // Sort by total cost ascending
    rows.sort((a, b) => a.totalCost - b.totalCost);
    return rows;
  }, [prompt, systemPrompt, expectedOutputTokens, fileText]);

  const formatCost = (v: number) => {
    if (v === 0) return "$0.00";
    if (v < 0.0001) return `$${v.toFixed(6)}`;
    if (v < 0.01) return `$${v.toFixed(4)}`;
    return `$${v.toFixed(4)}`;
  };

  const formatTokens = (n: number) => n.toLocaleString();

  if (data.length === 0) return null;

  const cheapestId = data[0].id;

  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
            Model Cost Comparison
          </h3>
          <InfoTooltip text="Output tokens are estimated based on your expected output setting. Actual costs may vary." />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Sorted by total cost — cheapest model first
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 text-xs text-muted-foreground uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-medium">Model</th>
              <th className="text-left px-5 py-3 font-medium">Provider</th>
              <th className="text-right px-5 py-3 font-medium">Input Tokens</th>
              <th className="text-right px-5 py-3 font-medium">
                <span className="flex items-center justify-end gap-1">
                  Output Tokens
                  <span className="text-[10px] normal-case font-normal text-muted-foreground/60">(est.)</span>
                </span>
              </th>
              <th className="text-right px-5 py-3 font-medium">Total Cost (USD)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const isCheapest = row.id === cheapestId;
              return (
                <tr
                  key={row.id}
                  className={`border-b border-border/20 transition-colors hover:bg-muted/30 ${
                    isCheapest ? "bg-cyan-500/5" : ""
                  }`}
                >
                  <td className="px-5 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      {isCheapest && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-400 whitespace-nowrap">
                          <Trophy className="w-2.5 h-2.5" />
                          Cheapest
                        </span>
                      )}
                      <span>{row.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{row.provider}</td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums">
                    {formatTokens(row.inputTokens)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums text-muted-foreground">
                    {formatTokens(row.outputTokens)}
                  </td>
                  <td className={`px-5 py-3 text-right font-mono tabular-nums font-semibold ${
                    isCheapest ? "text-cyan-400" : ""
                  }`}>
                    {formatCost(row.totalCost)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border/30">
        {data.map((row) => {
          const isCheapest = row.id === cheapestId;
          return (
            <div
              key={row.id}
              className={`px-4 py-3 ${isCheapest ? "border-l-2 border-l-cyan-400 bg-cyan-500/5" : ""}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{row.name}</span>
                  {isCheapest && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-400">
                      <Trophy className="w-2.5 h-2.5" />
                      Cheapest
                    </span>
                  )}
                </div>
                <span className={`font-mono text-sm font-semibold ${isCheapest ? "text-cyan-400" : ""}`}>
                  {formatCost(row.totalCost)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{row.provider}</span>
                <span>·</span>
                <span className="font-mono">{formatTokens(row.inputTokens)} in</span>
                <span>·</span>
                <span className="font-mono">{formatTokens(row.outputTokens)} out</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
