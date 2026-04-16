"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ChevronRight,
  Target,
  CheckCircle2,
  Cpu,
  Zap,
  Globe,
  Layout,
  BarChart3,
  ExternalLink,
  Milestone,
  Sparkles,
  Search,
  Code
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { GradientOrbs } from "@/components/GradientOrbs";
import BuildVsBuyCalculator from "@/components/BuildVsBuyCalculator";
import ModelRoutingSimulator from "@/components/ModelRoutingSimulator";

export default function Module6Page() {
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
                Module 6
              </Badge>
              <Badge variant="outline" className="px-3 py-1 border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-black text-[10px] tracking-[0.2em] uppercase">
                All Levels · Reference
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight uppercase">
              Model <span className="text-transparent bg-clip-text bg-gradient-to-r from-plasma-400 to-cyan-400">Comparison</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
              Navigate the crowded AI market, understand proprietary vs. open-source trade-offs, and architect systems that route tasks to the most cost-effective AI.
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
                    "Map the 'Big Three' ecosystems (OpenAI, Anthropic, Google).",
                    "Understand Serverless Inference vs. Dedicated GPUs.",
                    "Calculate the 'Build vs. Buy' break-even point.",
                    "Implement Model Routing using the 80/20 rule."
                ].map((obj, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300 font-medium">{obj}</span>
                    </div>
                ))}
            </div>
        </Card>

        {/* Lesson 6.1 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-l-4 border-plasma-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-plasma-400 uppercase tracking-[0.3em]">Lesson 6.1</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">The "Big Three" Ecosystems</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-plasma-400">
                    <Globe className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">Choosing Your Fighter</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    The AI frontier is dominated by three massive ecosystems. Understanding their strengths is crucial for picking the right API.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* OpenAI */}
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-4">
                    <h5 className="font-bold text-emerald-400 uppercase tracking-widest text-xs">OpenAI Ecosystem</h5>
                    <ul className="text-[10px] space-y-2 text-slate-400 font-medium">
                        <li><b className="text-white">GPT-4o:</b> The Flagship balanced choice.</li>
                        <li><b className="text-white">o1 (Reasoning):</b> The expensive "Thinker."</li>
                        <li><b className="text-white">GPT-4o-mini:</b> Incredibly cheap workhorse.</li>
                    </ul>
                </div>
                {/* Anthropic */}
                <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-2xl space-y-4">
                    <h5 className="font-bold text-orange-400 uppercase tracking-widest text-xs">Anthropic (Claude)</h5>
                    <ul className="text-[10px] space-y-2 text-slate-400 font-medium">
                        <li><b className="text-white">Sonnet 3.5:</b> Coding & instructions champ.</li>
                        <li><b className="text-white">Haiku:</b> Lightning-fast & cost-effective.</li>
                        <li><b className="text-white">Opus:</b> The literary heavy lifter.</li>
                    </ul>
                </div>
                {/* Google */}
                <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl space-y-4">
                    <h5 className="font-bold text-blue-400 uppercase tracking-widest text-xs">Google (Gemini)</h5>
                    <ul className="text-[10px] space-y-2 text-slate-400 font-medium">
                        <li><b className="text-white">Gemini 1.5 Pro:</b> Context King (2M+).</li>
                        <li><b className="text-white">Gemini 1.5 Flash:</b> Multimodal speed demon.</li>
                        <li><b className="text-white">Search Grounding:</b> Real-time web access.</li>
                    </ul>
                </div>
            </div>
          </div>
        </section>

        {/* Lesson 6.2 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-l-4 border-plasma-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-plasma-400 uppercase tracking-[0.3em]">Lesson 6.2</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">Open Weights & Serverless Inference</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-plasma-400">
                    <Cpu className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">Build vs. Buy Dilemma</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    You don't have to rely on the "Big Three." Open-weights models like <span className="text-white font-bold">Llama 3</span> allow you to either pay ultra-cheap serverless providers or rent your own hardware.
                </p>
            </div>

            <div className="py-12">
                <BuildVsBuyCalculator />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h5 className="font-bold text-white flex items-center gap-2">Serverless Inference</h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Platforms like <span className="text-indigo-400">Groq</span> or <span className="text-indigo-400">Together AI</span> offer Llama access for a fraction of GPT-4o's cost. No GPU management required.
                    </p>
                </div>
                <div className="space-y-4">
                    <h5 className="font-bold text-white flex items-center gap-2">The Rental Rule</h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                        "If your application runs 24/7 with massive volume, rent a GPU ($2/hr). If traffic is spiky, stick to per-token APIs."
                    </p>
                </div>
            </div>
          </div>
        </section>

        {/* Lesson 6.3 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-l-4 border-plasma-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-plasma-400 uppercase tracking-[0.3em]">Lesson 6.3</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">The "Good Enough" Principle</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-plasma-400">
                    <Layout className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">Model Routing Architecture</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    Don't use a Ferrari to drive to the grocery store. Sending every simple user query to an expensive flagship model is the <span className="text-red-400 font-bold italic">#1 source of wasted budget</span>.
                </p>
            </div>

            <div className="py-12">
                <ModelRoutingSimulator />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 p-6 bg-black/40 border border-white/5 rounded-2xl">
                    <h5 className="font-bold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-plasma-400" /> The 80/20 Rule</h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                        80% of tasks (extraction, formatting, simple Q&A) are "Flash" tasks. Only 20% (logic, coding, synthesis) need "Frontier" models. Implementing a router can slash bills by 70%.
                    </p>
                </div>
                <div className="space-y-4 p-6 bg-black/40 border border-white/5 rounded-2xl">
                    <h5 className="font-bold text-white flex items-center gap-2"><Code className="w-4 h-4 text-indigo-400" /> Dynamic Routing</h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                        Use a cheap model (Haiku/4o-mini) to "triage" the prompt first. If it detects complexity, forward it. If not, answer immediately for pennies.
                    </p>
                </div>
            </div>
          </div>
        </section>

        {/* Module Summary */}
        <section className="pt-20 border-t border-white/5 text-center space-y-10">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plasma-500/10 text-plasma-400 text-[10px] font-black uppercase tracking-widest border border-plasma-500/20">
                CURRICULUM COMPLETE
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight">Master of Tokenomics</h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              You've completed the TokenSense Academy. You now have the knowledge to build, scale, and optimize AI systems with world-class financial efficiency.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-16 px-10 bg-[#00dcb4] hover:bg-[#00c5a1] text-black font-black uppercase tracking-tight gap-2 shadow-2xl shadow-[#00dcb4]/20" asChild>
              <Link href="/#calculate-section">
                Try the Calculator
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-10 border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-tight" asChild>
              <Link href="/tokenomics">Back to Academy Home</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 mt-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-[0.3em]">Module 6 Complete • TokenSense Academy</p>
        </div>
      </footer>
    </div>
  );
}
