"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const AgentLoopSimulator = dynamic(() => import("@/components/AgentLoopSimulator"), { ssr: false });
const FileContextUploader = dynamic(() => import("@/components/FileContextUploader"), { ssr: false });

export function AgentSimulatorSection() {
  const tHome = useTranslations("home");

  return (
    <div className="text-left space-y-6 max-w-4xl mx-auto">
      <div className="text-xs font-mono text-[#00dcb4] uppercase tracking-wider mb-2">
        {tHome("agent_step1_label")}
      </div>
      <FileContextUploader />
      
      <div className="text-xs font-mono text-[#00dcb4] uppercase tracking-wider mb-2 mt-8">
        {tHome("agent_step2_label")}
      </div>
      <AgentLoopSimulator />
    </div>
  );
}
