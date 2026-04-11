import React from "react";
import PageEditor from "../PageEditor";
import SiteHeader from "@/components/SiteHeader";
import { getPageBySlug } from "@/lib/page-service";
import { notFound } from "next/navigation";

interface EditPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-10">
        <PageEditor initialPage={page} />
      </main>
    </div>
  );
}
