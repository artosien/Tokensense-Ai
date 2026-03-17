import { encoding_for_model } from "tiktoken";

let enc: ReturnType<typeof encoding_for_model> | null = null;

function getEncoder() {
    if (!enc) {
        // cl100k_base covers GPT-4, GPT-4o, and is a reasonable estimator for
        // other BPE-based models (Claude, Gemini, etc.) within ~5% variance.
        enc = encoding_for_model("gpt-4o");
    }
    return enc;
}

/**
 * Count tokens in a text string using tiktoken (cl100k_base).
 * Returns 0 for empty/null strings.
 */
export function countTokens(text: string): number {
    if (!text || text.length === 0) return 0;
    try {
        const encoder = getEncoder();
        const tokens = encoder.encode(text);
        return tokens.length;
    } catch {
        // Fallback: rough estimation of ~4 characters per token
        return Math.ceil(text.length / 4);
    }
}
