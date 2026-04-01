import { CostEstimate } from "./providerPricing";
import { TokenBreakdown, TokenConfig } from "./tokenCalculator";

export interface Recommendation {
  headline: string;
  body: string;
  savingsVsDefault: number;
  savingsPercent: number;
  suggestedModelId: string;
  tips: string[];
}

export function generateRecommendation(
  estimates: CostEstimate[],
  breakdown: TokenBreakdown,
  config: TokenConfig
): Recommendation {
  if (estimates.length === 0) {
    return {
      headline: "No data available",
      body: "Please upload a video to see recommendations.",
      savingsVsDefault: 0,
      savingsPercent: 0,
      suggestedModelId: "",
      tips: [],
    };
  }

  const cheapest = estimates[0];
  const gpt4oCost = estimates.find(e => e.model.id === "gpt-4o")?.totalCost ?? cheapest.totalCost;
  const savings = Math.max(0, gpt4oCost - cheapest.totalCost);
  const savingsPercent = gpt4oCost > 0 ? Math.round((savings / gpt4oCost) * 100) : 0;

  const tips: string[] = [];

  if (config.includeAudio && breakdown.audioTokens / breakdown.total > 0.2) {
    tips.push("Remove audio tokens if your use case doesn't require spoken content.");
  }
  if (breakdown.frameCount > 500 && config.frameSamplingFps > 1) {
    tips.push("Reduce frame sampling to 1 fps — most summarization tasks don't need higher.");
  }
  if (!cheapest.withinContextWindow) {
    tips.push("Split this video into shorter chunks to fit within the context window.");
  }

  const savingsText = savings > 0.001
    ? `, saving ${savingsPercent}% vs GPT-4o ($${savings.toFixed(3)} per video)`
    : "";

  return {
    headline: `Use ${cheapest.model.displayName} for the best value`,
    body: `${cheapest.model.displayName} costs approximately $${cheapest.totalCost.toFixed(4)} for this video${savingsText}.`,
    savingsVsDefault: savings,
    savingsPercent,
    suggestedModelId: cheapest.model.id,
    tips,
  };
}
