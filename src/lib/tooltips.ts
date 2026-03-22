/**
 * Central tooltip definitions for TokenSense AI.
 * All plain-English explanations for technical terms used in the UI.
 */

export interface TooltipDef {
  term: string;
  definition: string;
}

export const TOOLTIPS = {
  tokens: {
    term: "Tokens",
    definition:
      "A token is roughly ¾ of a word. 'Hello world' = 3 tokens. Most LLM APIs charge per token, not per word.",
  },
  contextWindow: {
    term: "Context Window",
    definition:
      "The maximum amount of text (input + output) a model can process in one request. Exceeding it truncates your prompt.",
  },
  promptCaching: {
    term: "Prompt Caching",
    definition:
      "Reusing parts of a previous prompt to reduce cost. Supported by Anthropic and Google — cache reads are up to 10× cheaper.",
  },
  inputCost: {
    term: "Input Cost",
    definition:
      "The cost to send your prompt to the model. Measured per million tokens. Longer prompts = higher input cost.",
  },
  outputCost: {
    term: "Output Cost",
    definition:
      "The cost for the model's response. Output tokens are typically 3–5× more expensive than input tokens.",
  },
  temperature: {
    term: "Temperature",
    definition:
      "Controls randomness in the model's output. 0 = deterministic/predictable. 1 = creative/varied. Higher = more random.",
  },
  inputTokens: {
    term: "Input Tokens",
    definition:
      "Characters sent to the model. Longer prompts = higher input cost.",
  },
  outputTokens: {
    term: "Output Tokens",
    definition:
      "Tokens generated in the model's response. Usually priced 3–5× higher than input tokens.",
  },
  totalTokens: {
    term: "Total Tokens",
    definition: "Sum of input and output tokens per API call.",
  },
  totalCost: {
    term: "Total Cost",
    definition: "Estimated cost for a single API call at current token rates.",
  },
} as const;

export type TooltipKey = keyof typeof TOOLTIPS;
