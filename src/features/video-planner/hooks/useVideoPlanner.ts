"use client";

import { useState, useMemo, useEffect } from "react";
import { VideoMetadata } from "../lib/videoAnalyzer";
import { TokenConfig, TokenBreakdown, calculateTokens } from "../lib/tokenCalculator";
import { CostEstimate, estimateCosts } from "../lib/providerPricing";
import { Recommendation, generateRecommendation } from "../lib/recommendationEngine";
import { runExactMeasurement, ExactMeasurementResult } from "../lib/exactMeasurement";
import { getAvailableProviders } from "../lib/apiKeyStore";

export function useVideoPlanner() {
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [config, setConfig] = useState<TokenConfig>({
    frameSamplingFps: 1,
    includeAudio: true,
    promptTokens: 500,
  });
  
  const [exactResults, setExactResults] = useState<ExactMeasurementResult[]>([]);
  const [isMeasuring, setIsMeasuring] = useState(false);

  const breakdown = useMemo(() => {
    if (!metadata) return null;
    return calculateTokens(metadata, config);
  }, [metadata, config]);

  const estimates = useMemo(() => {
    if (!breakdown) return [];
    
    let baseEstimates = estimateCosts(breakdown);
    
    // Merge exact results if available
    if (exactResults.length > 0) {
      baseEstimates = baseEstimates.map(est => {
        const exact = exactResults.find(r => r.provider.toLowerCase() === est.model.provider.toLowerCase());
        if (exact && !exact.error) {
          // Recalculate cost with exact tokens
          const totalCost = (exact.inputTokens / 1000) * est.model.inputPricePerKToken;
          return {
            ...est,
            totalCost,
            effectiveTokens: exact.inputTokens,
            mode: "exact" as const,
          };
        }
        return est;
      });
      // Re-sort because exact costs might change the order
      baseEstimates.sort((a, b) => a.totalCost - b.totalCost);
    }
    
    return baseEstimates;
  }, [breakdown, exactResults]);

  const recommendation = useMemo(() => {
    if (!breakdown || estimates.length === 0) return null;
    return generateRecommendation(estimates, breakdown, config);
  }, [estimates, breakdown, config]);

  const handleMetadata = (meta: VideoMetadata, videoFile?: File) => {
    setMetadata(meta);
    if (videoFile) setFile(videoFile);
    setExactResults([]); // Reset exact results on new video
  };

  const handleMeasureExactly = async () => {
    if (!metadata) return;
    setIsMeasuring(true);
    try {
      const results = await runExactMeasurement(metadata, config, file);
      setExactResults(results);
    } catch (err) {
      console.error("Measurement failed:", err);
    } finally {
      setIsMeasuring(false);
    }
  };

  const reset = () => {
    setMetadata(null);
    setFile(null);
    setExactResults([]);
    setIsMeasuring(false);
  };

  const hasApiKeys = getAvailableProviders().length > 0;

  return {
    metadata,
    config,
    setConfig,
    breakdown,
    estimates,
    recommendation,
    handleMetadata,
    handleMeasureExactly,
    isMeasuring,
    hasApiKeys,
    reset,
  };
}
