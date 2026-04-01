"use client";

import { models } from "@/lib/models";

export function PricingTicker() {
  const items = models.map(m => `${m.name}  ·  $${m.inputPricePer1M} in / $${m.outputPricePer1M} out`);
  const doubled = [...items, ...items]; // seamless loop
  return (
    <div className="overflow-hidden w-full py-3 border-t border-b border-[#00dcb4]/10 bg-[#00dcb4]/3 mt-6">
      <div
        className="flex gap-12 whitespace-nowrap"
        style={{
          animation: "ticker-scroll 32s linear infinite",
          width: "max-content",
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="text-[11px] font-mono text-muted-foreground/60 shrink-0">
            <span className="text-[#00dcb4]/60 mr-1">▸</span>{item}
          </span>
        ))}
      </div>
    </div>
  );
}
