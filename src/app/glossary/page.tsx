import { Metadata } from 'next';
import SiteHeader from "@/components/SiteHeader";
import GlossaryClient from "./GlossaryClient";
import glossaryData from "@/../data/glossary.json";

export const metadata: Metadata = {
  title: "LLM Glossary — Every Large Language Model Term Defined",
  description: "The most comprehensive glossary of Large Language Model (LLM) terms. Definitions for tokens, tokenizers, context windows, BPE encoding, embeddings, attention, RLHF, RAG, and 100+ more AI terms.",
};

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-[#040c0e] text-white">
      <SiteHeader />
      <GlossaryClient terms={glossaryData} />
    </div>
  );
}
