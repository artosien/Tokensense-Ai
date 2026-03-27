"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { models, ModelConfig } from "@/lib/models";
import { X, Search, ChevronDown } from "lucide-react";
import { cn, triggerHaptic } from "@/lib/utils";

const PROVIDER_ORDER = ["OpenAI", "Anthropic", "Google", "Meta (DeepInfra)", "xAI"];

const PROVIDER_COLORS: Record<string, { accent: string; bg: string; border: string }> = {
  OpenAI: { accent: "text-emerald-400", bg: "bg-emerald-500/8", border: "border-emerald-500/20" },
  Anthropic: { accent: "text-orange-400", bg: "bg-orange-500/8", border: "border-orange-500/20" },
  Google: { accent: "text-blue-400", bg: "bg-blue-500/8", border: "border-blue-500/20" },
  "Meta (DeepInfra)": { accent: "text-purple-400", bg: "bg-purple-500/8", border: "border-purple-500/20" },     
  xAI: { accent: "text-slate-300", bg: "bg-slate-500/8", border: "border-slate-500/20" },
};

const MODEL_TIERS: Record<string, "Fast" | "Balanced" | "Smart" | "Reasoning"> = {
  "gpt-5-mini": "Fast",
  "gemini-2.5-flash-lite": "Fast",
  "gemini-3-flash": "Fast",
  "claude-4.5-haiku": "Fast",
  "llama-3.3-70b": "Fast",
  "gpt-4o": "Balanced",
  "gemini-2.5-pro": "Balanced",
  "gemini-3.1-pro": "Balanced",
  "claude-4.6-sonnet": "Balanced",
  "claude-3.5-sonnet": "Balanced",
  "gpt-5.2": "Smart",
  "claude-4.6-opus": "Smart",
  "grok-4": "Smart",
  "o1": "Reasoning",
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
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedModel = models.find((m) => m.id === selectedModelId) ?? models[0];
  const providerStyle = PROVIDER_COLORS[selectedModel.provider];

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
      setFocusedIndex(0);
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

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger pill */}
      <button
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
          <span className={cn("text-[10px] font-mono shrink-0 font-bold uppercase", providerStyle?.accent ?? "text-muted-foreground")}>   
            {selectedModel.provider}
          </span>
          <span className="text-sm font-semibold text-foreground truncate">
            {selectedModel.name}
          </span>
        </div>
        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div 
          className={cn(
            "absolute top-full left-0 w-full mt-2 z-[100] bg-[#0d1117] border border-slate-700/60 shadow-2xl rounded-xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200",
            "max-h-[400px]"
          )}
        >
          {/* Search Header */}
          <div className="px-3 py-2 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/50 rounded-lg px-2 h-9">
              <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setFocusedIndex(0); }}
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-mono min-w-0"
              />
            </div>
          </div>

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
                              ${model.inputPricePer1M}/${model.outputPricePer1M}
                            </span>
                          </div>
                          {isSelected && <span className="text-plasma-400 text-[10px] shrink-0 font-bold">✓</span>}
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
      )}
    </div>
  );
}

