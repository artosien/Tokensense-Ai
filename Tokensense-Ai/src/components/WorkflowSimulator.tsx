"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Copy, Check } from "lucide-react";
import CostDisclaimer from "./CostDisclaimer";

// ─── Pricing Data ───────────────────────────────────────────────────────────

const PLATFORM_PRICING = {
  n8n: {
    name: "n8n",
    pricePerExecution: 0.004,
    freeExecs: 2500,
    brandColor: "#00B4FF",
    brandGlow: "rgba(0, 180, 255, 0.5)",
    tiers: [
      { label: "Starter", executions: 2500, price: 0 },
      { label: "Pro", executions: 10000, price: 24 },
      { label: "Enterprise", executions: 1000000, price: "Custom" },
    ],
  },
  make: {
    name: "Make",
    pricePerOp: 0.001,
    freeOps: 1000,
    brandColor: "#FF6B35",
    brandGlow: "rgba(255, 107, 53, 0.5)",
    tiers: [
      { label: "Free", ops: 1000, price: 0 },
      { label: "Team", ops: 100000, price: 99 },
      { label: "Business", ops: 10000000, price: 299 },
    ],
  },
  zapier: {
    name: "Zapier",
    pricePerTask: 0.025,
    freeTasks: 100,
    brandColor: "#FF4F00",
    brandGlow: "rgba(255, 79, 0, 0.5)",
    tiers: [
      { label: "Free", tasks: 100, price: 0 },
      { label: "Professional", tasks: 750, price: 20 },
      { label: "Company", tasks: 10000, price: 299 },
    ],
  },
};

const AI_MODELS = [
  { id: "none", label: "None", inputCost: 0, outputCost: 0 },
  { id: "gpt4o", label: "GPT-4o", inputCost: 0.005, outputCost: 0.015 },
  { id: "gpt4o-mini", label: "GPT-4o mini", inputCost: 0.00015, outputCost: 0.0006 },
  { id: "claude-sonnet", label: "Claude Sonnet", inputCost: 0.003, outputCost: 0.015 },
  { id: "claude-haiku", label: "Claude Haiku", inputCost: 0.00025, outputCost: 0.00125 },
  { id: "gemini-flash", label: "Gemini Flash", inputCost: 0.00005, outputCost: 0.00015 },
];

// ─── Helper Functions ───────────────────────────────────────────────────────

function fmtK(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function fmtTok(n: number): string {
  return `${fmtK(n)} tok`;
}

function fmt(n: number): string {
  return `$${n.toFixed(2)}`;
}

// ─── Sub-Components ─────────────────────────────────────────────────────────

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  unit?: string;
}

function Slider({ label, value, min, max, step = 1, onChange, unit = "" }: SliderProps) {
  const range = max - min;
  const percent = ((value - min) / range) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase">{label}</label>
        <span className="text-sm font-bold text-cyan-400 font-mono">
          {fmtK(value)} {unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #00c6ff 0%, #00c6ff ${percent}%, #1e293b ${percent}%, #1e293b 100%)`,
          }}
        />
      </div>
    </div>
  );
}

interface LineItemProps {
  label: string;
  value: string | number;
  sublabel?: string;
  highlight?: boolean;
}

function LineItem({ label, value, sublabel, highlight }: LineItemProps) {
  return (
    <div className={`flex items-center justify-between py-2 px-3 rounded-lg ${highlight ? "bg-cyan-500/10 border border-cyan-500/30" : ""}`}>
      <div>
        <div className="text-xs font-medium text-slate-300">{label}</div>
        {sublabel && <div className="text-[10px] text-slate-500 mt-0.5">{sublabel}</div>}
      </div>
      <div className={`font-mono font-bold ${highlight ? "text-cyan-400" : "text-slate-200"}`}>
        {value}
      </div>
    </div>
  );
}

interface StatBoxProps {
  label: string;
  value: string;
  unit?: string;
}

