"use client";

import { useState } from "react";
import { useTokenSenseStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { FileText, Info } from "lucide-react";

interface Preset {
  label: string;
  icon: string;
  inputTokens: number;
  outputTokens: number;
  modelId: string;
  description: string;
}

const PRESETS: Preset[] = [
  {
    label: "Chatbot Turn",
    icon: "💬",
    inputTokens: 500,
    outputTokens: 300,
    modelId: "gpt-4o-mini",
    description: "Typical back-and-forth message",
  },
  {
    label: "Doc Summary",
    icon: "📄",
    inputTokens: 4000,
    outputTokens: 500,
    modelId: "claude-3-5-haiku",
    description: "Summarize a document",
  },
  {
    label: "Content Rewrite",
    icon: "✍️",
    inputTokens: 0, // Dynamic
    outputTokens: 0, // Dynamic
    modelId: "claude-3-5-sonnet",
    description: "Bulk rewriting existing blog articles",
  },
  {
    label: "Code Review",
    icon: "💻",
    inputTokens: 2000,
    outputTokens: 800,
    modelId: "claude-3-5-sonnet",
    description: "Review a code file",
  },
  {
    label: "Long Report",
    icon: "📊",
    inputTokens: 8000,
    outputTokens: 2000,
    modelId: "gemini-1-5-pro",
    description: "Analyse and write a full report",
  },
  {
    label: "Agent Loop",
    icon: "🔄",
    inputTokens: 3000,
    outputTokens: 1200,
    modelId: "claude-3-5-sonnet",
    description: "Multi-step agentic task",
  },
];

const WORD_COUNT_RANGES = [
  { label: "Low (10K-20K)", min: 10000, max: 20000, avg: 15000 },
  { label: "Medium (30K-50K)", min: 30000, max: 50000, avg: 40000 },
  { label: "High (55K-80K)", min: 55000, max: 80000, avg: 67500 },
  { label: "Max (90K+)", min: 90000, max: 120000, avg: 105000 },
];

export function ScenarioPresets() {
  const { setUserPrompt, setExpectedOutputTokens, setSelectedModelId, setInputTokenCount } =
    useTokenSenseStore();
  const [activePreset, setActivePreset] = useState<string | null>(null);
  
  // Dynamic state for Content Rewrite
  const [postCount, setPostCount] = useState(1);
  const [wordRangeIdx, setWordRangeIdx] = useState(0);

  const applyPreset = (preset: Preset, forceUpdate: boolean = false) => {
    if (activePreset === preset.label && !forceUpdate) return;
    setActivePreset(preset.label);

    let inTokens = preset.inputTokens;
    let outTokens = preset.outputTokens;

    if (preset.label === "Content Rewrite") {
      const range = WORD_COUNT_RANGES[wordRangeIdx];
      // Average words * 1.35 tokens/word * number of posts
      const totalWords = range.avg * postCount;
      inTokens = Math.round(totalWords * 1.35);
      outTokens = inTokens; // Usually rewrite is roughly 1:1
    }

    const samplePrompts: Record<string, string> = {
      "Chatbot Turn":
        "Hi, can you help me understand how transformer models handle long-range dependencies in text?",
      "Doc Summary":
        `Please summarize the following document regarding quarterly performance...`,
      "Content Rewrite": 
        `You are an expert editor. Please rewrite the following ${postCount} blog articles (totaling ~${(WORD_COUNT_RANGES[wordRangeIdx].avg * postCount).toLocaleString()} words) to improve SEO, readability, and engagement. Maintain the original core message but modernize the tone.\n\n[Content of ${postCount} articles would follow here...]`,
      "Code Review":
        `Please review this Python function for bugs and style...`,
      "Long Report":
        "Analyze the following market data and write a comprehensive report...",
      "Agent Loop":
        "You are an autonomous research agent. Your goal is to search and synthesize papers...",
    };

    const promptText = samplePrompts[preset.label] || `[Preset applied]`;

    setUserPrompt(promptText);
    setInputTokenCount(inTokens);
    setExpectedOutputTokens(outTokens);
    setSelectedModelId(preset.modelId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Quick Presets
        </span>
        <div className="flex-1 h-px bg-border/40" />
      </div>

      <div className="relative group/scroll">
        <div className="flex md:flex-wrap gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none mask-fade-right md:mask-none -mx-4 px-4 md:mx-0 md:px-0">
          {PRESETS.map((preset) => {
            const isActive = activePreset === preset.label;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                className={cn(
                  "relative inline-flex items-center gap-2 px-4 py-2.5 md:px-3 md:py-1.5 rounded-full text-xs font-medium border transition-all duration-200 whitespace-nowrap min-h-[44px] md:min-h-0",
                  isActive
                    ? "border-plasma-400 bg-plasma-500/15 text-plasma-300 shadow-[0_0_12px_rgba(0,229,255,0.2)]"      
                    : "border-border/50 bg-card/50 text-muted-foreground hover:border-plasma-500/60 hover:bg-plasma-500/8 hover:text-plasma-400"
                )}
              >
                <span className="text-sm leading-none">{preset.icon}</span>
                <span>{preset.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-plasma-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Controls for Content Rewrite */}
      {activePreset === "Content Rewrite" && (
        <div className="bg-plasma-500/5 border border-plasma-500/10 rounded-2xl p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-3">
              <label className="text-[10px] font-bold text-plasma-400 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-3 h-3" />
                Number of Articles
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={postCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setPostCount(val);
                    applyPreset(PRESETS.find(p => p.label === "Content Rewrite")!, true);
                  }}
                  className="flex-1 h-1.5 bg-plasma-500/20 rounded-lg appearance-none cursor-pointer accent-plasma-500"
                />
                <span className="font-mono text-sm font-bold text-white bg-plasma-500/20 px-3 py-1 rounded-md min-w-[3rem] text-center">
                  {postCount}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <label className="text-[10px] font-bold text-plasma-400 uppercase tracking-widest flex items-center gap-2">
                <Info className="w-3 h-3" />
                Word Count Scale (Total)
              </label>
              <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
                {WORD_COUNT_RANGES.map((range, idx) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      setWordRangeIdx(idx);
                      applyPreset(PRESETS.find(p => p.label === "Content Rewrite")!, true);
                    }}
                    className={cn(
                      "px-2 py-2 rounded-lg text-[9px] font-bold uppercase transition-all border",
                      wordRangeIdx === idx
                        ? "bg-plasma-500 text-black border-plasma-400"
                        : "bg-plasma-500/5 text-plasma-400 border-plasma-500/20 hover:border-plasma-500/40"
                    )}
                  >
                    {range.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-plasma-500/10 flex items-center justify-between text-[10px] font-mono">
            <span className="text-muted-foreground">Estimated Payload:</span>
            <span className="text-plasma-400 font-bold">
              ~{(WORD_COUNT_RANGES[wordRangeIdx].avg * postCount).toLocaleString()} words total
            </span>
          </div>
        </div>
      )}

      {activePreset && activePreset !== "Content Rewrite" && (
        <p className="text-[10px] text-plasma-500/70 font-mono animate-in fade-in duration-300">
          Preset applied
        </p>
      )}

      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 767px) {
          .mask-fade-right {
            mask-image: linear-gradient(to right, black 85%, transparent 100%);
          }
        }
      `}</style>
    </div>
  );
}
