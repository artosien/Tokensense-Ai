"use client";

import dynamic from "next/dynamic";
import { useTokenSenseStore } from "@/lib/store";
import { useDebounce } from "@/hooks/useDebounce";

const CompareMode = dynamic(() => import("@/components/CompareMode").then(m => m.CompareMode), { ssr: false });

export function ComparisonTableSection() {
  const { userPrompt } = useTokenSenseStore();
  const debouncedPrompt = useDebounce(userPrompt, 800);
  const showComparisonTable = debouncedPrompt.trim().length > 0;

  if (!showComparisonTable) return null;

  return (
    <div className="animate-fade-in my-8 relative z-10">
      <CompareMode />
    </div>
  );
}
