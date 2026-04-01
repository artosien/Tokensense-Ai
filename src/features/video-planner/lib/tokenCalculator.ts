export interface TokenConfig {
  frameSamplingFps: number;
  includeAudio: boolean;
  promptTokens: number;
}

export interface TokenBreakdown {
  frameTokens: number;
  audioTokens: number;
  promptTokens: number;
  total: number;
  frameCount: number;
}

// Conservative per-frame token estimates based on published provider docs.
// These apply across providers — providers differ in price per token, not tokens per frame.
const TOKENS_PER_FRAME: Record<string, number> = {
  "360p":  258,
  "480p":  516,
  "720p":  765,
  "1080p": 1530,
};

function resolutionTier(w: number, h: number): string {
  const px = Math.max(w, h);
  if (px <= 480)  return "360p";
  if (px <= 640)  return "480p";
  if (px <= 1280) return "720p";
  return "1080p";
}

const AUDIO_TOKENS_PER_SECOND = 32;

export function calculateTokens(
  meta: { durationSeconds: number; width: number; height: number; hasAudio: boolean; audioDurationSeconds: number },
  config: TokenConfig
): TokenBreakdown {
  const frameCount = Math.ceil(meta.durationSeconds * config.frameSamplingFps);
  const tokensPerFrame = TOKENS_PER_FRAME[resolutionTier(meta.width, meta.height)];
  const frameTokens = frameCount * tokensPerFrame;
  const audioTokens = config.includeAudio && meta.hasAudio
    ? Math.ceil(meta.audioDurationSeconds * AUDIO_TOKENS_PER_SECOND)
    : 0;
  const total = frameTokens + audioTokens + config.promptTokens;
  return { frameTokens, audioTokens, promptTokens: config.promptTokens, total, frameCount };
}

export function tokensToReadable(tokens: number): string {
  const pages = Math.round(tokens / 250);
  if (tokens === 0) return "no tokens";
  if (pages < 5)   return `about ${pages} pages of text`;
  if (pages < 100) return `a ~${pages}-page document`;
  return `a ~${Math.round(pages / 100) * 100}-page report`;
}
