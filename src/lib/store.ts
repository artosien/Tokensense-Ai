import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DeliveryMode = "real-time" | "batch";

interface TokenMetrics {
    input: number;
    output: number;
    static: number;
}

interface TokenSenseState {
    // Mission Context (Persistent Payload)
    rawPrompt: string;
    optimizedPrompt: string;
    systemPrompt: string; // The "Rules of the House"
    userPrompt: string;
    fileText: string;

    // Model & Delivery
    selectedModelId: string;
    deliveryMode: DeliveryMode;

    // Token Metrics
    expectedOutputTokens: number;
    inputTokenCount: number; 
    fileTokenCount: number;
    staticTokenCount: number; // For caching

    // Agent loop
    agentLoopEnabled: boolean;
    agentIterations: number;
    avgNewInputTokensPerTurn: number;

    // UI state
    activeTab: "calculate" | "results";
    optimizationStep: number; // 1-5 for progress tracking

    // Actions
    setRawPrompt: (text: string) => void;
    setOptimizedPrompt: (text: string) => void;
    setSystemPrompt: (text: string) => void;
    setUserPrompt: (text: string) => void;
    setFileText: (text: string) => void;
    setSelectedModelId: (id: string) => void;
    setDeliveryMode: (mode: DeliveryMode) => void;
    setExpectedOutputTokens: (n: number) => void;
    setInputTokenCount: (n: number) => void;
    setFileTokenCount: (n: number) => void;
    setStaticTokenCount: (n: number) => void;
    setAgentLoopEnabled: (b: boolean) => void;
    setAgentIterations: (n: number) => void;
    setAvgNewInputTokensPerTurn: (n: number) => void;
    setActiveTab: (tab: "calculate" | "results") => void;
    setOptimizationStep: (step: number) => void;
}

export const useTokenSenseStore = create<TokenSenseState>()(
    persist(
        (set) => ({
            rawPrompt: "",
            optimizedPrompt: "",
            systemPrompt: "",
            userPrompt: "",
            fileText: "",

            selectedModelId: "gpt-5.2",
            deliveryMode: "real-time",

            expectedOutputTokens: 1000,
            inputTokenCount: 0,
            fileTokenCount: 0,
            staticTokenCount: 0,

            agentLoopEnabled: false,
            agentIterations: 5,
            avgNewInputTokensPerTurn: 500,

            activeTab: "calculate",
            optimizationStep: 1,

            setRawPrompt: (text) => set({ rawPrompt: text }),
            setOptimizedPrompt: (text) => set({ optimizedPrompt: text }),
            setSystemPrompt: (text) => set({ systemPrompt: text }),
            setUserPrompt: (text) => set({ userPrompt: text }),
            setFileText: (text) => set({ fileText: text }),
            setSelectedModelId: (id) => set({ selectedModelId: id }),
            setDeliveryMode: (mode) => set({ deliveryMode: mode }),
            setExpectedOutputTokens: (n) => set({ expectedOutputTokens: n }),
            setInputTokenCount: (n) => set({ inputTokenCount: n }),
            setFileTokenCount: (n) => set({ fileTokenCount: n }),
            setStaticTokenCount: (n) => set({ staticTokenCount: n }),
            setAgentLoopEnabled: (b) => set({ agentLoopEnabled: b }),
            setAgentIterations: (n) => set({ agentIterations: n }),
            setAvgNewInputTokensPerTurn: (n) => set({ avgNewInputTokensPerTurn: n }),
            setActiveTab: (tab) => set({ activeTab: tab }),
            setOptimizationStep: (step) => set({ optimizationStep: step }),
        }),
        {
            name: "tokensense-optimization-data",
        }
    )
);