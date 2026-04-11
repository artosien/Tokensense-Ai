import React from "react";
import ModuleEditor from "../ModuleEditor";
import SiteHeader from "@/components/SiteHeader";
import { getAcademyData } from "@/lib/academy-service";
import { notFound } from "next/navigation";

interface EditModulePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditModulePage({ params }: EditModulePageProps) {
  const { id } = await params;
  const modules = await getAcademyData();
  const module = modules.find(m => m.id === id);

  if (!module) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-10">
        <ModuleEditor initialModule={module} />
      </main>
    </div>
  );
}
