"use client";

import { useState } from "react";
import { useTokenSenseStore } from "@/lib/store";
import { cn } from "@/lib/utils";

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
    icon: "??",
    inputTokens: 500,
    outputTokens: 300,
    modelId: "gpt-5-mini",
    description: "Typical back-and-forth message",
  },
  {
    label: "Doc Summary",
    icon: "??",
    inputTokens: 4000,
    outputTokens: 500,
    modelId: "claude-4.5-haiku",
    description: "Summarize a document",
  },
  {
    label: "RAG Chunk",
    icon: "??",
    inputTokens: 1500,
    outputTokens: 400,
    modelId: "gpt-5-mini",
    description: "Retrieval-augmented generation",
  },
  {
    label: "Code Review",
    icon: "??",
    inputTokens: 2000,
    outputTokens: 800,
    modelId: "claude-4.6-sonnet",
    description: "Review a code file",
  },
  {
    label: "Email Draft",
    icon: "??",
    inputTokens: 300,
    outputTokens: 250,
    modelId: "gpt-5-mini",
    description: "Compose a short email",
  },
  {
    label: "Long Report",
    icon: "??",
    inputTokens: 8000,
    outputTokens: 2000,
    modelId: "gemini-3.1-pro",
    description: "Analyse and write a full report",
  },
  {
    label: "Translation",
    icon: "??",
    inputTokens: 1000,
    outputTokens: 1000,
    modelId: "gpt-5-mini",
    description: "Translate a passage",
  },
  {
    label: "Agent Loop",
    icon: "??",
    inputTokens: 3000,
    outputTokens: 1200,
    modelId: "claude-4.6-sonnet",
    description: "Multi-step agentic task",
  },
];

export function ScenarioPresets() {
  const { setUserPrompt, setExpectedOutputTokens, setSelectedModelId } =
    useTokenSenseStore();
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const applyPreset = (preset: Preset) => {
    setActivePreset(preset.label);

    const samplePrompts: Record<string, string> = {
      "Chatbot Turn":
        "Hi, can you help me understand how transformer models handle long-range dependencies in text? I'm working on a NLP project and want to know the trade-offs between attention mechanisms.",
      "Doc Summary":
        `Please summarize the following document:\n\n` +
        `Introduction\nThis report covers quarterly performance metrics across all business units. The analysis includes revenue, operational costs, customer acquisition, and retention rates.\n\n` +
        `Key Findings\nRevenue grew 14% year-over-year, driven primarily by enterprise subscriptions. Operational costs increased 8%, within projected range. Customer churn dropped to 3.2%, the lowest in 18 months.\n\n` +   
        `Recommendations\nInvest in customer success programs. Expand enterprise sales team. Review infrastructure costs for Q3 optimization.`,
      "RAG Chunk":
        "Based on the following context, answer the user's question.\n\nContext: [Retrieved document chunk about vector databases and embedding models]\n\nQuestion: What are the main advantages of using a vector database over a traditional relational database for semantic search?",
      "Code Review":
        `Please review this Python function for bugs, performance issues, and style:\n\n` +
        `def process_data(records):\n    results = []\n    for i in range(len(records)):\n        item = records[i]\n        if item['status'] == 'active':\n            results.append({'id': item['id'], 'value': item['value'] * 1.1})\n    return results`,
      "Email Draft":
        "Write a professional follow-up email to a client after a product demo. Mention the key features they showed interest in (AI automation and reporting), offer to answer questions, and suggest scheduling a technical call next week.",
      "Long Report":
        "Analyze the following market data and write a comprehensive report covering trends, competitive landscape, opportunities, and risks for an AI SaaS company entering the healthcare sector in 2025.\n\n[Market data would appear here, including TAM estimates, regulatory overview, competitor analysis, and growth projections across 5 years...]",
      "Translation":
        "Translate the following text from English to Spanish, preserving the formal business tone:\n\nDear valued client, we are pleased to inform you that your account has been successfully upgraded to our Professional tier. You now have access to all premium features including advanced analytics, priority support, and unlimited API calls.",
      "Agent Loop":
        "You are an autonomous research agent. Your goal is to: 1) Search for recent papers on multi-modal AI models, 2) Summarize the top 3 most cited papers from 2024, 3) Extract key methodologies from each, 4) Compare their approaches and identify trends, 5) Write a synthesis report with your findings and recommendations for practitioners.",
    };

    const promptText =
      samplePrompts[preset.label] ||
      `[${preset.description} - approximately ${preset.inputTokens} input tokens]`;

    setUserPrompt(promptText);
    setExpectedOutputTokens(preset.outputTokens);
    setSelectedModelId(preset.modelId);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Quick Presets
        </span>
        <div className="flex-1 h-px bg-border/40" />
      </div>

      {/* Horizontal scroll on mobile, wrap on desktop */}
      <div className="relative group/scroll">
        <div className="flex md:flex-wrap gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none mask-fade-right md:mask-none -mx-4 px-4 md:mx-0 md:px-0">
          {PRESETS.map((preset) => {
            const isActive = activePreset === preset.label;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                title={preset.description}
                className={cn(
                  "relative inline-flex items-center gap-2 px-4 py-2.5 md:px-3 md:py-1.5 rounded-full text-xs font-medium border transition-all duration-200 whitespace-nowrap min-h-[44px] md:min-h-0",
                  isActive
                    ? "border-plasma-400 bg-plasma-500/15 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]"      
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

      {activePreset && (
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
