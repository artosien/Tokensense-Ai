"use client";

import { useState } from "react";
import { useTokenSenseStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { FileText, Info, Files, BookOpen, Code2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface Preset {
  label: string;
  icon: string;
  inputTokens: number;
  outputTokens: number;
  modelId: string;
  description: string;
  id: string;
}

export function ScenarioPresets() {
  const t = useTranslations("presets");
  const { setUserPrompt, setExpectedOutputTokens, setSelectedModelId, setInputTokenCount } =
    useTokenSenseStore();
  const [activePreset, setActivePreset] = useState<string | null>(null);
  
  // Dynamic state for Content Rewrite
  const [postCount, setPostCount] = useState(1);
  const [wordRangeIdx, setWordRangeIdx] = useState(0);

  // Dynamic state for Doc Summary
  const [docCount, setDocCount] = useState(1);
  const [docSizeIdx, setDocSizeIdx] = useState(0);

  // Dynamic state for Code Review
  const [codeReviewIdx, setCodeReviewIdx] = useState(1);

  const PRESETS: Preset[] = [
    {
      id: "chatbot",
      label: t("chatbot_label"),
      icon: "💬",
      inputTokens: 500,
      outputTokens: 300,
      modelId: "gpt-4o-mini",
      description: t("chatbot_desc"),
    },
    {
      id: "doc_summary",
      label: t("doc_summary_label"),
      icon: "📄",
      inputTokens: 0, // Dynamic
      outputTokens: 0, // Dynamic
      modelId: "claude-3-5-haiku",
      description: t("doc_summary_desc"),
    },
    {
      id: "content_rewrite",
      label: t("content_rewrite_label"),
      icon: "✍️",
      inputTokens: 0, // Dynamic
      outputTokens: 0, // Dynamic
      modelId: "claude-3-5-sonnet",
      description: t("content_rewrite_desc"),
    },
    {
      id: "code_review",
      label: t("code_review_label"),
      icon: "💻",
      inputTokens: 0, // Dynamic
      outputTokens: 0, // Dynamic
      modelId: "claude-3-5-sonnet",
      description: t("code_review_desc"),
    },
    {
      id: "long_report",
      label: t("long_report_label"),
      icon: "📊",
      inputTokens: 8000,
      outputTokens: 2000,
      modelId: "gemini-1-5-pro",
      description: t("long_report_desc"),
    },
    {
      id: "agent_loop",
      label: t("agent_loop_label"),
      icon: "🔄",
      inputTokens: 3000,
      outputTokens: 1200,
      modelId: "claude-3-5-sonnet",
      description: t("agent_loop_desc"),
    },
  ];

  const WORD_COUNT_RANGES = [
    { label: t("low") + " (10K-20K)", min: 10000, max: 20000, avg: 15000 },
    { label: t("medium") + " (30K-50K)", min: 30000, max: 50000, avg: 40000 },
    { label: t("high") + " (55K-80K)", min: 55000, max: 80000, avg: 67500 },
    { label: t("max") + " (90K+)", min: 90000, max: 120000, avg: 105000 },
  ];

  const DOC_SIZE_PRESETS = [
    { label: t("short") + " (1k words)", words: 1000 },
    { label: t("medium") + " (4k words)", words: 4000 },
    { label: t("high") + " (12k words)", words: 12000 },
    { label: t("deep") + " (25k words)", words: 25000 },
  ];

  const CODE_REVIEW_COMPLEXITY = [
    { label: t("low"), description: t("code_review_low", { count: 500 }), inputAvg: 500, outputAvg: 200 },
    { label: t("medium"), description: t("code_review_medium", { count: 2000 }), inputAvg: 2000, outputAvg: 800 },
    { label: t("high"), description: t("code_review_high", { count: 8000 }), inputAvg: 8000, outputAvg: 2500 },
  ];

  const applyPreset = (preset: Preset, forceUpdate: boolean = false) => {
    if (activePreset === preset.id && !forceUpdate) return;
    setActivePreset(preset.id);

    let inTokens = preset.inputTokens;
    let outTokens = preset.outputTokens;

    let promptText = "";

    if (preset.id === "content_rewrite") {
      const range = WORD_COUNT_RANGES[wordRangeIdx];
      const totalWords = range.avg * postCount;
      inTokens = Math.round(totalWords * 1.35);
      outTokens = inTokens; 
      promptText = t("content_rewrite_text", { count: postCount, total: (range.avg * postCount).toLocaleString() });
    } else if (preset.id === "doc_summary") {
      const size = DOC_SIZE_PRESETS[docSizeIdx];
      const totalWords = size.words * docCount;
      inTokens = Math.round(totalWords * 1.35);
      outTokens = 500 * docCount; // ~500 tokens summary per doc
      promptText = t("doc_summary_text", { count: docCount, words: DOC_SIZE_PRESETS[docSizeIdx].words.toLocaleString() });
    } else if (preset.id === "code_review") {
      const complexity = CODE_REVIEW_COMPLEXITY[codeReviewIdx];
      inTokens = complexity.inputAvg;
      outTokens = complexity.outputAvg;
      if (codeReviewIdx === 0) {
        promptText = t("code_review_low", { count: complexity.inputAvg });
      } else if (codeReviewIdx === 1) {
        promptText = t("code_review_medium", { count: complexity.inputAvg });
      } else {
        promptText = t("code_review_high", { count: complexity.inputAvg });
      }
    } else {
      const samplePrompts: Record<string, string> = {
        "chatbot": t("chatbot_text"),
        "long_report": t("long_report_text"),
        "agent_loop": t("agent_loop_text"),
      };
      promptText = samplePrompts[preset.id] || `[Preset applied]`;
    }

    setUserPrompt(promptText);
    setInputTokenCount(inTokens);
    setExpectedOutputTokens(outTokens);
    setSelectedModelId(preset.modelId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {t("title")}
        </span>
        <div className="flex-1 h-px bg-border/40" />
      </div>

      <div className="relative group/scroll">
        <div className="flex md:flex-wrap gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none mask-fade-right md:mask-none -mx-4 px-4 md:mx-0 md:px-0">
          {PRESETS.map((preset) => {
            const isActive = activePreset === preset.id;
            return (
              <button
                key={preset.id}
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
      {activePreset === "content_rewrite" && (
        <div className="bg-plasma-500/5 border border-plasma-500/10 rounded-2xl p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-3">
              <label className="text-[10px] font-bold text-plasma-400 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-3 h-3" />
                {t("num_articles")}
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
                    applyPreset(PRESETS.find(p => p.id === "content_rewrite")!, true);
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
                {t("word_count_scale")}
              </label>
              <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
                {WORD_COUNT_RANGES.map((range, idx) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      setWordRangeIdx(idx);
                      applyPreset(PRESETS.find(p => p.id === "content_rewrite")!, true);
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
            <span className="text-muted-foreground">{t("est_payload")}</span>
            <span className="text-plasma-400 font-bold">
              {t("words_total", { count: (WORD_COUNT_RANGES[wordRangeIdx].avg * postCount).toLocaleString() })}
            </span>
          </div>
        </div>
      )}

      {/* Dynamic Controls for Doc Summary */}
      {activePreset === "doc_summary" && (
        <div className="bg-plasma-500/5 border border-plasma-500/10 rounded-2xl p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-3">
              <label className="text-[10px] font-bold text-plasma-400 uppercase tracking-widest flex items-center gap-2">
                <Files className="w-3 h-3" />
                {t("num_docs")}
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="number"
                  min="1"
                  max="1000"
                  value={docCount}
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 1);
                    setDocCount(val);
                    applyPreset(PRESETS.find(p => p.id === "doc_summary")!, true);
                  }}
                  className="w-full h-10 bg-plasma-500/10 border border-plasma-500/20 rounded-lg px-3 font-mono text-white focus:outline-none focus:border-plasma-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <label className="text-[10px] font-bold text-plasma-400 uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="w-3 h-3" />
                {t("size_per_doc")}
              </label>
              <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
                {DOC_SIZE_PRESETS.map((size, idx) => (
                  <button
                    key={size.label}
                    onClick={() => {
                      setDocSizeIdx(idx);
                      applyPreset(PRESETS.find(p => p.id === "doc_summary")!, true);
                    }}
                    className={cn(
                      "px-2 py-2 rounded-lg text-[9px] font-bold uppercase transition-all border",
                      docSizeIdx === idx
                        ? "bg-plasma-500 text-black border-plasma-400"
                        : "bg-plasma-500/5 text-plasma-400 border-plasma-500/20 hover:border-plasma-500/40"
                    )}
                  >
                    {size.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-plasma-500/10 flex items-center justify-between text-[10px] font-mono">
            <span className="text-muted-foreground">{t("est_word_total")}</span>
            <span className="text-plasma-400 font-bold">
              {t("words_unit", { count: (DOC_SIZE_PRESETS[docSizeIdx].words * docCount).toLocaleString() })}
            </span>
          </div>
        </div>
      )}

      {/* Dynamic Controls for Code Review */}
      {activePreset === "code_review" && (
        <div className="bg-plasma-500/5 border border-plasma-500/10 rounded-2xl p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-3">
              <label className="text-[10px] font-bold text-plasma-400 uppercase tracking-widest flex items-center gap-2">
                <Code2 className="w-3 h-3" />
                {t("code_complexity")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CODE_REVIEW_COMPLEXITY.map((comp, idx) => (
                  <button
                    key={comp.label}
                    onClick={() => {
                      setCodeReviewIdx(idx);
                      applyPreset(PRESETS.find(p => p.id === "code_review")!, true);
                    }}
                    className={cn(
                      "px-2 py-2 rounded-lg text-[9px] font-bold uppercase transition-all border",
                      codeReviewIdx === idx
                        ? "bg-plasma-500 text-black border-plasma-400"
                        : "bg-plasma-500/5 text-plasma-400 border-plasma-500/20 hover:border-plasma-500/40"
                    )}
                  >
                    {comp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-plasma-500/10 flex items-center justify-between text-[10px] font-mono">
            <span className="text-muted-foreground">{CODE_REVIEW_COMPLEXITY[codeReviewIdx].description.split('\n')[0]}</span>
            <span className="text-plasma-400 font-bold">
              {t("est_tokens", { count: CODE_REVIEW_COMPLEXITY[codeReviewIdx].inputAvg.toLocaleString() })}
            </span>
          </div>
        </div>
      )}

      {activePreset && !["content_rewrite", "doc_summary", "code_review"].includes(activePreset) && (
        <p className="text-[10px] text-plasma-500/70 font-mono animate-in fade-in duration-300">
          {t("applied")}
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
