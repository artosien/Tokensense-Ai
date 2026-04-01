"use client";

import { MainCalculator } from "@/components/MainCalculator";
import { ComparisonTableSection } from "@/components/ComparisonTableSection";
import { AgentSimulatorSection } from "@/components/AgentSimulatorSection";
import { ApiIntegrationSection } from "@/components/ApiIntegrationSection";
import { BudgetCalculator } from "@/components/BudgetCalculator";
import { StickyResultsBar } from "@/components/StickyResultsBar";
import { Card } from "@/components/ui/card";

export default function HomeClient() {
  return (
    <>
      <StickyResultsBar />
      
      {/* STEP 01 */}
      <section className="space-y-8">
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

      <div className="hidden md:flex justify-center mt-8 mb-4">
        <div className="w-px h-16 border-l-2 border-dashed border-[#00dcb4]/40"></div>
      </div>

      {/* STEP 02 */}
      <section className="space-y-8">
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#00dcb4]/10 text-[#00dcb4] text-sm font-mono font-bold tracking-widest uppercase mb-4 border border-[#00dcb4]/20">
            {"STEP 02 — Compare your model across 30+ options"}
          </div>
          <p className="text-muted-foreground text-lg font-medium">
            {"Add multiple models to see side-by-side costs for the same prompt."}
          </p>
        </div>
        <ComparisonTableSection />
      </section>

      <div className="hidden md:flex justify-center mt-8 mb-4">
        <div className="w-px h-16 border-l-2 border-dashed border-[#00dcb4]/40"></div>
      </div>

      {/* STEP 03 */}
      <section className="space-y-8">
        <div className="my-8 relative z-10 text-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#00dcb4]/10 text-[#00dcb4] text-sm font-mono font-bold tracking-widest uppercase mb-4 border border-[#00dcb4]/20">
              {"STEP 03 — Simulate your agent's total cost over time"}
            </div>
            <p className="text-muted-foreground text-lg font-medium mb-8">
              {"See how costs compound across multiple turns — before you build."}
            </p>
            <AgentSimulatorSection />
        </div>
      </section>

      {/* API Integration Section */}
      <div className="pt-8">
        <ApiIntegrationSection />
      </div>

      {/* Budget Reverse Calculator */}
      <div className="pt-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
          <BudgetCalculator />
        </Card>
      </div>
    </>
  );
}
