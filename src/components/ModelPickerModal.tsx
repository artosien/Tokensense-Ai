"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { models, ModelConfig } from "@/lib/models";
import { X, Search, ChevronDown, ChevronRight } from "lucide-react";
import { cn, triggerHaptic } from "@/lib/utils";

const PROVIDER_ORDER = [
  "OpenAI",
  "Anthropic",
  "Google",
  "DeepSeek",
  "Mistral",
  "Meta (Together AI)",
  "xAI",
  "Cohere",
  "Alibaba",
  "Amazon",
];

const PROVIDER_COLORS: Record<string, { accent: string; bg: string; border: string }> = {
  OpenAI: { accent: "text-emerald-400", bg: "bg-emerald-500/8", border: "border-emerald-500/20" },
  Anthropic: { accent: "text-orange-400", bg: "bg-orange-500/8", border: "border-orange-500/20" },
  Google: { accent: "text-blue-400", bg: "bg-blue-500/8", border: "border-blue-500/20" },
  DeepSeek: { accent: "text-indigo-400", bg: "bg-indigo-500/8", border: "border-indigo-500/20" },
  Mistral: { accent: "text-orange-500", bg: "bg-orange-500/8", border: "border-orange-500/20" },
  "Meta (Together AI)": { accent: "text-purple-400", bg: "bg-purple-500/8", border: "border-purple-500/20" },
  xAI: { accent: "text-slate-300", bg: "bg-slate-500/8", border: "border-slate-500/20" },
  Cohere: { accent: "text-teal-400", bg: "bg-teal-500/8", border: "border-teal-500/20" },
  Alibaba: { accent: "text-orange-600", bg: "bg-orange-600/8", border: "border-orange-600/20" },
  Amazon: { accent: "text-yellow-500", bg: "bg-yellow-500/8", border: "border-yellow-500/20" },
};

const MODEL_TIERS: Record<string, "Fast" | "Balanced" | "Smart" | "Reasoning"> = {
  "gpt-4o-mini": "Fast",
  "gpt-4.1-mini": "Fast",
  "claude-haiku-4-5-20251001": "Fast",
  "claude-haiku-3-5": "Fast",
  "gemini-2.5-flash-preview-04-17": "Fast",
  "gemini-1.5-flash-002": "Fast",
  "grok-4.1-fast": "Fast",
  "mistral-small-latest": "Fast",
  "amazon.nova-lite-v1:0": "Fast",
  
  "gpt-4o": "Balanced",
  "gpt-4.1": "Balanced",
  "gpt-5-mini": "Balanced",
  "claude-sonnet-4-6": "Balanced",
  "claude-sonnet-4-5": "Balanced",
  "gemini-3-flash": "Balanced",
  "gemini-2.5-pro-preview-05-06": "Balanced",
  "gemini-1.5-pro-002": "Balanced",
  "grok-3": "Balanced",
  "deepseek-chat": "Balanced",
  "codestral-latest": "Balanced",
  "pixtral-large-latest": "Balanced",
  "meta-llama/Llama-4-Scout-17B-16E-Instruct": "Balanced",
  "meta-llama/Llama-3.3-70B-Instruct": "Balanced",
  "command-r": "Balanced",
  "qwen2.5-72b-instruct": "Balanced",
  "sonar": "Balanced",
  "amazon.nova-pro-v1:0": "Balanced",
  "devstral-2-latest": "Balanced",

  "gpt-5": "Smart",
  "claude-opus-4-6": "Smart",
  "claude-opus-4-1": "Smart",
  "gemini-3.1-pro": "Smart",
  "grok-4": "Smart",
  "deepseek-v4": "Smart",
  "mistral-large-latest": "Smart",
  "mistral-medium-latest": "Smart",
  "meta-llama/Llama-4-Maverick-17B-128E-Instruct": "Smart",
  "meta-llama/Meta-Llama-3.1-405B-Instruct": "Smart",
  "command-r-plus": "Smart",
  "qwen3-235b-a22b": "Smart",

  "o1": "Reasoning",
  "o3": "Reasoning",
  "o4-mini": "Reasoning",
  "deepseek-reasoner": "Reasoning",
  "qwq-32b": "Reasoning",
};

