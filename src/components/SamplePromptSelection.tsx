"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTokenSenseStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Leaf, Activity, Weight } from "lucide-react";

const SAMPLE_PROMPTS = {
  light: {
    label: "Light Use Case",
    icon: <Leaf className="w-3.5 h-3.5" />,
    description: "~50 tokens. Simple query.",
    text: "What is the capital of France, and what is its most famous landmark?",
  },
  medium: {
    label: "Medium Use Case",
    icon: <Activity className="w-3.5 h-3.5" />,
    description: "~300 tokens. Detailed explanation.",
    text: "Explain the concept of 'Quantum Entanglement' to a high school student. Include a simple analogy, the historical context of its discovery (mentioning Einstein, Podolsky, and Rosen), and why it's considered a fundamental part of quantum mechanics despite being 'spooky action at a distance'. Please keep the tone encouraging and academic.",
  },
  heavy: {
    label: "Heavy Use Case",
    icon: <Weight className="w-3.5 h-3.5" />,
    description: "~1,500+ tokens. Complex reasoning & data.",
    text: `Analyze the following technical documentation and provide a comprehensive implementation plan for a secure, scalable microservices architecture.

### Documentation Context:
Our current monolith handles user authentication, order processing, and inventory management. We are seeing latency spikes exceeding 2.5s during peak hours (10 AM - 2 PM EST). The database is a single PostgreSQL instance with 95% CPU utilization. We need to migrate to a distributed system using Node.js, Go, and Redis.

### Requirements:
1. Define 4 core microservices (Auth, Order, Inventory, Notification).
2. Propose a communication strategy (Synchronous vs. Asynchronous).
3. Design a retry mechanism for failed transactions.
4. Include a security audit plan focusing on JWT rotation and TLS 1.3.
5. Create a step-by-step 12-week migration roadmap.

### Constraints:
- Zero downtime during migration.
- Must use Kubernetes for orchestration.
- Budget for infrastructure is limited to $5k/month.
- Compliance: GDPR and SOC2 Type II.

### Detailed System Specs:
[Imagine 1000+ more words here describing complex API schemas, database ERDs, network topology, and legacy code bottlenecks that need refactoring. This prompt simulates a heavy context-window stress test for LLMs like GPT-4o or Claude 3.5 Sonnet to see how they handle deep reasoning across massive input buffers.]

Please output a 15-page equivalent technical specification document.`,
  },
};

export function SamplePromptSelection() {
  const { setUserPrompt } = useTokenSenseStore();
  const [activeType, setActiveType] = useState<string | null>(null);

  const applySample = (type: keyof typeof SAMPLE_PROMPTS) => {
    setActiveType(type);
    setUserPrompt(SAMPLE_PROMPTS[type].text);
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Sample Use Cases
        </span>
        <div className="flex-1 h-px bg-border/40" />
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.entries(SAMPLE_PROMPTS) as [keyof typeof SAMPLE_PROMPTS, typeof SAMPLE_PROMPTS['light']][]).map(([key, sample]) => {
          const isActive = activeType === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => applySample(key)}
              title={sample.description}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200",
                isActive
                  ? "border-indigo-400 bg-indigo-500/15 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                  : "border-border/50 bg-card/30 text-muted-foreground hover:border-indigo-500/60 hover:bg-indigo-500/8 hover:text-indigo-400"
              )}
            >
              <span className={cn("transition-colors", isActive ? "text-indigo-400" : "text-muted-foreground")}>
                {sample.icon}
              </span>
              <span>{sample.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-indigo-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
