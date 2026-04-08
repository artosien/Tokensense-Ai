import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  History,
  Terminal,
  AlertTriangle,
  TrendingUp,
  Activity,
  Coffee,
  Timer,
  Check,
  X,
  Film,
  Smartphone,
  ArrowLeft, 
  Sparkles, 
  Layers, 
  Cpu, 
  Zap,
  Info,
  ChevronRight,
  Target,
  CheckCircle2,
  Database,
  Calculator,
  BookOpen,
  TrendingDown,
  Scale,
  Image as ImageIcon,
  Mic,
  Coins
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { GradientOrbs } from "@/components/GradientOrbs";
import ShareButton from "@/components/ShareButton";
import { cn } from "@/lib/utils";
import MultimodalEstimator from "@/components/MultimodalEstimator";

export default function Module2Page() {
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
                Module 2
              </Badge>
              <Badge variant="outline" className="px-3 py-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-black text-[10px] tracking-[0.2em] uppercase">
                Intermediate · Economics
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight uppercase">
              Understanding <span className="text-transparent bg-clip-text bg-gradient-to-r from-plasma-400 to-indigo-400">API Costs</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
              In this module, we transition from the "what" of tokens to the "how much." Mastering these economics is the difference between a sustainable project and a surprise bill.
            </p>
          </div>
        </div>

        {/* Hero Video */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-plasma-500 to-indigo-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/4BePIemplR4" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full"
            ></iframe>

            {/* Share Button Overlay */}
            <div className="absolute top-6 right-6">
                <ShareButton 
                    title="Understanding API Costs"
                    text="Watch this explainer on the asymmetric economics of AI API costs."
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                    className="bg-black/60 hover:bg-black/80 text-white border-white/20 backdrop-blur-md rounded-2xl w-12 h-12"
                />
            </div>

            {/* Video Label */}
            <div className="absolute top-6 left-6 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-plasma-500 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">MODULE 2 EXPLAINER</span>
            </div>
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
                    "Understand how tokens compete for space in a finite window.",
                    "Identify the 'Lost in the Middle' phenomenon in RAG.",
                    "Analyze the cost impact of Sequential Generation.",
                    "Master the economics of Prompt Caching (KV Cache)."
                ].map((obj, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300 font-medium">{obj}</span>
                    </div>
                ))}
            </div>
        </Card>

        {/* Lesson 2.1 */}
        <section className="space-y-16 relative">
          <div className="flex items-center gap-4 border-l-4 border-plasma-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-plasma-400 uppercase tracking-[0.3em]">Lesson 2.1</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">Context Window Costs</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-12">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-plasma-400">
                    <Database className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">What is a Context Window?</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    In the world of AI development, the Context Window is the AI’s <span className="text-white font-bold">"active memory."</span> It’s the total number of tokens the model can "see" and process at a single moment. 
                </p>
                <div className="p-4 bg-plasma-500/5 border border-plasma-500/20 rounded-2xl text-xs font-medium text-slate-400">
                    Understanding Context Window Costs is vital because, unlike a human who remembers a conversation for free, an AI charges you every time it has to "re-read" your history to understand your next question.
                </div>
            </div>

            {/* 1. The Memory Tax */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-white">
                    <History className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-xl font-bold uppercase tracking-tight">1. The "Memory Tax" (Cumulative Cost)</h4>
                </div>
                <p className="text-slate-400 leading-relaxed">
                    Most people assume that if a message costs $0.01, a 10-message conversation costs $0.10. This is a <span className="text-red-400 font-bold uppercase italic">mistake</span>. Because LLMs are "stateless," every new message requires sending the entire previous conversation back to the AI.
                </p>
                
                <div className="space-y-4">
                    <h5 className="text-sm font-black text-slate-500 uppercase tracking-widest">The Cost Snowball Effect:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { turn: "Turn 1", desc: "You send a question (50 tokens).", cost: "Cost: 50 tokens", bg: "bg-slate-900" },
                            { turn: "Turn 2", desc: "You send (Turn 1 Question + AI Answer + New Question).", cost: "Cost: ~200 tokens", bg: "bg-indigo-500/5", border: "border-indigo-500/20" },
                            { turn: "Turn 3", desc: "You send (Turn 1 + Turn 2 + New Question).", cost: "Cost: ~450 tokens", bg: "bg-indigo-500/10", border: "border-indigo-500/30" },
                        ].map((step, i) => (
                            <Card key={i} className={cn("p-6 space-y-3", step.bg, step.border)}>
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{step.turn}</span>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                                <p className="text-sm font-mono font-bold text-white">{step.cost}</p>
                            </Card>
                        ))}
                    </div>
                </div>
                <p className="text-xs text-slate-500 italic text-center">
                    By the time you are 20 messages deep, you aren't just paying for your new question; you are paying to re-upload a small book's worth of data.
                </p>
            </div>

            {/* 2. Prompt Caching */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-white">
                    <Zap className="w-5 h-5 text-plasma-400" />
                    <h4 className="text-xl font-bold uppercase tracking-tight">2. Prompt Caching: The 2026 Game Changer</h4>
                </div>
                <p className="text-slate-400 leading-relaxed">
                    To combat the "Memory Tax," most major API providers (Google, OpenAI, Anthropic) now use <span className="text-white font-bold underline decoration-plasma-500/50">Prompt Caching</span>. This is the most important concept for saving money today.
                </p>

                <div className="overflow-hidden border border-white/10 rounded-3xl bg-slate-950 shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Token Type</th>
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Standard Rate (per 1M)</th>
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-plasma-400">Cached Rate (per 1M)</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-t border-white/5">
                                <td className="p-4 text-slate-300 font-bold">New Input</td>
                                <td className="p-4 text-slate-400 font-mono">$2.50</td>
                                <td className="p-4 text-slate-500 font-mono">N/A</td>
                            </tr>
                            <tr className="border-t border-white/5 bg-plasma-500/5">
                                <td className="p-4 text-white font-bold">Repeated Input (Cached)</td>
                                <td className="p-4 text-slate-400 font-mono">$2.50</td>
                                <td className="p-4 text-plasma-400 font-mono font-black">$0.25</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. Long Context vs RAG */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                <div className="space-y-4">
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                        <Scale className="w-5 h-5 text-indigo-400" />
                        3. Long Context vs. RAG (Retrieval)
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        In 2026, models like Gemini 1.5 Pro offer massive context windows (up to 2 million tokens). You can drop 10 PDF books into the window at once. However, just because you can doesn't mean you should.
                    </p>
                    <div className="space-y-4">
                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">The Hidden Costs of "Long Context":</h5>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-xs">
                                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                                <span><b className="text-slate-200">Direct Cost:</b> Filling a 1-million-token window for a single question can cost <b className="text-white">$2.00 to $10.00</b> per click.</span>
                            </li>
                            <li className="flex gap-3 text-xs">
                                <TrendingDown className="w-4 h-4 text-red-500 shrink-0" />
                                <span><b className="text-slate-200">Performance Degradation:</b> Known as "Lost in the Middle." AI is most accurate with info at the start or end. Middle info is more likely to be ignored.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-plasma-400" />
                        4. Calculating the "History" Cost
                    </h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">The Math of a Growing Window:</p>
                    <div className="p-6 bg-black rounded-2xl border border-white/5 font-mono text-[10px] md:text-xs text-plasma-400">
                        <p className="text-slate-500 mb-2">// Total input tokens (I) for Turn N</p>
                        I = Σ T<sub>i</sub> (from i=1 to N)
                    </div>
                    <div className="space-y-2 pt-2">
                        <p className="text-[10px] text-slate-500 italic mb-2">If you don't "trim" your history, a single chat session looks like this:</p>
                        <div className="flex justify-between text-[10px] font-medium"><span className="text-slate-500 uppercase tracking-tighter">Message 1</span> <span className="text-white font-mono">$0.001</span></div>
                        <div className="flex justify-between text-[10px] font-medium"><span className="text-slate-500 uppercase tracking-tighter">Message 10</span> <span className="text-white font-mono font-bold">$0.015</span></div>
                        <div className="flex justify-between text-[10px] font-black border-t border-white/10 pt-2"><span className="text-plasma-400 uppercase tracking-tighter">Message 50</span> <span className="text-plasma-400 font-mono font-black">$0.250</span></div>
                        <p className="text-[9px] text-slate-500 text-right italic">(for a single "Yes/No" follow-up!)</p>
                    </div>
                </div>
            </div>

            {/* 💡 Practical Guide */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[32px] p-8 md:p-12 space-y-8 shadow-2xl shadow-indigo-500/5">
                <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-indigo-400" />
                    <h4 className="text-2xl font-black text-white uppercase tracking-tight">💡 Practical Guide for New Users</h4>
                </div>
                <p className="text-xs text-slate-400 font-medium italic">To keep your context window costs under control, use these three industry-standard techniques:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <h5 className="font-bold text-white flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Sliding Window</h5>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">Only send the last 10 messages of the conversation back to the AI. Older messages are "forgotten" to save money.</p>
                    </div>
                    <div className="space-y-4">
                        <h5 className="font-bold text-white flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Summarization</h5>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">Every 5 turns, ask a cheaper model (GPT-5 Nano or Gemini Flash) to summarize the conversation so far. Replace history with a 200-token summary.</p>
                    </div>
                    <div className="space-y-4">
                        <h5 className="font-bold text-white flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-plasma-400" /> System Caching</h5>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">Ensure your "System Instructions" are identical every time. If you change even one character (like a timestamp), the cache breaks.</p>
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* Lesson 2.2 */}
        <section className="space-y-16 relative">
          <div className="flex items-center gap-4 border-l-4 border-plasma-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-plasma-400 uppercase tracking-[0.3em]">Lesson 2.2</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">Sequential Generation Overhead</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-12">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-plasma-400">
                    <TrendingUp className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">The Technical Culprit</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    In previous modules, we discussed why output tokens are more expensive than input tokens. The culprit is <span className="text-white font-bold underline decoration-plasma-500/50">Sequential Generation Overhead</span>—how the AI writes, and why it’s so computationally "heavy."
                </p>
                <div className="p-4 bg-plasma-500/5 border border-plasma-500/20 rounded-2xl">
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-tight">The Core Concept:</p>
                    <p className="text-sm text-slate-400 italic">In AI, reading a thousand words is a single "sprint," but writing a thousand words is a thousand individual "steps."</p>
                </div>
            </div>

            {/* 🏎️ Prefill vs. 🚶 Decode */}
            <div className="space-y-8">
                <div className="flex items-center gap-3 text-white">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-xl font-bold uppercase tracking-tight">🏎️ Prefill vs. 🚶 Decode</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-8 bg-slate-900 border-white/5 space-y-4 hover:border-indigo-500/30 transition-all group">
                        <div className="flex items-center justify-between">
                            <h5 className="text-lg font-bold text-white uppercase tracking-tighter">The Prefill Phase (The Sprint)</h5>
                            <TrendingUp className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            When you send your prompt, the AI reads all your input tokens in <span className="text-white font-bold">parallel</span>. Because the GPU knows all the words at once, it can process them simultaneously using its thousands of cores. 
                        </p>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-black text-[10px] tracking-widest uppercase">High Efficiency</Badge>
                    </Card>
                    <Card className="p-8 bg-slate-900 border-white/5 space-y-4 hover:border-plasma-500/30 transition-all group">
                        <div className="flex items-center justify-between">
                            <h5 className="text-lg font-bold text-white uppercase tracking-tighter">The Decode Phase (The Steps)</h5>
                            <Activity className="w-5 h-5 text-plasma-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            The AI cannot "guess" the 10th word until it has finished words 1-9. It must generate tokens <span className="text-white font-bold">one-by-one</span>. Every token requires a complete pass of the model.
                        </p>
                        <Badge className="bg-red-500/10 text-red-400 border-none font-black text-[10px] tracking-widest uppercase">Sequential Bottleneck</Badge>
                    </Card>
                </div>
            </div>

            {/* ⏳ The Memory Bandwidth Bottleneck */}
            <div className="space-y-8">
                <div className="flex items-center gap-3 text-white">
                    <Layers className="w-5 h-5 text-plasma-400" />
                    <h4 className="text-xl font-bold uppercase tracking-tight">⏳ The Memory Bandwidth Bottleneck</h4>
                </div>
                <div className="bg-gradient-to-br from-slate-900 to-indigo-900/20 border border-white/10 rounded-[32px] p-8 md:p-12 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Cpu className="w-32 h-32" />
                    </div>
                    <div className="space-y-6 relative z-10">
                        <p className="text-lg text-slate-300 leading-relaxed">
                            The real reason sequential generation is so slow isn't actually the "math." It’s the <span className="text-white font-bold underline decoration-plasma-500/50">data moving</span>. 
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                                <h6 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Example: 7B Parameter Model</h6>
                                <p className="text-sm text-slate-400 font-medium">
                                    The GPU must load all <span className="text-white">14 Gigabytes</span> of data from memory into its processor to decide on a single token like "The."
                                </p>
                            </div>
                            <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                                <h6 className="text-xs font-black text-plasma-400 uppercase tracking-widest">The "Bored" GPU</h6>
                                <p className="text-sm text-slate-400 font-medium">
                                    The processor finishes the math in a fraction of a millisecond, then sits idle for <span className="text-white">95% of the time</span> waiting for the next data move.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-plasma-500/10 rounded-2xl border border-plasma-500/20">
                        <Coffee className="w-5 h-5 text-plasma-400" />
                        <span className="text-xs font-black text-white uppercase tracking-tighter italic">This is called being "Memory-Bandwidth Bound."</span>
                    </div>
                </div>
            </div>

            {/* 📉 Why This Drives Up Costs */}
            <div className="space-y-8">
                <div className="flex items-center gap-3 text-white">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                    <h4 className="text-xl font-bold uppercase tracking-tight">📉 Why This Drives Up Costs</h4>
                </div>
                <div className="overflow-hidden border border-white/10 rounded-3xl bg-slate-950">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Operation</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">GPU Utilization</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Efficiency / Cost</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            <tr className="border-t border-white/5">
                                <td className="p-4 text-white font-bold uppercase tracking-tighter">Input (Prefill)</td>
                                <td className="p-4 text-indigo-400 font-mono font-black">90% Optimized</td>
                                <td className="p-4 text-emerald-400 font-bold">High Efficiency = Low Cost</td>
                            </tr>
                            <tr className="border-t border-white/5 bg-white/5">
                                <td className="p-4 text-white font-bold uppercase tracking-tighter">Output (Decode)</td>
                                <td className="p-4 text-plasma-400 font-mono font-black">5-10% Effective</td>
                                <td className="p-4 text-red-400 font-bold">Low Efficiency = High Cost</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 💡 Discussion Guide */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[32px] p-8 md:p-12 space-y-12">
                <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-indigo-400" />
                    <h4 className="text-2xl font-black text-white uppercase tracking-tight">💡 Discussion Guide for Developers</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <h5 className="font-bold text-white flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> The "First Token" Illusion</h5>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">The initial pause after clicking Enter is the <span className="text-white">Prefill</span> (digestion). The steady typing flow is the <span className="text-white">Decode</span> (memory bus speed).</p>
                    </div>
                    <div className="space-y-4">
                        <h5 className="font-bold text-white flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Why "Streaming" Matters</h5>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">Streaming words one-by-one hides the overhead from humans, keeping you occupied while the AI performs its heavy lifting.</p>
                    </div>
                    <div className="space-y-4">
                        <h5 className="font-bold text-white flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-plasma-400" /> Speculative Decoding</h5>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">A tiny model "guesses" next words while the big model verifies them in parallel, potentially speeding up generation by 2x to 3x.</p>
                    </div>
                </div>
            </div>

            <div className="text-center pt-8 space-y-4">
                <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-black px-4 py-1">🎓 SUMMARY TASK</Badge>
                <p className="text-slate-400 max-w-2xl mx-auto italic text-sm">
                    "Every single letter you saw appearing on the screen represented the AI re-reading its entire brain and your entire conversation history."
                </p>
                <p className="text-white font-bold uppercase tracking-widest text-xs pt-4">
                    Ready to learn about "Prompt Engineering for Token Efficiency" to keep those bills low?
                </p>
            </div>
          </div>
        </section>

        {/* Lesson 2.3 */}
        <section className="space-y-16 relative">
          <div className="flex items-center gap-4 border-l-4 border-plasma-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-plasma-400 uppercase tracking-[0.3em]">Lesson 2.3</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">KV Cache Pricing</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-12">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-plasma-400">
                    <Layers className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">The "Working Memory" Economy</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    You shouldn't have to pay full price for the AI to "re-read" the same instructions every single time you send a message. This is the core concept of <span className="text-white font-bold underline decoration-plasma-500/50">KV Caching</span>.
                </p>
            </div>

            {/* 🧠 What is a KV Cache? */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-white">
                    <Cpu className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-xl font-bold uppercase tracking-tight">🧠 What is a KV Cache?</h4>
                </div>
                <p className="text-slate-400 leading-relaxed">
                    When an AI processes your prompt, it does a massive amount of math to understand token relationships. It stores the results as <span className="text-white font-bold">Key-Value (KV) pairs</span>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-6 bg-slate-900 border-white/5 space-y-2">
                        <h5 className="text-xs font-black text-indigo-400 uppercase tracking-widest">The "Write" phase</h5>
                        <p className="text-sm text-slate-300 font-medium">The AI calculates the KV pairs from scratch. This is <span className="text-red-400">expensive and slow</span>.</p>
                    </Card>
                    <Card className="p-6 bg-slate-900 border-white/5 space-y-2">
                        <h5 className="text-xs font-black text-plasma-400 uppercase tracking-widest">The "Read" phase</h5>
                        <p className="text-sm text-slate-300 font-medium">The AI simply looks up existing pairs in its cache. This is <span className="text-emerald-400">cheap and fast</span>.</p>
                    </Card>
                </div>
            </div>

            {/* 💰 The 2026 Pricing Model */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-white">
                    <Coins className="w-5 h-5 text-plasma-400" />
                    <h4 className="text-xl font-bold uppercase tracking-tight">💰 The 2026 Pricing Model: "Write once, Read many"</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="p-6 bg-slate-950 rounded-2xl border border-white/5">
                            <h5 className="text-sm font-bold text-white mb-2">1. The Cache Write (Full Price)</h5>
                            <p className="text-xs text-slate-400 leading-relaxed">The first time you send a large block of text, you pay the Standard Rate. <span className="text-white">Gemini 2.5 Pro: $1.25 / 1M.</span></p>
                        </div>
                        <div className="p-6 bg-plasma-500/5 rounded-2xl border border-plasma-500/20">
                            <h5 className="text-sm font-bold text-white mb-2">2. The Cache Hit (90% Discount)</h5>
                            <p className="text-xs text-slate-400 leading-relaxed">Subsequent reuse of the same manual costs a fraction. <span className="text-emerald-400 font-bold font-mono">Gemini 2.5 Pro: $0.13 / 1M.</span></p>
                        </div>
                    </div>

                    <div className="overflow-hidden border border-white/10 rounded-2xl bg-slate-950">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5 text-[10px]">
                                <tr>
                                    <th className="p-3 text-slate-500 uppercase">Provider (2026)</th>
                                    <th className="p-3 text-slate-500 uppercase">Standard</th>
                                    <th className="p-3 text-plasma-400 uppercase">Cached Hit</th>
                                </tr>
                            </thead>
                            <tbody className="text-[10px]">
                                <tr className="border-t border-white/5">
                                    <td className="p-3 text-slate-300">GPT-5.4</td>
                                    <td className="p-3 text-slate-500">$2.50</td>
                                    <td className="p-3 text-white font-bold">$1.25</td>
                                </tr>
                                <tr className="border-t border-white/5 bg-plasma-500/5">
                                    <td className="p-3 text-slate-300 font-bold">Gemini 2.5 Pro</td>
                                    <td className="p-3 text-slate-500 font-mono">$1.25</td>
                                    <td className="p-3 text-emerald-400 font-black">$0.13</td>
                                </tr>
                                <tr className="border-t border-white/5">
                                    <td className="p-3 text-slate-300 font-bold">Claude 4.6</td>
                                    <td className="p-3 text-slate-500 font-mono">$5.00</td>
                                    <td className="p-3 text-emerald-400 font-black">$0.50</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ⏳ The "TTL" Storage Fee */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-white">
                    <Timer className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-xl font-bold uppercase tracking-tight">⏳ The "TTL" (Time-To-Live) Storage Fee</h4>
                </div>
                <div className="p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-[32px] relative overflow-hidden group">
                    <p className="text-sm text-slate-400 leading-relaxed max-w-2xl relative z-10">
                        In 2026, memory isn't free. Because keeping KV pairs in the GPU’s VRAM is expensive, providers charge a <span className="text-white font-bold">Storage Fee</span> based on time. 
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 relative z-10">
                        <div className="flex gap-3 items-start">
                            <Badge className="bg-indigo-500/20 text-indigo-400 border-none shrink-0 mt-1">THE RULE</Badge>
                            <p className="text-[10px] text-slate-500">You might pay a few cents per hour to keep your context "active" in the cache.</p>
                        </div>
                        <div className="flex gap-3 items-start">
                            <Badge className="bg-plasma-500/20 text-plasma-400 border-none shrink-0 mt-1">THE TTL</Badge>
                            <p className="text-[10px] text-slate-500">If no one uses the cache for 30 mins, it is "evicted" and you pay the "Write" price again.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 📊 Practical Calculation: The Agentic Workflow */}
            <div className="space-y-8">
                <div className="flex items-center gap-3 text-white">
                    <Calculator className="w-5 h-5 text-plasma-400" />
                    <h4 className="text-xl font-bold uppercase tracking-tight">📊 Practical Calculation: The Agentic Workflow</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-8 bg-slate-900 border-white/5 space-y-4">
                        <h6 className="text-xs font-black text-slate-500 uppercase tracking-widest">Scenario A: No Caching</h6>
                        <ul className="text-[10px] space-y-2 text-slate-400 font-medium">
                            <li>10 requests per day (100k each)</li>
                            <li>Total Input: 1,000,000 tokens</li>
                            <li className="pt-2 text-white font-bold border-t border-white/5">Daily Cost: $1.25</li>
                        </ul>
                    </Card>
                    <Card className="p-8 bg-emerald-500/5 border-emerald-500/20 space-y-4 shadow-2xl shadow-emerald-500/5">
                        <h6 className="text-xs font-black text-emerald-400 uppercase tracking-widest">Scenario B: 2026 KV Caching</h6>
                        <ul className="text-[10px] space-y-2 text-slate-400 font-medium">
                            <li>Request 1: 100k "Write" = $0.125</li>
                            <li>Requests 2-10: 900k "Read" = $0.117</li>
                            <li className="pt-2 text-emerald-400 font-black border-t border-white/5">Daily Cost: ~$0.24</li>
                        </ul>
                    </Card>
                </div>
                <p className="text-center text-xs font-black text-emerald-400 uppercase tracking-widest">
                    Savings: 80% reduction in total cost
                </p>
            </div>

            {/* 💡 Discussion Guide */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[32px] p-8 md:p-12 space-y-12">
                <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-indigo-400" />
                    <h4 className="text-2xl font-black text-white uppercase tracking-tight">💡 Discussion Guide for Developers</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h5 className="font-bold text-white flex items-center gap-2">1. The "Prefix" Rule</h5>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">For a cache hit to work, the text must be an exact match at the <span className="text-white">beginning</span> of the prompt.</p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/20">
                                <Check className="w-3 h-3" /> [Manual] + [User Question]
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-red-400 bg-red-500/5 p-2 rounded-lg border border-red-500/20">
                                <X className="w-3 h-3" /> [Timestamp] + [Manual] + [User Question]
                            </div>
                        </div>
                        <p className="text-[9px] text-slate-500 italic">Always put dynamic text (like timestamps) at the bottom to avoid breaking the cache.</p>
                    </div>
                    <div className="space-y-6">
                        <h5 className="font-bold text-white flex items-center gap-2">2. Is it worth it for small prompts?</h5>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">Most providers only trigger caching for prompts larger than <span className="text-white">1,024 tokens</span>. For small "Hey" messages, the overhead is more expensive than re-calculation.</p>
                        <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-[10px] text-slate-400">
                            Caching is for the "Heavy Lifters"—PDFs, codebases, and long chat histories.
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center pt-8 space-y-4">
                <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-black px-4 py-1">🎓 SUMMARY TASK</Badge>
                <p className="text-slate-400 max-w-2xl mx-auto italic text-sm">
                    "Do you have a 'static' set of rules or data that the AI uses in every single chat? If so, you are currently paying a 'Memory Tax' that you could avoid with a KV Cache strategy."
                </p>
                <p className="text-white font-bold uppercase tracking-widest text-xs pt-4">
                    Ready to move to Module 3, where we learn how to "Compress" your prompts?
                </p>
            </div>
          </div>
        </section>

        {/* Lesson 2.4 */}
        <section className="space-y-16 relative">
          <div className="flex items-center gap-4 border-l-4 border-plasma-500 pl-6 py-2">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-plasma-400 uppercase tracking-[0.3em]">Lesson 2.4</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">Multimodal Tokens</h3>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-12">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-plasma-400">
                    <ImageIcon className="w-6 h-6" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">Pixels and Sound Waves</h4>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    Every pixel and every second of sound has a <span className="text-white font-bold underline decoration-plasma-500/50">"Token Weight"</span> that consumes your budget and your context window.
                </p>
            </div>

            {/* 🖼️ 1. Image Tokens */}
            <div className="space-y-8">
                <div className="flex items-center gap-3 text-white">
                    <ImageIcon className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-xl font-bold uppercase tracking-tight">1. Image Tokens: The Tiling Math</h4>
                </div>
                <p className="text-slate-400 leading-relaxed">
                    AI models don't "see" an image all at once. They slice it into a grid of squares, called <span className="text-white font-bold">Tiles or Patches</span>.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl space-y-3">
                            <h6 className="text-xs font-black text-slate-500 uppercase tracking-widest">The Formula (2026 Std)</h6>
                            <div className="font-mono text-xs text-plasma-400 py-2">
                                Total Tokens = Base Fee + (Tiles × Tokens/Tile)
                            </div>
                            <p className="text-[10px] text-slate-500 italic">Base fee: ~85-258 tokens | Tiles: 768x768 (Gemini) or 512x512 (GPT)</p>
                        </div>
                        <p className="text-xs text-slate-400">
                            <b className="text-white">Real-World:</b> A 4K photo (~12 tiles) can cost <span className="text-white font-bold">3,000 tokens</span>. That’s like sending a 10-page essay just to upload one photo!
                        </p>
                    </div>
                    <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-center">
                        <div className="grid grid-cols-3 gap-1 opacity-40">
                            {[...Array(9)].map((_, i) => <div key={i} className="aspect-square bg-indigo-400/20 border border-indigo-400/40 rounded-sm" />)}
                        </div>
                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-4 text-center">Visual Tiling Grid</p>
                    </div>
                </div>
            </div>

            {/* 🎙️ 2. Audio Tokens */}
            <div className="space-y-8">
                <div className="flex items-center gap-3 text-white">
                    <Mic className="w-5 h-5 text-plasma-400" />
                    <h4 className="text-xl font-bold uppercase tracking-tight">2. Audio Tokens: The Time-to-Token Rate</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-gradient-to-br from-slate-900 to-indigo-900/20 border border-white/10 rounded-[32px] space-y-4">
                        <p className="text-sm text-slate-300 leading-relaxed font-medium">
                            Audio is tokenized based on <span className="text-white">duration</span>, not file size. The AI converts sound waves into "acoustic tokens" at a fixed rate.
                        </p>
                        <div className="flex justify-between items-center py-4 border-y border-white/5">
                            <span className="text-[10px] font-black text-slate-500 uppercase">Standard Rate</span>
                            <span className="text-plasma-400 font-mono font-black">~32 tokens / sec</span>
                        </div>
                        <p className="text-[10px] text-slate-500 italic">1 minute of audio ≈ 1,920 tokens</p>
                    </div>
                    <div className="space-y-4 justify-center flex flex-col">
                        <Badge className="bg-amber-500/10 text-amber-400 border-none font-black text-[10px] tracking-widest uppercase w-fit">Premium Math</Badge>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Providers often charge more for audio. Gemini Flash might charge <span className="text-white">$0.10/1M</span> for text but <span className="text-white">$0.40/1M</span> for audio due to "listening" math complexity.
                        </p>
                    </div>
                </div>
            </div>

            {/* 🎬 3. Video Tokens */}
            <div className="space-y-8">
                <div className="flex items-center gap-3 text-white">
                    <Film className="w-5 h-5 text-red-500" />
                    <h4 className="text-xl font-bold uppercase tracking-tight">3. Video Tokens: The Ultimate Budget Killer</h4>
                </div>
                <div className="p-8 bg-slate-950 border border-white/10 rounded-[32px] space-y-8">
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Video combines frames and audio into a massive stream. To save money, models <span className="text-white font-bold italic">"sample"</span> the video at a lower rate (e.g., 1 frame per second).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <span>Gemini 2.5/3 Rate</span>
                                <span className="text-white">~263 tokens / sec</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 w-[80%]" />
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500">
                            A simple 10-minute video consumes <span className="text-red-400 font-bold">~157,000 tokens</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Media Comparison Table */}
            <div className="overflow-hidden border border-white/10 rounded-3xl bg-slate-950">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5">
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Media Type</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Duration/Size</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-plasma-400">Est. Token Cost</th>
                        </tr>
                    </thead>
                    <tbody className="text-[10px]">
                        <tr className="border-t border-white/5">
                            <td className="p-4 text-slate-300">Simple Image</td>
                            <td className="p-4 text-slate-500">Low-Res (384px)</td>
                            <td className="p-4 text-white font-mono font-bold">258 tokens</td>
                        </tr>
                        <tr className="border-t border-white/5">
                            <td className="p-4 text-slate-300">Detailed Image</td>
                            <td className="p-4 text-slate-500">4K Photograph</td>
                            <td className="p-4 text-white font-mono font-bold">3,000+ tokens</td>
                        </tr>
                        <tr className="border-t border-white/5 bg-indigo-500/5">
                            <td className="p-4 text-slate-300">Short Audio</td>
                            <td className="p-4 text-slate-500">30-Second Clip</td>
                            <td className="p-4 text-white font-mono font-bold">960 tokens</td>
                        </tr>
                        <tr className="border-t border-white/5">
                            <td className="p-4 text-slate-300">Long Audio</td>
                            <td className="p-4 text-slate-500">1-Hour Podcast</td>
                            <td className="p-4 text-white font-mono font-bold">115,200 tokens</td>
                        </tr>
                        <tr className="border-t border-white/5 bg-red-500/5">
                            <td className="p-4 text-red-400 font-bold uppercase">Short Video</td>
                            <td className="p-4 text-slate-500">1-Minute Clip</td>
                            <td className="p-4 text-red-400 font-mono font-black">15,780 tokens</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Interactive Lab */}
            <div className="space-y-8 pt-12 border-t border-white/5">
                <div className="space-y-2">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-plasma-400" />
                        Interactive Multimodal Lab
                    </h4>
                    <p className="text-sm text-slate-400 max-w-2xl font-medium">
                        Test the "Tiling Math" yourself. Upload a photo or simulate "Attention Zooms" to see how agentic vision scales your token bill in real-time.
                    </p>
                </div>
                <div className="p-1 rounded-[40px] bg-gradient-to-b from-white/10 to-transparent">
                    <div className="bg-[#020817] rounded-[38px] p-2 md:p-8">
                        <MultimodalEstimator />
                    </div>
                </div>
            </div>

            {/* 💡 Discussion Guide */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[32px] p-8 md:p-12 space-y-12">
                <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-indigo-400" />
                    <h4 className="text-2xl font-black text-white uppercase tracking-tight">💡 Discussion Guide for New Users</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <h5 className="font-bold text-white flex items-center gap-2">1. The "Resolution Trap"</h5>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">Most models have a "Cap" (e.g., 1568px). Sending a 50MB DSLR photo costs latency without gaining intelligence.</p>
                        <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 text-[10px] text-slate-400">
                            <b className="text-emerald-400">Pro-Tip:</b> Resize images to <span className="text-white">~1024px</span> before sending to save upload time and tiles.
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h5 className="font-bold text-white flex items-center gap-2">2. The Context Window "Cliff"</h5>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">Flagship models offer massive windows (10M+), but a 45-min video uses <span className="text-white">710,000 tokens</span>. Every single chat follow-up will "re-read" those tokens.</p>
                        <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/20 text-[10px] text-slate-400">
                            <b className="text-red-400 font-bold uppercase tracking-widest">The Cost:</b> On a $2.50/1M model, every follow-up costs <span className="text-white font-bold">$1.77</span> just in background memory!
                        </div>
                    </div>
                </div>
            </div>

            {/* Graphic Prompt Placeholder */}
            <div className="p-8 border border-dashed border-white/10 rounded-3xl text-center space-y-4 bg-black/20">
                <Smartphone className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">Lesson 2.4 Visual Infographic</p>
                <p className="text-xs text-slate-600 italic max-w-md mx-auto">"A high-tech infographic showing a smartphone screen video frame exploded into layers of Visual Blocks (Image) and flowing Waveforms (Audio), with a Context Window counter filling up."</p>
            </div>

            <div className="text-center pt-8 space-y-4">
                <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-black px-4 py-1">🎓 SUMMARY TASK</Badge>
                <p className="text-slate-400 max-w-2xl mx-auto italic text-sm">
                    "Now that you see how multimodal data 'eats' your context window, are you ready to learn the strategies for 'Context Management' to keep these costs from spiraling?"
                </p>
            </div>
          </div>
        </section>

        {/* Module Summary */}
        <section className="pt-20 border-t border-white/5 text-center space-y-10">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plasma-500/10 text-plasma-400 text-[10px] font-black uppercase tracking-widest border border-plasma-500/20">
                MODULE 2 COMPLETE
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight">The Big Picture</h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              You now know that <span className="text-white">context windows</span> are finite, <span className="text-white">generation</span> is the real bottleneck, and <span className="text-white">caching</span> is the ultimate budget optimization tool.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-16 px-10 bg-plasma-600 hover:bg-plasma-700 text-white font-black uppercase tracking-tight gap-2 shadow-2xl shadow-plasma-500/20" asChild>
              <Link href="/tokenomics/module-3">
                Continue to Module 3
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-10 border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-tight" asChild>
              <Link href="/tokenomics">Back to Academy</Link>
            </Button>
          </div>

          <p className="text-sm text-slate-500 italic pt-8">
            "Would you like to move on to Module 3: Prompt Engineering for Token Efficiency, where we learn how to get the same results using 50% fewer tokens?"
          </p>
        </section>

        {/* Learning Resources (Keeping existing) */}
        <section className="pt-20 border-t border-white/5">
             <div className="space-y-10">
                <div className="space-y-2">
                  <Badge className="bg-plasma-500/20 text-plasma-400 border-none px-3 py-1 text-[10px] font-black tracking-widest uppercase">
                    Deep Dive
                  </Badge>
                  <h4 className="text-2xl font-bold text-white uppercase tracking-tight">Additional Learning Resources</h4>
                  <p className="text-sm text-slate-400">Curated tools and articles to help you master the "Generation Loop."</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h5 className="text-sm font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      1. The "Must-Watch" Visualizers
                    </h5>
                    <div className="space-y-4">
                      <a 
                        href="https://bbycroft.net/llm" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <Card className="p-6 bg-slate-900/50 border-white/5 hover:border-plasma-500/40 hover:bg-plasma-500/5 transition-all duration-300">
                          <h6 className="font-bold text-white mb-2 group-hover:text-plasma-400">LLM Visualization (by Brendan Bycroft)</h6>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            A 3D walkthrough that shows exactly how tokens move through a model. Perfect for visualizing Sequential Generation.
                          </p>
                        </Card>
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      2. Deep-Dive Articles (The "Why")
                    </h5>
                    <div className="space-y-4">
                      <a 
                        href="https://redis.io/blog/llm-token-optimization/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <Card className="p-6 bg-slate-900/50 border-white/5 hover:border-plasma-500/40 hover:bg-plasma-500/5 transition-all duration-300">
                          <h6 className="font-bold text-white mb-2 group-hover:text-plasma-400">LLM Token Optimization: Cutting Costs</h6>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Focuses on the business side of tokens. Explains how to minimize "token waste" in professional apps.
                          </p>
                        </Card>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 mt-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-[0.3em]">Module 2 Complete • TokenSense Academy</p>
        </div>
      </footer>
    </div>
  );
}
