"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Copy, Check, Info, Sparkles, TrendingDown, LayoutGrid, FileDown, Zap, Shield, Rocket, ChevronDown } from "lucide-react";
import CostDisclaimer from "./CostDisclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── Pricing Data ───────────────────────────────────────────────────────────

const PLATFORM_PRICING = {
  n8n: {
    name: "n8n Cloud",
    pricePerExecution: 0.004,
    freeExecs: 2500,
    brandColor: "#00B4FF",
    brandGlow: "rgba(0, 180, 255, 0.5)",
    billingUnit: "Execution",
    tooltip: "One full workflow run, regardless of how many steps are inside.",
    annualDiscount: 0.2, // 20% off
    tiers: [
      { label: "Starter", executions: 2500, price: 0 },
      { label: "Pro", executions: 10000, price: 24 },
    ],
  },
  make: {
    name: "Make",
    pricePerOp: 0.001,
    freeOps: 1000,
    brandColor: "#FF6B35",
    brandGlow: "rgba(255, 107, 53, 0.5)",
    billingUnit: "Operation",
    tooltip: "Each module that runs inside a scenario. A 5-step scenario uses 5 operations.",
    annualDiscount: 0.15, // 15% off
    tiers: [
      { label: "Free", ops: 1000, price: 0 },
      { label: "Core", ops: 10000, price: 9 },
    ],
  },
  zapier: {
    name: "Zapier",
    pricePerTask: 0.025,
    freeTasks: 100,
    brandColor: "#FF4F00",
    brandGlow: "rgba(255, 79, 0, 0.5)",
    billingUnit: "Task",
    tooltip: "Each action step performed. Trigger steps are free; actions cost 1 task.",
    annualDiscount: 0.33, // 33% off
    tiers: [
      { label: "Free", tasks: 100, price: 0 },
      { label: "Starter", tasks: 750, price: 19.99 },
    ],
  },
};

const TEMPLATES = [
  {
    id: "content",
    label: "Content Automation Pipeline",
    executions: 5000,
    steps: 12,
    aiCalls: 3,
    tokens: 2500,
    model: "gpt4o",
  },
  {
    id: "lead",
    label: "Lead Enrichment Workflow",
    executions: 25000,
    steps: 6,
    aiCalls: 1,
    tokens: 1500,
    model: "gpt4o-mini",
  },
  {
    id: "ecommerce",
    label: "E-commerce Order Processing",
    executions: 15000,
    steps: 8,
    aiCalls: 2,
    tokens: 1000,
    model: "claude-haiku",
  },
];