const TIER_STYLES: Record<string, string> = {
  Fast: "text-green-400 bg-green-500/10 border-green-500/20",
  Balanced: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Smart: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Reasoning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

interface ModelPickerModalProps {
  selectedModelId: string;
  onChange: (modelId: string) => void;
}

export function ModelPickerModal({ selectedModelId, onChange }: ModelPickerModalProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const selectedModel = models.find((m) => m.id === selectedModelId);
  const providerStyle = selectedModel ? PROVIDER_COLORS[selectedModel.provider] : undefined;

  const filteredModels = models.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.provider.toLowerCase().includes(q)
    );
  });

  const grouped = PROVIDER_ORDER.reduce<Record<string, ModelConfig[]>>((acc, provider) => {
    const matches = filteredModels.filter((m) => m.provider === provider);
    if (matches.length > 0) acc[provider] = matches;
    return acc;
  }, {});

  const flatFiltered = Object.values(grouped).flat();

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [open]);

  // Handle click outside to close
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  const handleOpen = () => {
    triggerHaptic(15);
    setOpen((o) => !o);
  };

  const handleSelect = (id: string) => {
    triggerHaptic(15);
    onChange(id);
    setOpen(false);
  };

  if (!mounted) return null;

  const flyoutPanel = (
    <div
      className={cn(
        "bg-[#0d1117] border border-slate-700/60 shadow-2xl rounded-xl overflow-hidden flex flex-col",
        "animate-in fade-in duration-150",
        isDesktop
          ? // Desktop: fixed width flyout to the right
            "absolute left-[calc(100%+8px)] top-0 w-[280px] max-h-[480px] slide-in-from-left-2"
          : // Mobile: dropdown below
            "absolute top-full left-0 w-full mt-2 max-h-[400px] slide-in-from-top-2",
        "z-[200]"
      )}
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-slate-800 shrink-0 flex items-center gap-2">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/50 rounded-lg px-2 h-9 flex-1">
          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search models..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-mono min-w-0"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-muted-foreground/50 hover:text-muted-foreground">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <button
          onClick={() => setOpen(false)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-slate-800 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Desktop label */}
      {isDesktop && (
        <div className="px-3 pt-2.5 pb-1 shrink-0">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/50">
            {flatFiltered.length} models available
          </span>
        </div>
      )}

      {/* Model List */}
      <div className="overflow-y-auto flex-1 p-1.5 space-y-3 custom-scrollbar">
        {Object.entries(grouped).map(([provider, providerModels]) => {
          const pStyle = PROVIDER_COLORS[provider];
          return (
            <div key={provider}>
              <div className={cn("text-[9px] font-mono font-bold uppercase tracking-widest px-2 mb-1", pStyle?.accent ?? "text-muted-foreground")}>
                {provider}
              </div>
              <div className="space-y-0.5">
                {providerModels.map((model) => {
                  const isSelected = model.id === selectedModelId;
                  const tier = MODEL_TIERS[model.id];

                  return (
                    <button
                      key={model.id}
                      onClick={() => handleSelect(model.id)}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 px-2 rounded-lg text-left transition-all duration-100 min-h-[44px] py-2",
                        isSelected ? "bg-plasma-500/10 border border-plasma-500/20" : "border border-transparent hover:bg-slate-800/40"
                      )}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className={cn("text-xs font-medium truncate", isSelected ? "text-plasma-400" : "text-foreground")}>
                          {model.name}
                        </span>
                        <span className="text-[9px] text-muted-foreground/50 font-mono">
                          ${model.inputPricePer1M}/${model.outputPricePer1M} per 1M
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {tier && (
                          <span className={cn("text-[8px] font-bold font-mono uppercase px-1.5 py-0.5 rounded-full border", TIER_STYLES[tier])}>
                            {tier}
                          </span>
                        )}
                        {isSelected && <span className="text-plasma-400 text-[10px] font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {flatFiltered.length === 0 && (
          <p className="text-center text-xs text-muted-foreground/50 py-8">No results for "{search}"</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger pill */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-150 min-h-[44px]",
          providerStyle?.border ?? "border-border/50",
          providerStyle?.bg ?? "bg-card/50",
          "hover:border-plasma-500/40 hover:bg-plasma-500/5",
          open && "ring-2 ring-plasma-500/20 border-plasma-500/40"
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedModel ? (
            <>
              <span className={cn("text-[10px] font-mono shrink-0 font-bold uppercase", providerStyle?.accent ?? "text-muted-foreground")}>
                {selectedModel.provider}
              </span>
              <span className="text-sm font-semibold text-foreground truncate">
                {selectedModel.name}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-muted-foreground tracking-wide">Select a model to see cost &rarr;</span>
          )}
        </div>
        {/* Show ChevronRight on desktop (flyout), ChevronDown on mobile (dropdown) */}
        {isDesktop ? (
          <ChevronRight className={cn("w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform", open && "text-plasma-400")} />
        ) : (
          <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")} />
        )}
      </button>

      {/* Flyout / Dropdown */}
      {open && flyoutPanel}
    </div>
  );
}
