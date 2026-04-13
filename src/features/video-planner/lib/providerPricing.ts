import { TokenBreakdown } from "./tokenCalculator";

export interface ProviderModel {
  id: string;
  provider: string;
  modelName: string;
  displayName: string;
  inputPricePerKToken: number; // USD per 1,000 tokens
  supportsNativeVideo: boolean;
  supportsAudio: boolean;
  contextWindowTokens: number;
  apiDocsUrl: string;
}

export const PROVIDER_MODELS: ProviderModel[] = [
  {
    id: "gemini-3.1-pro",
    provider: "Google",
    modelName: "gemini-3.1-pro",
    displayName: "Gemini 3.1 Pro",
    inputPricePerKToken: 0.002, // $2.00 per 1M
    supportsNativeVideo: true,
    supportsAudio: true,
    contextWindowTokens: 2_000_000,
    apiDocsUrl: "https://ai.google.dev/pricing",
  },
  {
    id: "gemini-3-flash",
    provider: "Google",
    modelName: "gemini-3-flash",
    displayName: "Gemini 3 Flash",
    inputPricePerKToken: 0.0005, // $0.50 per 1M
    supportsNativeVideo: true,
    supportsAudio: true,
    contextWindowTokens: 1_000_000,
    apiDocsUrl: "https://ai.google.dev/pricing",
  },
  {
    id: "gemini-1.5-pro",
    provider: "Google",
    modelName: "gemini-1.5-pro-002",
    displayName: "Gemini 1.5 Pro",
    inputPricePerKToken: 0.00125, // $1.25 per 1M
    supportsNativeVideo: true,
    supportsAudio: true,
    contextWindowTokens: 2_000_000,
    apiDocsUrl: "https://ai.google.dev/pricing",
  },
  {
    id: "claude-sonnet-4-6",
    provider: "Anthropic",
    modelName: "claude-sonnet-4-6",
    displayName: "Claude Sonnet 4.6",
    inputPricePerKToken: 0.003, // $3.00 per 1M
    supportsNativeVideo: true,
    supportsAudio: false,
    contextWindowTokens: 1_000_000,
    apiDocsUrl: "https://www.anthropic.com/pricing",
  },
  {
    id: "gpt-5",
    provider: "OpenAI",
    modelName: "gpt-5",
    displayName: "GPT-5",
    inputPricePerKToken: 0.00125, // $1.25 per 1M
    supportsNativeVideo: true,
    supportsAudio: true,
    contextWindowTokens: 400_000,
    apiDocsUrl: "https://openai.com/pricing",
  },
  {
    id: "gpt-4o",
    provider: "OpenAI",
    modelName: "gpt-4o",
    displayName: "GPT-4o",
    inputPricePerKToken: 0.0025, // $2.50 per 1M
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
    inputPricePerKToken: 0.00015, // $0.15 per 1M
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
