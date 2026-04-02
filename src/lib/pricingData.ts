export const pricingData = [
    { date: "2024-03", openai: 15.0, anthropic: 15.0, google: 10.0 },
    { date: "2024-05", openai: 5.0, anthropic: 15.0, google: 7.0, event: "GPT-4o Release (-50%)" },
    { date: "2024-08", openai: 2.5, anthropic: 15.0, google: 3.5, event: "GPT-4o mini release" },
    { date: "2024-11", openai: 2.5, anthropic: 3.0, google: 3.5, event: "Claude 3.5 Sonnet v2" },
    { date: "2025-02", openai: 2.0, anthropic: 3.0, google: 1.25, event: "Gemini 2.0 Price Cut" },
    { date: "2025-06", openai: 1.75, anthropic: 3.0, google: 1.25, event: "GPT-5 Preview" },
    { date: "2025-10", openai: 1.75, anthropic: 3.0, google: 1.25, event: "Claude 4.5 Release" },
    { date: "2026-01", openai: 1.75, anthropic: 3.0, google: 1.25, event: "Grok 4 Release" },
    { date: "2026-03", openai: 1.75, anthropic: 3.0, google: 1.25, event: "Claude 4.6 Release" },
];

export const timelineEvents = [
    {
        id: "claude-4.6",
        date: "March 2026",
        provider: "Anthropic",
        model: "Claude 4.6 Series",
        change: "New Release",
        details: "Claude 4.6 series launched with significant intelligence gains while maintaining 4.5 pricing levels.",
        type: "release",
        dataPointIndex: 8
    },
    {
        id: "gpt-5.2",
        date: "January 2026",
        provider: "OpenAI",
        model: "GPT-5.2 Series",
        change: "-15% Input Cost",
        details: "OpenAI optimized inference for GPT-5.2, reducing input costs across the board.",
        type: "cut",
        dataPointIndex: 7
    },
    {
        id: "deepseek-v3",
        date: "October 2025",
        provider: "DeepSeek",
        model: "DeepSeek V3",
        change: "Market Disruptor",
        details: "V3 set a new floor for open-weights performance at proprietary-beating prices.",
        type: "disruptor",
        dataPointIndex: 6
    },
    {
        id: "gemini-2.5-flash",
        date: "July 2025",
        provider: "Google",
        model: "Gemini 2.5 Flash",
        change: "-40% Output Cost",
        details: "Google slashed output costs for Flash models to compete with GPT-4o mini.",
        type: "cut",
        dataPointIndex: 5
    },
    {
        id: "gpt-5",
        date: "May 2025",
        provider: "OpenAI",
        model: "GPT-5",
        change: "Generational Launch",
        details: "GPT-5 launched with 400k context window and improved reasoning capabilities.",
        type: "release",
        dataPointIndex: 4 // approximation for interaction
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
        dataPointIndex: 2 // Approx for interaction
    }
];

export const priceWarData = [
    { provider: "OpenAI", lastCutDate: "2026-01-15", daysSinceCut: 45 }, // Assume today is ~Mar 2026
    { provider: "Anthropic", lastCutDate: "2024-11-01", daysSinceCut: 120 },
    { provider: "Google", lastCutDate: "2025-07-01", daysSinceCut: 240 },
    { provider: "Meta", lastCutDate: "2024-04-18", daysSinceCut: 680 },
    { provider: "Mistral", lastCutDate: "2025-02-15", daysSinceCut: 380 },
];
