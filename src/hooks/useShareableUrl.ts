"use client";

import { useCallback } from "react";

export interface ShareState {
  modelId: string;
  inputTokens: number;
  outputTokens: number;
}

/**
 * Encodes calculator state into URL query params and decodes it back.
 * Format: ?m=gpt-4o&in=1200&out=400
 */
export function useShareableUrl() {
  const buildUrl = useCallback((state: ShareState): string => {
    const url = new URL(window.location.href);
    url.searchParams.set("m", state.modelId);
    url.searchParams.set("in", String(state.inputTokens));
    url.searchParams.set("out", String(state.outputTokens));
    return url.toString();
  }, []);

  const parseUrlState = useCallback((): Partial<ShareState> | null => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const m = params.get("m");
    const inTokens = params.get("in");
    const outTokens = params.get("out");
    if (!m && !inTokens && !outTokens) return null;
    return {
      ...(m ? { modelId: m } : {}),
      ...(inTokens ? { inputTokens: parseInt(inTokens) } : {}),
      ...(outTokens ? { outputTokens: parseInt(outTokens) } : {}),
    };
  }, []);

  const copyShareUrl = useCallback(
    async (state: ShareState): Promise<"copied" | "shared" | "failed"> => {
      const url = buildUrl(state);

      // Try Web Share API on mobile
      if (
        typeof navigator !== "undefined" &&
        "share" in navigator &&
        /Mobi|Android/i.test(navigator.userAgent)
      ) {
        try {
          await navigator.share({
            title: "TokenSense AI Estimate",
            text: `Check out this AI cost estimate on TokenSense AI`,
            url,
          });
          return "shared";
        } catch {
          // User cancelled or not supported — fall through to clipboard
        }
      }

      // Clipboard fallback
      try {
        await navigator.clipboard.writeText(url);
        // Update browser URL bar without reload
        window.history.replaceState({}, "", url);
        return "copied";
      } catch {
        return "failed";
      }
    },
    [buildUrl]
  );

  return { buildUrl, parseUrlState, copyShareUrl };
}
