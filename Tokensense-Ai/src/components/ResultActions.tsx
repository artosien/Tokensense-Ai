"use client";

import { useTokenSenseStore } from "@/lib/store";
import { getModelById } from "@/lib/models";

interface ResultActionsProps {
  tokenCount: number;
  cost: number;
}

export function ResultActions({ tokenCount, cost }: ResultActionsProps) {
  const { selectedModelId } = useTokenSenseStore();
  const model = getModelById(selectedModelId);

  if (tokenCount === 0) return null;

  const handleCopy = () => {
    const text = `${tokenCount.toLocaleString()} tokens · $${cost.toFixed(6)} · ${model?.name} via Tokensense-Ai`;
    navigator.clipboard.writeText(text).catch(() => {
      alert("Copy failed");
    });
  };

  const handleExport = () => {
    const csv = `Model,Tokens,Cost\n${model?.name},${tokenCount},$${cost.toFixed(6)}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tokensense-ai-${Date.now()}.csv`);
    link.click();
  };

  const handleCompare = () => {
    const element = document.getElementById("comparison-section");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-800">
      <button
        onClick={handleCopy}
        className="text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        title="Copy to clipboard"
      >
        ↗︎ Copy
      </button>
      <button
        onClick={handleCompare}
        className="text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        title="Scroll to model comparison"
      >
        ⇄ More models
      </button>
      <button
        onClick={handleExport}
        className="text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        title="Download CSV"
      >
        ↓ Export
      </button>
    </div>
  );
}