function StatBox({ label, value, unit }: StatBoxProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</div>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-2xl font-black text-white">{value}</span>
        {unit && <span className="text-xs text-slate-400">{unit}</span>}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function WorkflowSimulator() {
  const [platform, setPlatform] = useState<keyof typeof PLATFORM_PRICING>("n8n");
  const [executions, setExecutions] = useState(1000);
  const [stepsPerExec, setStepsPerExec] = useState(5);
  const [aiModel, setAiModel] = useState("none");
  const [aiCalls, setAiCalls] = useState(0);
  const [tokensPerCall, setTokensPerCall] = useState(1000);
  const [compareMode, setCompareMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [displayCost, setDisplayCost] = useState(0);
  const animationRef = useRef<number | null>(null);

  const model = AI_MODELS.find((m) => m.id === aiModel) || AI_MODELS[0];

  // Calculate costs
  const calculateCosts = useCallback( () => {
    let baseCost = 0;

    if (platform === "n8n") {
      const config = PLATFORM_PRICING.n8n;
      baseCost = Math.max(0, (executions - config.freeExecs) * config.pricePerExecution);
    } else if (platform === "make") {
      const config = PLATFORM_PRICING.make;
      const ops = executions * stepsPerExec;
      baseCost = Math.max(0, (ops - config.freeOps) * config.pricePerOp);
    } else if (platform === "zapier") {
      const config = PLATFORM_PRICING.zapier;
      baseCost = Math.max(0, (executions - config.freeTasks) * config.pricePerTask);
    }

    let aiCost = 0;
    if (aiModel !== "none" && aiCalls > 0) {
      const inputTokens = aiCalls * tokensPerCall;
      const outputTokens = inputTokens * 0.3; // Assume 30% of input for output
      aiCost = inputTokens * (model.inputCost / 1000000) + outputTokens * (model.outputCost / 1000000);
    }

    return { baseCost, aiCost, total: baseCost + aiCost };
  }, [platform, executions, stepsPerExec, aiModel, aiCalls, tokensPerCall, model]);

  const costs = calculateCosts();

  // Animate cost display
  useEffect(() => {
    let startValue = displayCost;
    const targetValue = costs.total;
    const startTime = Date.now();
    const duration = 400; // ms

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      const newValue = startValue + (targetValue - startValue) * eased;
      setDisplayCost(newValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [costs.total]);

  // Copy summary functionality
  const copySummary = useCallback(async () => {
    const summary = `Platform: ${PLATFORM_PRICING[platform].name}
Executions: ${fmtK(executions)}
Steps per Execution: ${stepsPerExec}
AI Model: ${model.label}
AI Calls: ${fmtK(aiCalls)}
Tokens per Call: ${fmtK(tokensPerCall)}

Base Cost (Monthly): ${fmt(costs.baseCost)}
AI Cost (Monthly): ${fmt(costs.aiCost)}
Total Cost (Monthly): ${fmt(costs.total)}
Annual Cost: ${fmt(costs.total * 12)}`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [platform, executions, stepsPerExec, aiModel, aiCalls, tokensPerCall, costs, model.label]);

  const getPlatformConfig = () => {
    if (platform === "n8n") return PLATFORM_PRICING.n8n;
    if (platform === "make") return PLATFORM_PRICING.make;
    return PLATFORM_PRICING.zapier;
  };
  const platformConfig = getPlatformConfig();
  const annualBase = costs.baseCost * 12;
  const annualGrowth = costs.baseCost * 12 * 1.2; // 20% growth projection

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #080e1a 0%, #0a1628 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');

        .flow-cost {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .grid-background {
          background-image:
            linear-gradient(0deg, rgba(0, 198, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 198, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .platform-btn {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .platform-btn.active {
          box-shadow: 0 0 20px var(--glow-color);
          border-color: currentColor;
        }

        @keyframes pulse-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }

        .pulse-glow { animation: pulse-glow 3s infinite; }

        .slider {
          outline: none;
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #00c6ff;
          cursor: pointer;
          border: 2px solid #080e1a;
          box-shadow: 0 0 10px rgba(0, 198, 255, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #00c6ff;
          cursor: pointer;
          border: 2px solid #080e1a;
          box-shadow: 0 0 10px rgba(0, 198, 255, 0.5);
        }
      `}</style>

      <div className="grid-background min-h-screen p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              FlowCost
            </h1>
            <p className="text-slate-400 text-sm">Workflow Platform Cost Calculator</p>
          </div>

          {/* Platform Selector */}
          <div className="flex gap-3 justify-center flex-wrap mb-8">
            {Object.entries(PLATFORM_PRICING).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setPlatform(key as keyof typeof PLATFORM_PRICING)}
                className={`platform-btn px-6 py-3 rounded-lg font-bold text-sm uppercase border-2 transition-all ${
                  platform === key
                    ? "text-white border-opacity-100"
                    : "text-slate-400 border-slate-600 border-opacity-50 hover:border-opacity-100"
                }`}
                style={{
                  "--glow-color": platform === key ? config.brandGlow : "transparent",
                } as React.CSSProperties}
              >
                {config.name}
              </button>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 space-y-6">
                <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Workflow Configuration</h2>

                <Slider
                  label="Monthly Executions"
                  value={executions}
                  min={100}
                  max={100000}
                  step={100}
                  onChange={setExecutions}
                  unit="runs"
                />

                <Slider
                  label="Steps Per Execution"
                  value={stepsPerExec}
                  min={1}
                  max={30}
                  onChange={setStepsPerExec}
                />

                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">AI Node Configuration</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 uppercase block mb-2">Model</label>
                      <select
                        value={aiModel}
                        onChange={(e) => setAiModel(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-slate-200 text-sm"
                      >
                        {AI_MODELS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {aiModel !== "none" && (
                      <>
                        <Slider
                          label="AI Calls per Execution"
                          value={aiCalls}
                          min={0}
                          max={50000}
                          step={100}
                          onChange={setAiCalls}
                        />
                        <Slider
                          label="Tokens per Call"
                          value={tokensPerCall}
                          min={100}
                          max={8000}
                          step={100}
                          onChange={setTokensPerCall}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Cost Panel */}
            <div className="rounded-2xl border-2 bg-gradient-to-br from-slate-900 to-slate-800 p-6 space-y-4" style={{ borderColor: platformConfig.brandColor }}>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Cost</div>
              <div className="pulse-glow">
                <div className="text-5xl font-black text-white font-mono">
                  ${displayCost.toFixed(2)}
                </div>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Base: ${costs.baseCost.toFixed(2)} | AI: ${costs.aiCost.toFixed(2)}
              </div>

              <button
                onClick={copySummary}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm font-semibold"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Summary
                  </>
                )}
              </button>

              <CostDisclaimer className="mt-4 text-[10px]" />
            </div>
          </div>

          {/* Receipt Breakdown */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 space-y-3">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Cost Breakdown</h2>
            <LineItem label={`${platform.toUpperCase()} Base Cost`} value={fmt(costs.baseCost)} highlight={false} />
            {aiModel !== "none" && <LineItem label="AI Model Cost" value={fmt(costs.aiCost)} sublabel={`${fmtK(aiCalls)} calls × ${fmtK(tokensPerCall)} tokens`} />}
            <div className="pt-3 border-t border-white/10">
              <LineItem label="Total Monthly" value={fmt(costs.total)} highlight={true} />
            </div>
          </div>

          {/* Annual Projection */}
          <div className="grid grid-cols-2 gap-4">
            <StatBox label="Annual (Base)" value={fmt(annualBase)} />
            <StatBox label="Annual (+20% Growth)" value={fmt(annualGrowth)} />
          </div>

          {/* Platform Comparison Mode */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="compare"
                checked={compareMode}
                onChange={(e) => setCompareMode(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="compare" className="text-sm font-semibold text-slate-300 cursor-pointer">
                Compare All Platforms
              </label>
            </div>

            {compareMode && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {Object.entries(PLATFORM_PRICING).map(([key, config]) => {
                  let cost = 0;
                  if (key === "n8n") {
                    cost = Math.max(0, (executions - (config as typeof PLATFORM_PRICING.n8n).freeExecs) * (config as typeof PLATFORM_PRICING.n8n).pricePerExecution);
                  } else if (key === "make") {
                    const ops = executions * stepsPerExec;
                    cost = Math.max(0, (ops - (config as typeof PLATFORM_PRICING.make).freeOps) * (config as typeof PLATFORM_PRICING.make).pricePerOp);
                  } else if (key === "zapier") {
                    cost = Math.max(0, (executions - (config as typeof PLATFORM_PRICING.zapier).freeTasks) * (config as typeof PLATFORM_PRICING.zapier).pricePerTask);
                  }

                  const n8nCost = Math.max(0, (executions - PLATFORM_PRICING.n8n.freeExecs) * PLATFORM_PRICING.n8n.pricePerExecution);
                  const makeCost = Math.max(0, (executions * stepsPerExec - PLATFORM_PRICING.make.freeOps) * PLATFORM_PRICING.make.pricePerOp);
                  const zapierCost = Math.max(0, (executions - PLATFORM_PRICING.zapier.freeTasks) * PLATFORM_PRICING.zapier.pricePerTask);
                  const isBest = cost === Math.min(n8nCost, makeCost, zapierCost);

                  return (
                    <div
                      key={key}
                      className={`rounded-lg p-4 border-2 ${
                        isBest
                          ? "border-green-500/50 bg-green-500/10"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="text-sm font-bold uppercase"
                          style={{ color: config.brandColor }}
                        >
                          {config.name}
                        </div>
                        {isBest && <span className="text-xs font-bold text-green-400 bg-green-500/20 px-2 py-1 rounded">BEST VALUE</span>}
                      </div>
                      <div className="text-2xl font-black text-white font-mono">${cost.toFixed(2)}</div>
                      <div className="text-xs text-slate-400 mt-2">/month</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
