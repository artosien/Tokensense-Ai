"use client";

export function PriceTimestamp({
  updatedAt = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).replace(/,/, "") + " UTC",
}: {
  updatedAt?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span>
        Prices synced from provider APIs ·{" "}
        <time className="text-slate-500">{updatedAt}</time>
      </span>
    </div>
  );
}
