"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, ArrowUp } from 'lucide-react';

interface Term {
  id: string;
  term: string;
  abbr: string | null;
  definition: string;
  categories: string[];
}

const CATEGORY_MAPPING: Record<string, string> = {
  architecture: "Architecture",
  multimodal: "Architecture",
  training: "Training",
  alignment: "Training",
  prompting: "Usage",
  inference: "Usage",
  tokenization: "Engineering",
  evaluation: "Engineering",
  retrieval: "Engineering",
  efficiency: "Engineering",
};

const CATEGORIES = ["All", "Architecture", "Training", "Usage", "Engineering"];

export default function GlossaryClient({ terms }: { terms: Term[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTerms = useMemo(() => {
    return terms.filter(term => {
      const matchesSearch = !searchQuery || 
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (term.abbr && term.abbr.toLowerCase().includes(searchQuery.toLowerCase())) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase());
      
      const termMainCategories = term.categories.map(c => CATEGORY_MAPPING[c] || "Engineering");
      const matchesCategory = activeCategory === "All" || termMainCategories.includes(activeCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [terms, searchQuery, activeCategory]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, Term[]> = {
      "Architecture": [],
      "Training": [],
      "Usage": [],
      "Engineering": []
    };

    filteredTerms.forEach(term => {
      // Find which main category it belongs to (first match)
      const mainCat = term.categories.map(c => CATEGORY_MAPPING[c]).find(c => !!c) || "Engineering";
      groups[mainCat].push(term);
    });

    // Sort terms within each group
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => a.term.localeCompare(b.term));
    });

    return groups;
  }, [filteredTerms]);

  const totalCount = terms.length;
  const filteredCount = filteredTerms.length;

  return (
    <div className="relative">
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-20" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")` }}>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 text-[#e8c547] font-mono text-[10px] uppercase tracking-[0.2em] mb-6">
            <div className="w-6 h-px bg-[#e8c547]" />
            The Definitive Reference
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-[1.1]">
            Every <em className="text-[#e8c547] not-italic italic">LLM term</em><br />you need to know
          </h1>
          <p className="text-[#8888a8] text-lg max-w-2xl font-light leading-relaxed">
            A comprehensive glossary of Large Language Model concepts — from tokenization and architecture to training, inference, alignment, and beyond.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="sticky top-20 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl py-6 border-b border-[#1e1e2e] mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#55556a]" />
              <input 
                type="text" 
                placeholder="Search 100+ terms..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#16161f] border border-[#2a2a3e] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#55556a] focus:outline-none focus:border-[#e8c547] transition-colors font-light text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider border transition-all ${
                    activeCategory === cat 
                      ? "bg-[#e8c547]/10 border-[#e8c547] text-[#e8c547]" 
                      : "border-[#2a2a3e] text-[#8888a8] hover:border-[#8888a8]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="text-[#55556a] font-mono text-[10px] uppercase tracking-widest whitespace-nowrap">
              {filteredCount} / {totalCount} Terms
            </div>
          </div>
        </div>

        {/* Terms Groups */}
        {filteredCount > 0 ? (
          <div className="space-y-24">
            {Object.entries(groupedByCategory).map(([category, groupTerms]) => (
              groupTerms.length > 0 && (
                <section key={category} id={category.toLowerCase()} className="scroll-mt-40">
                  <div className="flex items-baseline gap-4 mb-8 border-b border-[#1e1e2e] pb-4">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#2a2a3e] leading-none tracking-tighter">
                      {category}
                    </h2>
                    <span className="text-[#55556a] font-mono text-xs uppercase tracking-widest">
                      {groupTerms.length} terms
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1e1e2e] border border-[#1e1e2e] rounded-2xl overflow-hidden shadow-2xl">
                    {groupTerms.map(term => (
                      <Link 
                        key={term.id} 
                        href={`/glossary/${term.id}`}
                        className="group bg-[#111118] p-8 hover:bg-[#16161f] transition-all relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-mono font-medium text-[#f0d875] group-hover:text-[#e8c547] transition-colors mb-1">
                              {term.term}
                            </h3>
                            {term.abbr && (
                              <span className="text-[#55556a] font-mono text-[10px] uppercase tracking-wider block">
                                {term.abbr}
                              </span>
                            )}
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[#55556a] font-mono text-[10px]">
                            #{term.id}
                          </div>
                        </div>
                        <p className="text-[#8888a8] text-sm font-light leading-relaxed mb-6 line-clamp-3" 
                           dangerouslySetInnerHTML={{ __html: term.definition.replace(/<strong>/g, '<strong class="text-white font-medium">') }} />
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {term.categories.map(cat => (
                            <span key={cat} className="px-2 py-0.5 rounded border border-white/5 bg-white/5 text-[9px] font-mono text-[#55556a] uppercase tracking-tighter group-hover:border-[#e8c547]/20 group-hover:text-[#8888a8] transition-colors">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <p className="text-[#55556a] font-mono text-sm uppercase tracking-widest mb-4">No terms found matching your query.</p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="text-[#e8c547] hover:underline font-mono text-xs uppercase"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-[#1e1e2e] text-center">
        <p className="text-[#55556a] font-mono text-[10px] uppercase tracking-widest">
          LLM Glossary &nbsp;·&nbsp; {totalCount} terms across {CATEGORIES.length - 1} categories &nbsp;·&nbsp; Built for developers and curious minds
        </p>
      </footer>

      {/* Back to top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-[#16161f] border border-[#2a2a3e] text-[#8888a8] w-12 h-12 rounded-xl flex items-center justify-center hover:border-[#e8c547] hover:text-[#e8c547] transition-all shadow-2xl z-[60]"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
