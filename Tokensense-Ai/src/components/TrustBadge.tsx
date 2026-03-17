'use client';

import React from 'react';
import { Lock } from 'lucide-react';

export default function TrustBadge() {
  return (
    <div className="group relative">
      <button
        className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-500/8 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/15 hover:border-blue-500/60 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-blue-500/20"
        title="Prompts never leave your browser"
      >
        <Lock className="w-3.5 h-3.5" />
        <span>100% Client-Side</span>
      </button>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg text-xs text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        <p className="font-medium text-foreground">Your data stays private</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">All calculations run locally in your browser</p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-card border-b border-r border-border rotate-45" />
      </div>
    </div>
  );
}
