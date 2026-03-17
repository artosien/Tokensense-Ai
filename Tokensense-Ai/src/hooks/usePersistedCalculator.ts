import { useState, useEffect } from "react";

const STORAGE_KEY = "tokensense-ai_session";

export interface PersistedSession {
  input: string;
  model: string;
}

export function usePersistedCalculator() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [restored, setRestored] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { input: savedInput, model: savedModel } = JSON.parse(saved) as PersistedSession;
        if (savedInput) {
          setInput(savedInput);
          setRestored(true);
        }
        if (savedModel) setModel(savedModel);
      }
    } catch (error) {
      console.debug("Could not restore session:", error);
    }
    setMounted(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ input, model }));
    } catch (error) {
      console.debug("Could not persist session:", error);
    }
  }, [input, model, mounted]);

  return { input, setInput, model, setModel, restored, setRestored, mounted };
}
