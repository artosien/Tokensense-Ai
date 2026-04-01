export const USE_CASE_PRESETS: Record<string, { promptTokens: number; label: string }> = {
  summarize:   { promptTokens: 300,  label: "Summarize content" },
  transcribe:  { promptTokens: 150,  label: "Transcribe & analyze" },
  qa:          { promptTokens: 1000, label: "Visual Q&A" },
  description: { promptTokens: 200,  label: "Generate description" },
  custom:      { promptTokens: 500,  label: "Custom" },
};
