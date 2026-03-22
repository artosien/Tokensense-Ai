"use client";

import { useState } from "react";
import { useTokenSenseStore } from "@/lib/store";
import { getModelById } from "@/lib/models";
import { calculateCost } from "@/lib/costEngine";
import { Check, Copy, Download, ArrowRight } from "lucide-react";

interface ResultActionsProps {
  tokenCount: number;
  cost: number;
}

export function ResultActions({ tokenCount, cost }: ResultActionsProps) {
  const { selectedModelId, inputTokenCount, fileTokenCount, expectedOutputTokens } = useTokenSenseStore();
  const model = getModelById(selectedModelId);
  const [copied, setCopied] = useState(false);

  if (tokenCount === 0) return null;

  const totalInputTokens = inputTokenCount + fileTokenCount;
  const costs = model ? calculateCost(totalInputTokens, expectedOutputTokens, model) : null;

  const formatCost = (v: number) => {
    if (v === 0) return "$0.00";
    if (v < 0.0001) return `$${v.toFixed(6)}`;
    if (v < 0.01) return `$${v.toFixed(4)}`;
    return `$${v.toFixed(4)}`;
  };

  const handleCopy = () => {
    const lines = [
      `TokenSense AI Estimate`,
      `Model: ${model?.name ?? "Unknown"}`,
      `Input: ${totalInputTokens.toLocaleString()} tokens → ${formatCost(costs?.inputCost ?? 0)}`,
      `Output: ${expectedOutputTokens.toLocaleString()} tokens → ${formatCost(costs?.outputCost ?? 0)}`,
      `Total: ${formatCost(costs?.totalCost ?? cost)}`,
      `tokensense-ai.com`,
    ].join("\n");

    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      alert("Copy failed — please copy manually.");
    });
  };

  const handleExport = () => {
    const csv =
      `Model,Input Tokens,Input Cost,Output Tokens,Output Cost,Total Cost\n` +
      `${model?.name},${totalInputTokens},${formatCost(costs?.inputCost ?? 0)},${expectedOutputTokens},${formatCost(costs?.outputCost ?? 0)},${formatCost(costs?.totalCost ?? cost)}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `tokensense-ai-${Date.now()}.csv`);
    link.click();
  };

  const handleCompare = () => {
    const element = document.getElementById("comparison-section");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-800/60">
      {/* Copy — primary action */}
      <button
        type="button"
        onClick={handleCopy}
        className={`
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono
          border transition-all duration-200
          ${copied
            ? "border-green-500/50 bg-green-500/10 text-green-400"
            : "border-cyan-500/30 bg-cyan-500/8 text-cyan-400 hover:bg-cyan-500/15 hover:border-cyan-400/60"
          }
        `}
      >
        {copied ? (
          <><Check className="w-3.5 h-3.5" /><span>Copied!</span></>
        ) : (
          <><Copy className="w-3.5 h-3.5" /><span>Copy Estimate</span></>
        )}
      </button>

      <button
        type="button"
        onClick={handleCompare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border border-slate-700/50 bg-slate-800/30 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-200"
      >
        <ArrowRight className="w-3.5 h-3.5" />
        <span>More Models</span>
      </button>

      <button
        type="button"
        onClick={handleExport}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border border-slate-700/50 bg-slate-800/30 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-200"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Export CSV</span>
      </button>
    </div>
  );
}
