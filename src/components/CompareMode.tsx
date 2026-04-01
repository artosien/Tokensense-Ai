"use client";

import { useState, useMemo } from "react";
import { models, ModelConfig, getModelById } from "@/lib/models";
import { calculateCost } from "@/lib/costEngine";
import { useTokenSenseStore } from "@/lib/store";
import { X, Plus, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CostBreakdownBar } from "./CostBreakdownBar";
import { useTranslations } from "next-intl";

const MAX_MODELS = 4;

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: "text-emerald-400",
  Anthropic: "text-orange-400",
  Google: "text-blue-400",
  "Meta (DeepInfra)": "text-purple-400",
  xAI: "text-slate-300",
};

interface CompareModeProps {
  onClose?: () => void;
}

export function CompareMode({ onClose }: CompareModeProps = {}) {
  const tCompare = useTranslations("compare");
  const tCalc = useTranslations("calculator");

  const { inputTokenCount, fileTokenCount, expectedOutputTokens, selectedModelId } =
    useTokenSenseStore();

  const totalInputTokens = inputTokenCount + fileTokenCount;

  // Start with 2 columns: current model + cheapest different model
  const defaultSecond = models.find((m) => m.id !== selectedModelId) ?? models[1];
  // Guard: ensure the two initial IDs are not the same (can happen if store hasn't hydrated yet)
  const initialIds = selectedModelId && selectedModelId !== defaultSecond.id
    ? [selectedModelId, defaultSecond.id]
    : [models[0].id, models[1].id];
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);

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
      m.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      m.provider.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#00dcb4]/10 text-[#00dcb4] text-sm font-mono font-bold tracking-widest uppercase mb-4 border border-[#00dcb4]/20">
              {tCompare("step_label")}
            </div>
            <p className="text-muted-foreground text-lg font-medium">
              {tCompare("step_desc")}
            </p>
        </div>

      {/* Header / Add Button */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#00dcb4]" />
          <span className="text-sm font-semibold text-foreground">{tCompare("title")}</span>
          <span className="text-xs text-muted-foreground/60">
            ({selectedIds.length} {tCalc("models") || "models"})
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length < MAX_MODELS && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPicker(!showPicker)}
              className="h-8 text-xs gap-1 border-[#00dcb4]/30 hover:bg-[#00dcb4]/10 hover:text-[#00dcb4]"
            >
              <Plus className="w-3.5 h-3.5" />
              {tCompare("add_model")}
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              {tCompare("exit")}
            </Button>
          )}
        </div>
      </div>

      {/* Model Picker Dropdown */}
      {showPicker && (
        <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <input
            autoFocus
            type="text"
            placeholder={tCalc("search_placeholder") || "Search models..."}
            value={pickerSearch}
            onChange={(e) => setPickerSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-xs font-mono bg-background/50 border border-border/50 rounded-md focus:outline-none focus:border-plasma-500/50 text-foreground placeholder:text-muted-foreground/50"
          />
          <div className="max-h-40 overflow-y-auto space-y-0.5">
            {filteredModels.map((m) => {
              const isSelected = selectedIds.includes(m.id);
              return (
              <button
                key={m.id}
                onClick={() => addModel(m.id)}
                disabled={isSelected}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-md text-left transition-colors ${
                  isSelected ? "opacity-40 cursor-not-allowed bg-muted/20" : "hover:bg-accent/50 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${PROVIDER_COLORS[m.provider] ?? "text-foreground"}`}>
                    {m.name}
                  </span>
                  <span className="text-muted-foreground/50">{m.provider}</span>
                  {isSelected && <span className="text-[10px] text-muted-foreground ml-1">({tCalc("added") || "Added"})</span>}
                </div>
                <span className="font-mono text-muted-foreground/60 text-[10px]">
                  ${m.inputPricePer1M}/${m.outputPricePer1M}
                </span>
              </button>
            )})}
            {filteredModels.length === 0 && (
              <p className="text-xs text-muted-foreground/50 px-3 py-2">{tCalc("no_results") || "No more models to add."}</p>
            )}
          </div>
        </div>
      )}

      {/* Sticky Token Context Header */}
      <div className="sticky top-[60px] lg:top-[72px] z-10 bg-background/80 backdrop-blur-md p-3 rounded-xl border border-border/50 shadow-sm flex items-center justify-between transition-all">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 w-full justify-between">
           <div className="flex items-center gap-2">
             <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{tCompare("pricing_context")}</span>
           </div>
           <div className="flex items-center gap-3 text-sm font-mono whitespace-nowrap">
             <span className="text-foreground font-semibold">{totalInputTokens.toLocaleString()} <span className="text-muted-foreground/60">{tCompare("in")}</span></span>
             <span className="text-muted-foreground/30">+</span>
             <span className="text-foreground font-semibold">{expectedOutputTokens.toLocaleString()} <span className="text-muted-foreground/60">{tCompare("out")}</span></span>
           </div>
        </div>
      </div>

      {/* Columns — desktop: flex row, mobile: stacked */}
      <div className="flex flex-col lg:flex-row gap-3 relative">
        {sortedByCost.map(({ model, cost }, i) => {
          const isCheapest = model.id === cheapestId && columns.length > 1;
          const isMostExpensive = model.id === mostExpensiveId && columns.length > 1;

          return (
            <div
              key={`${model.id}-${i}`}
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
                    {tCompare("best_value")}
                  </span>
                )}
                {isMostExpensive && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    {tCompare("most_capable")}
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
                  <span className="text-plasma-400/70">{tCompare("input")}</span>
                  <span>{formatCost(cost.inputCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400/70">{tCompare("output")}</span>
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
                ${model.inputPricePer1M} / ${model.outputPricePer1M} {tCompare("per_1m_tokens") || "per 1M tokens"}
              </div>
            </div>
          );
        })}
      </div>

      {/* No tokens prompt */}
      {totalInputTokens === 0 && (
        <p className="text-xs text-center text-muted-foreground/50 py-2">
          {tCompare("enter_prompt")}
        </p>
      )}
    </div>
  );
}
