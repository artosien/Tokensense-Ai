export type SharePayload = {
  title?: string;
  text?: string;
  url?: string;
};

export function canWebShare(payload?: SharePayload) {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { canShare?: (data?: ShareData) => boolean };
  if (!("share" in nav)) return false;
  if (payload && typeof nav.canShare === "function") {
    try {
      return nav.canShare(payload as ShareData);
    } catch {
      return true;
    }
  }
  return true;
}

export async function shareOrCopy(payload: SharePayload) {
  const url = payload.url ?? (typeof window !== "undefined" ? window.location.href : "");
  const title = payload.title ?? (typeof document !== "undefined" ? document.title : "TokenSense");
  const text = payload.text ?? "";

  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await (navigator as Navigator).share({ title, text, url });
      return { ok: true as const, method: "share" as const };
    } catch {
      // fall back to clipboard
    }
  }

  const combined = [text, url].filter(Boolean).join("\n");
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(combined);
    return { ok: true as const, method: "clipboard" as const };
  }

  return { ok: false as const, method: "none" as const };
}

