let enc: any = null;
let initPromise: Promise<any> | null = null;

/**
 * Dynamically load tiktoken and get the encoder.
 * This saves on initial bundle size as WASM and BPE data are large.
 */
async function getEncoder() {
    if (enc) return enc;
    if (initPromise) return initPromise;

    initPromise = (async () => {
        try {
            // We use a try-catch to handle cases where tiktoken might not load
            // correctly in certain browser environments (like those with restricted WASM).
            const tiktoken = await import("tiktoken");
            if (tiktoken && typeof tiktoken.encoding_for_model === "function") {
                enc = tiktoken.encoding_for_model("gpt-4o");
            }
        } catch (e) {
            console.warn("Failed to load tiktoken, falling back to rough estimation.", e);
        }
        return enc;
    })();

    return initPromise;
}

/**
 * Count tokens in a text string.
 * This is now async to allow for lazy loading of the tokenizer.
 */
export async function countTokens(text: string): Promise<number> {
    if (!text || typeof text !== "string" || text.length === 0) return 0;
    
    try {
        const encoder = await getEncoder();
        if (encoder && typeof encoder.encode === "function") {
            const tokens = encoder.encode(text);
            return tokens.length;
        }
    } catch (e) {
        console.warn("Error during token counting, using fallback:", e);
    }

    // Fallback: rough estimation of ~4 characters per token
    return Math.ceil(text.length / 4);
}

/**
 * Synchronous version with rough estimation as fallback.
 * Used for fast UI updates while the real tokenizer loads.
 */
export function countTokensSync(text: string): number {
    if (!text || typeof text !== "string" || text.length === 0) return 0;
    
    if (enc && typeof enc.encode === "function") {
        try {
            return enc.encode(text).length;
        } catch (e) {
            // Silently fall back
        }
    }
    
    return Math.ceil(text.length / 4);
}