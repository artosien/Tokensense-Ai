"use client";

import { useState, useMemo } from "react";
import { models, ModelConfig, getModelById } from "@/lib/models";
import { calculateCost } from "@/lib/costEngine";
import { useTokenSenseStore } from "@/lib/store";
import { X, Plus, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CostBreakdownBar } from "./CostBreakdownBar";

const MAX_MODELS = 4;

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: "text-emerald-400",
  Anthropic: "text-orange-400",
  Google: "text-blue-400",
  "Meta (DeepInfra)": "text-purple-400",
  xAI: "text-slate-300",
};

interface CompareModeProps {
  onClose: () => void;
}

export function CompareMode({ onClose }: CompareModeProps) {
  const { inputTokenCount, fileTokenCount, expectedOutputTokens, selectedModelId } =
    useTokenSenseStore();

  const totalInputTokens = inputTokenCount + fileTokenCount;

  // Start with 2 columns: current model + cheapest different model
  const defaultSecond = models.find((m) => m.id !== selectedModelId) ?? models[1];
  const [selectedIds, setSelectedIds] = useState<string[]>([
    selectedModelId,
    defaultSecond.id,
  ]);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");

  const addModel = (modelId: string) => {
    if (selectedIds.includes(modelId) || selectedIds.length >= MAX_MODELS) return;
    setSelectedIds((prev) => [...prev, modelId]);
    setShowPicker(false);
    setPickerSearch("");
  };

  const removeModel = (modelId: string) => {
    if (selectedIds.length <= 1) return;
    setSelectedIds((prev) => prev.filter((id) => id !== modelId));
  };

  const formatCost = (v: number) => {
    if (v === 0) return "$0.00";
    if (v < 0.0001) return `$${v.toFixed(6)}`;
    if (v < 0.01) return `$${v.toFixed(4)}`;
    return `$${v.toFixed(4)}`;
  };

  // Compute costs for all selected models
  const columns = useMemo(() => {
    return selectedIds.map((id) => {
      const model = getModelById(id) ?? models[0];
      const cost = calculateCost(totalInputTokens, expectedOutputTokens, model);
      return { model, cost };
    });
  }, [selectedIds, totalInputTokens, expectedOutputTokens]);

  // Determine cheapest and most expensive
  const sortedByCost = [...columns].sort((a, b) => a.cost.totalCost - b.cost.totalCost);
  const cheapestId = sortedByCost[0]?.model.id;
  const mostExpensiveId = sortedByCost[sortedByCost.length - 1]?.model.id;

  const filteredModels = models.filter(
    (m) =>
      !selectedIds.includes(m.id) &&
      (m.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        m.provider.toLowerCase().includes(pickerSearch.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-foreground">Compare Mode</span>
          <span className="text-xs text-muted-foreground/60">
            ({selectedIds.length} models)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length < MAX_MODELS && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPicker(!showPicker)}
              className="h-7 text-xs gap-1 border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
            >
              <Plus className="w-3 h-3" />
              Add Model
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3 mr-1" />
            Exit
          </Button>
        </div>
      </div>

      {/* Model Picker Dropdown */}
      {showPicker && (
        <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <input
            autoFocus
            type="text"
            placeholder="Search models..."
            value={pickerSearch}
            onChange={(e) => setPickerSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-xs font-mono bg-background/50 border border-border/50 rounded-md focus:outline-none focus:border-cyan-500/50 text-foreground placeholder:text-muted-foreground/50"
          />
          <div className="max-h-40 overflow-y-auto space-y-0.5">
            {filteredModels.map((m) => (
              <button
                key={m.id}
                onClick={() => addModel(m.id)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-md hover:bg-accent/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${PROVIDER_COLORS[m.provider] ?? "text-foreground"}`}>
                    {m.name}
                  </span>
                  <span className="text-muted-foreground/50">{m.provider}</span>
                </div>
                <span className="font-mono text-muted-foreground/60 text-[10px]">
                  ${m.inputPricePer1M}/${m.outputPricePer1M}
                </span>
              </button>
            ))}
            {filteredModels.length === 0 && (
              <p className="text-xs text-muted-foreground/50 px-3 py-2">No more models to add.</p>
            )}
          </div>
        </div>
      )}

      {/* Columns — desktop: flex row, mobile: stacked */}
      <div className="flex flex-col lg:flex-row gap-3">
        {columns.map(({ model, cost }) => {
          const isCheapest = model.id === cheapestId && columns.length > 1;
          const isMostExpensive = model.id === mostExpensiveId && columns.length > 1;

          return (
            <div
              key={model.id}
              className={`
                flex-1 min-w-0 rounded-xl border p-4 space-y-3 relative transition-all duration-300
                bg-card/50 backdrop-blur-sm
                ${isCheapest ? "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.08)]" : ""}
                ${isMostExpensive ? "border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.06)]" : ""}
                ${!isCheapest && !isMostExpensive ? "border-border/40" : ""}
              `}
            >
              {/* Remove button */}
              {columns.length > 1 && (
                <button
                  onClick={() => removeModel(model.id)}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-muted/50 hover:bg-destructive/20 hover:text-destructive text-muted-foreground flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Model name + badge */}
              <div className="space-y-1">
                <div className={`text-xs font-semibold tracking-wide ${PROVIDER_COLORS[model.provider] ?? "text-muted-foreground"}`}>
                  {model.provider}
                </div>
                <div className="text-sm font-bold text-foreground pr-6 leading-tight">
                  {model.name}
                </div>
                {isCheapest && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    ✦ Best Value
                  </span>
                )}
                {isMostExpensive && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    ⚡ Most Capable
                  </span>
                )}
              </div>

              {/* Main cost */}
              <div className="text-2xl font-bold font-mono tabular-nums text-foreground">
                {formatCost(cost.totalCost)}
              </div>

              {/* Breakdown */}
              <div className="space-y-1 text-xs font-mono text-muted-foreground/70">
                <div className="flex justify-between">
                  <span className="text-cyan-400/70">Input</span>
                  <span>{formatCost(cost.inputCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400/70">Output</span>
                  <span>{formatCost(cost.outputCost)}</span>
                </div>
              </div>

              {/* Mini breakdown bar */}
              {totalInputTokens > 0 && (
                <CostBreakdownBar
                  inputCost={cost.inputCost}
                  outputCost={cost.outputCost}
                />
              )}

              {/* Pricing reference */}
              <div className="text-[10px] font-mono text-muted-foreground/40 pt-1 border-t border-border/30">
                ${model.inputPricePer1M} / ${model.outputPricePer1M} per 1M tokens
              </div>
            </div>
          );
        })}
      </div>

      {/* No tokens prompt */}
      {totalInputTokens === 0 && (
        <p className="text-xs text-center text-muted-foreground/50 py-2">
          Enter a prompt to see cost comparison across models.
        </p>
      )}
    </div>
  );
}
