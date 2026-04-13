"use client";

import { MainCalculator } from "@/components/MainCalculator";
import { ComparisonTableSection } from "@/components/ComparisonTableSection";
import { AgentSimulatorSection } from "@/components/AgentSimulatorSection";
import { BudgetCalculator } from "@/components/BudgetCalculator";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function HomeClient() {
  return (
    <>
      {/* STEP 01 */}
      <section id="step-1" className="scroll-mt-24 space-y-8" data-step-section="1">
        <div className="text-center mb-8 mt-12">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#00dcb4]/10 text-[#00dcb4] text-sm font-mono font-bold tracking-widest uppercase mb-4 border border-[#00dcb4]/20">
              {"STEP 01 — Count your tokens & estimate cost"}
            </div>
            <p className="text-muted-foreground text-lg font-medium">
              {"Paste your prompt, choose a model, and see your cost instantly."}
            </p>
        </div>
        <MainCalculator />
      </section>

      <div className="py-12">
        <Separator className="bg-border/40" />
      </div>

      {/* STEP 02 */}
      <section id="step-2" className="scroll-mt-24 space-y-8" data-step-section="2">
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#00dcb4]/10 text-[#00dcb4] text-sm font-mono font-bold tracking-widest uppercase mb-4 border border-[#00dcb4]/20">
            {"STEP 02 — Compare your model across 30+ options"}
          </div>
          <p className="text-muted-foreground text-lg font-medium">
            {"Add multiple models to see side-by-side costs for the same prompt."}
          </p>
        </div>
        <Card className="border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden">
          <ComparisonTableSection />
        </Card>
      </section>

      <div className="py-12">
        <Separator className="bg-border/40" />
      </div>

      {/* STEP 03 */}
      <section id="step-3" className="scroll-mt-24 space-y-8" data-step-section="3">
        <div className="my-8 relative z-10 text-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#00dcb4]/10 text-[#00dcb4] text-sm font-mono font-bold tracking-widest uppercase mb-4 border border-[#00dcb4]/20">
              {"STEP 03 — Simulate your agent's total cost over time"}
            </div>
            <p className="text-muted-foreground text-lg font-medium mb-8">
              {"See how costs compound across multiple turns — before you build."}
            </p>
            <Card className="border-border/40 bg-card/30 backdrop-blur-sm p-2 sm:p-6 lg:p-8">
              <AgentSimulatorSection />
            </Card>
        </div>
      </section>

      <div className="py-12">
        <Separator className="bg-border/40" />
      </div>

      {/* Budget Reverse Calculator */}
      <div id="budget-planner" className="pt-4 scroll-mt-24">
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-mono font-bold tracking-widest uppercase mb-4 border border-indigo-500/20">
            {"Reverse Budget Planner"}
          </div>
          <p className="text-muted-foreground text-lg font-medium">
            {"Work backwards from your monthly budget to see how many prompts you can afford."}
          </p>
        </div>
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
          <BudgetCalculator />
        </Card>
      </div>
    </>
  );
}
