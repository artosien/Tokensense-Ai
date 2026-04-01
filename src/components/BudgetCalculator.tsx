"use client";

import { useState, useMemo } from "react";
import { models, getModelById } from "@/lib/models";
import { calculateCost } from "@/lib/costEngine";
import { TermTooltip } from "./TermTooltip";
import { ModelPickerModal } from "./ModelPickerModal";
import { Calculator, AlertTriangle, TrendingUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useTranslations } from "next-intl";

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: "text-emerald-400",
  Anthropic: "text-orange-400",
  Google: "text-blue-400",
  "Meta (DeepInfra)": "text-purple-400",
  xAI: "text-slate-300",
};

const SUGGESTED_BUDGETS = [10, 50, 100, 500];

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}

function fmtCost(v: number) {
  if (v === 0) return "$0.00";
  if (v < 0.0001) return `$${v.toFixed(6)}`;
  if (v < 0.01) return `$${v.toFixed(4)}`;
  return `$${v.toFixed(4)}`;
}

export function BudgetCalculator() {
  const tBudget = useTranslations("budget");
  const tCalc = useTranslations("calculator");
  const tMetrics = useTranslations("metrics");
  const tCompare = useTranslations("compare");

  const [budget, setBudget] = useState(50);
  const [inputTokens, setInputTokens] = useState(500);
  const [outputTokens, setOutputTokens] = useState(300);
  const [selectedModelId, setSelectedModelId] = useState("gpt-5-mini");
  const [dailyVolume, setDailyVolume] = useState(100);
  const [alertThreshold, setAlertThreshold] = useState(100);

  const model = getModelById(selectedModelId) ?? models[0];
  const cost = useMemo(
    () => calculateCost(inputTokens, outputTokens, model),
    [inputTokens, outputTokens, model]
  );

  const requestsPerMonth = cost.totalCost > 0 ? Math.floor(budget / cost.totalCost) : 0;
  const requestsPerDay = Math.floor(requestsPerMonth / 30);
  const usedBudgetPct = Math.min((cost.totalCost * requestsPerMonth) / budget, 1) * 100;

  const projectedMonthlySpend = cost.totalCost * dailyVolume * 30;
  const isOverBudget = projectedMonthlySpend > alertThreshold;

  // Alternatives: top 5 cheapest models by total cost for this token profile
  const alternatives = useMemo(() => {
    return [...models]
      .filter((m) => m.id !== selectedModelId)
      .map((m) => {
        const c = calculateCost(inputTokens, outputTokens, m);
        const perMonth = c.totalCost > 0 ? Math.floor(budget / c.totalCost) : 0;
        return { model: m, costPerReq: c.totalCost, requestsPerMonth: perMonth };
      })
      .sort((a, b) => b.requestsPerMonth - a.requestsPerMonth)
      .slice(0, 4);
  }, [inputTokens, outputTokens, budget, selectedModelId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Calculator className="w-4 h-4 text-plasma-400" />
        <span className="text-sm font-semibold text-foreground">{tBudget("title")}</span>
        <span className="text-xs text-muted-foreground/60">— {tBudget("subtitle")}</span>
      </div>

      {/* Inputs grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Monthly Budget */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
            {tBudget("monthly_budget")}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-mono">$</span>
            <input
              type="number"
              value={budget}
              min={1}
              onChange={(e) => setBudget(Math.max(1, Number(e.target.value)))}
              className="flex-1 bg-background/50 border border-border/50 rounded-md px-3 py-2 font-mono text-sm focus:outline-none focus:border-plasma-500/50"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {SUGGESTED_BUDGETS.map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                  budget === b
                    ? "border-plasma-500/50 bg-plasma-500/15 text-plasma-400"
                    : "border-border/40 text-muted-foreground/60 hover:border-plasma-500/30 hover:text-plasma-400/70"
                }`}
              >
                ${b}
              </button>
            ))}
          </div>
        </div>

        {/* Tokens per request */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            {tBudget("tokens_per_request")}
            <TermTooltip termKey="tokens" iconOnly />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] text-muted-foreground/50 mb-1 font-mono">{tCompare("input") || "Input"}</div>
              <input
                type="number"
                value={inputTokens}
                min={1}
                onChange={(e) => setInputTokens(Math.max(1, Number(e.target.value)))}
                className="w-full bg-background/50 border border-border/50 rounded-md px-2 py-2 font-mono text-sm focus:outline-none focus:border-plasma-500/50"
              />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground/50 mb-1 font-mono">{tCompare("output") || "Output"}</div>
              <input
                type="number"
                value={outputTokens}
                min={0}
                onChange={(e) => setOutputTokens(Math.max(0, Number(e.target.value)))}
                className="w-full bg-background/50 border border-border/50 rounded-md px-2 py-2 font-mono text-sm focus:outline-none focus:border-plasma-500/50"
              />
            </div>
          </div>
        </div>

        {/* Model selector — full width */}
        <div className="sm:col-span-2 space-y-2">
          <label className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
            {tMetrics("model")}
          </label>
          <ModelPickerModal selectedModelId={selectedModelId} onChange={setSelectedModelId} />
        </div>
      </div>

      {/* Results */}
      {cost.totalCost > 0 ? (
        <div className="space-y-6">
          {/* Monthly Projection Card */}
          <div className={`p-5 rounded-2xl border transition-all duration-500 ${isOverBudget ? "bg-red-500/10 border-red-500/40" : "bg-indigo-500/5 border-indigo-500/20"}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-4 h-4 ${isOverBudget ? "text-red-400" : "text-indigo-400"}`} />
                <span className="text-sm font-bold uppercase tracking-wider">{tBudget("monthly_projection")}</span>
              </div>
              {isOverBudget && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/20 rounded-md text-[10px] font-bold text-red-400 uppercase tracking-tighter">
                  <AlertTriangle className="w-3 h-3" />
                  {tBudget("threshold_hit")}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between">
                <div className={`text-3xl font-black font-mono ${isOverBudget ? "text-red-400" : "text-indigo-400"}`}>
                  ${projectedMonthlySpend.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {tBudget("at_req_day", { volume: dailyVolume.toLocaleString() })}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>{tBudget("adjust_volume")}</span>
                  <span>{dailyVolume} {tBudget("req_day")}</span>
                </div>
                <Slider 
                  defaultValue={[dailyVolume]} 
                  max={5000} 
                  step={10} 
                  onValueChange={([v]) => setDailyVolume(v)} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">{tBudget("alert_threshold")}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">$</span>
                    <input 
                      type="number" 
                      value={alertThreshold} 
                      onChange={(e) => setAlertThreshold(Number(e.target.value))}
                      className="w-full bg-background/50 border border-border/40 rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">{tBudget("model_cost")}</label>
                  <div className="text-xs font-mono font-bold text-foreground py-1">
                    {tBudget("per_req", { cost: fmtCost(cost.totalCost) })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: tBudget("requests_month"),
                value: fmt(requestsPerMonth),
                accent: true,
              },
              {
                label: tBudget("requests_day"),
                value: `≈ ${fmt(requestsPerDay)}/day`,
                accent: false,
              },
              {
                label: tBudget("cost_request"),
                value: fmtCost(cost.totalCost),
                accent: false,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/40 bg-card/50 p-3 space-y-1"
              >
                <div className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">
                  {stat.label}
                </div>
                <div
                  className={`text-lg font-bold font-mono tabular-nums ${
                    stat.accent ? "text-plasma-400" : "text-foreground"
                  }`}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Budget fill bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground/60">
              <span>{tBudget("utilization")}</span>
              <span>
                {fmtCost(cost.totalCost * requestsPerMonth)} / ${budget}
              </span>
            </div>
            <div className="h-4 rounded-full bg-slate-800/60 border border-slate-700/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-plasma-500 to-plasma-400 transition-all duration-700 ease-out rounded-full"
                style={{ width: `${usedBudgetPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground/40">
              <span>$0</span>
              <span>${budget}</span>
            </div>
          </div>

          {/* "What if I switch?" */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-semibold text-muted-foreground/70 uppercase tracking-wider">
              {tBudget("switch_models")}
            </div>
            <div className="space-y-1.5">
              {alternatives.map(({ model: alt, costPerReq, requestsPerMonth: altReqsPerMonth }) => {
                const diff = altReqsPerMonth - requestsPerMonth;
                const diffLabel =
                  diff === 0
                    ? tBudget("diff_same")
                    : diff > 0
                    ? tBudget("diff_more", { count: fmt(diff) })
                    : tBudget("diff_fewer", { count: fmt(Math.abs(diff)) });
                const diffColor = diff > 0 ? "text-emerald-400" : diff < 0 ? "text-red-400" : "text-muted-foreground";
                const pColor = PROVIDER_COLORS[alt.provider] ?? "text-muted-foreground";
                const barPct = Math.min((costPerReq * altReqsPerMonth) / budget, 1) * 100;

                return (
                  <div
                    key={alt.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-card/30 border border-border/30 hover:border-border/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${pColor} truncate`}>{alt.name}</span>
                        <span className={`text-[10px] font-mono shrink-0 ${diffColor}`}>
                          {diffLabel}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-800/60 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            diff > 0 ? "bg-emerald-500/60" : "bg-slate-500/40"
                          }`}
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold font-mono text-foreground tabular-nums">
                        {fmt(altReqsPerMonth)}
                      </div>
                      <div className="text-[9px] font-mono text-muted-foreground/50">
                        {tBudget("per_req", { cost: fmtCost(costPerReq) })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-muted-foreground/50">
          {tBudget("empty_state")}
        </div>
      )}
    </div>
  );
}
