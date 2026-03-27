"use client";

import { useState, useRef } from "react";
import { TOOLTIPS, TooltipKey } from "@/lib/tooltips";

interface TermTooltipProps {
  termKey: TooltipKey;
  children?: React.ReactNode;
  /** If true, renders a ? icon button instead of wrapping children with dotted underline */
  iconOnly?: boolean;
  className?: string;
}

/**
 * TermTooltip — wraps a term or renders a ? icon with a styled terminal-aesthetic tooltip.
 * Works on hover (desktop) and tap (mobile).
 */
export function TermTooltip({
  termKey,
  children,
  iconOnly = false,
  className = "",
}: TermTooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltip = TOOLTIPS[termKey];

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => setVisible(false), 120);
  };

  const toggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setVisible((v) => !v);
  };

  if (iconOnly) {
    return (
      <span className={`relative inline-flex items-center ml-1 ${className}`}>
        <button
          type="button"
          onMouseEnter={show}
          onMouseLeave={hide}
          onFocus={show}
          onBlur={hide}
          onClick={toggle}
          className="w-4 h-4 rounded-full border border-plasma-500/40 bg-plasma-500/10 text-plasma-400 hover:bg-plasma-500/20 hover:border-plasma-400 transition-all duration-150 flex items-center justify-center text-[9px] font-bold cursor-help shrink-0"
          aria-label={`What is ${tooltip.term}?`}
        >
          ?
        </button>
        <TooltipBubble visible={visible} definition={tooltip.definition} />
      </span>
    );
  }

  return (
    <span className={`relative inline-flex items-baseline gap-0.5 ${className}`}>
      <span
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={toggle}
        className="border-b border-dashed border-plasma-500/50 cursor-help hover:border-plasma-400 transition-colors duration-150"
        tabIndex={0}
        role="button"
        aria-label={`What is ${tooltip.term}?`}
      >
        {children ?? tooltip.term}
      </span>
      <TooltipBubble visible={visible} definition={tooltip.definition} />
    </span>
  );
}

function TooltipBubble({
  visible,
  definition,
}: {
  visible: boolean;
  definition: string;
}) {
  if (!visible) return null;

  return (
    <span
      role="tooltip"
      className="
        absolute z-[9999] bottom-full left-1/2 -translate-x-1/2 mb-2
        w-56 px-3 py-2.5 rounded-md
        bg-[#0d1117] border border-plasma-500/50
        text-xs font-mono text-slate-200 leading-relaxed
        shadow-[0_0_20px_rgba(6,182,212,0.15)]
        pointer-events-none
        whitespace-normal text-center
        animate-in fade-in zoom-in-95 duration-150
      "
      style={{ filter: "drop-shadow(0 0 8px rgba(6,182,212,0.2))" }}
    >
      {definition}
      {/* Caret */}
      <span
        className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
        style={{
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "5px solid rgb(6 182 212 / 0.5)",
        }}
      />
    </span>
  );
}

