"use client";

export function RestoredSessionBanner({
  onClear,
}: {
  onClear: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded border border-plasma-400/20 bg-plasma-400/5 text-xs font-mono text-plasma-400/70 mb-4 animate-fade-in">
      <span>↩ Restored your last session</span>
      <button
        onClick={onClear}
        className="hover:text-cyan-300 transition-colors ml-4 flex-shrink-0"
        aria-label="Clear session"
      >
        ✕
      </button>
    </div>
  );
}

