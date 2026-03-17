"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTokenSenseStore } from "@/lib/store";
import { models, getModelById, ModelConfig } from "@/lib/models";
import { calculateCost, calculateLoopCost } from "@/lib/costEngine";
import CostGauge from "./CostGauge";
import CostDisclaimer from "./CostDisclaimer";
import { Zap, ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelPills } from "./ModelPills";
import { InfoTooltip } from "./InfoTooltip";
import { PriceTimestamp } from "./PriceTimestamp";
import { ResultActions } from "./ResultActions";

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

    // Group models by provider
    const grouped = models.reduce<Record<string, typeof models>>((acc, m) => {
        if (!acc[m.provider]) acc[m.provider] = [];
        acc[m.provider].push(m);
        return acc;
    }, {});

    // Smart Routing Logic
    // If prompt is modest (< 10k tokens) and expected output isn't massive (< 4k tokens),
    // and current model is expensive (>$1.00 input), suggest a cheaper alternative.
    const isSimplePrompt = totalInputTokens > 0 && totalInputTokens < 10000 && expectedOutputTokens <= 4000;

    const recommendedModel = useMemo<ModelConfig | null>(() => {
        if (!isSimplePrompt) return null;
        if (model.inputPricePer1M <= 0.50) return null; // Already using a very cheap model

        // Pick the cheapest overall model to suggest (e.g. GPT-5 Mini or Gemini Flash)
        const cheapModels = models.filter(m => m.inputPricePer1M <= 0.50);
        if (cheapModels.length === 0) return null;

        const cheapest = cheapModels.reduce((prev, curr) =>
            (curr.inputPricePer1M + curr.outputPricePer1M) < (prev.inputPricePer1M + prev.outputPricePer1M) ? curr : prev
        );

        return cheapest;
    }, [isSimplePrompt, model.inputPricePer1M, model.outputPricePer1M]);

    const handleApplyRecommendation = () => {
        if (recommendedModel) setSelectedModelId(recommendedModel.id);
    };

    // Calculate cost multiplier for the UI copy
    const multiplier = recommendedModel
        ? Math.round(model.inputPricePer1M / recommendedModel.inputPricePer1M)
        : 0;

    return (
        <div className="space-y-5">
            {/* Model Selector with Pills */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Model</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <ModelPills selected={selectedModelId} onChange={setSelectedModelId} />
                    <Separator className="opacity-20" />
                    <div className="text-xs text-muted-foreground/70 space-y-1">
                        <div className="flex justify-between">
                            <span>Context window:</span>
                            <span className="font-mono">{(model.maxContext / 1000).toFixed(0)}k tokens</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Price:</span>
                            <span className="font-mono">${model.inputPricePer1M} / ${model.outputPricePer1M} per 1M</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Cost Gauge */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6 flex flex-col items-center">
                    <CostGauge totalCost={totalCost} />
                    {agentLoopEnabled && agentIterations > 1 && (
                        <p className="text-xs text-muted-foreground mt-2">
                            Total across {agentIterations} turns
                        </p>
                    )}
                    <CostDisclaimer className="mt-4 max-w-[240px] text-center justify-center" />
                </CardContent>
            </Card>

            {/* Smart Routing Recommender */}
            {recommendedModel && (
                <Card className="border-indigo-500/30 bg-indigo-500/5 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-indigo-500/10 px-4 py-2 flex items-center gap-2 border-b border-indigo-500/20">
                        <Lightbulb className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-semibold text-indigo-300 tracking-wide uppercase">Smart Routing</span>
                    </div>
                    <CardContent className="pt-4 pb-4">
                        <p className="text-sm text-muted-foreground mb-3 leading-snug">
                            Want to run this <strong className="text-foreground">{multiplier}x cheaper</strong>?
                            This prompt length fits easily within <strong>{recommendedModel.name}</strong>.
                        </p>
                        <Button
                            onClick={handleApplyRecommendation}
                            variant="secondary"
                            size="sm"
                            className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/20 transition-all font-medium"
                        >
                            <Zap className="w-3.5 h-3.5 mr-2 fill-indigo-400 text-indigo-400" />
                            Switch & Compare Cost
                            <ArrowRight className="w-3.5 h-3.5 ml-2 opacity-70" />
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 gap-3">
                <MetricCard
                    label="Input Tokens"
                    tooltip="Characters sent to the model. Longer prompts = higher input cost."
                    value={formatTokens(totalInputTokens)}
                    sublabel={`Prompt: ${formatTokens(inputTokenCount)} | Attach: ${formatTokens(fileTokenCount)}`}
                    icon="📥"
                />
                <MetricCard
                    label="Output Tokens"
                    tooltip="Tokens generated in the model's response. Usually priced 3–5× higher than input."
                    value={formatTokens(expectedOutputTokens)}
                    sublabel={`${formatCost(singleCost.outputCost)}`}
                    icon="📤"
                />
                <MetricCard
                    label="Total Tokens"
                    tooltip="Sum of input and output tokens per API call."
                    value={formatTokens(totalInputTokens + expectedOutputTokens)}
                    sublabel="per call"
                    icon="📊"
                />
                <MetricCard
                    label="Total Cost"
                    tooltip="Estimated cost for a single API call at current rates."
                    value={formatCost(singleCost.totalCost)}
                    sublabel="single call"
                    icon="💰"
                    highlight={true}
                    showDisclaimer={true}
                />
            </div>

            {/* Result Actions */}
            {totalInputTokens > 0 && (
                <ResultActions tokenCount={totalInputTokens + expectedOutputTokens} cost={singleCost.totalCost} />
            )}

            {/* Price Reference & Timestamp */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-4 pb-3">
                    <PriceTimestamp />
                </CardContent>
            </Card>

            {/* Pricing reference */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-4 pb-3">
                    <div className="text-xs text-muted-foreground/60 space-y-1">
                        <div className="flex justify-between">
                            <span>Input price</span>
                            <span className="font-mono">${model.inputPricePer1M} / 1M tokens</span>
                        </div>
                        <Separator className="opacity-30" />
                        <div className="flex justify-between">
                            <span>Output price</span>
                            <span className="font-mono">${model.outputPricePer1M} / 1M tokens</span>
                        </div>
                        <Separator className="opacity-30" />
                        <div className="flex justify-between">
                            <span>Prices last updated</span>
                            <span>March 2026</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
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
    tooltip,
}: {
    label: string;
    value: string;
    sublabel: string;
    icon: string;
    highlight?: boolean;
    showDisclaimer?: boolean;
    tooltip?: string;
}) {
    return (
        <Card className={`border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 ${highlight ? "ring-1 ring-primary/20" : ""}`}>
            <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">{label}</span>
                        {tooltip && <InfoTooltip text={tooltip} />}
                    </div>
                    <span className="text-sm">{icon}</span>
                </div>
                <div className={`text-lg font-bold font-mono tabular-nums transition-all duration-200 ${highlight ? "text-primary" : ""}`}>
                    {value}
                </div>
                <div className="text-xs text-muted-foreground/60 mt-0.5">{sublabel}</div>
                {showDisclaimer && <CostDisclaimer className="mt-2" />}
            </CardContent>
        </Card>
    );
}
