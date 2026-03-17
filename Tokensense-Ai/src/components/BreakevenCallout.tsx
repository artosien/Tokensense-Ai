'use client';

import React from 'react';

interface BreakevenCalloutProps {
  n8nCost: number;
  makeCost: number;
  zapierCost: number;
  executions: number;
  stepsPerExec: number;
}

export default function BreakevenCallout({
  n8nCost,
  makeCost,
  zapierCost,
  executions,
  stepsPerExec,
}: BreakevenCalloutProps) {
  // Determine which is cheapest
  const minCost = Math.min(n8nCost, makeCost, zapierCost);
  const cheapest = minCost === n8nCost ? 'n8n' : minCost === makeCost ? 'Make' : 'Zapier';

  // Calculate approximate breakeven points (simplified)
  // These are rough estimates based on the current execution/steps settings
  const n8nVsMakeBreakeven = stepsPerExec > 2 ? `high step count (${stepsPerExec}+)` : 'low step count';
  const n8nVsZapierBreakeven = executions > 5000 ? 'high volume' : 'low volume';

  const costDiffMakeZapier = Math.abs(makeCost - zapierCost);
  const costDiffN8nMake = Math.abs(n8nCost - makeCost);
  const costDiffN8nZapier = Math.abs(n8nCost - zapierCost);

  const insights = [];

  if (cheapest === 'n8n') {
    insights.push(`✓ n8n is your cheapest option at $${n8nCost.toFixed(2)}/month`);
    if (makeCost > n8nCost) {
      insights.push(`• Make is $${costDiffN8nMake.toFixed(2)}/month more expensive`);
    }
    if (zapierCost > n8nCost) {
      insights.push(`• Zapier is $${costDiffN8nZapier.toFixed(2)}/month more expensive`);
    }
  } else if (cheapest === 'Make') {
    insights.push(`✓ Make is your cheapest option at $${makeCost.toFixed(2)}/month`);
    if (n8nCost > makeCost) {
      insights.push(`• n8n is $${costDiffN8nMake.toFixed(2)}/month more expensive (due to step count)`);
    }
    if (zapierCost > makeCost) {
      insights.push(`• Zapier is $${costDiffMakeZapier.toFixed(2)}/month more expensive`);
    }
  } else {
    insights.push(`✓ Zapier is your cheapest option at $${zapierCost.toFixed(2)}/month`);
    if (n8nCost > zapierCost) {
      insights.push(`• n8n is $${costDiffN8nZapier.toFixed(2)}/month more expensive`);
    }
    if (makeCost > zapierCost) {
      insights.push(`• Make is $${costDiffMakeZapier.toFixed(2)}/month more expensive`);
    }
  }

  return (
    <div className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 p-6">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🎯</div>
          <div>
            <h3 className="font-bold text-cyan-50 text-lg">Breakeven Analysis</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Based on your current settings ({executions.toLocaleString()} executions/month, {stepsPerExec} steps per execution):
            </p>
          </div>
        </div>

        <div className="bg-black/20 rounded-lg p-4 space-y-2">
          {insights.map((insight, idx) => (
            <div key={idx} className="text-sm text-muted-foreground">
              {insight}
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground/70 italic">
          💡 Tip: Adjust the executions and steps above to see how costs change. For complex workflows with many steps, Make becomes expensive — consider n8n self-hosted instead.
        </div>
      </div>
    </div>
  );
}
