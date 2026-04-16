"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Zap,
  ChevronRight,
  Target,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Info,
  Database,
  Search,
  Maximize2,
  Trash2,
  Table,
  Cpu,
  Lock
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { GradientOrbs } from "@/components/GradientOrbs";
import DataFormatSimulator from "@/components/DataFormatSimulator";

export default function Module4Page() {
  return (
    <div className="min-h-screen bg-[#020817] text-slate-200 selection:bg-plasma-500/30">
      <SiteHeader />
      
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-20">
        <GradientOrbs />
        
        {/* Navigation & Header */}
        <div className="space-y-8 relative">
          <Link 
            href="/tokenomics" 
            className="inline-flex items-center gap-2 text-sm font-bold text-plasma-400 hover:text-plasma-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            BACK TO ACADEMY
          </Link>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1 border-plasma-500/30 bg-plasma-500/10 text-plasma-400 font-black text-[10px] tracking-[0.2em] uppercase">
                Module 4
              </Badge>
              <Badge variant="outline" className="px-3 py-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-black text-[10px] tracking-[0.2em] uppercase">
                Intermediate · Actionable
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight uppercase">
              Prompt <span className="text-transparent bg-clip-text bg-gradient-to-r from-plasma-400 to-indigo-400">Optimization</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
              Shift from writing "human-friendly" prompts to "machine-efficient" prompts. Learn actionable techniques to instantly slash API bills and reduce latency.
            </p>
          </div>
        </div>

        {/* Learning Objectives */}
        <Card className="p-8 bg-slate-900/50 border-white/5 space-y-6 shadow-2xl shadow-plasma-500/5">
            <h4 className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-widest">
                <Target className="w-4 h-4 text-plasma-400" />
                Learning Objectives
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    "Master 'De-fluffing' to eliminate token waste.",
                    "Understand format taxes (JSON vs YAML vs CSV).",
                    "Architect prompts for maximum Cache Hit rates.",
                    "Balance few-shot examples for accuracy vs cost."
                ].map((obj, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300 font-medium">{obj}</span>
                    </div>
                ))}
            </div>
        </Card>

        {/* Lesson 4.1 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-l-4 border-plasma-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-plasma-400 uppercase tracking-[0.3em]">Lesson 4.1</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">Prompt Compression</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-plasma-400">
                    <Trash2 className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">De-fluffing: The Art of Ruthless Editing</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    LLMs do not have feelings. They do not need you to say <span className="text-white font-bold italic">"Please"</span> or <span className="text-white font-bold italic">"Thank you."</span> Every piece of conversational filler is a token that you are paying a server to process.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6 bg-red-500/5 border-red-500/20 space-y-3">
                    <h5 className="text-xs font-black text-red-400 uppercase tracking-widest">Verbose (Human-Friendly)</h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed italic">
                        "Hi there! I would really appreciate it if you could take a look at the following text and help me summarize it in just a few bullet points. I need this for a meeting at 5 PM. Thank you so much for your help!"
                    </p>
                    <Badge variant="outline" className="border-red-500/30 text-red-400 font-mono text-[9px]">~45 Tokens</Badge>
                </Card>
                <Card className="p-6 bg-emerald-500/5 border-emerald-500/20 space-y-3">
                    <h5 className="text-xs font-black text-emerald-400 uppercase tracking-widest">Compressed (Machine-Efficient)</h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-bold">
                        "Summarize text as bullet points."
                    </p>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-mono text-[9px]">5 Tokens</Badge>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className="space-y-4">
                    <h5 className="font-bold text-white flex items-center gap-2">Algorithmic Compression</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Use tools like <span className="text-plasma-400 font-bold">LLMLingua</span> to use a tiny, cheap model to compress massive prompts by removing non-essential words before sending them to expensive models like GPT-4o.
                    </p>
                </div>
                <div className="space-y-4">
                    <h5 className="font-bold text-white flex items-center gap-2">Few-Shot Efficiency</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Giving examples increases accuracy but costs tokens. Provide <span className="text-white font-bold">exactly enough</span> examples to set the pattern, and not one more.
                    </p>
                </div>
            </div>
          </div>
        </section>

        {/* Lesson 4.2 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-l-4 border-plasma-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-plasma-400 uppercase tracking-[0.3em]">Lesson 4.2</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">Data Format Efficiency</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-plasma-400">
                    <Table className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">The Syntax Tax</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    When extracting data, your chosen format changes your bill drastically. Heavy, nested syntaxes waste tokens on <span className="text-white font-bold italic">brackets and tags</span> instead of actual data.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl space-y-3">
                    <h5 className="text-xs font-black text-amber-400 uppercase tracking-widest">JSON/XML</h5>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                        Standard but heavy. Every bracket, quote, and closing tag is a token you pay for twice.
                    </p>
                </div>
                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl space-y-3">
                    <h5 className="text-xs font-black text-indigo-400 uppercase tracking-widest">YAML</h5>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                        Cheaper. Relies on spaces rather than brackets. Often 20-30% more efficient than JSON.
                    </p>
                </div>
                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl space-y-3">
                    <h5 className="text-xs font-black text-emerald-400 uppercase tracking-widest">CSV</h5>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                        The King of Savings. Eliminates keys entirely after the header row. Can save 50%+ on massive lists.
                    </p>
                </div>
            </div>

            <div className="py-12">
                <DataFormatSimulator />
            </div>
          </div>
        </section>

        {/* Lesson 4.3 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-l-4 border-plasma-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-plasma-400 uppercase tracking-[0.3em]">Lesson 4.3</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">Leveraging Prompt Caching</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-plasma-400">
                    <Lock className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">The Ultimate Cost-Saving Feature</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    Caching allows you to upload a massive document once, pay for it once, and query it thousands of times at a massive discount (often <span className="text-white font-bold">50% to 80% cheaper</span>).
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                <div className="space-y-6">
                    <h5 className="font-bold text-white flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-indigo-400" />
                        How Caching Works
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Instead of recalculating the math for a 100-page PDF every time, the provider stores the "computed attention blocks" in memory for a short window (5-60 mins).
                    </p>
                </div>
                <div className="space-y-4 flex flex-col justify-center">
                    <h5 className="font-bold text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-plasma-400" />
                        The Golden Rule
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Caching only works if the <span className="text-white font-bold">beginning</span> of the prompt is identical. Put static context (PDFs, system instructions) at the TOP, and dynamic questions at the BOTTOM.
                    </p>
                </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-3xl p-12 text-center space-y-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-plasma-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 space-y-4">
                    <p className="text-xs font-black text-plasma-400 uppercase tracking-[0.2em]">Prompt Structure Iceberg</p>
                    <div className="max-w-xs mx-auto space-y-1">
                        <div className="p-8 bg-indigo-500/20 border border-indigo-500/30 rounded-t-2xl font-black text-[10px] text-indigo-200 uppercase">Static Context (Cached)</div>
                        <div className="p-4 bg-plasma-500/40 border border-plasma-500/60 rounded-b-2xl font-black text-[10px] text-white uppercase">User Question (Dynamic)</div>
                    </div>
                    <p className="text-[10px] text-slate-500 italic pt-4">This architecture triggers an 80% discount on the static block.</p>
                </div>
            </div>
          </div>
        </section>

        {/* Module Summary */}
        <section className="pt-20 border-t border-white/5 text-center space-y-10">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plasma-500/10 text-plasma-400 text-[10px] font-black uppercase tracking-widest border border-plasma-500/20">
                MODULE 4 COMPLETE
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight">Ready to Build?</h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              You have the strategy. Now it's time to talk about <span className="text-white">production</span>. How do you scale these models without going bankrupt?
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-16 px-10 bg-plasma-600 hover:bg-plasma-700 text-white font-black uppercase tracking-tight gap-2 shadow-2xl shadow-plasma-500/20" asChild>
              <Link href="/tokenomics/module-5">
                Continue to Module 5
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-10 border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-tight" asChild>
              <Link href="/tokenomics">Back to Academy</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 mt-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-[0.3em]">Module 4 Complete • TokenSense Academy</p>
        </div>
      </footer>
    </div>
  );
}
