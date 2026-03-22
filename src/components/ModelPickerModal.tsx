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
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
      setTimeout(() => searchRef.current?.focus(), 150);
      setFocusedIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      setSearch("");
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Handle back gesture (Android)
  useEffect(() => {
    if (!open) return;
    const onPopState = (e: PopStateEvent) => {
      e.preventDefault();
      setOpen(false);
    };
    window.history.pushState({ open: true }, "");
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      if (window.history.state?.open) window.history.back();
    };
  }, [open]);

  // Global keydown listener when open
  useEffect(() => {
    if (!open) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && flatFiltered[focusedIndex]) {
        e.preventDefault();
        handleSelect(flatFiltered[focusedIndex].id);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [open, flatFiltered, focusedIndex]);

  const handleOpen = () => {
    triggerHaptic(15);
    setOpen(true);
  };

  const handleSelect = (id: string) => {
    triggerHaptic(15);
    onChange(id);
    setOpen(false);
  };

  if (!mounted) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )} 
        onClick={() => setOpen(false)} 
      />      

      {/* Modal / Bottom Sheet */}
      <div
        ref={dialogRef}
        className={cn(
          "fixed z-[110] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] bg-[#0d1117] border-slate-700/60 shadow-2xl overflow-hidden flex flex-col",
          "md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:rounded-2xl md:border md:h-auto",
          "inset-x-0 bottom-0 rounded-t-[24px] border-t max-h-[85vh] h-auto pb-[env(safe-area-inset-bottom)]",
          open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 md:opacity-0 md:scale-95"
        )}
      >
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-12 h-1.5 bg-slate-700/50 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <span className="text-sm font-semibold text-foreground">Select Model</span>
          <button
            onClick={() => setOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/50 rounded-xl px-3 h-12">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search by name or provider..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setFocusedIndex(0); }}
              className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-mono"
            />
            {search && (
              <button onClick={() => setSearch("")} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-3 space-y-4 md:max-h-[50vh]">
          {Object.entries(grouped).map(([provider, providerModels]) => {
            const pStyle = PROVIDER_COLORS[provider];
            return (
              <div key={provider}>
                <div className={cn("text-[10px] font-mono font-bold uppercase tracking-widest px-2 mb-1.5", pStyle?.accent ?? "text-muted-foreground")}>
                  {provider}
                </div>
                <div className="space-y-1">
                  {providerModels.map((model) => {
                    const flatIdx = flatFiltered.indexOf(model);
                    const isSelected = model.id === selectedModelId;
                    const isFocused = flatIdx === focusedIndex;
                    const tier = MODEL_TIERS[model.id];

                    return (
                      <button
                        key={model.id}
                        onClick={() => handleSelect(model.id)}
                        onMouseEnter={() => !isMobile && setFocusedIndex(flatIdx)}
                        className={cn(
                          "w-full flex items-center justify-between gap-2 px-3 rounded-xl text-left transition-all duration-100 min-h-[56px] py-3",
                          isSelected ? "bg-cyan-500/15 border border-cyan-500/30" : "border border-transparent",
                          isFocused && !isSelected && !isMobile ? "bg-slate-800/60" : "",
                          !isSelected && !isFocused && !isMobile ? "hover:bg-slate-800/40" : ""
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isSelected && <span className="text-cyan-400 text-xs shrink-0 font-bold">✓</span>}       
                          <span className={cn("text-base font-medium truncate", isSelected ? "text-cyan-300" : "text-foreground")}>
                            {model.name}
                          </span>
                          {tier && (
                            <span className={cn("hidden xs:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono border shrink-0", TIER_STYLES[tier])}>
                              {tier}
                            </span>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[11px] font-mono text-muted-foreground/60 whitespace-nowrap">
                             ${model.inputPricePer1M.toFixed(2)} / ${model.outputPricePer1M.toFixed(2)}
                          </div>
                          <div className="text-[9px] text-muted-foreground/40 font-mono">
                            per 1M tokens
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {flatFiltered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground/50 py-12">No models match "{search}"</p> 
          )}
        </div>

        <div className="hidden md:flex px-4 py-2 border-t border-slate-800 items-center gap-3 text-[10px] font-mono text-muted-foreground/40">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>Esc close</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="relative">
      {/* Trigger pill */}
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-150 min-h-[44px]",
          providerStyle?.border ?? "border-border/50",
          providerStyle?.bg ?? "bg-card/50",
          "hover:border-cyan-500/40 hover:bg-cyan-500/5"
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn("text-xs font-mono shrink-0", providerStyle?.accent ?? "text-muted-foreground")}>   
            {selectedModel.provider}
          </span>
          <span className="text-sm font-semibold text-foreground truncate">
            {selectedModel.name}
          </span>
          {MODEL_TIERS[selectedModelId] && (
            <span className={cn("hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border shrink-0", TIER_STYLES[MODEL_TIERS[selectedModelId]])}>
              {MODEL_TIERS[selectedModelId]}
            </span>
          )}
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      </button>

      {/* Portal for Modal */}
      {typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </div>
  );
}
