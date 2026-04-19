import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Tag, BookOpen, Presentation, Info, CheckCircle2, ChevronRight, Activity, Microscope, Zap } from 'lucide-react';
import SiteHeader from "@/components/SiteHeader";
import TermInfographic from "@/components/TermInfographic";
import glossaryData from "@/../data/glossary.json";
import fs from 'fs';
import path from 'path';

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

  // Check if infographic exists
  const infographicPath = `/images/glossary/${term.id}.svg`;
  const fullInfographicPath = path.join(process.cwd(), 'public', infographicPath);
  const hasInfographic = fs.existsSync(fullInfographicPath);

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
      
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-32">
        <Link 
          href="/glossary" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#00e5ff] transition-colors font-mono text-xs uppercase tracking-widest mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Glossary
        </Link>

        <article>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <header className="mb-12">
                <div className="flex flex-wrap gap-2 mb-6">
                  {term.categories.map(cat => (
                    <span key={cat} className="px-3 py-1 rounded-full border border-[#00e5ff]/10 bg-[#00e5ff]/5 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {cat}
                    </span>
                  ))}
                </div>
                
                <h1 className="text-4xl md:text-6xl font-sans font-black text-white mb-4 leading-tight tracking-tighter">
                  What is {term.term}? <span className="text-[#00e5ff]">A Complete Guide</span>
                </h1>
                
                {term.abbr && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xl font-mono text-[#00e5ff] font-bold">
                    <span className="text-xs uppercase tracking-widest text-slate-500 font-black">Abbr.</span>
                    {term.abbr}
                  </div>
                )}
              </header>

              {/* TL;DR Section */}
              <div className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-[#00e5ff]/10 to-transparent border border-[#00e5ff]/20 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.5)]"></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#00e5ff]/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#00e5ff]" />
                  </div>
                  <h2 className="text-[#00e5ff] font-mono text-xs uppercase tracking-[0.2em] font-black">TL;DR Definition</h2>
                </div>
                <p className="text-xl md:text-2xl font-medium leading-relaxed text-white group-hover:translate-x-1 transition-transform duration-300">
                  {term.tldr || term.definition.replace(/<[^>]+>/g, '')}
                </p>
              </div>

              {/* Primary Visual Element */}
              <div className="mb-16">
                {hasInfographic ? (
                  <div className="rounded-3xl overflow-hidden border border-[#00e5ff]/20 shadow-2xl bg-[#061417] group relative">
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md">
                        <Presentation className="w-3.5 h-3.5 text-[#00e5ff]" />
                        <span className="text-[10px] font-black text-[#00e5ff] uppercase tracking-wider">High-Res Diagram</span>
                      </div>
                    </div>
                    <img 
                      src={infographicPath} 
                      alt={`Infographic explaining ${term.term}`} 
                      className="w-full h-auto"
                    />
                    <div className="p-6 bg-slate-900/50 border-t border-white/5">
                      <p className="text-sm text-slate-400 italic text-center font-medium leading-relaxed">
                        <strong>Architectural View:</strong> A visual mapping of {term.term} logic and flow.
                      </p>
                    </div>
                  </div>
                ) : (
                  <TermInfographic id={term.id} term={term.term} categories={term.categories} />
                )}
              </div>

              <div className="space-y-20">
                {/* Deep Dive */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00e5ff]">
                      <Microscope className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight">
                      Deep Dive: How it Works
                    </h2>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-[#00e5ff]/20 via-transparent to-transparent" />
                    <div 
                      className="pl-8 text-lg font-medium leading-relaxed text-slate-400 prose prose-invert prose-cyan max-w-none
                      prose-h3:text-white prose-h3:font-black prose-h3:uppercase prose-h3:tracking-tight prose-h3:mt-12
                      prose-ul:list-none prose-ul:pl-0 prose-li:relative prose-li:pl-8 prose-li:mb-4
                      prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-4
                      prose-li:before:w-2 prose-li:before:h-px prose-li:before:bg-[#00e5ff]
                      prose-strong:text-white prose-strong:font-bold prose-p:mb-6"
                      dangerouslySetInnerHTML={{ 
                        __html: (term.deepDive || term.definition)
                          .replace(/<strong>/g, '<strong class="text-white font-bold">')
                          .replace(/<ul/g, '<ul class="space-y-4"')
                          .replace(/<li/g, '<li class="text-slate-300 font-medium"')
                      }} 
                    />
                  </div>
                </section>

                {/* Why it Matters */}
                {term.whyItMatters && (
                  <section className="p-8 rounded-3xl bg-slate-900/30 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Activity className="w-24 h-24" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Info className="w-4 h-4 text-purple-400" />
                      </div>
                      <h2 className="text-xl font-sans font-black text-white uppercase tracking-tight">
                        Why it Matters
                      </h2>
                    </div>
                    <p className="text-lg font-medium leading-relaxed text-slate-400 relative z-10">
                      {term.whyItMatters}
                    </p>
                  </section>
                )}

                {/* Examples */}
                {term.examples && (
                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-8 h-8 rounded-lg bg-[#00e5ff]/20 flex items-center justify-center text-[#00e5ff]">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <h2 className="text-2xl font-sans font-black text-white uppercase tracking-tight">
                        Real-World Examples
                      </h2>
                    </div>
                    <div className="rounded-3xl bg-[#061417] border border-white/10 shadow-inner overflow-hidden">
                      <div className="p-1 bg-gradient-to-r from-transparent via-[#00e5ff]/20 to-transparent" />
                      <div className="p-8 font-mono text-sm text-[#00e5ff]/90 leading-relaxed overflow-x-auto">
                        <div 
                          className="prose prose-invert prose-cyan max-w-none prose-table:border-collapse prose-td:border prose-td:border-white/10 prose-th:bg-white/5"
                          dangerouslySetInnerHTML={{ __html: term.examples }} 
                        />
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </div>

            {/* Sidebar / Quick Facts */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="sticky top-32 space-y-6">
                <div className="p-8 rounded-3xl bg-[#061417] border border-white/5 shadow-2xl">
                  <h3 className="text-[#00e5ff] font-mono text-xs uppercase tracking-widest mb-6 flex items-center gap-2 font-black">
                    <Tag className="w-4 h-4" />
                    Quick Context
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-black text-white uppercase mb-1 tracking-tighter">Domain</div>
                        <div className="text-sm text-slate-400 leading-snug">LLM Infrastructure & {term.categories[0]}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-black text-white uppercase mb-1 tracking-tighter">Impact Level</div>
                        <div className="text-sm text-slate-400 leading-snug">Critical for Performance & Cost</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                      Understanding <strong>{term.term}</strong> is fundamental to mastering AI architecture.
                    </p>
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20">
                  <h3 className="text-indigo-400 font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2 font-black">
                    <BookOpen className="w-4 h-4" />
                    Learn More
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6 font-medium">
                    See how this concept translates into real-world token costs and optimizations in our academy.
                  </p>
                  <Link href="/tokenomics" className="group flex items-center gap-2 text-sm font-bold text-white">
                    <span className="underline decoration-[#00e5ff] underline-offset-4 group-hover:text-[#00e5ff] transition-colors">Visit Academy</span>
                    <ChevronRight className="w-4 h-4 text-[#00e5ff] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {relatedTerms.length > 0 && (
            <section className="mt-32">
              <div className="flex items-center gap-4 mb-12">
                <div className="h-px flex-1 bg-white/5" />
                <h2 className="text-2xl font-sans font-black text-white uppercase tracking-tight shrink-0">Related Concepts</h2>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedTerms.map(rt => (
                  <Link 
                    key={rt.id} 
                    href={`/glossary/${rt.id}`}
                    className="group p-8 rounded-3xl bg-[#061417] border border-white/5 hover:border-[#00e5ff]/30 transition-all hover:-translate-y-1"
                  >
                    <div className="text-[#00e5ff] font-mono text-[10px] uppercase tracking-widest mb-4 opacity-50">{rt.categories[0]}</div>
                    <h4 className="text-xl font-sans font-black text-white group-hover:text-[#00e5ff] transition-colors mb-4">
                      {rt.term}
                    </h4>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium group-hover:text-slate-400 transition-colors">
                      {rt.tldr || rt.definition.replace(/<[^>]+>/g, '')}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* About the Author Section */}
          <section className="mt-32 pt-16 border-t border-white/5">
            <div className="flex flex-col md:flex-row items-center gap-10 p-10 rounded-[2.5rem] bg-gradient-to-br from-[#061417] to-[#040c0e] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              <div className="w-32 h-32 rounded-3xl overflow-hidden border border-white/10 flex-shrink-0 bg-[#061417] rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/images/Author/angelo-profile.webp" 
                  alt="Angelo" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8 bg-[#00e5ff]/30" />
                  <h3 className="text-[#00e5ff] font-mono text-xs uppercase tracking-[0.2em] font-black">Expert Contributor</h3>
                </div>
                <h4 className="text-3xl font-sans font-black text-white mb-4">Angelo</h4>
                <p className="text-slate-400 text-base leading-relaxed max-w-2xl font-medium">
                  Specialist in LLM tokenomics and AI infrastructure optimization. Angelo builds tools like Tokensense-Ai to help developers navigate the complex landscape of AI costs, focusing on high-performance, cost-efficient implementation of frontier models.
                </p>
                <div className="flex gap-6 mt-8">
                  <a href="https://tokensense-ai.com/about" className="text-sm font-black text-white hover:text-[#00e5ff] transition-colors uppercase tracking-widest">About</a>
                  <a href="/blog" className="text-sm font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">More Articles</a>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}

