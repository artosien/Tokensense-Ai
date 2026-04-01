// Keys are stored in localStorage under namespaced keys.
// They are read directly by the dry-run API callers in the browser.
// They are NEVER sent to the tokensense-ai server.

const KEY_PREFIX = "tokensense:apikey:";

export type ProviderId = "google" | "anthropic" | "openai";

export function saveApiKey(provider: ProviderId, key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${KEY_PREFIX}${provider}`, key);
  } catch {
    console.warn("localStorage unavailable — key not saved");
  }
}

export function getApiKey(provider: ProviderId): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(`${KEY_PREFIX}${provider}`);
  } catch {
    return null;
  }
}

export function clearApiKey(provider: ProviderId): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${KEY_PREFIX}${provider}`);
  } catch {}
}

export function clearAllApiKeys(): void {
  if (typeof window === "undefined") return;
  (["google", "anthropic", "openai"] as ProviderId[]).forEach(clearApiKey);
}

export function getAvailableProviders(): ProviderId[] {
  if (typeof window === "undefined") return [];
  return (["google", "anthropic", "openai"] as ProviderId[]).filter(
    p => !!getApiKey(p)
  );
}
