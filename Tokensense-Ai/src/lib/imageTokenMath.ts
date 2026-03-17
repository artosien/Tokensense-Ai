import { ModelConfig } from "./models";

export interface ImageTokenResult {
    tokens: number;
    tiles?: number; // Only relevant for OpenAI
    scaledWidth?: number; // Represent how the model sees it
    scaledHeight?: number;
}

/**
 * Calculate the token cost of an image based on the model's specific pricing strategy.
 */
export function calculateImageTokens(
    width: number,
    height: number,
    model: ModelConfig
): ImageTokenResult {
    const strategy = model.visionPricing?.strategy;

    if (!strategy) {
        return { tokens: 0 };
    }

    if (strategy === "gemini-flat") {
        // Gemini handles images at a flat token rate
        return { tokens: model.visionPricing?.flatTokens || 258 };
    }

    if (strategy === "openai-tiles") {
        // OpenAI Low/High Res Logic (simplified high-res)
        // 1. Scale image to fit within a 2048 x 2048 square
        let scaledW = width;
        let scaledH = height;

        if (Math.max(scaledW, scaledH) > 2048) {
            const ratio = 2048 / Math.max(scaledW, scaledH);
            scaledW = Math.round(scaledW * ratio);
            scaledH = Math.round(scaledH * ratio);
        }

        // 2. Scale image such that shortest side is 768px
        const shortSide = Math.min(scaledW, scaledH);
        if (shortSide > 768) {
            const ratio = 768 / shortSide;
            scaledW = Math.round(scaledW * ratio);
            scaledH = Math.round(scaledH * ratio);
        }

        // 3. Calculate 512x512 tiles
        const tilesW = Math.ceil(scaledW / 512);
        const tilesH = Math.ceil(scaledH / 512);
        const totalTiles = tilesW * tilesH;

        const baseTokens = model.visionPricing?.baseTokens || 85;
        const tileTokens = model.visionPricing?.tileTokens || 170;

        return {
            tokens: baseTokens + tileTokens * totalTiles,
            tiles: totalTiles,
            scaledWidth: scaledW,
            scaledHeight: scaledH,
        };
    }

    if (strategy === "anthropic-scale") {
        // Claude 3/3.5 standard logic:
        // Scale image to fit within max dimensions of 1568x1568 while maintaining aspect ratio
        // Total tokens = (scaled_width * scaled_height) / 750
        let scaledW = width;
        let scaledH = height;

        if (Math.max(scaledW, scaledH) > 1568) {
            const ratio = 1568 / Math.max(scaledW, scaledH);
            scaledW = Math.round(scaledW * ratio);
            scaledH = Math.round(scaledH * ratio);
        }

        const tokens = Math.ceil((scaledW * scaledH) / 750);

        return {
            tokens,
            scaledWidth: scaledW,
            scaledHeight: scaledH,
        };
    }

    return { tokens: 0 };
}