const AI_MODELS = [
  { id: "none", label: "None", inputCost: 0, outputCost: 0 },
  { id: "gpt4o", label: "GPT-4o", inputCost: 5, outputCost: 15 }, // Per 1M
  { id: "gpt4o-mini", label: "GPT-4o mini", inputCost: 0.15, outputCost: 0.6 },
  { id: "claude-sonnet", label: "Claude Sonnet", inputCost: 3, outputCost: 15 },
  { id: "claude-haiku", label: "Claude Haiku", inputCost: 0.25, outputCost: 1.25 },
  { id: "gemini-flash", label: "Gemini Flash", inputCost: 0.05, outputCost: 0.15 },
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
  const [executions, setExecutions] = useState(10000); // Default to 10k
  const [stepsPerExec, setStepsPerExec] = useState(5); // Default to 5
  const [aiModel, setAiModel] = useState("gpt4o-mini"); // Default to gpt4o-mini
  const [aiCalls, setAiCalls] = useState(1); // Default to 1 call per exec
  const [tokensPerCall, setTokensPerCall] = useState(1000);
  const [isAnnual, setIsAnnual] = useState(false);
  const [compareMode, setCompareMode] = useState(true); // Default to true
  const [copied, setCopied] = useState(false);
  const [displayCost, setDisplayCost] = useState(0);
  const animationRef = useRef<number | null>(null);

  const model = AI_MODELS.find((m) => m.id === aiModel) || AI_MODELS[0];

  // Calculate costs for a specific platform
  const getCostsForPlatform = useCallback((p: keyof typeof PLATFORM_PRICING) => {
    const config = PLATFORM_PRICING[p];
    let baseCost = 0;

    if (p === "n8n") {
      baseCost = Math.max(0, (executions - config.freeExecs) * config.pricePerExecution);
    } else if (p === "make") {
      const ops = executions * stepsPerExec;
      baseCost = Math.max(0, (ops - config.freeOps) * config.pricePerOp);
    } else if (p === "zapier") {
      baseCost = Math.max(0, (executions - config.freeTasks) * config.pricePerTask);
    }

    if (isAnnual) {
        baseCost = baseCost * (1 - config.annualDiscount);
    }

    let aiCost = 0;
    if (aiModel !== "none" && aiCalls > 0) {
      const inputTokens = (executions * aiCalls) * tokensPerCall;
      const outputTokens = inputTokens * 0.3; // Assume 30% of input for output
      aiCost = inputTokens * (model.inputCost / 1000000) + outputTokens * (model.outputCost / 1000000);
    }

    return { baseCost, aiCost, total: baseCost + aiCost };
  }, [executions, stepsPerExec, aiModel, aiCalls, tokensPerCall, model, isAnnual]);

  const costs = getCostsForPlatform(platform);

  const allPlatformCosts = useMemo(() => {
    return {
        n8n: getCostsForPlatform("n8n"),
        make: getCostsForPlatform("make"),
        zapier: getCostsForPlatform("zapier")
    };
  }, [getCostsForPlatform]);

  const recommendations = useMemo(() => {
    const sorted = Object.entries(allPlatformCosts).sort((a, b) => a[1].total - b[1].total);
    const cheapest = sorted[0][0] as keyof typeof PLATFORM_PRICING;
    const diff = sorted[1][1].total - sorted[0][1].total;
    
    return {
        cheapest,
        savings: diff,
        scalable: "n8n" as const,
        aiHeavy: "n8n" as const, // n8n is generally better for complex AI flows due to execution-based pricing
    };
  }, [allPlatformCosts]);

  // Template handler
  const applyTemplate = (templateId: string) => {
    const t = TEMPLATES.find(tmp => tmp.id === templateId);
    if (t) {
        setExecutions(t.executions);
        setStepsPerExec(t.steps);
        setAiCalls(t.aiCalls);
        setTokensPerCall(t.tokens);
        setAiModel(t.model);
    }
  };

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
    const summary = `FlowCost Summary — A TokenSense-AI Tool
-----------------------------------------
Platform: ${PLATFORM_PRICING[platform].name}
Billing: ${isAnnual ? 'Annual (Monthly Avg)' : 'Monthly'}
Executions: ${fmtK(executions)}
Steps per Execution: ${stepsPerExec}
AI Model: ${model.label}
AI Calls: ${fmtK(executions * aiCalls)} total/mo
Tokens per Call: ${fmtK(tokensPerCall)}

Base Platform Cost: ${fmt(costs.baseCost)}
AI Model Cost: ${fmt(costs.aiCost)}
Total Monthly: ${fmt(costs.total)}
-----------------------------------------
Calculated at: tokensense-ai.com/workflow`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [platform, executions, stepsPerExec, aiModel, aiCalls, tokensPerCall, costs, model.label, isAnnual]);

  const platformConfig = PLATFORM_PRICING[platform];
  const annualBase = costs.total * 12;

  return (
    <div className="flow-cost">
      <TooltipProvider>
      <div className="grid-background p-4 md:p-8 rounded-3xl border border-white/5 overflow-hidden relative">
        <div className="max-w-6xl mx-auto space-y-10 relative z-10">
          
          {/* Header & Brand */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
                <LayoutGrid className="w-4 h-4" />
                FlowCost — A TokenSense-AI Tool
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                Workflow <span className="text-slate-500">Estimator</span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2 bg-white/5 rounded-full px-4 py-2 border border-white/10">
                    <Label htmlFor="billing-toggle" className={`text-xs font-bold uppercase tracking-wider ${!isAnnual ? 'text-indigo-400' : 'text-slate-500'}`}>Monthly</Label>
                    <Switch 
                        id="billing-toggle" 
                        checked={isAnnual} 
                        onCheckedChange={setIsAnnual}
                    />
                    <Label htmlFor="billing-toggle" className={`text-xs font-bold uppercase tracking-wider ${isAnnual ? 'text-indigo-400' : 'text-slate-500'}`}>Annual</Label>
                    {isAnnual && <span className="ml-2 text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-md font-bold">SAVING UP TO 33%</span>}
                </div>

                <Select onValueChange={applyTemplate}>
                    <SelectTrigger className="w-[240px] bg-white/5 border-white/10 h-10 text-xs font-bold uppercase tracking-wider text-slate-300">
                        <Rocket className="w-4 h-4 mr-2 text-indigo-400" />
                        <SelectValue placeholder="Quick Templates" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                        {TEMPLATES.map(t => (
                            <SelectItem key={t.id} value={t.id} className="text-xs">{t.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>

          {/* ── Side-by-Side Comparison Row (New Default) ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(allPlatformCosts).map(([key, pCosts]) => {
              const p = key as keyof typeof PLATFORM_PRICING;
              const config = PLATFORM_PRICING[p];
              const isSelected = platform === p;
              const isCheapest = recommendations.cheapest === p;

              return (
                <div 
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`relative cursor-pointer group rounded-2xl border-2 p-5 transition-all duration-300 ${
                        isSelected 
                        ? 'bg-white/10 border-indigo-500/50 shadow-2xl shadow-indigo-500/10' 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                >
                    {isCheapest && (
                        <div className="absolute -top-3 left-4 bg-green-500 text-black text-[10px] font-black px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            CHEAPEST
                        </div>
                    )}
                    {p === recommendations.scalable && (
                        <div className="absolute -top-3 right-4 bg-indigo-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            MOST SCALABLE
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-black uppercase tracking-widest" style={{ color: config.brandColor }}>{config.name}</div>
                        <div className={`p-1 rounded-full transition-colors ${isSelected ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-500'}`}>
                            <Check className={`w-3 h-3 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="text-3xl font-black text-white font-mono">{fmt(pCosts.total)}<span className="text-xs text-slate-500 ml-1">/mo</span></div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            ${pCosts.baseCost.toFixed(2)} Base + ${pCosts.aiCost.toFixed(2)} AI
                        </div>
                    </div>

                    {isCheapest && platform !== p && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] text-green-400 font-bold">
                            <Sparkles className="w-3.5 h-3.5" />
                            Save {fmt(recommendations.savings)}/mo
                        </div>
                    )}
                </div>
              );
            })}
          </div>

          {/* Main Configurator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Controls */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-400" />
                        Workflow Parameters
                    </h2>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Adjust to your scale</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Slider
                                label="Monthly Executions"
                                value={executions}
                                min={100}
                                max={100000}
                                step={100}
                                onChange={setExecutions}
                                unit="runs"
                            />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="w-3.5 h-3.5 text-slate-600 hover:text-slate-400 cursor-help mt-6" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 border-white/10 text-xs p-3 max-w-[200px]">
                                    How many times the entire workflow runs in a single month.
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <div className="flex items-center gap-2">
                            <Slider
                                label="Steps Per Execution"
                                value={stepsPerExec}
                                min={1}
                                max={30}
                                onChange={setStepsPerExec}
                            />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="w-3.5 h-3.5 text-slate-600 hover:text-slate-400 cursor-help mt-6" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 border-white/10 text-xs p-3 max-w-[200px]">
                                    <p className="font-bold mb-1">What counts as a step?</p>
                                    {platformConfig.tooltip}
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-2">Primary AI Model</label>
                            <Select value={aiModel} onValueChange={setAiModel}>
                                <SelectTrigger className="w-full bg-white/5 border-white/10 h-11 text-sm">
                                    <SelectValue placeholder="Select model" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10">
                                    {AI_MODELS.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {aiModel !== "none" && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Calls / Run</label>
                                    <Input 
                                        type="number" 
                                        value={aiCalls} 
                                        onChange={(e) => setAiCalls(Number(e.target.value))}
                                        className="bg-white/5 border-white/10 h-10 text-sm font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tokens / Call</label>
                                    <Input 
                                        type="number" 
                                        value={tokensPerCall} 
                                        onChange={(e) => setTokensPerCall(Number(e.target.value))}
                                        className="bg-white/5 border-white/10 h-10 text-sm font-mono"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
              </div>
            </div>

            {/* Right: Summary Card */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900 border-2 rounded-3xl p-8 sticky top-6 shadow-2xl transition-all duration-500" style={{ borderColor: platformConfig.brandColor }}>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{platformConfig.name} Estimate</div>
                            <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-slate-400">MARCH 2026</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-5xl font-black text-white font-mono tracking-tighter">${displayCost.toFixed(2)}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Per Month (Avg)</div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400 font-medium">Platform Fees</span>
                                <span className="text-white font-mono font-bold">{fmt(costs.baseCost)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400 font-medium">AI Token Cost</span>
                                <span className="text-white font-mono font-bold">{fmt(costs.aiCost)}</span>
                            </div>
                            <div className="flex items-center justify-between text-lg font-bold pt-4 border-t border-white/10">
                                <span className="text-white">Annual Total</span>
                                <span className="text-indigo-400 font-mono">{fmt(annualBase)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-6">
                            <Button 
                                onClick={copySummary}
                                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider py-6"
                            >
                                {copied ? <Check className="w-4 h-4 mr-2 text-green-400" /> : <Copy className="w-4 h-4 mr-2 text-slate-400" />}
                                {copied ? "Copied" : "Copy Summary"}
                            </Button>
                            <Button 
                                variant="outline"
                                className="border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 font-bold text-xs uppercase tracking-wider py-6"
                            >
                                <FileDown className="w-4 h-4 mr-2" />
                                PDF
                            </Button>
                        </div>

                        <p className="text-[9px] text-slate-600 leading-relaxed text-center">
                            * {platformConfig.name} billing unit: {platformConfig.billingUnit}s. AI costs estimated on typical input/output ratios. 
                            {isAnnual ? ' Annual pricing includes standard platform prepay discounts.' : ''}
                        </p>
                    </div>
                </div>
                
                {/* Insights Panel */}
                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6 space-y-4">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        Platform Insights
                    </h3>
                    <div className="space-y-3">
                        <div className="text-sm text-slate-300 leading-relaxed">
                            💡 {platform === "zapier" ? "Zapier is great for simple connections, but at this volume, n8n Cloud would save you significant platform fees." : ""}
                            {platform === "make" ? "Your multi-step workflow uses many operations. Monitor your Make usage closely as it can scale costs faster than executions." : ""}
                            {platform === "n8n" ? "Your workflow is well-optimized for n8n's execution-based billing. High step counts don't increase your platform bill here." : ""}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      </TooltipProvider>
    </div>
  );
}
