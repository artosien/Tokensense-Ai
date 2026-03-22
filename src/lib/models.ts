export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  inputPricePer1M: number;   // USD per 1M input tokens
  outputPricePer1M: number;  // USD per 1M output tokens
  cacheWritePricePer1M?: number; // USD per 1M tokens written to cache
  cacheReadPricePer1M?: number;  // USD per 1M tokens read from cache
  maxContext: number;        // max context window in tokens
  visionPricing?: {
    strategy: "openai-tiles" | "anthropic-scale" | "gemini-flat";
    baseTokens?: number; // For OpenAI base
    tileTokens?: number; // For OpenAI tiles
    flatTokens?: number; // For Gemini flat
  };
}

// Pricing last updated: March 2026
// Sources: Official provider pricing pages
export const models: ModelConfig[] = [
  // ── OpenAI ──────────────────────────────────────────────────────────────
  {
    id: "gpt-5.2",
    name: "GPT-5.2",
    provider: "OpenAI",
    inputPricePer1M: 1.75,
    outputPricePer1M: 14.00,
    maxContext: 400_000,
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 Mini",
    provider: "OpenAI",
    inputPricePer1M: 0.25,
    outputPricePer1M: 2.00,
    maxContext: 400_000,
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    inputPricePer1M: 2.50,
    outputPricePer1M: 10.00,
    maxContext: 128_000,
    visionPricing: { strategy: "openai-tiles", baseTokens: 85, tileTokens: 170 },
  },
  {
    id: "o1",
    name: "o1 (Reasoning)",
    provider: "OpenAI",
    inputPricePer1M: 15.00,
    outputPricePer1M: 60.00,
    maxContext: 200_000,
  },
  // ── Anthropic ────────────────────────────────────────────────────────────
  {
    id: "claude-4.6-opus",
    name: "Claude 4.6 Opus",
    provider: "Anthropic",
    inputPricePer1M: 5.00,
    outputPricePer1M: 25.00,
    cacheWritePricePer1M: 6.25,
    cacheReadPricePer1M: 0.50,
    maxContext: 200_000,
    visionPricing: { strategy: "anthropic-scale" },
  },
  {
    id: "claude-4.6-sonnet",
    name: "Claude 4.6 Sonnet",
    provider: "Anthropic",
    inputPricePer1M: 3.00,
    outputPricePer1M: 15.00,
    cacheWritePricePer1M: 3.75,
    cacheReadPricePer1M: 0.30,
    maxContext: 200_000,
    visionPricing: { strategy: "anthropic-scale" },
  },
  {
    id: "claude-4.5-haiku",
    name: "Claude 4.5 Haiku",
    provider: "Anthropic",
    inputPricePer1M: 1.00,
    outputPricePer1M: 5.00,
    cacheWritePricePer1M: 1.25,
    cacheReadPricePer1M: 0.10,
    maxContext: 200_000,
    visionPricing: { strategy: "anthropic-scale" },
  },
  {
    id: "claude-3.5-sonnet-v2",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    inputPricePer1M: 3.00,
    outputPricePer1M: 15.00,
    cacheWritePricePer1M: 3.75,
    cacheReadPricePer1M: 0.30,
    maxContext: 200_000,
    visionPricing: { strategy: "anthropic-scale" },
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    inputPricePer1M: 15.00,
    outputPricePer1M: 75.00,
    maxContext: 200_000,
    visionPricing: { strategy: "anthropic-scale" },
  },
  // ── Google ───────────────────────────────────────────────────────────────
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    inputPricePer1M: 3.50,
    outputPricePer1M: 10.50,
    maxContext: 2_000_000,
    visionPricing: { strategy: "gemini-flat", flatTokens: 258 },
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google",
    inputPricePer1M: 0.075,
    outputPricePer1M: 0.30,
    maxContext: 1_000_000,
    visionPricing: { strategy: "gemini-flat", flatTokens: 258 },
  },
  {
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro Preview",
    provider: "Google",
    inputPricePer1M: 2.00,
    outputPricePer1M: 12.00,
    cacheWritePricePer1M: 2.00,
    cacheReadPricePer1M: 0.50,
    maxContext: 2_000_000,
    visionPricing: { strategy: "gemini-flat", flatTokens: 258 },
  },
  {
    id: "gemini-3-flash",
    name: "Gemini 3 Flash",
    provider: "Google",
    inputPricePer1M: 0.50,
    outputPricePer1M: 3.00,
    cacheWritePricePer1M: 0.50,
    cacheReadPricePer1M: 0.125,
    maxContext: 1_000_000,
    visionPricing: { strategy: "gemini-flat", flatTokens: 258 },
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    inputPricePer1M: 1.25,
    outputPricePer1M: 10.00,
    cacheWritePricePer1M: 1.25,
    cacheReadPricePer1M: 0.3125,
    maxContext: 2_000_000,
    visionPricing: { strategy: "gemini-flat", flatTokens: 258 },
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash-Lite",
    provider: "Google",
    inputPricePer1M: 0.10,
    outputPricePer1M: 0.40,
    cacheWritePricePer1M: 0.10,
    cacheReadPricePer1M: 0.025,
    maxContext: 1_000_000,
    visionPricing: { strategy: "gemini-flat", flatTokens: 258 },
  },
  // ── Meta ─────────────────────────────────────────────────────────────────
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    provider: "Meta (DeepInfra)",
    inputPricePer1M: 0.23,
    outputPricePer1M: 0.40,
    maxContext: 128_000,
  },
  // ── xAI ──────────────────────────────────────────────────────────────────
  {
    id: "grok-4",
    name: "Grok 4",
    provider: "xAI",
    inputPricePer1M: 3.00,
    outputPricePer1M: 15.00,
    maxContext: 256_000,
  },
];

export const getModelById = (id: string): ModelConfig | undefined =>
  models.find((m) => m.id === id);
