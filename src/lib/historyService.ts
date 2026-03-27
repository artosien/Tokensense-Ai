export interface CalculationEntry {
    id: string;
    timestamp: number;
    modelId: string;
    modelName: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    totalCost: number;
    promptSnippet: string;
}

const HISTORY_KEY = "tokensense_calculation_history";
const MAX_HISTORY = 20;

export const historyService = {
    save(entry: Omit<CalculationEntry, "id" | "timestamp">): CalculationEntry {
        const history = this.getAll();
        const newEntry: CalculationEntry = {
            ...entry,
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
        };

        const updatedHistory = [newEntry, ...history].slice(0, MAX_HISTORY);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        
        // Trigger storage event for reactive updates
        window.dispatchEvent(new Event('storage'));
        
        return newEntry;
    },

    getAll(): CalculationEntry[] {
        if (typeof window === "undefined") return [];
        const saved = localStorage.getItem(HISTORY_KEY);
        if (!saved) return [];
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse history", e);
            return [];
        }
    },

    clear(): void {
        localStorage.removeItem(HISTORY_KEY);
        window.dispatchEvent(new Event('storage'));
    },

    remove(id: string): void {
        const history = this.getAll();
        const updated = history.filter(e => e.id !== id);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
    }
};
