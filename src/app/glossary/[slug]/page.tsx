import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Tag, BookOpen } from 'lucide-react';
import SiteHeader from "@/components/SiteHeader";
import glossaryData from "@/../data/glossary.json";

interface Term {
  id: string;
  term: string;
  abbr: string | null;
  definition: string;
  categories: string[];
  tldr?: string;
  deepDive?: string;
  whyItMatters?: string;
  examples?: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return glossaryData.map((term) => ({
    slug: term.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = glossaryData.find(t => t.id === slug) as Term | undefined;

  if (!term) return { title: "Term Not Found" };

  return {
    title: `What is ${term.term}? A Complete Guide — LLM Glossary`,
    description: term.tldr || term.definition.replace(/<[^>]+>/g, '').slice(0, 160),
  };
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  const term = glossaryData.find(t => t.id === slug) as Term | undefined;

  if (!term) {
    notFound();
  }
  // Find related terms (same categories)
  const relatedTerms = (glossaryData as Term[])
    .filter(t => t.id !== term.id && t.categories.some(cat => term.categories.includes(cat)))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <SiteHeader />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-32">
        <Link 
          href="/glossary" 
          className="inline-flex items-center gap-2 text-[#8888a8] hover:text-[#e8c547] transition-colors font-mono text-xs uppercase tracking-widest mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Glossary
        </Link>

        <article>
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-6">
              {term.categories.map(cat => (
                <span key={cat} className="px-3 py-1 rounded-full border border-white/5 bg-white/5 text-[10px] font-mono text-[#8888a8] uppercase tracking-wider">
                  {cat}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight">
              What is {term.term}? <span className="text-[#e8c547]">A Complete Guide</span>
            </h1>
            
            {term.abbr && (
              <div className="text-2xl font-mono text-[#e8c547] opacity-80">
                {term.abbr}
              </div>
            )}
          </header>

          {/* TL;DR Section */}
          <div className="mb-12 p-8 rounded-3xl bg-[#e8c547]/5 border border-[#e8c547]/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#e8c547]"></div>
            <h2 className="text-[#e8c547] font-mono text-xs uppercase tracking-[0.2em] mb-4">TL;DR Definition</h2>
            <p className="text-xl md:text-2xl font-light leading-relaxed text-white">
              {term.tldr || term.definition.replace(/<[^>]+>/g, '')}
            </p>
          </div>

          <div className="space-y-16">
            {/* Deep Dive */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-[#e8c547]/30" />
                Deep Dive: How it Works
              </h2>
              <div 
                className="text-lg font-light leading-relaxed text-[#b4b4d0] prose prose-invert prose-indigo max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: (term.deepDive || term.definition).replace(/<strong>/g, '<strong class="text-white font-medium">') 
                }} 
              />
            </section>

            {/* Why it Matters */}
            {term.whyItMatters && (
              <section>
                <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-px bg-[#e8c547]/30" />
                  Why it Matters
                </h2>
                <p className="text-lg font-light leading-relaxed text-[#b4b4d0]">
                  {term.whyItMatters}
                </p>
              </section>
            )}

            {/* Examples */}
            {term.examples && (
              <section>
                <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-px bg-[#e8c547]/30" />
                  Examples & Visualization
                </h2>
                <div className="p-8 rounded-2xl bg-slate-950 border border-white/5 font-mono text-sm overflow-x-auto text-indigo-300 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: term.examples }} />
                </div>
              </section>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12 border-t border-[#1e1e2e] mt-24">
            <div className="p-8 rounded-3xl bg-[#111118] border border-[#1e1e2e]">
              <h3 className="text-[#e8c547] font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Topical Context
              </h3>
              <p className="text-sm text-[#8888a8] leading-relaxed">
                This term is fundamental to <strong>{term.categories.join(', ')}</strong> within the Large Language Model ecosystem. Understanding it is crucial for mastering AI infrastructure and implementation.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-[#111118] border border-[#1e1e2e]">
              <h3 className="text-[#e8c547] font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Learn More
              </h3>
              <p className="text-sm text-[#8888a8] leading-relaxed mb-4">
                Explore our Academy modules to see how these concepts translate into real-world token costs and optimizations.
              </p>
              <Link href="/tokenomics" className="text-xs font-bold text-white underline decoration-[#e8c547] underline-offset-4 hover:text-[#e8c547] transition-colors">
                Visit Tokenomics Academy
              </Link>
            </div>
          </div>

          {relatedTerms.length > 0 && (
            <section className="mt-24">
              <h2 className="text-2xl font-serif font-bold text-white mb-8">Related Concepts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedTerms.map(rt => (
                  <Link 
                    key={rt.id} 
                    href={`/glossary/${rt.id}`}
                    className="p-6 rounded-2xl bg-[#111118] border border-[#1e1e2e] hover:border-[#e8c547]/30 transition-all group"
                  >
                    <h4 className="text-sm font-mono text-[#f0d875] group-hover:text-[#e8c547] transition-colors mb-2">
                      {rt.term}
                    </h4>
                    <p className="text-xs text-[#55556a] line-clamp-2 leading-relaxed">
                      {rt.tldr || rt.definition.replace(/<[^>]+>/g, '')}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
    </div>
  );
}
