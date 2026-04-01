import { getApiKey } from "./apiKeyStore";
import { VideoMetadata } from "./videoAnalyzer";
import { TokenConfig } from "./tokenCalculator";

export interface ExactMeasurementResult {
  provider: "google" | "anthropic" | "openai";
  inputTokens: number;
  dryRunCostUsd: number;
  error?: string;
}

// ─── Gemini ───────────────────────────────────────────────────────────────────
export async function dryRunGemini(
  meta: VideoMetadata,
  config: TokenConfig
): Promise<ExactMeasurementResult> {
  const key = getApiKey("google");
  if (!key) throw new Error("No Gemini API key saved");

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

  const videoPart = meta.originalUrl
    ? {
        file_data: {
          mime_type: "video/mp4",
          file_uri: meta.originalUrl,
        },
      }
    : {
        text: `[Video analysis request — ${meta.durationSeconds}s, ${meta.width}x${meta.height}]`,
      };

  const body = {
    contents: [{ parts: [videoPart, { text: "Describe this video in one sentence." }] }],
    generationConfig: { maxOutputTokens: 1 },
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message ?? "Gemini API error");
  }

  const data = await res.json();
  const inputTokens: number = data.usageMetadata?.promptTokenCount ?? 0;
  const dryRunCostUsd = (inputTokens / 1000) * 0.000075;

  return { provider: "google", inputTokens, dryRunCostUsd };
}

// ─── Anthropic Claude ─────────────────────────────────────────────────────────
export async function dryRunClaude(
  meta: VideoMetadata,
  config: TokenConfig,
  sampledFrameBase64: string[]
): Promise<ExactMeasurementResult> {
  const key = getApiKey("anthropic");
  if (!key) throw new Error("No Anthropic API key saved");

  const imageContent = sampledFrameBase64.map(b64 => ({
    type: "image",
    source: { type: "base64", media_type: "image/jpeg", data: b64 },
  }));

  const body = {
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1,
    messages: [
      {
        role: "user",
        content: [
          ...imageContent as any,
          { type: "text", text: "Describe these video frames in one sentence." },
        ],
      },
    ],
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "dangerously-allow-browser": "true" // Note: This header is often needed for browser-side calls to Claude if using their SDK, but here we use fetch.
    } as any,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message ?? "Anthropic API error");
  }

  const data = await res.json();
  const inputTokens: number = data.usage?.input_tokens ?? 0;
  const dryRunCostUsd = (inputTokens / 1000) * 0.003;

  return { provider: "anthropic", inputTokens, dryRunCostUsd };
}

// ─── OpenAI ───────────────────────────────────────────────────────────────────
export async function dryRunOpenAI(
  meta: VideoMetadata,
  config: TokenConfig,
  sampledFrameBase64: string[]
): Promise<ExactMeasurementResult> {
  const key = getApiKey("openai");
  if (!key) throw new Error("No OpenAI API key saved");

  const imageContent = sampledFrameBase64.map(b64 => ({
    type: "image_url",
    image_url: { url: `data:image/jpeg;base64,${b64}`, detail: "auto" },
  }));

  const body = {
    model: "gpt-4o",
    max_tokens: 1,
    messages: [
      {
        role: "user",
        content: [
          ...imageContent as any,
          { type: "text", text: "Describe these video frames in one sentence." },
        ],
      },
    ],
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message ?? "OpenAI API error");
  }

  const data = await res.json();
  const inputTokens: number = data.usage?.prompt_tokens ?? 0;
  const dryRunCostUsd = (inputTokens / 1000) * 0.0025;

  return { provider: "openai", inputTokens, dryRunCostUsd };
}

// ─── Frame sampler (browser-side) ─────────────────────────────────────────────
export async function sampleFrames(
  file: File,
  fps: number,
  maxFrames = 20
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const frames: string[] = [];

    video.src = url;
    video.preload = "auto";
    video.muted = true; // Important for auto-play/seeking in some browsers

    video.onloadedmetadata = async () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const duration = video.duration;
      const totalFrames = Math.min(Math.floor(duration * fps), maxFrames);
      const interval = duration / totalFrames;

      try {
        for (let i = 0; i < totalFrames; i++) {
          await new Promise<void>((res, rej) => {
            const onSeeked = () => {
              ctx.drawImage(video, 0, 0);
              const b64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
              frames.push(b64);
              video.removeEventListener("seeked", onSeeked);
              res();
            };
            video.addEventListener("seeked", onSeeked);
            video.currentTime = i * interval;
            
            // Timeout safety
            setTimeout(() => {
              video.removeEventListener("seeked", onSeeked);
              res(); // skip this frame
            }, 2000);
          });
        }
        URL.revokeObjectURL(url);
        resolve(frames);
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not sample video frames"));
    };
  });
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────
export async function runExactMeasurement(
  meta: VideoMetadata,
  config: TokenConfig,
  file: File | null
): Promise<ExactMeasurementResult[]> {
  const frames = (file && (getApiKey("anthropic") || getApiKey("openai")))
    ? await sampleFrames(file, config.frameSamplingFps).catch(() => [])
    : [];

  const calls: Promise<ExactMeasurementResult>[] = [];

  if (getApiKey("google"))    calls.push(dryRunGemini(meta, config));
  if (getApiKey("anthropic")) calls.push(dryRunClaude(meta, config, frames));
  if (getApiKey("openai"))    calls.push(dryRunOpenAI(meta, config, frames));

  const settled = await Promise.allSettled(calls);

  return settled.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    
    // Attempt to recover provider name from the calls order
    const providers: Array<"google"|"anthropic"|"openai"> = [];
    if (getApiKey("google")) providers.push("google");
    if (getApiKey("anthropic")) providers.push("anthropic");
    if (getApiKey("openai")) providers.push("openai");

    return {
      provider: providers[i] || "openai", // fallback
      inputTokens: 0,
      dryRunCostUsd: 0,
      error: (r.reason as Error).message,
    };
  });
}
