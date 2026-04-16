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
  Lock,
  Clock,
  DollarSign,
  Search,
  Database,
  Cpu,
  BarChart3,
  Terminal,
  Layers,
  Sparkles
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { GradientOrbs } from "@/components/GradientOrbs";
import UnitEconomicsSimulator from "@/components/UnitEconomicsSimulator";

export default function Module5Page() {
  return (
    <div className="min-h-screen bg-[#020817] text-slate-200 selection:bg-emerald-500/30">
      <SiteHeader />
      
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-20">
        <GradientOrbs />
        
        {/* Navigation & Header */}
        <div className="space-y-8 relative">
          <Link 
            href="/tokenomics" 
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            BACK TO ACADEMY
          </Link>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-black text-[10px] tracking-[0.2em] uppercase">
                Module 5
              </Badge>
              <Badge variant="outline" className="px-3 py-1 border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-black text-[10px] tracking-[0.2em] uppercase">
                Advanced · Developer
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight uppercase">
              Building with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">LLMs</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
              Shift from prototyping to production by mastering API cost constraints, batch economics, and system architecture trade-offs.
            </p>
          </div>
        </div>

        {/* Learning Objectives */}
        <Card className="p-8 bg-slate-900/50 border-white/5 space-y-6 shadow-2xl shadow-emerald-500/5">
            <h4 className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-widest">
                <Target className="w-4 h-4 text-emerald-400" />
                Learning Objectives
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    "Master production API parameters (stop, max_tokens).",
                    "Leverage Batch APIs for 50% cost reduction.",
                    "Calculate SaaS Unit Economics and CPQ.",
                    "Evaluate RAG vs. Long Context architectures."
                ].map((obj, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300 font-medium">{obj}</span>
                    </div>
                ))}
            </div>
        </Card>

        {/* Lesson 5.1 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-l-4 border-emerald-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-emerald-400 uppercase tracking-[0.3em]">Lesson 5.1</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">API Parameters & Cost Control</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-emerald-400">
                    <Lock className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">Production Guardrails</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    A single poorly coded loop combined with an open-ended LLM API call can drain your credit card overnight. Hard-coding limits at the API level is <span className="text-white font-bold underline decoration-emerald-500/50">mandatory</span> for production apps.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6 bg-slate-900 border border-white/5 rounded-2xl space-y-4">
                    <h5 className="font-bold text-white flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-indigo-400" />
                        max_completion_tokens
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Reasoning models (like o1) generate hidden "thinking" tokens. Capping this parameter prevents runaway thinking costs but risks truncated answers if set too low.
                    </p>
                </Card>
                <Card className="p-6 bg-slate-900 border border-white/5 rounded-2xl space-y-4">
                    <h5 className="font-bold text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400" />
                        Stop Sequences (stop)
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Pass an array like <code className="text-white font-mono">["\n\nUser:", "###"]</code>. The millisecond the AI hits this sequence, the API severs the connection, freezing the bill.
                    </p>
                </Card>
            </div>
          </div>
        </section>

        {/* Lesson 5.2 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-l-4 border-emerald-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-emerald-400 uppercase tracking-[0.3em]">Lesson 5.2</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">Asynchronous & Batch Processing</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-emerald-400">
                    <Clock className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">Trading Speed for Margin</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    If your users or systems can wait, you should never pay full price for tokens. Batch APIs offer a <span className="text-white font-bold underline decoration-emerald-500/50">50% discount</span> by processing requests during off-peak hours.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                        <Badge className="bg-indigo-500 text-white font-black text-[10px]">50% OFF</Badge>
                        <p className="text-sm font-bold text-white uppercase tracking-tight">Separated Rate Limits</p>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                        Batch APIs have their own, vastly higher rate limit pools. Submitting 50,000 classifications won&apos;t slow down your live site users.
                    </p>
                </div>
                <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                    <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ideal Batch Use-Cases:</h6>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Bulk data cleaning/translation</span>
                        </li>
                        <li className="flex gap-3 text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Nightly summary pipelines</span>
                        </li>
                        <li className="flex gap-3 text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Fine-tuning dataset generation</span>
                        </li>
                    </ul>
                </div>
            </div>
          </div>
        </section>

        {/* Lesson 5.3 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-l-4 border-emerald-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-emerald-400 uppercase tracking-[0.3em]">Lesson 5.3</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">Scaling Economics</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-emerald-400">
                    <BarChart3 className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">Profit Margins vs. Power Users</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    You cannot price an AI SaaS—or offer an "Unlimited" tier—without understanding the mathematical relationship between API tokens and Monthly Active Users (MAUs).
                </p>
            </div>

            <div className="py-12">
                <UnitEconomicsSimulator />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className="space-y-4">
                    <h5 className="font-bold text-white flex items-center gap-2">Cost Per Query (CPQ)</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        The foundational metric. Calculate: <span className="text-white font-mono">(System Prompt + User Input + Output) × Price</span>.
                    </p>
                </div>
                <div className="space-y-4">
                    <h5 className="font-bold text-white flex items-center gap-2">Tiered Throttling</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Flat-rate "Unlimited AI" pricing leads to bankruptcy. Implement sliding windows or token quotas per subscription tier.
                    </p>
                </div>
            </div>
          </div>
        </section>

        {/* Lesson 5.4 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-l-4 border-emerald-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-emerald-400 uppercase tracking-[0.3em]">Lesson 5.4</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">RAG vs. Long Context</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-emerald-400">
                    <Layers className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">Architectural Trade-offs</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    When a user needs to chat with a 10,000-page knowledge base, how do you feed that data without going broke? It comes down to an <span className="text-white font-bold underline decoration-emerald-500/50">architectural and financial</span> debate.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h5 className="font-bold text-white flex items-center gap-2">Retrieval-Augmented Generation (RAG)</h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Search and send only the 3 relevant paragraphs.
                    </p>
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2">
                        <div className="flex justify-between text-[10px]"><span className="text-slate-500 font-black uppercase">Pros</span> <span className="text-emerald-400 font-bold">Ultra-Low Token Cost</span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-slate-500 font-black uppercase">Cons</span> <span className="text-slate-400 font-medium">High Eng. Effort</span></div>
                    </div>
                </div>
                <div className="space-y-4">
                    <h5 className="font-bold text-white flex items-center gap-2">Long Context Stuffing</h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Paste the entire 10,000-page doc every single time.
                    </p>
                    <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-2">
                        <div className="flex justify-between text-[10px]"><span className="text-slate-500 font-black uppercase">Pros</span> <span className="text-emerald-400 font-bold">Zero Eng. Effort</span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-slate-500 font-black uppercase">Cons</span> <span className="text-red-400 font-bold font-mono">Astronomical Cost</span></div>
                    </div>
                </div>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[32px] p-8 md:p-12 text-center space-y-4">
                <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
                <h6 className="text-xl font-black text-white uppercase tracking-tight">The Financial Tipping Point</h6>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xl mx-auto italic font-medium">
                    If a user asks 100 questions about one massive doc, <span className="text-white font-bold">Long Context + Caching</span> is cheaper. If they ask 1 question each about 100 docs, <span className="text-white font-bold">RAG</span> is superior.
                </p>
            </div>
          </div>
        </section>

        {/* Module Summary */}
        <section className="pt-20 border-t border-white/5 text-center space-y-10">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                MODULE 5 COMPLETE
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight">The Final Frontier</h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              You now have the production blueprint. The final step is knowing exactly <span className="text-white">which model</span> to route these tasks to for maximum ROI.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-16 px-10 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-tight gap-2 shadow-2xl shadow-emerald-500/20" asChild>
              <Link href="/tokenomics/module-6">
                Final Module: Comparison
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
          <p className="text-xs font-mono text-slate-500 uppercase tracking-[0.3em]">Module 5 Complete • TokenSense Academy</p>
        </div>
      </footer>
    </div>
  );
}
