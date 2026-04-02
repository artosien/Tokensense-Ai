"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { RestoredSessionBanner } from "@/components/RestoredSessionBanner";
import { usePersistedCalculator } from "@/hooks/usePersistedCalculator";
import { useTokenSenseStore } from "@/lib/store";
import { useShareableUrl } from "@/hooks/useShareableUrl";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import Link from "next/link";

const PromptEditor = dynamic(() => import("@/components/PromptEditor"), { 
  ssr: false,
  loading: () => <div className="h-[500px] animate-pulse bg-card/50 rounded-2xl border border-border/40" />
});
const MetricsDashboard = dynamic(() => import("@/components/MetricsDashboard"), { 
  ssr: false,
  loading: () => <div className="h-[600px] animate-pulse bg-card/50 rounded-2xl border border-border/40" />
});
const ConversationSimulator = dynamic(() => import("@/components/ConversationSimulator"), { ssr: false });

export function MainCalculator() {
  const [mounted, setMounted] = useState(false);
  const { input, model, restored, setRestored } = usePersistedCalculator();
  const { 
    userPrompt, 
    setUserPrompt, 
    setSelectedModelId, 
    setExpectedOutputTokens,
    inputTokenCount,
    fileTokenCount,
    setMissionStep
  } = useTokenSenseStore();
  const { parseUrlState } = useShareableUrl();

  const hasPromptContent = userPrompt.trim().length > 0;
  const totalTkn = inputTokenCount + fileTokenCount;

  useEffect(() => {
    const urlState = parseUrlState();
    if (urlState) {
      if (urlState.modelId) setSelectedModelId(urlState.modelId);
      if (urlState.outputTokens) setExpectedOutputTokens(urlState.outputTokens);
    } else {
      if (input) setUserPrompt(input);
      if (model) setSelectedModelId(model);
    }
    setMounted(true);
  }, [input, model, parseUrlState, setSelectedModelId, setUserPrompt, setExpectedOutputTokens]);

  return (
    <div id="calculate-section" className="relative scroll-mt-20">
      <div className="flex flex-col lg:flex-row gap-8 text-left">
        {/* Left Panel - 60% */}
        <div className="w-full lg:w-[60%] xl:w-[65%] space-y-6">
          {mounted && restored && (
            <RestoredSessionBanner onClear={() => setRestored(false)} />
          )}
          <PromptEditor />
        </div>

        {/* Right Panel - 40%, sticky */}
        <div className="w-full lg:w-[40%] xl:w-[35%]">
          <div className="sticky top-20 lg:top-[72px] space-y-6">
            <MetricsDashboard />

            {hasPromptContent && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                <Button 
                    asChild
                    onClick={() => setMissionStep(2)}
                    className="w-full h-20 rounded-3xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl shadow-2xl shadow-indigo-500/20 gap-4 group uppercase tracking-tighter"
                >
                    <Link href="/tools/context">
                        <Zap className="w-6 h-6 fill-white group-hover:animate-pulse" />
                        Launch Analysis
                    </Link>
                </Button>
                <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">
                    Trajectory Locked: {totalTkn.toLocaleString()} Tokens
                </p>
              </div>
            )}

            {hasPromptContent && <ConversationSimulator />}
          </div>
        </div>
      </div>
    </div>
  );
}
