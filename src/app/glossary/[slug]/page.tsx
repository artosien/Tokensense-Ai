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

  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `https://tokensense-ai.com/glossary/${term.id}`,
    "name": term.term,
    "description": term.definition.replace(/<[^>]+>/g, ''),
    "inDefinedTermSet": "https://tokensense-ai.com/glossary",
    "termCode": term.abbr || undefined
  };

  const techArticleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": `What is ${term.term}? A Complete Guide`,
    "description": term.tldr || term.definition.replace(/<[^>]+>/g, ''),
    "author": {
      "@type": "Person",
      "name": "Angelo",
      "url": "https://tokensense-ai.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Tokensense-Ai",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tokensense-ai.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://tokensense-ai.com/glossary/${term.id}`
    }
  };

  // Find related terms (same categories)
  const relatedTerms = (glossaryData as Term[])
    .filter(t => t.id !== term.id && t.categories.some(cat => term.categories.includes(cat)))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#040c0e] text-white">
      <SiteHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-32">
        <Link 
          href="/glossary" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#00e5ff] transition-colors font-mono text-xs uppercase tracking-widest mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Glossary
        </Link>

        <article>
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-6">
              {term.categories.map(cat => (
                <span key={cat} className="px-3 py-1 rounded-full border border-[#00e5ff]/10 bg-[#00e5ff]/5 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  {cat}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-sans font-black text-white mb-4 leading-tight tracking-tighter">
              What is {term.term}? <span className="text-[#00e5ff]">A Complete Guide</span>
            </h1>
            
            {term.abbr && (
              <div className="text-2xl font-mono text-[#00e5ff] opacity-80">
                {term.abbr}
              </div>
            )}
          </header>

          {/* TL;DR Section */}
          <div className="mb-12 p-8 rounded-3xl bg-[#00e5ff]/5 border border-[#00e5ff]/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#00e5ff]"></div>
            <h2 className="text-[#00e5ff] font-mono text-xs uppercase tracking-[0.2em] mb-4">TL;DR Definition</h2>
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-white">
              {term.tldr || term.definition.replace(/<[^>]+>/g, '')}
            </p>
          </div>

          <div className="space-y-16">
            {/* Deep Dive */}
            <section>
              <h2 className="text-2xl font-sans font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tight">
                <div className="w-8 h-px bg-[#00e5ff]/30" />
                Deep Dive: How it Works
              </h2>
              <div 
                className="text-lg font-medium leading-relaxed text-slate-400 prose prose-invert prose-cyan max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: (term.deepDive || term.definition).replace(/<strong>/g, '<strong class="text-white font-bold">') 
                }} 
              />
            </section>

            {/* Why it Matters */}
            {term.whyItMatters && (
              <section>
                <h2 className="text-2xl font-sans font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tight">
                  <div className="w-8 h-px bg-[#00e5ff]/30" />
                  Why it Matters
                </h2>
                <p className="text-lg font-medium leading-relaxed text-slate-400">
                  {term.whyItMatters}
                </p>
              </section>
            )}

            {/* Examples */}
            {term.examples && (
              <section>
                <h2 className="text-2xl font-sans font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tight">
                  <div className="w-8 h-px bg-[#00e5ff]/30" />
                  Examples & Visualization
                </h2>
                <div className="p-8 rounded-2xl bg-[#061417] border border-[#00e5ff]/10 font-mono text-sm overflow-x-auto text-[#00e5ff] leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: term.examples }} />
                </div>
              </section>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12 border-t border-white/5 mt-24">
            <div className="p-8 rounded-3xl bg-[#061417] border border-white/5">
              <h3 className="text-[#00e5ff] font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Topical Context
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                This term is fundamental to <strong>{term.categories.join(', ')}</strong> within the Large Language Model ecosystem. Understanding it is crucial for mastering AI infrastructure and implementation.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-[#061417] border border-white/5">
              <h3 className="text-[#00e5ff] font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Learn More
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4 font-medium">
                Explore our Academy modules to see how these concepts translate into real-world token costs and optimizations.
              </p>
              <Link href="/tokenomics" className="text-xs font-bold text-white underline decoration-[#00e5ff] underline-offset-4 hover:text-[#00e5ff] transition-colors">
                Visit Tokenomics Academy
              </Link>
            </div>
          </div>

          {relatedTerms.length > 0 && (
            <section className="mt-24">
              <h2 className="text-2xl font-sans font-black text-white mb-8 uppercase tracking-tight">Related Concepts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedTerms.map(rt => (
                  <Link 
                    key={rt.id} 
                    href={`/glossary/${rt.id}`}
                    className="p-6 rounded-2xl bg-[#061417] border border-white/5 hover:border-[#00e5ff]/30 transition-all group"
                  >
                    <h4 className="text-sm font-mono font-bold text-white group-hover:text-[#00e5ff] transition-colors mb-2">
                      {rt.term}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                      {rt.tldr || rt.definition.replace(/<[^>]+>/g, '')}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* About the Author Section */}
          <section className="mt-24 pt-12 border-t border-white/5">
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-3xl bg-gradient-to-br from-[#061417] to-[#040c0e] border border-white/5">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#00e5ff]/20 flex-shrink-0 bg-[#061417]">
                <img 
                  src="/images/Author/angelo-profile.webp" 
                  alt="Angelo" 
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div>
                <h3 className="text-[#00e5ff] font-mono text-xs uppercase tracking-[0.2em] mb-2">About the Author</h3>
                <h4 className="text-2xl font-sans font-black text-white mb-3">Angelo</h4>
                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl font-medium">
                  Specialist in LLM tokenomics and AI infrastructure optimization. Angelo builds tools like Tokensense-Ai to help developers and enterprises navigate the complex landscape of AI costs, focusing on high-performance, cost-efficient implementation of frontier models.
                </p>
                <div className="flex gap-4 mt-4">
                  <a href="https://tokensense-ai.com/about" className="text-xs font-bold text-[#00e5ff] hover:underline">Learn More</a>
                  <a href="/blog" className="text-xs font-bold text-slate-500 hover:text-white transition-colors">Read More Articles</a>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}

