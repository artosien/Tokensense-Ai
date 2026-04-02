import { ModelConfig } from "./models";

export interface ImageTokenResult {
    tokens: number;
    tiles?: number; // Only relevant for OpenAI & Gemini tiling
    scaledWidth?: number; // Represent how the model sees it
    scaledHeight?: number;
}

export type ImageContentType = "natural" | "document" | "ui";

/**
 * Calculate the token cost of an image based on the model's specific pricing strategy.
 */
export function calculateImageTokens(
    width: number,
    height: number,
    model: ModelConfig,
    detail: "low" | "high" = "high",
    contentType: ImageContentType = "natural"
): ImageTokenResult {
    const strategy = model.visionPricing?.strategy;

    if (!strategy) {
        return { tokens: 0 };
    }

    let result: ImageTokenResult = { tokens: 0 };

    if (strategy === "gemini-flat") {
        // Gemini 1.5 / 3.1 Logic (March 2026)
        // 1. Standard: Both dimensions <= 384px = 258 tokens
        if (width <= 384 && height <= 384) {
            result = { 
                tokens: 258,
                tiles: 1,
                scaledWidth: width,
                scaledHeight: height
            };
        } else {
            // 2. Large: Scaled into 768px tiles, each 258 tokens
            const cols = Math.ceil(width / 768);
            const rows = Math.ceil(height / 768);
            const totalTiles = cols * rows;
            result = {
                tokens: totalTiles * 258,
                tiles: totalTiles,
                scaledWidth: width,
                scaledHeight: height
            };
        }
    } else if (strategy === "openai-tiles") {
        const baseTokens = model.visionPricing?.baseTokens || 85;

        if (detail === "low") {
            result = {
                tokens: baseTokens,
                tiles: 0,
                scaledWidth: width > 512 || height > 512 ? 512 : width,
                scaledHeight: width > 512 || height > 512 ? 512 : height,
            };
        } else {
            // OpenAI High Res Logic
            let scaledW = width;
            let scaledH = height;

            // 1. Fit within 2048 x 2048
            if (Math.max(scaledW, scaledH) > 2048) {
                const ratio = 2048 / Math.max(scaledW, scaledH);
                scaledW = Math.round(scaledW * ratio);
                scaledH = Math.round(scaledH * ratio);
            }

            // 2. Shortest side is 768px
            const shortSide = Math.min(scaledW, scaledH);
            if (shortSide > 768) {
                const ratio = 768 / shortSide;
                scaledW = Math.round(scaledW * ratio);
                scaledH = Math.round(scaledH * ratio);
            }

            // 3. Count 512x512 tiles
            const tilesW = Math.ceil(scaledW / 512);
            const tilesH = Math.ceil(scaledH / 512);
            const totalTiles = tilesW * tilesH;
            const tileTokens = model.visionPricing?.tileTokens || 170;

            result = {
                tokens: baseTokens + tileTokens * totalTiles,
                tiles: totalTiles,
                scaledWidth: scaledW,
                scaledHeight: scaledH,
            };
        }
    } else if (strategy === "anthropic-scale") {
        let scaledW = width;
        let scaledH = height;

        if (Math.max(scaledW, scaledH) > 1568) {
            const ratio = 1568 / Math.max(scaledW, scaledH);
            scaledW = Math.round(scaledW * ratio);
            scaledH = Math.round(scaledH * ratio);
        }

        const tokens = Math.ceil((scaledW * scaledH) / 750);

        result = {
            tokens,
            scaledWidth: scaledW,
            scaledHeight: scaledH,
        };
    }

    // Apply complexity buffer for OCR/Document
    if (contentType === "document") {
        result.tokens = Math.round(result.tokens * 1.1); // 10% overhead
    }

    return result;
}

export const getVisionOptimization = (width: number, height: number, currentTokens: number) => {
    // Target: Fit into 1 tile for maximum efficiency (512px for OpenAI)
    const targetDimension = 512;
    const ratio = width / height;
    
    let recommendedWidth, recommendedHeight;
    if (width > height) {
        recommendedWidth = targetDimension;
        recommendedHeight = Math.round(targetDimension / ratio);
    } else {
        recommendedHeight = targetDimension;
        recommendedWidth = Math.round(targetDimension * ratio);
    }

    // Cost for 1 tile (OpenAI)
    const optimizedTokens = 85 + 170; // 255 tokens
    const improvementPercent = currentTokens > optimizedTokens 
        ? Math.round((1 - optimizedTokens / currentTokens) * 100)
        : 0;
    
    return {
        recommendedWidth,
        recommendedHeight,
        optimizedTokens,
        improvementPercent
    };
};
