let enc: any = null;

/**
 * Dynamically load tiktoken and get the encoder.
 * This saves on initial bundle size as WASM and BPE data are large.
 */
async function getEncoder() {
    if (!enc) {
        try {
            // cl100k_base covers GPT-4, GPT-4o, and is a reasonable estimator for
            // other BPE-based models (Claude, Gemini, etc.) within ~5% variance.
            const { encoding_for_model } = await import("tiktoken");
            enc = encoding_for_model("gpt-4o");
        } catch (e) {
            console.warn("Failed to load tiktoken, falling back to rough estimation.", e);
            return null;
        }
    }
    return enc;
}

/**
 * Count tokens in a text string.
 * This is now async to allow for lazy loading of the tokenizer.
 */
export async function countTokens(text: string): Promise<number> {
    if (!text || text.length === 0) return 0;
    
    const encoder = await getEncoder();
    if (!encoder) {
        // Fallback: rough estimation of ~4 characters per token
        return Math.ceil(text.length / 4);
    }

    try {
        const tokens = encoder.encode(text);
        return tokens.length;
    } catch {
        return Math.ceil(text.length / 4);
    }
}

/**
 * Synchronous version with rough estimation as fallback.
 * Used for fast UI updates while the real tokenizer loads.
 */
export function countTokensSync(text: string): number {
    if (!text || text.length === 0) return 0;
    if (enc) {
        try {
            return enc.encode(text).length;
        } catch {
            return Math.ceil(text.length / 4);
        }
    }
    return Math.ceil(text.length / 4);
}