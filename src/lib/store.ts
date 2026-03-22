import { create } from "zustand";

interface TokenSenseState {
    // Prompt text
    systemPrompt: string;
    userPrompt: string;
    fileText: string;

    // Model selection
    selectedModelId: string;

    // Output estimation
    expectedOutputTokens: number;

    // Tokenisation results (calculated)
    inputTokenCount: number; // Tokens from the typed text prompts
    fileTokenCount: number;  // Tokens extracted from attached files

    // Agent loop
    agentLoopEnabled: boolean;
    agentIterations: number;
    avgNewInputTokensPerTurn: number;

    // UI state
    activeTab: "calculate" | "results";

    // Actions
    setSystemPrompt: (text: string) => void;
    setUserPrompt: (text: string) => void;
    setFileText: (text: string) => void;
    setSelectedModelId: (id: string) => void;
    setExpectedOutputTokens: (n: number) => void;
    setInputTokenCount: (n: number) => void;
    setFileTokenCount: (n: number) => void;
    setAgentLoopEnabled: (b: boolean) => void;
    setAgentIterations: (n: number) => void;
    setAvgNewInputTokensPerTurn: (n: number) => void;
    setActiveTab: (tab: "calculate" | "results") => void;
}

export const useTokenSenseStore = create<TokenSenseState>((set) => ({
    systemPrompt: "",
    userPrompt: "",
    fileText: "",

    selectedModelId: "gpt-4o",

    expectedOutputTokens: 1000,

    inputTokenCount: 0,
    fileTokenCount: 0,

    agentLoopEnabled: false,
    agentIterations: 5,
    avgNewInputTokensPerTurn: 500,

    activeTab: "calculate",

    setSystemPrompt: (text) => set({ systemPrompt: text }),
    setUserPrompt: (text) => set({ userPrompt: text }),
    setFileText: (text) => set({ fileText: text }),
    setSelectedModelId: (id) => set({ selectedModelId: id }),
    setExpectedOutputTokens: (n) => set({ expectedOutputTokens: n }),
    setInputTokenCount: (n) => set({ inputTokenCount: n }),
    setFileTokenCount: (n) => set({ fileTokenCount: n }),
    setAgentLoopEnabled: (b) => set({ agentLoopEnabled: b }),
    setAgentIterations: (n) => set({ agentIterations: n }),
    setAvgNewInputTokensPerTurn: (n) => set({ avgNewInputTokensPerTurn: n }),
    setActiveTab: (tab) => set({ activeTab: tab }),
}));