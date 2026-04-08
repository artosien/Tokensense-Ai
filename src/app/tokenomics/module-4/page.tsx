"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Brain,
  Zap,
  Repeat,
  ChevronRight,
  Target,
  CheckCircle2,
  Cpu,
  Workflow,
  TrendingUp,
  AlertTriangle,
  Info,
  Layers,
  Calculator,
  History,
  ArrowRight,
  ShieldAlert,
  Terminal,
  DollarSign
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { GradientOrbs } from "@/components/GradientOrbs";
import ShareButton from "@/components/ShareButton";
import { cn } from "@/lib/utils";

export default function Module4Page() {
  const [activeLesson, setActiveLesson] = useState(0);

  const lessons = [
    { id: 'price', title: 'The Price of Autonomy', icon: <Repeat className="w-4 h-4" /> },
    { id: 'tool-tax', title: 'Hidden Tool Tax', icon: <Workflow className="w-4 h-4" /> },
    { id: 'persistence', title: 'State Persistence', icon: <Layers className="w-4 h-4" /> },
    { id: 'breakeven', title: 'Economic Breakeven', icon: <Calculator className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-slate-200 selection:bg-indigo-500/30">
      <SiteHeader />
      
      {/* Floating Nav */}
      <nav className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full hidden md:flex items-center gap-8 shadow-2xl">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-r border-white/10 pr-8">Module 4</span>
          <div className="flex gap-6">
              {lessons.map((lesson, i) => (
                  <a key={i} href={`#lesson-${i+1}`} className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-tight">
                      4.{i+1} {lesson.title}
                  </a>
              ))}
          </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-32 space-y-32">
        <GradientOrbs />
        
        {/* HERO */}
        <section className="relative min-h-[60vh] flex flex-col justify-center space-y-10">
          <div className="space-y-6">
            <Link 
              href="/tokenomics" 
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              BACK TO ACADEMY
            </Link>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="px-3 py-1 border-purple-500/30 bg-purple-500/10 text-purple-400 font-black text-[10px] tracking-[0.2em] uppercase">
                  Module 4 · Agentic Loop Economics
                </Badge>
                <Badge variant="outline" className="px-3 py-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-black text-[10px] tracking-[0.2em] uppercase">
                  Expert · Architecture
                </Badge>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase">
                The Token<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 italic font-serif normal-case">CFO</span>
              </h1>
              <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
                Welcome to Module 4: Agentic Loop Economics. If you are building autonomous systems, you aren't just a developer; you are a <span className="text-white font-bold">"Token CFO."</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl space-y-4">
              <p className="text-lg text-slate-300 leading-relaxed font-medium">
                In standard chatbots, costs are linear. In AI Agents, costs are <span className="text-white font-bold italic">exponential</span>. Without the right financial architecture, an autonomous agent can spend your entire monthly budget in a single afternoon.
              </p>
              <p className="text-slate-400 text-sm">
                Let’s master the math of autonomy and prevent the "infinite loop" horror story.
              </p>
            </div>

            <Card className="p-8 bg-slate-900/50 border-white/5 space-y-6">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Target className="w-4 h-4 text-purple-400" />
                    Learning Objectives
                </h4>
                <div className="grid grid-cols-1 gap-3">
                    {[
                        "Calculate the compounding cost of ReAct (Reason + Act) loops.",
                        "Estimate token overhead for tool-calling and function definitions.",
                        "Optimize state persistence to reduce redundant context injection.",
                        "Model the breakeven point for autonomous vs. human tasks."
                    ].map((obj, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-xs font-bold text-slate-300">{obj}</span>
                        </div>
                    ))}
                </div>
            </Card>
          </div>
        </section>

        {/* LESSON 4.1: THE PRICE OF AUTONOMY */}
        <section id="lesson-1" className="space-y-16 scroll-mt-32">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
                <span className="text-6xl font-black text-slate-800/50 font-serif">4.1</span>
                <div className="h-px flex-1 bg-white/5" />
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tight">The Price of Autonomy</h2>
            <p className="text-xl text-slate-400 font-medium max-w-2xl italic">"Every 'thought' in a reasoning loop is a full API call that includes the entire history of previous thoughts."</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-6 text-lg text-slate-300 leading-relaxed font-medium">
                <p>
                  Most agents use the <span className="text-white font-bold">ReAct (Reason + Act)</span> framework. For every task, the agent follows a cycle: <span className="font-mono text-indigo-400 text-base">Thought → Action → Observation</span>.
                </p>
                
                <Card className="p-8 bg-indigo-500/5 border-indigo-500/20 space-y-4">
                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                        <DollarSign className="w-4 h-4" /> The Snowball Effect
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Imagine an agent trying to fix a bug in your code. It takes 5 turns to find and fix the issue. Because each turn carries the history of previous turns, the cost grows with every step.
                    </p>
                </Card>

                <p className="text-slate-400 text-base">
                  While a "dumb" chatbot might have cost $0.005, the agent cost $0.035—a <span className="text-white font-bold">7x increase</span> for the same final result.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Card className="overflow-hidden border-white/10 bg-slate-900/50 shadow-2xl">
                <div className="p-4 border-b border-white/5 bg-black/20">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">The Loop Bill (Example)</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] font-bold">
                    <thead className="bg-white/5 text-slate-500 uppercase tracking-widest border-b border-white/5">
                      <tr>
                        <th className="px-4 py-3 font-black">Turn</th>
                        <th className="px-4 py-3 font-black">Input (History)</th>
                        <th className="px-4 py-3 font-black">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { turn: 1, tokens: "1,000", cost: "$0.005" },
                        { turn: 2, tokens: "1,200", cost: "$0.006" },
                        { turn: 3, tokens: "1,400", cost: "$0.007" },
                        { turn: 4, tokens: "1,600", cost: "$0.008" },
                        { turn: 5, tokens: "1,800", cost: "$0.009" }
                      ].map((row) => (
                        <tr key={row.turn} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-white">Turn {row.turn}</td>
                          <td className="px-4 py-3 text-slate-400">{row.tokens} tokens</td>
                          <td className="px-4 py-3 text-emerald-400 font-mono">{row.cost}</td>
                        </tr>
                      ))}
                      <tr className="bg-emerald-500/10">
                        <td className="px-4 py-4 text-white font-black uppercase tracking-widest">Total</td>
                        <td className="px-4 py-4 text-slate-300 font-black">7,000 In / 1K Out</td>
                        <td className="px-4 py-4 text-emerald-400 font-black font-mono text-sm">$0.035</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* LESSON HIGHLIGHT VIDEO */}
        <section className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-slate-900/50 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
                <div className="aspect-video relative">
                    <video 
                        className="w-full h-full object-cover"
                        controls
                        poster="/hero-banner.jpg"
                    >
                        <source src="/Videos/The_Math_of_Autonomy__Architecting_Cost-Effective_AI_Agents.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    
                    {/* Share Button Overlay */}
                    <div className="absolute top-6 right-6">
                        <ShareButton 
                            title="The Math of Autonomy"
                            text="Watch this lesson highlight on architecting cost-effective AI agents."
                            url={typeof window !== 'undefined' ? window.location.href : ''}
                            className="bg-black/60 hover:bg-black/80 text-white border-white/20 backdrop-blur-md rounded-2xl w-12 h-12"
                        />
                    </div>

                    {/* Video Label */}
                    <div className="absolute top-6 left-6 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">MODULE 4 HIGHLIGHT</span>
                    </div>
                </div>
            </div>
            <p className="mt-6 text-center text-sm text-slate-500 font-medium italic">
                "Architecting for autonomy requires a shift from prompt engineering to financial engineering."
            </p>
        </section>

        {/* LESSON 4.2: THE HIDDEN TAX OF TOOL-CALLING */}
        <section id="lesson-2" className="space-y-16 scroll-mt-32">
          <div className="space-y-4 text-right">
            <div className="flex items-center gap-4 justify-end">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-6xl font-black text-slate-800/50 font-serif">4.2</span>
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tight">The Hidden Tax of Tool-Calling</h2>
            <p className="text-xl text-slate-400 font-medium max-w-2xl ml-auto italic">"Function definitions aren't free; they are 'System Instructions' that you pay for in every single turn."</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-6 text-lg text-slate-300 leading-relaxed font-medium">
                <p>
                  To make an agent "agentic," you give it tools (e.g., <code className="bg-white/5 px-1.5 py-0.5 rounded text-indigo-400">search_web</code>, <code className="bg-white/5 px-1.5 py-0.5 rounded text-indigo-400">read_database</code>). These are sent to the AI as JSON Schemas in the system prompt.
                </p>
                <div className="p-8 bg-slate-900/50 border border-white/5 rounded-3xl space-y-6">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-400" /> The Overhead Math
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    A typical tool definition takes about 150-300 tokens. If your agent has 10 tools, you are starting every single conversation with a <span className="text-white font-bold">3,000-token "Tax."</span>
                  </p>
                  <div className="flex items-baseline gap-4 border-t border-white/5 pt-6">
                    <span className="text-3xl font-black text-red-400 font-mono tracking-tighter">30,000</span>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Tokens paid in a 10-turn ReAct loop just for tool definitions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <Card className="p-8 bg-indigo-500/10 border-indigo-500/20 rounded-[32px] space-y-6">
                <div className="flex items-center gap-3 text-indigo-400">
                  <Brain className="w-6 h-6" />
                  <h4 className="text-lg font-black uppercase tracking-tight">Architectural Tip: Proxy Layer</h4>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  Don't send all tools every time. Use a <span className="text-white font-bold">"Proxy Layer"</span> or the Model Context Protocol (MCP) to only inject tool definitions when the AI specifically asks for a "Tool Discovery" step.
                </p>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/10">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Reduces baseline per-turn cost by up to 80% for tool-heavy agents.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* LESSON 4.3: STATE PERSISTENCE */}
        <section id="lesson-3" className="space-y-16 scroll-mt-32">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
                <span className="text-6xl font-black text-slate-800/50 font-serif">4.3</span>
                <div className="h-px flex-1 bg-white/5" />
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tight">State Persistence & Optimization</h2>
            <p className="text-xl text-slate-400 font-medium max-w-2xl italic">"Managing 'State' is how you stop the budget from bleeding."</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Rolling Summarization</h3>
              <p className="text-lg text-slate-400 leading-relaxed font-medium">
                To keep costs linear (flat) rather than exponential (climbing), you must manage the State Persistence.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl flex gap-6 items-start">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 font-black text-indigo-400">1</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white uppercase tracking-tight">Turns 1-5</h4>
                    <p className="text-sm text-slate-400">Send full history for maximum accuracy during the initial reasoning phase.</p>
                  </div>
                </div>
                <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex gap-6 items-start">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 font-black text-indigo-400">2</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white uppercase tracking-tight text-indigo-400">Turn 6: Summary Reset</h4>
                    <p className="text-sm text-slate-300 italic">"Use a lightweight model (like Gemini 2.5 Flash) to summarize Turns 1-5 into 200 tokens."</p>
                  </div>
                </div>
                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl flex gap-6 items-start">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 font-black text-indigo-400">3</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white uppercase tracking-tight">Turn 7+</h4>
                    <p className="text-sm text-slate-400">Send the Summary + the new turn. Your cost curve resets to baseline.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">2026 Tech: KV Cache</h3>
                <Card className="p-8 bg-slate-900/50 border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-none font-black text-[9px] uppercase tracking-widest">2026 STANDARD</Badge>
                  </div>
                  <div className="space-y-6">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <p className="text-slate-300 leading-relaxed font-medium">
                      In 2026, the best way to optimize is <span className="text-white font-bold">KV Caching</span>. By keeping "Tool Definitions" and "System Instructions" at the top of the prompt, providers can cache them.
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-cyan-400 font-mono tracking-tighter">−90%</span>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Discount on cached tokens in subsequent turns.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* LESSON 4.4: THE ECONOMIC BREAKEVEN */}
        <section id="lesson-4" className="space-y-16 scroll-mt-32">
          <div className="space-y-4 text-right">
            <div className="flex items-center gap-4 justify-end">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-6xl font-black text-slate-800/50 font-serif">4.4</span>
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tight">The Economic Breakeven</h2>
            <p className="text-xl text-slate-400 font-medium max-w-2xl ml-auto italic">"When is an agent actually cheaper than a person?"</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5 space-y-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">The ROI Formula</h3>
              <div className="p-8 bg-slate-950 border border-white/5 rounded-3xl space-y-8">
                <div className="text-center py-6 bg-black/40 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">ROI CALCULATION</div>
                  <div className="text-xl font-black text-white tracking-tighter font-mono px-4 leading-relaxed">
                    (Hours Saved × Rate) − Agent Costs
                    <div className="h-px bg-white/20 my-3 mx-10" />
                    Agent Development Cost
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic text-center">
                  "If the ROI isn't positive within 3 months, you are building a toy, not a business system."
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">Case Study: Philippines VA vs. AI Agent</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 bg-slate-900/50 border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Human VA</h4>
                    <span className="text-xl font-black text-white font-mono">$5.00/hr</span>
                  </div>
                  <ul className="space-y-2 text-xs font-bold text-slate-500">
                    <li className="flex justify-between"><span>Throughput</span> <span className="text-white">20 leads / hr</span></li>
                    <li className="flex justify-between"><span>Cost per lead</span> <span className="text-white">$0.25</span></li>
                  </ul>
                </Card>
                <Card className="p-8 bg-indigo-500/10 border-indigo-500/20 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest">AI Agent</h4>
                    <span className="text-xl font-black text-white font-mono">$0.04/loop</span>
                  </div>
                  <ul className="space-y-2 text-xs font-bold text-slate-500">
                    <li className="flex justify-between"><span>Throughput</span> <span className="text-indigo-400">1,000+ leads / hr</span></li>
                    <li className="flex justify-between"><span>Cost per lead</span> <span className="text-indigo-400">$0.04</span></li>
                  </ul>
                </Card>
              </div>
              <div className="mt-8 p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl font-black">6x</div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">The Verdict</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The AI is <span className="text-emerald-400 font-bold">6x cheaper</span>. Even with high development costs, the "Breakeven" happens within the first 1,000 leads for travel sites like <code className="bg-white/5 px-1 rounded">seeanddoplacesph.com</code>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DISCUSSION & TASK */}
        <section className="pt-32 border-t border-white/5 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-red-400">
                <ShieldAlert className="w-6 h-6" />
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">The "Infinite Loop" Horror Story</h2>
              </div>
              <p className="text-lg text-slate-400 leading-relaxed font-medium">
                Every developer eventually writes a "While" loop that doesn't have a break condition. With a normal app, it just crashes your computer. <span className="text-white font-bold">With an AI Agent, it can spend $500 in API credits before you finish your coffee.</span>
              </p>
              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4">
                <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-500 font-black text-xs shrink-0">FIX</div>
                <p className="text-sm text-slate-300 font-bold leading-relaxed">
                  Always implement a <code className="bg-black/40 px-2 py-1 rounded text-red-400">max_iterations=10</code> hard cap in your code.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-3 text-emerald-400">
                <Terminal className="w-6 h-6" />
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Developer Task</h2>
              </div>
              <Card className="p-8 bg-slate-900/50 border-white/10 space-y-6">
                <p className="text-slate-300 leading-relaxed">
                  Using a tool like <span className="text-emerald-400 font-bold">AITokenSense</span>, input your current "System Prompt" and 5 sample "Tools." 
                </p>
                <div className="space-y-4">
                  <p className="text-sm font-bold text-white uppercase tracking-widest">Question:</p>
                  <p className="text-sm text-slate-400 italic leading-relaxed">
                    "Calculate how much a 10-turn conversation would cost. Are you shocked by the number? That is the 'Price of Autonomy.'"
                  </p>
                </div>
                <Button className="w-full bg-[#00dcb4] hover:bg-[#00c5a1] text-black font-black uppercase tracking-widest py-6" asChild>
                  <Link href="/">Open Calculator</Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* NEXT MODULE */}
        <section className="pt-32 border-t border-white/5">
          <div className="flex flex-col items-center gap-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
                MODULE 4 COMPLETE
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tight text-center">Ready to optimize?</h2>
            
            <Button size="lg" className="h-16 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-tight gap-3 shadow-2xl shadow-indigo-500/20 group" asChild>
                <Link href="/#calculator">
                    Start Calculating
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
            </Button>
            <p className="text-sm text-slate-500 italic max-w-md text-center leading-relaxed">
                "Ready to apply these economics to your own loops? <span className="text-white">Start Calculating</span> now and see the price of autonomy for your specific use case."
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-16">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Agentic Loop Economics · AI Architecture</p>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-[0.2em]">Module 4 · TokenSense Academy</p>
          </div>
      </footer>
    </div>
  );
}
