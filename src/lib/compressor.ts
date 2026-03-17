/**
 * Simple heuristic to check if a string consists entirely of a JSON object or array
 */
function isProbablyJson(str: string): boolean {
    const trimmed = str.trim();
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
        try {
            JSON.parse(trimmed);
            return true;
        } catch {
            return false;
        }
    }
    return false;
}

/**
 * Basic Compression:
 * - Trims excess leading/trailing whitespace
 * - Removes duplicate blank lines
 * - Collapses pure JSON payloads
 */
export function compressBasic(text: string): string {
    if (!text) return text;

    // Check if the whole block is valid JSON first
    if (isProbablyJson(text)) {
        try {
            return JSON.stringify(JSON.parse(text));
        } catch {
            // fallback if it wasn't actually perfectly parsed
        }
    }

    // 1. Replace 3 or more newlines with just 2 (leave single blank lines)
    let processed = text.replace(/\n{3,}/g, "\n\n");

    // 2. Remove trailing spaces on every line
    processed = processed.replace(/[ \t]+$/gm, "");

    // 3. Collapse 3+ spaces into a single space (unless it looks like code indentation)
    // We'll be conservative here and only compress spaces that aren't at the start of a line
    // to preserve basic indentation formatting for Python/YAML config files.
    processed = processed.replace(/([^ \n])[ \t]{2,}/g, "$1 ");

    return processed.trim();
}

/**
 * Advanced Compression:
 * - Applies Basic Compression
 * - Attempts to strip out code block comments (//, /* *\/)
 * - Attempts to strip HTML/XML comments (<!-- -->)
 * - Removes Python-style line comments (#) if they start a line
 */
export function compressAdvanced(text: string): string {
    if (!text) return text;

    // Start with basic cleanup
    let processed = compressBasic(text);

    // Bail out if it's pure JSON, advanced compression might break keys if they happen to contain //
    if (isProbablyJson(text)) {
        return processed;
    }

    // 1. Remove /* ... */ multi-line comments
    // [^]*? matches any character including newlines, non-greedy
    processed = processed.replace(/\/\*[\s\S]*?\*\//g, "");

    // 2. Remove <!-- ... --> HTML comments
    processed = processed.replace(/<!--[\s\S]*?-->/g, "");

    // 3. Remove // line comments (only if there's whitespace before it so we don't break URLs like http://)
    processed = processed.replace(/(^|\s)\/\/.*$/gm, "");

    // 4. Remove # line comments (common in Python, Ruby, YAML, Bash)
    // Only remove if it's the very first non-whitespace character on the line
    processed = processed.replace(/^[ \t]*#.*$/gm, "");

    // Re-run basic compression to clean up any massive gaps left by deleted comments
    return compressBasic(processed);
}
