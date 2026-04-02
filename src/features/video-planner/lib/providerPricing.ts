import { TokenBreakdown } from "./tokenCalculator";

export interface ProviderModel {
  id: string;
  provider: string;
  modelName: string;
  displayName: string;
  inputPricePerKToken: number;
  supportsNativeVideo: boolean;
  supportsAudio: boolean;
  contextWindowTokens: number;
  apiDocsUrl: string;
}

export const PROVIDER_MODELS: ProviderModel[] = [
  {
    id: "gemini-1.5-flash",
    provider: "Google",
    modelName: "gemini-1.5-flash",
    displayName: "Gemini 1.5 Flash",
    inputPricePerKToken: 0.000075,
    supportsNativeVideo: true,
    supportsAudio: true,
    contextWindowTokens: 1_000_000,
    apiDocsUrl: "https://ai.google.dev/pricing",
  },
  {
    id: "gemini-1.5-pro",
    provider: "Google",
    modelName: "gemini-1.5-pro",
    displayName: "Gemini 1.5 Pro",
    inputPricePerKToken: 0.00125,
    supportsNativeVideo: true,
    supportsAudio: true,
    contextWindowTokens: 2_000_000,
    apiDocsUrl: "https://ai.google.dev/pricing",
  },
  {
    id: "claude-3-5-sonnet",
    provider: "Anthropic",
    modelName: "claude-3-5-sonnet",
    displayName: "Claude 3.5 Sonnet",
    inputPricePerKToken: 0.003,
    supportsNativeVideo: true,
    supportsAudio: false,
    contextWindowTokens: 200_000,
    apiDocsUrl: "https://www.anthropic.com/pricing",
  },
  {
    id: "gpt-4o",
    provider: "OpenAI",
    modelName: "gpt-4o",
    displayName: "GPT-4o",
    inputPricePerKToken: 0.0025,
    supportsNativeVideo: false,  // Video sent as sampled frames
    supportsAudio: true,
    contextWindowTokens: 128_000,
    apiDocsUrl: "https://openai.com/pricing",
  },
  {
    id: "gpt-4o-mini",
    provider: "OpenAI",
    modelName: "gpt-4o-mini",
    displayName: "GPT-4o mini",
    inputPricePerKToken: 0.00015,
    supportsNativeVideo: false,
    supportsAudio: false,
    contextWindowTokens: 128_000,
    apiDocsUrl: "https://openai.com/pricing",
  },
  {
    id: "openai-sora",
    provider: "OpenAI",
    modelName: "sora-v1",
    displayName: "Sora (Estimate)",
    inputPricePerKToken: 0.015, // Higher estimated cost for video generation/processing
    supportsNativeVideo: true,
    supportsAudio: true,
    contextWindowTokens: 500_000,
    apiDocsUrl: "https://openai.com/sora",
  },
  {
    id: "kling-1-5",
    provider: "Kling AI",
    modelName: "kling-1.5",
    displayName: "Kling 1.5",
    inputPricePerKToken: 0.008,
    supportsNativeVideo: true,
    supportsAudio: true,
    contextWindowTokens: 300_000,
    apiDocsUrl: "https://klingai.com/",
  },
];

export interface CostEstimate {
  model: ProviderModel;
  totalCost: number;
  effectiveTokens: number;
  withinContextWindow: boolean;
  warningMessage?: string;
  mode: "estimate" | "exact";
}

export function estimateCosts(
  breakdown: TokenBreakdown,
  models = PROVIDER_MODELS
): CostEstimate[] {
  return models
    .map(model => {
      const effectiveTokens = model.supportsAudio
        ? breakdown.total
        : breakdown.total - breakdown.audioTokens;
      const totalCost = (effectiveTokens / 1000) * model.inputPricePerKToken;
      const withinContextWindow = breakdown.total <= model.contextWindowTokens;
      const warningMessage = !withinContextWindow
        ? `Exceeds ${(model.contextWindowTokens / 1000).toFixed(0)}K context window — chunking required`
        : !model.supportsAudio && breakdown.audioTokens > 0
        ? "Audio not natively supported — transcription step needed"
        : undefined;
      return { model, totalCost, effectiveTokens, withinContextWindow, warningMessage, mode: "estimate" as const };
    })
    .sort((a, b) => a.totalCost - b.totalCost);
}
