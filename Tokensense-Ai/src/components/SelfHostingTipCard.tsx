'use client';

import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface SelfHostingTipProps {
  monthlyN8nCost: number;
  onDismiss?: () => void;
}

export default function SelfHostingTipCard({ monthlyN8nCost, onDismiss }: SelfHostingTipProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Only show if monthly n8n cost exceeds ~$20
  if (isDismissed || monthlyN8nCost < 20) {
    return null;
  }

  const annualN8nCost = monthlyN8nCost * 12;
  const vpsEstimate = 8; // ~$8/month for basic VPS
  const annualVpsCost = vpsEstimate * 12;
  const annualSavings = annualN8nCost - annualVpsCost;

  const handleDismiss = () => {
    setIsDismissed(true);
    // Store in localStorage to remember dismissal
    if (typeof window !== 'undefined') {
      localStorage.setItem('n8n-selfhost-dismissed', 'true');
    }
    onDismiss?.();
  };

  return (
    <div className="relative rounded-lg border-2 border-amber-500/40 bg-amber-500/10 p-6">
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-start gap-4 pr-12">
        <div className="text-3xl mt-1">💡</div>
        <div className="space-y-4 flex-1">
          <div>
            <h3 className="text-lg font-bold text-amber-50 mb-2">Did you know? Self-Hosted n8n Has Zero Execution Cost</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              n8n Cloud charges per execution, but self-hosted n8n runs on your own server with no per-execution billing. At <span className="font-semibold text-foreground">${monthlyN8nCost.toFixed(2)}/month</span> for Cloud, you could save approximately <span className="font-semibold text-green-400">${annualSavings.toFixed(0)}/year</span> by running a basic VPS (~${vpsEstimate}/month) instead.
            </p>
          </div>

          <div className="bg-black/20 rounded-lg p-3 space-y-2">
            <div className="text-xs font-semibold text-foreground uppercase">Cost Comparison</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-muted-foreground">n8n Cloud (Annual)</div>
                <div className="font-mono font-bold text-amber-50">${annualN8nCost.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">Self-Hosted (Annual)</div>
                <div className="font-mono font-bold text-green-400">${annualVpsCost.toFixed(2)}</div>
              </div>
            </div>
            <div className="pt-2 border-t border-border/40">
              <div className="text-[10px] text-muted-foreground">Annual Savings</div>
              <div className="font-mono font-bold text-green-400">${annualSavings.toFixed(2)}</div>
            </div>
          </div>

          <a
            href="https://docs.n8n.io/hosting/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            Read n8n Self-Hosting Docs
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
