import React from "react";
import ModuleEditor from "../ModuleEditor";
import SiteHeader from "@/components/SiteHeader";

export default function NewModulePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-10">
        <ModuleEditor />
      </main>
    </div>
  );
}
