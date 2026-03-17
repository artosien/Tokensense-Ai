"use client";

import { useState } from "react";

export function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative inline-block ml-1">
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="text-slate-500 hover:text-cyan-400 text-xs leading-none transition-colors cursor-help"
        aria-label="More info"
      >
        ⓘ
      </button>
      {visible && (
        <span className="
          absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2
          w-48 px-3 py-2 rounded
          bg-slate-800 border border-slate-700
          text-xs font-mono text-slate-300 text-center
          shadow-xl
          pointer-events-none
          whitespace-normal
        ">
          {text}
        </span>
      )}
    </span>
  );
}
