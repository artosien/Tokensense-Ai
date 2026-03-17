'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface PlatformComparisonData {
  platform: 'n8n' | 'Make' | 'Zapier';
  costPer1kRuns: number;
  monthlyCost: number;
  annualCost: number;
  bestFor: string;
  color: string;
  isBestValue: boolean;
}

interface PlatformComparisonTableProps {
  data: PlatformComparisonData[];
  executions: number;
}

export default function PlatformComparisonTable({ data, executions }: PlatformComparisonTableProps) {
  const bestValuePlatform = data.find(d => d.isBestValue);

  return (
    <div className="space-y-6">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Platform</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Cost per 1,000 Runs</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Monthly Cost</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Annual Projection</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Best For</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr 
                key={item.platform} 
                className={`border-b border-border/20 transition-colors ${
                  item.isBestValue ? 'bg-green-500/10' : 'hover:bg-muted/50'
                }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-semibold text-foreground">{item.platform}</span>
                    {item.isBestValue && (
                      <span className="ml-2 text-xs font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                        BEST VALUE
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-right font-mono font-semibold text-foreground">
                  ${item.costPer1kRuns.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right font-mono font-bold text-foreground text-base">
                  ${item.monthlyCost.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right font-mono font-semibold text-muted-foreground">
                  ${item.annualCost.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-muted-foreground text-xs">
                  {item.bestFor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((item) => (
          <div
            key={item.platform}
            className={`rounded-lg border-2 p-4 space-y-3 ${
              item.isBestValue
                ? 'border-green-500/50 bg-green-500/10'
                : 'border-border/40 bg-card'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <h3 className="font-bold text-foreground">{item.platform}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{item.bestFor}</p>
              </div>
              {item.isBestValue && (
                <span className="text-xs font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  BEST
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/20">
              <div>
                <div className="text-[10px] text-muted-foreground/70 uppercase font-semibold">Per 1K</div>
                <div className="font-mono font-bold text-foreground">${item.costPer1kRuns.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground/70 uppercase font-semibold">Monthly</div>
                <div className="font-mono font-bold text-foreground">${item.monthlyCost.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground/70 uppercase font-semibold">Annual</div>
                <div className="font-mono font-bold text-foreground">${item.annualCost.toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insight Callout */}
      {bestValuePlatform && (
        <div className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl mt-1">💡</div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-cyan-400">Smart Insight</p>
              <p className="text-sm text-muted-foreground">
                At {executions.toLocaleString()} executions/month, <span className="font-semibold text-foreground">{bestValuePlatform.platform}</span> is your most cost-effective option, saving you <span className="font-semibold text-green-400">${(Math.max(...data.map(d => d.monthlyCost)) - bestValuePlatform.monthlyCost).toFixed(2)}/month</span> compared to the next platform.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
