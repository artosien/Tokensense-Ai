"use client";

import { useState } from "react";
import { models } from "@/lib/models";

const TOP_MODELS = [
  "gpt-5",
  "claude-sonnet-4-6",
  "gemini-3.1-pro",
  "gpt-4o",
  "deepseek-v4",
];

export function ModelPills({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (modelId: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);

  const topModels = models.filter((m) => TOP_MODELS.includes(m.id));
  const remainingModels = models.filter((m) => !TOP_MODELS.includes(m.id));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        {topModels.map((model) => (
          <button
            key={model.id}
            onClick={() => onChange(model.id)}
            className={`
              px-3 py-1.5 rounded-full text-xs font-mono tracking-wide border
              transition-all duration-150 whitespace-nowrap
              ${
                selected === model.id
                  ? "bg-plasma-400 text-navy-950 border-plasma-400 shadow-lg shadow-plasma-400/20"
                  : "bg-transparent text-slate-400 border-slate-700 hover:border-plasma-400/50 hover:text-cyan-300"
              }
            `}
          >
            {model.name}
          </button>
        ))}
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-3 py-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors whitespace-nowrap"
        >
          {showAll ? "Less ↑" : "More ↓"}
        </button>
      </div>

      {showAll && remainingModels.length > 0 && (
        <div className="flex flex-wrap gap-2 pl-0 border-t border-slate-800 pt-3">
          {remainingModels.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onChange(model.id);
                setShowAll(false);
              }}
              className={`
                px-3 py-1.5 rounded-full text-xs font-mono tracking-wide border
                transition-all duration-150 whitespace-nowrap
                ${
                  selected === model.id
                    ? "bg-plasma-400 text-navy-950 border-plasma-400 shadow-lg shadow-plasma-400/20"
                    : "bg-transparent text-slate-400 border-slate-700 hover:border-plasma-400/50 hover:text-cyan-300"
                }
              `}
            >
              {model.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

