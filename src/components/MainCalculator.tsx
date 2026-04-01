"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { RestoredSessionBanner } from "@/components/RestoredSessionBanner";
import { usePersistedCalculator } from "@/hooks/usePersistedCalculator";
import { useTokenSenseStore } from "@/lib/store";
import { useShareableUrl } from "@/hooks/useShareableUrl";

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
    setExpectedOutputTokens
  } = useTokenSenseStore();
  const { parseUrlState } = useShareableUrl();

  const hasPromptContent = userPrompt.trim().length > 0;

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
      <div className="flex flex-col md:flex-row gap-6 text-left">
        {/* Left Panel - 60% */}
        <div className="w-full lg:w-[60%] space-y-6">
          {mounted && restored && (
            <RestoredSessionBanner onClear={() => setRestored(false)} />
          )}
          <PromptEditor />
        </div>

        {/* Right Panel - 40%, sticky */}
        <div className="w-full lg:w-[40%]">
          <div className="lg:sticky lg:top-[72px]">
            <div className="space-y-6">
              <MetricsDashboard />
              {hasPromptContent && <ConversationSimulator />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
