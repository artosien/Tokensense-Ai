"use client";

import React from "react";
import CostDisclaimer from "./CostDisclaimer";

interface CostGaugeProps {
    totalCost: number;
}

export default function CostGauge({ totalCost }: CostGaugeProps) {
    // Gauge parameters
    const size = 200;
    const strokeWidth = 16;
    const radius = (size - strokeWidth) / 2;
    const cx = size / 2;
    const cy = size / 2;

    // Arc goes from 135° to 405° (270° sweep)
    const startAngle = 135;
    const endAngle = 405;
    const totalSweep = endAngle - startAngle; // 270°

    // Map cost to gauge position (logarithmic for better UX)
    // $0 = 0%, $0.001 = ~15%, $0.01 = ~50%, $0.10 = ~80%, $1.00 = 100%
    const costToPercentage = (cost: number): number => {
        if (cost <= 0) return 0;
        if (cost >= 1.0) return 100;
        // Log scale: map from $0.0001 to $1.00
        const logMin = Math.log10(0.0001);
        const logMax = Math.log10(1.0);
        const logCost = Math.log10(Math.max(cost, 0.0001));
        return Math.min(100, Math.max(0, ((logCost - logMin) / (logMax - logMin)) * 100));
    };

    const percentage = costToPercentage(totalCost);
    const needleAngle = startAngle + (percentage / 100) * totalSweep;

    // Determine tier and colors
    const getTier = (): { label: string; color: string; bgGlow: string } => {
        if (totalCost < 0.01) return { label: "Cheap", color: "#22c55e", bgGlow: "rgba(34,197,94,0.15)" };
        if (totalCost < 0.10) return { label: "Moderate", color: "#f59e0b", bgGlow: "rgba(245,158,11,0.15)" };
        return { label: "Expensive", color: "#ef4444", bgGlow: "rgba(239,68,68,0.15)" };
    };

    const tier = getTier();

    // SVG arc path helper
    const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
        const rad = ((angleDeg - 90) * Math.PI) / 180;
        return {
            x: cx + r * Math.cos(rad),
            y: cy + r * Math.sin(rad),
        };
    };

    const describeArc = (cx: number, cy: number, r: number, startA: number, endA: number) => {
        const start = polarToCartesian(cx, cy, r, endA);
        const end = polarToCartesian(cx, cy, r, startA);
        const largeArc = endA - startA > 180 ? 1 : 0;
        return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
    };

    const needleEnd = polarToCartesian(cx, cy, radius - 20, needleAngle);
    const needleBase1 = polarToCartesian(cx, cy, 6, needleAngle - 90);
    const needleBase2 = polarToCartesian(cx, cy, 6, needleAngle + 90);

    return (
        <div className="flex flex-col items-center">
            <svg
                width={size}
                height={size * 0.7}
                viewBox={`0 0 ${size} ${size * 0.75}`}
                className="drop-shadow-lg"
            >
                {/* Background glow */}
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id="gaugeGradient" gradientUnits="userSpaceOnUse"
                        x1={polarToCartesian(cx, cy, radius, startAngle).x}
                        y1={polarToCartesian(cx, cy, radius, startAngle).y}
                        x2={polarToCartesian(cx, cy, radius, endAngle).x}
                        y2={polarToCartesian(cx, cy, radius, endAngle).y}
                    >
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="40%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>

                {/* Track background */}
                <path
                    d={describeArc(cx, cy, radius, startAngle, endAngle)}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Colored arc (filled up to needle) */}
                {percentage > 0 && (
                    <path
                        d={describeArc(cx, cy, radius, startAngle, startAngle + (percentage / 100) * totalSweep)}
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        filter="url(#glow)"
                        className="transition-all duration-500 ease-out"
                    />
                )}

                {/* Tick marks */}
                {[0, 25, 50, 75, 100].map((pct) => {
                    const angle = startAngle + (pct / 100) * totalSweep;
                    const outer = polarToCartesian(cx, cy, radius + 10, angle);
                    const inner = polarToCartesian(cx, cy, radius + 4, angle);
                    return (
                        <line
                            key={pct}
                            x1={inner.x} y1={inner.y}
                            x2={outer.x} y2={outer.y}
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth={1.5}
                        />
                    );
                })}

                {/* Needle */}
                <polygon
                    points={`${needleEnd.x},${needleEnd.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
                    fill={tier.color}
                    className="transition-all duration-500 ease-out"
                    filter="url(#glow)"
                />

                {/* Center dot */}
                <circle cx={cx} cy={cy} r={8} fill="rgba(255,255,255,0.15)" />
                <circle cx={cx} cy={cy} r={4} fill={tier.color} className="transition-colors duration-500" />

                {/* Cost display */}
                <text
                    x={cx}
                    y={cy + 28}
                    textAnchor="middle"
                    className="fill-foreground text-lg font-bold font-mono"
                    fontSize="18"
                >
                    ${totalCost < 0.001 ? totalCost.toFixed(6) : totalCost < 0.01 ? totalCost.toFixed(4) : totalCost.toFixed(4)}
                </text>
            </svg>

            {/* Tier label */}
            <div
                className="mt-1 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-500"
                style={{
                    color: tier.color,
                    backgroundColor: tier.bgGlow,
                }}
            >
                {tier.label}
            </div>
            
            <CostDisclaimer className="mt-4 max-w-[180px] text-center justify-center" />
        </div>
    );
}
