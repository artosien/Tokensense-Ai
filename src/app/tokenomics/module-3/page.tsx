"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  TrendingUp,
  Zap,
  ChevronRight,
  Target,
  CheckCircle2,
  History,
  AlertTriangle,
  Layers,
  Cpu,
  Clock,
  ExternalLink,
  BookOpen,
  Info,
  Database,
  Search,
  Maximize2
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { GradientOrbs } from "@/components/GradientOrbs";
import ShareButton from "@/components/ShareButton";
import ContextCompoundingSimulator from "@/components/ContextCompoundingSimulator";

export default function Module3Page() {
  return (
    <div className="min-h-screen bg-[#020817] text-slate-200 selection:bg-indigo-500/30">
      <SiteHeader />
      
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-20">
        <GradientOrbs />
        
        {/* Navigation & Header */}
        <div className="space-y-8 relative">
          <Link 
            href="/tokenomics" 
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            BACK TO ACADEMY
          </Link>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1 border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-black text-[10px] tracking-[0.2em] uppercase">
                Module 3
              </Badge>
              <Badge variant="outline" className="px-3 py-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-black text-[10px] tracking-[0.2em] uppercase">
                Intermediate · Core Concept
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight uppercase">
              Context <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Windows</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
              Master the concept of AI memory, understand the invisible computing costs of large documents, and learn how to prevent the AI from "forgetting" critical information.
            </p>
          </div>
        </div>

        {/* Learning Objectives */}
        <Card className="p-8 bg-slate-900/50 border-white/5 space-y-6 shadow-2xl shadow-indigo-500/5">
            <h4 className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-widest">
                <Target className="w-4 h-4 text-indigo-400" />
                Learning Objectives
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    "Understand the physical limits of LLM working memory.",
                    "Analyze the quadratic scaling costs of Attention.",
                    "Mitigate context degradation (Lost in the Middle).",
                    "Manage stateless sessions and compounding costs."
                ].map((obj, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300 font-medium">{obj}</span>
                    </div>
                ))}
            </div>
        </Card>

        {/* Lesson 3.1 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-l-4 border-indigo-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em]">Lesson 3.1</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">The Context Window Explained</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-indigo-400">
                    <Layers className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">The Core Concept</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    If an LLM is a brilliant worker, the context window is the size of their physical desk. It is the model's <span className="text-white font-bold">"working memory"</span> for a single interaction. Everything the AI needs to know to answer your prompt must fit on that desk.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <History className="w-5 h-5 text-red-400" />
                    </div>
                    <h5 className="font-bold text-white">The "No Hard Drive" Rule</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        LLMs are essentially amnesiacs. They have zero permanent memory between sessions. When you start a new prompt, the AI wakes up with a blank slate.
                    </p>
                </div>
                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <Maximize2 className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h5 className="font-bold text-white">Sizing the Window</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Legacy models had 4K limits (~3k words). Modern models like GPT-4o handle 128K (300 pages), while Gemini Pro 1.5 reaches <span className="text-white font-bold">2M+ tokens</span>.
                    </p>
                </div>
                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                    </div>
                    <h5 className="font-bold text-white">Input vs. Output Caps</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        If your prompt is 120K tokens on a 128K desk, the AI only has 8K tokens of "desk space" left to write its response before cutting off mid-sentence.
                    </p>
                </div>
            </div>

            {/* Video Element Placeholder */}
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/5sLYAQS9s8U" 
                    title="What is an LLM Context Window?" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    className="absolute inset-0"
                ></iframe>
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Visual Scale Guide</span>
                </div>
            </div>
          </div>
        </section>

        {/* Lesson 3.2 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-l-4 border-indigo-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em]">Lesson 3.2</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">The Compute Cost of Attention</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-indigo-400">
                    <Cpu className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">Why isn't context infinite?</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    Because of a mechanism called <span className="text-white font-bold underline decoration-indigo-500/50">"Self-Attention,"</span> which gets exponentially harder for the computer to process as the text gets longer.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                <div className="space-y-6">
                    <h5 className="text-xl font-bold text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-400" />
                        The Math of Scaling: O(N²)
                    </h5>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        In Transformers, every token looks at every other token to find context. Historically, if you double the tokens ($N$), the compute quadruples.
                    </p>
                    <div className="p-6 bg-black rounded-2xl border border-white/5 font-mono text-center">
                        <div className="text-2xl text-indigo-400 font-black mb-2" dangerouslySetInnerHTML={{ __html: "O(N<sup>2</sup>)" }} />
                        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Quadratic Complexity</p>
                    </div>
                </div>
                <div className="space-y-4 flex flex-col justify-center">
                    <Badge className="w-fit bg-red-500/10 text-red-400 border-none font-black uppercase tracking-widest">The Cost Reality</Badge>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        A 100K token prompt requires vastly more processing power and RAM than ten 10K prompts. This is why sending a 100-page document for a simple, unrelated question is a massive waste of credits.
                    </p>
                </div>
            </div>

            {/* Graphic Illustration */}
            <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border border-white/5 rounded-[32px] p-12 text-center space-y-6">
                <div className="flex justify-center gap-16">
                    <div className="space-y-4">
                        <div className="w-24 h-24 rounded-full border border-indigo-500/30 bg-indigo-500/5 flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-2">
                                {[...Array(4)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-indigo-400" />)}
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase">Short (Linear)</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-24 h-24 rounded-full border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center">
                            <div className="w-12 h-12 relative">
                                {[...Array(12)].map((_, i) => <div key={i} className="absolute inset-0 border border-cyan-400/20 rounded-full" style={{ transform: `rotate(${i * 30}deg)` }} />)}
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase">Long (Exponential)</p>
                    </div>
                </div>
                <p className="text-xs text-slate-500 italic max-w-md mx-auto">Visualizing "Attention" connections as context length grows.</p>
            </div>
          </div>
        </section>

        {/* Lesson 3.3 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-l-4 border-indigo-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em]">Lesson 3.3</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">Lost in the Middle</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-indigo-400">
                    <Search className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">The U-Curve of Recall</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    Research shows that LLMs suffer from a <span className="text-white font-bold underline decoration-indigo-500/50">"Lost in the Middle"</span> phenomenon. They recall information best at the very beginning (Primacy) or very end (Recency) of a prompt.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <h5 className="font-bold text-white flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        The Black Hole
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Information buried in the exact middle of a massive prompt has the highest chance of being hallucinated, skipped, or completely ignored.
                    </p>
                </div>
                <div className="space-y-4">
                    <h5 className="font-bold text-white flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        The Developer Fix
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Put critical instructions (system prompts, JSON schemas) at the <span className="text-white font-bold uppercase">absolute top or bottom</span>. Never in the middle of reference data.
                    </p>
                </div>
            </div>

            {/* U-Curve Graphic */}
            <div className="relative h-48 w-full border border-white/10 rounded-2xl bg-slate-950 overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <div className="w-full h-[1px] bg-white/20" />
                </div>
                {/* U-Curve Path */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                    <path 
                        d="M 50 20 Q 500 250 950 20" 
                        fill="none" 
                        stroke="url(#u-gradient)" 
                        strokeWidth="4" 
                        strokeLinecap="round"
                    />
                    <defs>
                        <linearGradient id="u-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="50%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute top-4 left-4 text-[10px] font-black text-emerald-400 uppercase">High Recall</div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-red-400 uppercase">The Black Hole (Low Recall)</div>
                <div className="absolute top-4 right-4 text-[10px] font-black text-emerald-400 uppercase">High Recall</div>
            </div>
          </div>
        </section>

        {/* Lesson 3.4 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-l-4 border-indigo-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em]">Lesson 3.4</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">Anatomy of a Chat Session</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-indigo-400">
                    <History className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">The Snowball Effect</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    APIs are completely <span className="text-white font-bold underline decoration-indigo-500/50">"Stateless."</span> They don't remember you. You are paying to re-read the entire history on every single turn.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl space-y-4">
                    <h5 className="font-bold text-white flex items-center gap-2">Compounding Waste</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        In Message 10, your app bundles Messages 1-9 AND the AI answers 1-9 into a massive new payload. A long session doesn't scale linearly; it explodes.
                    </p>
                </div>
                <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl space-y-4">
                    <h5 className="font-bold text-white flex items-center gap-2">Pruning & Management</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Developers must build logic to prune old messages, summarize past context, or set a <span className="text-white font-bold">Sliding Window</span> to stop costs from bankrupting the app.
                    </p>
                </div>
            </div>

            <div className="py-12">
                <ContextCompoundingSimulator />
            </div>
          </div>
        </section>

        {/* Module Summary */}
        <section className="pt-20 border-t border-white/5 text-center space-y-10">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                MODULE 3 COMPLETE
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight">The Big Picture</h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              You now understand how AI memory works, why it's expensive, and how to manage it. Ready to actually <span className="text-white">slash those bills</span> using professional techniques?
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-16 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-tight gap-2 shadow-2xl shadow-indigo-500/20" asChild>
              <Link href="/tokenomics/module-4">
                Continue to Module 4
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
          <p className="text-xs font-mono text-slate-500 uppercase tracking-[0.3em]">Module 3 Complete • TokenSense Academy</p>
        </div>
      </footer>
    </div>
  );
}
