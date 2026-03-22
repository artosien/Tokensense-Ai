"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTokenSenseStore } from "@/lib/store";
import { models, getModelById, ModelConfig } from "@/lib/models";
import { calculateCost, calculateLoopCost } from "@/lib/costEngine";
import CostGauge from "./CostGauge";
import CostDisclaimer from "./CostDisclaimer";
import { Zap, ArrowRight, Lightbulb, Layers, Link2, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TermTooltip } from "./TermTooltip";
import { PriceTimestamp } from "./PriceTimestamp";
import { ResultActions } from "./ResultActions";
import { CompareMode } from "./CompareMode";
import { ModelPickerModal } from "./ModelPickerModal";
import { CostBreakdownBar } from "./CostBreakdownBar";
import { useShareableUrl } from "@/hooks/useShareableUrl";
import { TooltipKey } from "@/lib/tooltips";
import Link from "next/link";
import { cn, triggerHaptic } from "@/lib/utils";

export default function MetricsDashboard() {
    const {
        inputTokenCount,
        expectedOutputTokens,
        selectedModelId,
        agentLoopEnabled,
        agentIterations,
        avgNewInputTokensPerTurn,
        fileTokenCount,
        setSelectedModelId,
    } = useTokenSenseStore();

    const [compareMode, setCompareMode] = useState(false);
    const [shareCopied, setShareCopied] = useState(false);
    const { copyShareUrl, getShareUrl } = useShareableUrl();

    const model = getModelById(selectedModelId) ?? models[0];
    const totalInputTokens = inputTokenCount + fileTokenCount;

    const singleCost = useMemo(
        () => calculateCost(totalInputTokens, expectedOutputTokens, model),
        [totalInputTokens, expectedOutputTokens, model]
    );

    const totalCost = useMemo(() => {
        if (!agentLoopEnabled || agentIterations <= 1) return singleCost.totalCost;
        const result = calculateLoopCost(totalInputTokens, expectedOutputTokens, avgNewInputTokensPerTurn, agentIterations, model);
        return result.totals.totalCost;
    }, [agentLoopEnabled, agentIterations, avgNewInputTokensPerTurn, totalInputTokens, expectedOutputTokens, model, singleCost]);

    const formatCost = (v: number) => {
        if (v === 0) return "$0.00";
        if (v < 0.0001) return `$${v.toFixed(6)}`;
        if (v < 0.01) return `$${v.toFixed(4)}`;
        return `$${v.toFixed(4)}`;
    };

    const formatTokens = (n: number) => n.toLocaleString();

    // Smart Routing Logic
    const isSimplePrompt = totalInputTokens > 0 && totalInputTokens < 10000 && expectedOutputTokens <= 4000;    

    const recommendedModel = useMemo<ModelConfig | null>(() => {
        if (!isSimplePrompt) return null;
        if (model.inputPricePer1M <= 0.50) return null;
        const cheapModels = models.filter(m => m.inputPricePer1M <= 0.50);
        if (cheapModels.length === 0) return null;
        return cheapModels.reduce((prev, curr) =>
            (curr.inputPricePer1M + curr.outputPricePer1M) < (prev.inputPricePer1M + prev.outputPricePer1M) ? curr : prev
        );
    }, [isSimplePrompt, model.inputPricePer1M, model.outputPricePer1M]);

    const handleApplyRecommendation = () => {
        if (recommendedModel) {
          triggerHaptic(15);
          setSelectedModelId(recommendedModel.id);
        }
    };

    const multiplier = recommendedModel
        ? Math.round(model.inputPricePer1M / recommendedModel.inputPricePer1M)
        : 0;

    const handleShare = async () => {
        // M12: Use Web Share API if available on mobile
        if (typeof navigator !== "undefined" && navigator.share && window.innerWidth < 768) {
          try {
            const url = getShareUrl({
              modelId: selectedModelId,
              inputTokens: totalInputTokens,
              outputTokens: expectedOutputTokens,
            });
            await navigator.share({
              title: 'TokenSense AI Estimate',
              text: `${model.name} - ${totalInputTokens.toLocaleString()} tokens → ${formatCost(totalCost)}`,
              url: url
            });
            triggerHaptic(30);
            return;
          } catch (e) {
            // If user cancels or it fails, fallback to clipboard
            console.warn("Share failed", e);
          }
        }

        const result = await copyShareUrl({
            modelId: selectedModelId,
            inputTokens: totalInputTokens,
            outputTokens: expectedOutputTokens,
        });
        if (result !== "failed") {
            triggerHaptic([20, 10, 20]); // M14: double tap feel
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2500);
        }
    };

    // -- Compare Mode UI ---------------------------------------------------------
    if (compareMode) {
        return (
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-5 pb-5">
                    <CompareMode onClose={() => setCompareMode(false)} />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-5 pb-8 md:pb-0">
            {/* Hero Cost Display */}
            <Card className="border-cyan-500/20 bg-gradient-to-b from-cyan-500/10 to-transparent backdrop-blur-md md:hidden">
              <CardContent className="pt-8 pb-6 text-center">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-2">Estimated Cost</span>
                <div className="text-5xl font-bold font-mono text-cyan-400 tabular-nums tracking-tighter mb-2">
                  {formatCost(totalCost)}
                </div>
                <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground/60 font-mono">
                  <span>{formatTokens(totalInputTokens)} in</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>{formatTokens(expectedOutputTokens)} out</span>
                </div>
              </CardContent>
            </Card>

            {/* Model Selector */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Model</CardTitle>      
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { triggerHaptic(15); setCompareMode(true); }}
                            className="h-9 md:h-7 text-xs gap-1.5 text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/10 border border-border/40 md:border-transparent hover:border-cyan-500/30 transition-all px-3"
                        >
                            <Layers className="w-3.5 h-3.5" />
                            Compare
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-1">
                    <ModelPickerModal selectedModelId={selectedModelId} onChange={(id) => { triggerHaptic(15); setSelectedModelId(id); }} />        
                    <Separator className="opacity-20" />
                    <div className="text-[11px] md:text-xs text-muted-foreground/70 space-y-1.5">
                        <div className="flex justify-between">
                            <span className="flex items-center">
                                <TermTooltip termKey="contextWindow">Context window</TermTooltip>:
                            </span>
                            <span className="font-mono">{(model.maxContext / 1000).toFixed(0)}k tokens</span>   
                        </div>
                        <div className="flex justify-between">
                            <span className="flex items-center gap-1">
                                Price
                                <TermTooltip termKey="inputCost" iconOnly />/<TermTooltip termKey="outputCost" iconOnly />:
                            </span>
                            <span className="font-mono">${model.inputPricePer1M} / ${model.outputPricePer1M} per 1M</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Cost Gauge (Desktop Only) */}
            <div className="hidden md:block">
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-6 pb-4 flex flex-col items-center space-y-4">
                      <CostGauge totalCost={totalCost} />
                      {agentLoopEnabled && agentIterations > 1 && (
                          <p className="text-xs text-muted-foreground">
                              Total across {agentIterations} turns
                          </p>
                      )}
                      <CostDisclaimer className="max-w-[240px] text-center justify-center" />

                      {totalInputTokens > 0 && (
                          <div className="w-full pt-2 border-t border-border/30">
                              <CostBreakdownBar
                                  inputCost={singleCost.inputCost}
                                  outputCost={singleCost.outputCost}
                              />
                          </div>
                      )}
                  </CardContent>
              </Card>
            </div>

            {/* Smart Routing Recommender */}
            {recommendedModel && (
                <Card className="border-indigo-500/30 bg-indigo-500/5 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-indigo-500/10 px-4 py-2 flex items-center gap-2 border-b border-indigo-500/20">
                        <Lightbulb className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] font-bold text-indigo-300 tracking-widest uppercase">Smart Routing</span>
                    </div>
                    <CardContent className="pt-4 pb-4">
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            Want to run this <strong className="text-foreground">{multiplier}x cheaper</strong>?
                            This prompt fits within <strong className="text-indigo-300">{recommendedModel.name}</strong>.
                        </p>
                        <Button
                            onClick={handleApplyRecommendation}
                            variant="secondary"
                            size="lg"
                            className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/20 transition-all font-semibold h-11 md:h-9"
                        >
                            <Zap className="w-4 h-4 mr-2 fill-indigo-400 text-indigo-400" />
                            Switch & Save
                            <ArrowRight className="w-4 h-4 ml-2 opacity-70" />
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 gap-3">
                <MetricCard
                    label="Input Tokens"
                    tooltipKey="inputTokens"
                    value={formatTokens(totalInputTokens)}
                    sublabel={`Prompt: ${formatTokens(inputTokenCount)} | Attach: ${formatTokens(fileTokenCount)}`}
                    icon="📥"
                />
                <MetricCard
                    label="Output Tokens"
                    tooltipKey="outputTokens"
                    value={formatTokens(expectedOutputTokens)}
                    sublabel={`${formatCost(singleCost.outputCost)}`}
                    icon="📤"
                />
                <MetricCard
                    label="Total Tokens"
                    tooltipKey="totalTokens"
                    value={formatTokens(totalInputTokens + expectedOutputTokens)}
                    sublabel="per call"
                    icon="📊"
                />
                <MetricCard
                    label="Total Cost"
                    tooltipKey="totalCost"
                    value={formatCost(singleCost.totalCost)}
                    sublabel="single call"
                    icon="💰"
                    highlight={true}
                    showDisclaimer={true}
                />
            </div>

            {/* Result Actions + Share */}
            {totalInputTokens > 0 && (
                <div className="space-y-3">
                    <ResultActions tokenCount={totalInputTokens + expectedOutputTokens} cost={singleCost.totalCost} />

                    {/* Share button */}
                    <button
                        type="button"
                        onClick={handleShare}
                        className={cn(
                            "w-full inline-flex items-center justify-center gap-2 px-4 h-12 md:h-10 rounded-xl text-xs font-bold uppercase tracking-widest",
                            "border transition-all duration-200",
                            shareCopied
                                ? "border-green-500/50 bg-green-500/10 text-green-400"
                                : "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-cyan-500/20"
                        )}
                    >
                        {shareCopied ? (
                            <><Check className="w-4 h-4" /> Link copied!</>
                        ) : (
                            <div className="flex items-center gap-2">
                              {(typeof navigator !== "undefined" && navigator.share && window.innerWidth < 768) ? (
                                <><Share2 className="w-4 h-4" /> Share estimate</>
                              ) : (
                                <><Link2 className="w-4 h-4" /> Copy share link</>
                              )}
                            </div>
                        )}
                    </button>
                </div>
            )}

            {/* Pricing reference (Mobile friendly version) */}
            <div className="md:hidden space-y-3">
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardContent className="pt-4 pb-3">
                        <div className="text-[11px] text-muted-foreground/60 space-y-2">
                            <div className="flex justify-between">
                                <TermTooltip termKey="inputCost">Input price</TermTooltip>
                                <span className="font-mono">${model.inputPricePer1M} / 1M</span>
                            </div>
                            <Separator className="opacity-20" />
                            <div className="flex justify-between">
                                <TermTooltip termKey="outputCost">Output price</TermTooltip>
                                <span className="font-mono">${model.outputPricePer1M} / 1M</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="px-2">
                  <PriceTimestamp />
                </div>
            </div>

            {/* Pricing reference (Desktop Only) */}
            <div className="hidden md:block space-y-4">
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-4 pb-3">
                      <PriceTimestamp />
                  </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-4 pb-3">
                      <div className="text-xs text-muted-foreground/60 space-y-1">
                          <div className="flex justify-between">
                              <TermTooltip termKey="inputCost">Input price</TermTooltip>
                              <span className="font-mono">${model.inputPricePer1M} / 1M tokens</span>
                          </div>
                          <Separator className="opacity-30" />
                          <div className="flex justify-between">
                              <TermTooltip termKey="outputCost">Output price</TermTooltip>
                              <span className="font-mono">${model.outputPricePer1M} / 1M tokens</span>
                          </div>
                          <Separator className="opacity-30" />
                          <div className="flex justify-between items-center">
                              <span>Prices last updated</span>
                              <Link href="/changelog" className="text-cyan-500/70 hover:text-cyan-400 font-mono transition-colors underline underline-offset-2">
                                  March 2026 ↗
                              </Link>
                          </div>
                      </div>
                  </CardContent>
              </Card>
            </div>
        </div>
    );
}

function MetricCard({
    label,
    value,
    sublabel,
    icon,
    highlight,
    showDisclaimer,
    tooltipKey,
}: {
    label: string;
    value: string;
    sublabel: string;
    icon: string;
    highlight?: boolean;
    showDisclaimer?: boolean;
    tooltipKey?: TooltipKey;
}) {
    return (
        <Card className={cn(
          "border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 rounded-2xl",
          highlight ? "ring-1 ring-cyan-500/30 bg-cyan-500/5" : ""
        )}>
            <CardContent className="pt-5 pb-4 px-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
                        {tooltipKey && <TermTooltip termKey={tooltipKey} iconOnly />}
                    </div>
                    <span className="text-sm">{icon}</span>
                </div>
                <div className={cn(
                  "text-xl md:text-lg font-bold font-mono tabular-nums tracking-tight transition-all duration-200",
                  highlight ? "text-cyan-400" : "text-foreground"
                )}>
                    {value}
                </div>
                <div className="text-[10px] text-muted-foreground/50 mt-1 line-clamp-1">{sublabel}</div>
                {showDisclaimer && <CostDisclaimer className="mt-2" />}
            </CardContent>
        </Card>
    );
}