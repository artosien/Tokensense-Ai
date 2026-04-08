"use client";

import { useState, useEffect } from "react";
import { useTokenSenseStore } from "@/lib/store";
import { getModelById } from "@/lib/models";
import { calculateCost } from "@/lib/costEngine";
import { Check, Copy, ArrowRight } from "lucide-react";
import { cn, triggerHaptic } from "@/lib/utils";

import { usePathname } from "next/navigation";

/**
 * StickyResultsBar - appears at the top of the viewport after first calculation.
 * Shows Total - Input - Output costs with a copy button.
 */
export function StickyResultsBar() {
  const pathname = usePathname();
  const {
    inputTokenCount,
    fileTokenCount,
    expectedOutputTokens,
    selectedModelId,
    activeTab,
    setActiveTab,
  } = useTokenSenseStore();

  const [hasCalculated, setHasCalculated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  const totalInputTokens = inputTokenCount + fileTokenCount;
  const model = getModelById(selectedModelId);

  const cost =
    model && totalInputTokens > 0
      ? calculateCost(totalInputTokens, expectedOutputTokens, model)
      : null;

  // Trigger once we have a real calculation
  useEffect(() => {
    if (totalInputTokens > 0 && model) {
      if (!hasCalculated) {
        setHasCalculated(true);
        // Small delay so the animation is noticeable
        setTimeout(() => {
          setVisible(true);
          triggerHaptic(30); 
        }, 200);
      }
    }
  }, [totalInputTokens, model, hasCalculated]);

  const formatCost = (v: number) => {
    if (v === 0) return "$0.00";
    if (v < 0.0001) return `$${v.toFixed(6)}`;
    if (v < 0.01) return `$${v.toFixed(4)}`;
    return `$${v.toFixed(4)}`;
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cost || !model) return;
    const text =
      `TokenSense AI Estimate\n` +
      `Model: ${model.name}\n` +
      `Input: ${totalInputTokens.toLocaleString()} tokens ? ${formatCost(cost.inputCost)}\n` +
      `Output: ${expectedOutputTokens.toLocaleString()} tokens ? ${formatCost(cost.outputCost)}\n` +
      `Total: ${formatCost(cost.totalCost)}\n` +
      `tokensense-ai.com`;

    navigator.clipboard.writeText(text).then(() => {
      triggerHaptic([20, 10, 20]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleTabSwitch = () => {
    if (pathname === "/") {
      triggerHaptic(15);
      setActiveTab("results");
      // Scroll to top if on home
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!hasCalculated || !cost || !model) return null;

  // Hide when on results tab of home page to avoid duplication
  const isHidden = pathname === "/" && activeTab === "results";

  return (
    <div
      onClick={handleTabSwitch}
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        pathname === "/" ? "cursor-pointer" : "cursor-default",
        (visible && !isHidden) ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
    >
      <div className="bg-[#040c0e]/95 backdrop-blur-md border-b border-plasma-500/30 shadow-[0_4px_20px_rgba(0,229,255,0.12)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 md:h-10 gap-4">
            <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar flex-1">
              <span className="text-xs font-mono font-bold text-plasma-400 shrink-0">
                {formatCost(cost.totalCost)}
              </span>
              <span className="text-slate-600 mx-1 shrink-0">-</span>
              <span className="text-[10px] font-mono text-slate-400 shrink-0 hidden xs:inline">
                {totalInputTokens.toLocaleString()} in
              </span>
              <ArrowRight className="w-2.5 h-2.5 text-slate-600 mx-1 shrink-0 hidden xs:inline" />
              <span className="text-[10px] font-mono text-slate-400 shrink-0 hidden xs:inline">
                {expectedOutputTokens.toLocaleString()} out
              </span>
              <span className="text-slate-600 mx-1.5 shrink-0 hidden md:inline">-</span>
              <span className="text-[10px] font-mono text-slate-500 shrink-0 hidden md:inline">
                {model.name}
              </span>
              
              <span className="text-[9px] font-bold text-plasma-500/50 uppercase tracking-tighter ml-auto md:hidden">
                {"Tap for details ?"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              title="Copy estimate to clipboard"
              className={cn(
                "shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                "border transition-all duration-200",
                copied
                  ? "border-green-500/50 bg-green-500/10 text-green-400"
                  : "border-plasma-500/30 bg-plasma-500/8 text-plasma-400/70 hover:text-plasma-400 hover:border-plasma-400/60 hover:bg-plasma-500/15"
              )}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
