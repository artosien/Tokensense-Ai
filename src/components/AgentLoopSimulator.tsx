"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useTokenSenseStore } from "@/lib/store";
import { getModelById, models } from "@/lib/models";
import { calculateLoopCost } from "@/lib/costEngine";
import CostDisclaimer from "./CostDisclaimer";

export default function AgentLoopSimulator() {
    const {
        agentLoopEnabled,
        agentIterations,
        avgNewInputTokensPerTurn,
        inputTokenCount,
        fileTokenCount,
        expectedOutputTokens,
        selectedModelId,
        setAgentLoopEnabled,
        setAgentIterations,
        setAvgNewInputTokensPerTurn,
    } = useTokenSenseStore();

    const model = getModelById(selectedModelId) ?? models[0];

    const totalInputTokens = inputTokenCount + fileTokenCount;

    // Run the compounding-cost engine
    const loopResult = useMemo(() => {
        if (!agentLoopEnabled || agentIterations < 1 || totalInputTokens === 0) return null;
        return calculateLoopCost(
            totalInputTokens,
            expectedOutputTokens,
            avgNewInputTokensPerTurn,
            agentIterations,
            model
        );
    }, [
        agentLoopEnabled,
        agentIterations,
        avgNewInputTokensPerTurn,
        totalInputTokens,
        expectedOutputTokens,
        model,
    ]);

    // Detect first turn where context window is exceeded
    const contextExceededAtTurn = useMemo(() => {
        if (!loopResult) return null;
        const exceeded = loopResult.turnData.find(
            (t) => t.inputTokens > model.maxContext
        );
        return exceeded ? exceeded.turn : null;
    }, [loopResult, model.maxContext]);

    // Shape data for Recharts — use numeric turn label for a cleaner axis
    const chartData = useMemo(() => {
        if (!loopResult) return [];
        return loopResult.turnData.map((t) => ({
            turn: t.turn,
            turnCost: parseFloat(t.turnCost.toFixed(8)),
            cumulativeCost: parseFloat(t.cumulativeCost.toFixed(8)),
            inputTokens: t.inputTokens,
        }));
    }, [loopResult]);

    const formatCost = (v: number) => {
        if (v === 0) return "$0.00";
        if (v < 0.0001) return `$${v.toFixed(8)}`;
        if (v < 0.01) return `$${v.toFixed(6)}`;
        return `$${v.toFixed(4)}`;
    };

    const formatTokens = (n: number) =>
        n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n.toLocaleString();

    return (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <span className="text-base">🔄</span>
                        Agentic Loop Simulator
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Label
                            htmlFor="loop-toggle"
                            className="text-xs text-muted-foreground cursor-pointer"
                        >
                            {agentLoopEnabled ? "Enabled" : "Disabled"}
                        </Label>
                        <Switch
                            id="loop-toggle"
                            checked={agentLoopEnabled}
                            onCheckedChange={setAgentLoopEnabled}
                        />
                    </div>
                </div>
            </CardHeader>

            {agentLoopEnabled && (
                <CardContent className="space-y-4">
                    {/* ── Controls ─────────────────────────────────────────── */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        {/* Iterations */}
                        <div className="flex flex-col gap-1.5">
                            <Label
                                htmlFor="iterations"
                                className="text-xs text-muted-foreground"
                            >
                                Iterations
                            </Label>
                            <Input
                                id="iterations"
                                type="number"
                                value={agentIterations}
                                onChange={(e) =>
                                    setAgentIterations(
                                        Math.max(1, Math.min(50, parseInt(e.target.value) || 1))
                                    )
                                }
                                min={1}
                                max={50}
                                className="bg-background/50 border-border/50 font-mono text-sm"
                            />
                            <span className="text-[10px] text-muted-foreground/50">max 50 turns</span>
                        </div>

                        {/* Avg new tokens per turn */}
                        <div className="flex flex-col gap-1.5">
                            <Label
                                htmlFor="new-tokens-per-turn"
                                className="text-xs text-muted-foreground"
                            >
                                Avg new tokens / turn
                            </Label>
                            <Input
                                id="new-tokens-per-turn"
                                type="number"
                                value={avgNewInputTokensPerTurn}
                                onChange={(e) =>
                                    setAvgNewInputTokensPerTurn(
                                        Math.max(0, parseInt(e.target.value) || 0)
                                    )
                                }
                                min={0}
                                className="bg-background/50 border-border/50 font-mono text-sm"
                            />
                            <span className="text-[10px] text-muted-foreground/50">
                                tool results, user replies
                            </span>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground/70">
                        Each turn, model output + new tool/user tokens are appended to the
                        context. Costs compound as the window grows.
                    </p>

                    {/* ── Context window exceeded warning ───────────────────── */}
                    {contextExceededAtTurn !== null && (
                        <div className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2">
                            <span className="text-red-400 text-base leading-none">⚠️</span>
                            <p className="text-xs text-red-400 font-medium">
                                Context Window Exceeded at Turn {contextExceededAtTurn}
                                <span className="font-normal text-red-400/70 ml-1">
                                    — model limit is {formatTokens(model.maxContext)} tokens
                                </span>
                            </p>
                        </div>
                    )}

                    <Separator className="opacity-30" />

                    {/* ── Chart & Table ─────────────────────────────────────── */}
                    {loopResult && chartData.length > 0 ? (
                        <>
                            {/* Recharts AreaChart — cumulativeCost curves upward */}
                            <div className="h-[220px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={chartData}
                                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="colorCumulative"
                                                x1="0" y1="0" x2="0" y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#818cf8"
                                                    stopOpacity={0.4}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#818cf8"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                            <linearGradient
                                                id="colorTurnCost"
                                                x1="0" y1="0" x2="0" y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#f59e0b"
                                                    stopOpacity={0.4}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#f59e0b"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(255,255,255,0.06)"
                                        />
                                        <XAxis
                                            dataKey="turn"
                                            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                                            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                                            tickLine={false}
                                            label={{
                                                value: "Turn",
                                                position: "insideBottomRight",
                                                offset: -4,
                                                fontSize: 10,
                                                fill: "rgba(255,255,255,0.25)",
                                            }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                                            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                                            tickLine={false}
                                            tickFormatter={(v) => `$${Number(v).toFixed(4)}`}
                                            width={72}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "rgba(24,24,27,0.95)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "8px",
                                                fontSize: "12px",
                                            }}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            formatter={((value: any, name: any) => [
                                                formatCost(Number(value ?? 0)),
                                                name === "cumulativeCost"
                                                    ? "Cumulative Cost"
                                                    : "Turn Cost",
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            ]) as any}
                                            labelFormatter={(label) => `Turn ${label}`}
                                        />
                                        {/* Cumulative — indigo, fills upward curve */}
                                        <Area
                                            type="monotone"
                                            dataKey="cumulativeCost"
                                            stroke="#818cf8"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorCumulative)"
                                            name="cumulativeCost"
                                        />
                                        {/* Per-turn — amber, stays relatively flat */}
                                        <Area
                                            type="monotone"
                                            dataKey="turnCost"
                                            stroke="#f59e0b"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorTurnCost)"
                                            name="turnCost"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-indigo-400" />
                                    <span>Cumulative Cost</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                                    <span>Per-Turn Cost</span>
                                </div>
                            </div>

                            <Separator className="opacity-30" />

                            {/* Turn-by-turn table */}
                            <div className="max-h-[200px] overflow-y-auto overflow-x-auto">
                                <table className="w-full text-xs min-w-[300px]">
                                    <thead className="sticky top-0 bg-card">
                                        <tr className="text-muted-foreground/70 border-b border-border/30">
                                            <th className="text-left py-1.5 font-medium">Turn</th>
                                            <th className="text-right py-1.5 font-medium">
                                                Input Tokens
                                            </th>
                                            <th className="text-right py-1.5 font-medium">
                                                Turn Cost
                                            </th>
                                            <th className="text-right py-1.5 font-medium">
                                                Cumulative
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-mono">
                                        {loopResult.turnData.map((t) => {
                                            const overLimit = t.inputTokens > model.maxContext;
                                            return (
                                                <tr
                                                    key={t.turn}
                                                    className={`border-b border-border/10 transition-colors ${overLimit
                                                        ? "bg-red-500/10 text-red-400"
                                                        : "hover:bg-muted/20"
                                                        }`}
                                                >
                                                    <td className="py-1.5 flex items-center gap-1">
                                                        {t.turn}
                                                        {overLimit && (
                                                            <span className="text-[9px] font-sans text-red-400 bg-red-500/20 px-1 rounded">
                                                                LIMIT
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="text-right py-1.5">
                                                        {formatTokens(t.inputTokens)}
                                                    </td>
                                                    <td className="text-right py-1.5">
                                                        {formatCost(t.turnCost)}
                                                    </td>
                                                    <td className="text-right py-1.5 text-primary font-semibold">
                                                        {formatCost(t.cumulativeCost)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals footer */}
                            <div className="rounded-lg bg-muted/20 p-3 space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        Total ({agentIterations} turns)
                                    </span>
                                    <span className="text-lg font-bold font-mono text-primary">
                                        {formatCost(loopResult.totals.totalCost)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                                    <span>Input cost</span>
                                    <span className="font-mono">
                                        {formatCost(loopResult.totals.totalInputCost)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                                    <span>Output cost</span>
                                    <span className="font-mono">
                                        {formatCost(loopResult.totals.totalOutputCost)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                                    <span>Final context size</span>
                                    <span className={`font-mono ${loopResult.totals.finalInputTokens > model.maxContext ? "text-red-400" : ""}`}>
                                        {formatTokens(loopResult.totals.finalInputTokens)}
                                        {" / "}
                                        {formatTokens(model.maxContext)}
                                    </span>
                                </div>
                                <Separator className="my-2 opacity-20" />
                                <CostDisclaimer />
                            </div>
                        </>
                    ) : null}
                    {(!loopResult || chartData.length === 0) && (
                        <div className="py-8 text-center text-sm text-muted-foreground/50">
                            Type a prompt and set expected output to see the simulation
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
}
