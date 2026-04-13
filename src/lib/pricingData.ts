export const pricingData = [
    { date: "2024-03", openai: 15.0, anthropic: 15.0, google: 10.0 },
    { date: "2024-05", openai: 5.0, anthropic: 15.0, google: 7.0, event: "GPT-4o Release (-50%)" },
    { date: "2024-08", openai: 2.5, anthropic: 15.0, google: 3.5, event: "GPT-4o mini release" },
    { date: "2024-11", openai: 2.5, anthropic: 3.0, google: 3.5, event: "Claude 3.5 Sonnet v2" },
    { date: "2025-02", openai: 2.0, anthropic: 3.0, google: 1.25, event: "Gemini 2.0 Price Cut" },
    { date: "2025-06", openai: 1.75, anthropic: 3.0, google: 1.25, event: "GPT-5 Preview" },
    { date: "2025-10", openai: 1.25, anthropic: 3.0, google: 1.25, event: "Claude 4.5 Release" },
    { date: "2026-01", openai: 1.25, anthropic: 3.0, google: 1.25, event: "Grok 4 Release" },
    { date: "2026-04", openai: 1.25, anthropic: 3.0, google: 2.00, event: "Gemini 3.1 Launch" },
];

export const timelineEvents = [
    {
        id: "gemini-3.1",
        date: "April 2026",
        provider: "Google",
        model: "Gemini 3.1 Pro",
        change: "Generational Launch",
        details: "Gemini 3.1 Pro launched with 2M context window and improved multimodal reasoning.",
        type: "release",
        dataPointIndex: 8
    },
    {
        id: "claude-4.6",
        date: "March 2026",
        provider: "Anthropic",
        model: "Claude 4.6 Series",
        change: "New Release",
        details: "Claude 4.6 series launched with significant intelligence gains while maintaining 4.5 pricing levels.",
        type: "release",
        dataPointIndex: 7
    },
    {
        id: "gpt-5",
        date: "October 2025",
        provider: "OpenAI",
        model: "GPT-5",
        change: "New Flagship",
        details: "GPT-5 officially released, setting a new price floor for flagship intelligence at $1.25/M tokens.",
        type: "release",
        dataPointIndex: 6
    },
    {
        id: "deepseek-v4",
        date: "September 2025",
        provider: "DeepSeek",
        model: "DeepSeek V4",
        change: "Market Disruptor",
        details: "DeepSeek V4 disruptive pricing forces major providers to reconsider their flagship margins.",
        type: "disruptor",
        dataPointIndex: 5
    },
    {
        id: "gemini-2.5-flash",
        date: "July 2025",
        provider: "Google",
        model: "Gemini 2.5 Flash",
        change: "-40% Output Cost",
        details: "Google slashed output costs for Flash models to compete with GPT-4o mini.",
        type: "cut",
        dataPointIndex: 4
    },
    {
        id: "claude-3.5-v2",
        date: "November 2024",
        provider: "Anthropic",
        model: "Claude 3.5 Sonnet",
        change: "Performance Leader",
        details: "Sonnet v2 became the industry benchmark for coding and reasoning efficiency.",
        type: "release",
        dataPointIndex: 3
    },
    {
        id: "gpt-4o-mini",
        date: "July 2024",
        provider: "OpenAI",
        model: "GPT-4o mini",
        change: "-90% vs GPT-3.5",
        details: "The death of GPT-3.5. A massive leap in cost-efficiency for small tasks.",
        type: "cut",
        dataPointIndex: 2
    }
];

export const priceWarData = [
    { provider: "OpenAI", lastCutDate: "2025-10-15", daysSinceCut: 180 }, // Assume today is April 2026
    { provider: "Anthropic", lastCutDate: "2026-03-01", daysSinceCut: 30 },
    { provider: "Google", lastCutDate: "2026-04-10", daysSinceCut: 3 },
    { provider: "Meta", lastCutDate: "2026-02-20", daysSinceCut: 60 },
    { provider: "DeepSeek", lastCutDate: "2025-09-15", daysSinceCut: 210 },
];
