"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  TrendingDown,
  Zap,
  Scale,
  ChevronRight,
  Target,
  CheckCircle2,
  LineChart,
  History,
  Activity,
  ArrowRight,
  AlertTriangle,
  Info,
  Layers,
  Calculator,
  Cpu,
  Clock,
  ExternalLink,
  Milestone
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { GradientOrbs } from "@/components/GradientOrbs";
import ShareButton from "@/components/ShareButton";
import { cn } from "@/lib/utils";

// ─── Constants & Data ────────────────────────────────────────────────────────

const TASK_DATA = [
    { 
        id: 1, 
        task: "Classify support tickets as urgent / not urgent", 
        tier: 'flash', 
        model: 'Gemini 2.5 Flash', 
        reason: 'Binary classification is well within Flash capabilities. No multi-step reasoning required. At 10,000 calls/day, Flash costs ~$1.50/day vs Frontier at ~$225/day.' 
    },
    { 
        id: 2, 
        task: "Analyze a contract for conflicting indemnification clauses", 
        tier: 'frontier', 
        model: 'Claude Sonnet / GPT-5', 
        reason: 'Interpreting conflicting legal language across jurisdictions requires deep multi-step reasoning, citation tracking, and low error tolerance. Frontier is the right call.' 
    },
    { 
        id: 3, 
        task: "Extract names and amounts from 500 invoices", 
        tier: 'flash', 
        model: 'Gemini 2.5 Flash', 
        reason: 'Structured extraction is a pattern-matching task Flash handles with high accuracy. Consider running a Flash model with a structured output schema (JSON mode).' 
    },
    { 
        id: 4, 
        task: "Debug a race condition in a distributed async system", 
        tier: 'frontier', 
        model: 'Claude Sonnet / GPT-5', 
        reason: 'Debugging requires understanding state across multiple files and reasoning about causal chains. Frontier models show dramatically higher first-attempt fix rates.' 
    },
    { 
        id: 5, 
        task: "Translate 10,000 product descriptions to Spanish", 
        tier: 'flash', 
        model: 'Gemini 2.5 Flash', 
        reason: 'Translation is a well-solved Flash task. Modern Flash models match Frontier quality on 40+ major languages. Use Flash and save 150×.' 
    },
    { 
        id: 6, 
        task: "Synthesize 20 research papers into an investment thesis", 
        tier: 'frontier', 
        model: 'Claude Sonnet / GPT-5', 
        reason: 'Multi-document synthesis across sources with conflicting data requires tracking provenance and resolving contradictions. This is the Frontier sweet spot.' 
    }
];

const ERAS = [
    {
        year: "2023",
        name: "Context Scarcity",
        tokens: "4K – 8K tokens",
        desc: "Roughly 6–12 pages of text. Most real-world documents didn't fit. Teams built RAG pipelines and chunking strategies just to process anything substantial.",
        cost: "$0.48",
        costLabel: "to fill 8K context (GPT-4)",
        overhead: "High",
        fits: [
            { label: "Short Q&A, single-page docs", status: "Fits", type: "fits" },
            { label: "Legal contracts (5-10 pages)", status: "Tight", type: "tight" },
            { label: "Codebases, books, reports", status: "Impossible", type: "nope" }
        ]
    },
    {
        year: "2024",
        name: "Context Expansion",
        tokens: "128K – 200K tokens",
        desc: "Claude and GPT-4 Turbo pushed limits. Entire codebases and long books could now be processed in a single call. RAG was still preferred for cost, but ceilings vanished.",
        cost: "$0.38",
        costLabel: "to fill 128K context (GPT-4T)",
        overhead: "Medium",
        fits: [
            { label: "Contracts, reports, codebases", status: "Fits", type: "fits" },
            { label: "Full novels (200K words)", status: "Fits", type: "fits" },
            { label: "Very large repos, datasets", status: "Tight", type: "tight" }
        ]
    },
    {
        year: "2025",
        name: "Context Abundance (Early)",
        tokens: "500K – 1M tokens",
        desc: "Gemini 1.5 Pro offered 1M tokens. Entire documentation sets and databases could be sent in a single call. Cost-per-token fell enough to make this viable.",
        cost: "$0.50",
        costLabel: "to fill 1M context (Gemini 1.5)",
        overhead: "Low",
        fits: [
            { label: "Entire codebases (mid-size)", status: "Fits", type: "fits" },
            { label: "Full product doc sets", status: "Fits", type: "fits" },
            { label: "Long research histories", status: "Fits", type: "fits" }
        ]
    },
    {
        year: "2026",
        name: "Context Abundance (Mature)",
        tokens: "2M+ tokens",
        desc: "2M+ token windows are standard. The bottleneck has fully inverted: the constraint is no longer fitting data, it's the cost of keeping it in memory on every call.",
        cost: "$0.15",
        costLabel: "to fill 2M context (Flash 2026)",
        overhead: "Minimal",
        fits: [
            { label: "Large enterprise codebases", status: "Fits", type: "fits" },
            { label: "Year-long conversation logs", status: "Fits", type: "fits" },
            { label: "Encyclopedias, full datasets", status: "Fits", type: "fits" }
        ]
    }
];

// ─── Components ──────────────────────────────────────────────────────────────

export default function Module3Page() {
    const [activeTask, setActiveTask] = useState<typeof TASK_DATA[0] | null>(null);
    const [activeEra, setActiveEra] = useState(0);
    
    // Forecaster State
    const [baseCost, setBaseCost] = useState(1000);
    const [growthRate, setGrowthRate] = useState(20);
    const [halvingPeriod, setHalvingPeriod] = useState(18);

    const forecast = useMemo(() => {
        const monthlyGrowthRate = Math.pow(1 + growthRate / 100, 1/12) - 1;
        const monthlyDecayRate = Math.pow(0.5, 1 / halvingPeriod);
        
        return [1, 2, 3, 4, 5].map(yr => {
            const monthly = baseCost * Math.pow(1 + monthlyGrowthRate, yr * 12) * Math.pow(monthlyDecayRate, yr * 12);
            return { yr, monthly };
        });
    }, [baseCost, growthRate, halvingPeriod]);

    const maxForecastMonthly = Math.max(...forecast.map(f => f.monthly), baseCost);

    return (
        <div className="min-h-screen bg-[#020817] text-slate-200 selection:bg-emerald-500/30">
            <SiteHeader />
            
            {/* Floating Nav */}
            <nav className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full hidden md:flex items-center gap-8 shadow-2xl">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest border-r border-white/10 pr-8">Module 3</span>
                <div className="flex gap-6">
                    {['The Crash', 'Flash vs Frontier', 'Context', 'Forecasting'].map((link, i) => (
                        <a key={i} href={`#lesson-${i+1}`} className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-tight">
                            3.{i+1} {link}
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
                            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            BACK TO ACADEMY
                        </Link>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="px-3 py-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-black text-[10px] tracking-[0.2em] uppercase">
                                    Module 3 · Economics of AI
                                </Badge>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase">
                                Deflationary<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 italic font-serif normal-case">Intelligence</span>
                            </h1>
                            <p className="text-xl text-slate-400 font-medium max-w-xl leading-relaxed">
                                In 24 months, intelligence costs have dropped 90%. Learn to navigate the fastest-falling price curve in the history of computing.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-8 items-center">
                        <div className="inline-flex items-baseline gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4">
                            <span className="text-4xl font-black text-emerald-400 font-mono tracking-tighter">−92%</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest max-w-[120px] leading-tight">
                                Cost per 1M tokens Mar 2023 → 2026
                            </span>
                        </div>
                        
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Learning Objectives</p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                                {[
                                    "Analyze price-performance ratios",
                                    "Distinguish model tiers",
                                    "Master context economics",
                                    "Forecast future token costs"
                                ].map((obj, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                        <ArrowRight className="w-3 h-3 text-emerald-500" /> {obj}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* EXPLAINER VIDEO */}
                <section className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-slate-900/50 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
                        <div className="aspect-video relative">
                            <video 
                                className="w-full h-full object-cover"
                                controls
                                poster="/hero-banner.jpg"
                            >
                                <source src="/Videos/The_Commoditization_of_Reasoning.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            
                            {/* Share Button Overlay */}
                            <div className="absolute top-6 right-6">
                                <ShareButton 
                                    title="The Commoditization of Reasoning"
                                    text="Watch this explainer on the deflationary economics of AI reasoning."
                                    url={typeof window !== 'undefined' ? window.location.href : ''}
                                    className="bg-black/60 hover:bg-black/80 text-white border-white/20 backdrop-blur-md rounded-2xl w-12 h-12"
                                />
                            </div>

                            {/* Video Label */}
                            <div className="absolute top-6 left-6 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">MODULE 3 EXPLAINER</span>
                            </div>
                        </div>
                    </div>
                    <p className="mt-6 text-center text-sm text-slate-500 font-medium italic">
                        "As reasoning becomes a commodity, the value shifts from the model itself to the orchestration of loops."
                    </p>
                </section>

                {/* LESSON 3.1: THE CRASH */}
                <section id="lesson-1" className="space-y-16 scroll-mt-32">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-6xl font-black text-slate-800/50 font-serif">3.1</span>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tight">The 90% Drop</h2>
                        <p className="text-xl text-slate-400 font-medium max-w-2xl italic">"We aren't just seeing lower prices. We're witnessing the commoditization of reasoning itself."</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-7 space-y-8 text-lg text-slate-300 leading-relaxed font-medium">
                            <p>
                                What cost <strong>$30.00</strong> to process in early 2023 now costs less than <strong>$0.10</strong> for the same amount of information. No technology in recent history has deflated this fast.
                            </p>
                            <p className="text-slate-400 text-base">
                                Three structural forces are compounding: algorithmic efficiency (more per FLOP), hardware improvements (H100 → Blackwell), and competitive pressure driving margins toward zero.
                            </p>
                            
                            <Card className="p-8 bg-emerald-500/5 border-emerald-500/20 space-y-4">
                                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                    <Info className="w-4 h-4" /> Key Insight
                                </h4>
                                <p className="text-sm text-slate-300 leading-relaxed italic">
                                    The price of <span className="text-white font-bold">intelligence</span> is now decoupling from the cost of <span className="text-white font-bold">quality</span>. Yesterday's premium capability is today's commodity.
                                </p>
                            </Card>
                        </div>

                        <div className="lg:col-span-5">
                            <Card className="p-8 bg-slate-900/50 border-white/10 space-y-10 relative overflow-hidden">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cost Crash Timeline</h4>
                                        <Badge className="bg-red-500/20 text-red-400 border-none font-mono text-[10px]">-92% in 36mo</Badge>
                                    </div>
                                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Cost per 1M Input Tokens</p>
                                </div>

                                <div className="space-y-12 relative">
                                    <div className="absolute left-0 top-2 bottom-2 w-px bg-white/5" />
                                    
                                    {[
                                        { date: "Mar 2023", model: "GPT-4 (8K)", price: "$30.00", width: "100%", color: "bg-slate-700", note: "Frontier Launch" },
                                        { date: "May 2024", model: "GPT-4o", price: "$5.00", width: "16.7%", color: "bg-emerald-600", note: "83% Cheaper" },
                                        { date: "2026", model: "Gemini 2.5 Flash", price: "$0.075", width: "2%", color: "bg-cyan-400", note: "400x Reduction" }
                                    ].map((item, i) => (
                                        <div key={i} className="pl-6 relative">
                                            <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-slate-900 border border-white/20" />
                                            <div className="flex justify-between items-baseline mb-2">
                                                <span className="text-[10px] font-black text-slate-500 font-mono uppercase tracking-widest">{item.date}</span>
                                                <span className="text-xs font-bold text-white">{item.model}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={cn("text-2xl font-black font-mono tracking-tighter", i === 0 ? "text-slate-500" : i === 1 ? "text-emerald-500" : "text-cyan-400")}>{item.price}</span>
                                                <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div className={cn("h-full rounded-full transition-all duration-1000", item.color)} style={{ width: item.width }} />
                                                </div>
                                            </div>
                                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1 italic">{item.note}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-900/30 border border-dashed border-white/10 rounded-3xl space-y-6">
                        <div className="flex items-center gap-3 text-emerald-400">
                            <Activity className="w-5 h-5" />
                            <h4 className="text-lg font-black uppercase tracking-tight">Wright's Law in AI Inference</h4>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Every time cumulative production doubles, costs fall by a predictable percentage. For AI inference, we see a <strong>40-50% cost reduction per year</strong>. The implication: never lock in architecture assumptions. A $500/mo workflow today will cost $50/mo in 18 months.
                        </p>
                        <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-400 leading-relaxed italic">
                                <strong className="text-white uppercase tracking-widest text-[10px] block mb-1">Architectural Risk:</strong> The biggest mistake is hard-coding model names. Always abstract your model layer behind a config variable so you can swap GPT-5 for Gemini Flash in a single line.
                            </p>
                        </div>
                    </div>

                    <div className="relative aspect-video w-full overflow-hidden rounded-[32px] border border-white/10 shadow-2xl">
                        <Image 
                            src="/images/Deflationary Intelligence.png" 
                            alt="The Era of Deflationary Intelligence: The 90% Cost Crash" 
                            fill
                            className="object-cover"
                        />
                    </div>
                </section>

                {/* LESSON 3.2: FLASH VS FRONTIER */}
                <section id="lesson-2" className="space-y-16 scroll-mt-32">
                    <div className="space-y-4 text-right">
                        <div className="flex items-center gap-4 justify-end">
                            <div className="h-px flex-1 bg-white/5" />
                            <span className="text-6xl font-black text-slate-800/50 font-serif">3.2</span>
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tight">Flash vs. Frontier</h2>
                        <p className="text-xl text-slate-400 font-medium max-w-2xl ml-auto italic">"Flash models have solved the cost problem for 80% of use cases. The skill is knowing when you need the $15/1M reasoning."</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-8 bg-slate-900/50 border-emerald-500/20 space-y-6 group hover:border-emerald-500/40 transition-all">
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                    <Zap className="w-4 h-4" /> Flash Tier
                                </h4>
                                <span className="text-2xl font-black text-white font-mono tracking-tighter">$0.10</span>
                            </div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest -mt-4">Avg Output / 1M tokens · 2026</p>
                            
                            <div className="space-y-3 border-y border-white/5 py-6">
                                <div className="flex justify-between text-xs font-bold"><span className="text-slate-500 uppercase tracking-tight">Latency</span><span className="text-emerald-400">&lt; 300ms</span></div>
                                <div className="flex justify-between text-xs font-bold"><span className="text-slate-500 uppercase tracking-tight">Context</span><span className="text-white">1M – 2M</span></div>
                                <div className="flex justify-between text-xs font-bold"><span className="text-slate-500 uppercase tracking-tight">Throughput</span><span className="text-white">Very High</span></div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {['Classification', 'Summarization', 'Extraction', 'Translation', 'Routing'].map(tag => (
                                    <Badge key={tag} className="bg-emerald-500/10 text-emerald-400 border-none font-black text-[9px] uppercase tracking-tighter">{tag}</Badge>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-8 bg-slate-900/50 border-indigo-500/20 space-y-6 group hover:border-indigo-500/40 transition-all">
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                    <Scale className="w-4 h-4" /> Frontier Tier
                                </h4>
                                <span className="text-2xl font-black text-white font-mono tracking-tighter">$15.00</span>
                            </div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest -mt-4">Avg Output / 1M tokens · 2026</p>
                            
                            <div className="space-y-3 border-y border-white/5 py-6">
                                <div className="flex justify-between text-xs font-bold"><span className="text-slate-500 uppercase tracking-tight">Latency</span><span className="text-indigo-400">500ms – 2s</span></div>
                                <div className="flex justify-between text-xs font-bold"><span className="text-slate-500 uppercase tracking-tight">Context</span><span className="text-white">200K – 1M</span></div>
                                <div className="flex justify-between text-xs font-bold"><span className="text-slate-500 uppercase tracking-tight">Throughput</span><span className="text-white">Moderate</span></div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {['Legal Analysis', 'Code Generation', 'Research', 'Strategy', 'Novel Tasks'].map(tag => (
                                    <Badge key={tag} className="bg-indigo-500/10 text-indigo-400 border-none font-black text-[9px] uppercase tracking-tighter">{tag}</Badge>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <div className="text-center space-y-2">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Decision Engine Exercise</h4>
                            <p className="text-lg text-white font-bold tracking-tight uppercase">Which tier would you deploy?</p>
                        </div>

                        <Card className="bg-black/40 border-white/5 overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
                                {TASK_DATA.map(item => (
                                    <button 
                                        key={item.id}
                                        onClick={() => setActiveTask(item)}
                                        className={cn(
                                            "p-6 text-left transition-all duration-300 group relative",
                                            activeTask?.id === item.id ? "bg-slate-900" : "bg-slate-950 hover:bg-slate-900"
                                        )}
                                    >
                                        {activeTask?.id === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                                        <p className="text-xs font-bold text-slate-400 group-hover:text-slate-200 leading-relaxed mb-4">{item.task}</p>
                                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 group-hover:text-emerald-400 uppercase tracking-widest">
                                            SELECT TASK <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                            
                            <div className="p-8 bg-slate-900/80 border-t border-white/10 min-h-[160px] flex items-center justify-center text-center">
                                {!activeTask ? (
                                    <p className="text-xs font-mono text-slate-600 uppercase tracking-widest animate-pulse">Select a task above to reveal the optimal deployment strategy</p>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-2xl">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center text-xl",
                                                activeTask.tier === 'flash' ? "bg-emerald-500/20 text-emerald-400" : "bg-indigo-500/20 text-indigo-400"
                                            )}>
                                                {activeTask.tier === 'flash' ? <Zap className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
                                            </div>
                                            <div className="text-left">
                                                <h5 className={cn("text-sm font-black uppercase tracking-widest", activeTask.tier === 'flash' ? "text-emerald-400" : "text-indigo-400")}>
                                                    {activeTask.tier === 'flash' ? '⚡ Flash Tier' : '🔬 Frontier Tier'} — {activeTask.model}
                                                </h5>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Deployment Strategy Verified</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed font-medium">{activeTask.reason}</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    <div className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-[32px] space-y-4">
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                            <Milestone className="w-4 h-4" /> Routing Pattern
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                            "Advanced teams use a <strong>model router</strong>: a cheap classifier (Flash) that reads each request and decides which model tier to invoke. This alone can cut costs 40–70% on mixed workloads."
                        </p>
                    </div>
                </section>

                {/* LESSON 3.3: CONTEXT ABUNDANCE */}
                <section id="lesson-3" className="space-y-16 scroll-mt-32">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-6xl font-black text-slate-800/50 font-serif">3.3</span>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tight">Context Abundance</h2>
                        <p className="text-xl text-slate-400 font-medium max-w-2xl italic">"The bottleneck has shifted from 'can I fit this?' to 'can I afford to keep this in memory?'"</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-12">
                            <Card className="bg-slate-900/50 border-white/5 overflow-hidden shadow-2xl">
                                <div className="p-6 border-b border-white/5 flex flex-wrap justify-between items-center gap-4 bg-black/20">
                                    <div className="flex items-center gap-3">
                                        <History className="w-5 h-5 text-emerald-400" />
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Context Window Evolution</h4>
                                    </div>
                                    <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                                        {ERAS.map((era, i) => (
                                            <button 
                                                key={i}
                                                onClick={() => setActiveEra(i)}
                                                className={cn(
                                                    "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded transition-all",
                                                    activeEra === i ? "bg-emerald-500 text-black shadow-lg" : "text-slate-500 hover:text-white"
                                                )}
                                            >
                                                {era.year}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-10 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-16 min-h-[400px]">
                                    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700" key={`era-text-${activeEra}`}>
                                        <div className="space-y-2">
                                            <h5 className="text-3xl font-black text-white uppercase tracking-tighter">{ERAS[activeEra].name}</h5>
                                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono">{ERAS[activeEra].year} ERA STANDARD</p>
                                        </div>
                                        <div className="text-6xl font-black text-white font-mono tracking-tighter tabular-nums">
                                            {ERAS[activeEra].tokens}
                                        </div>
                                        <p className="text-lg text-slate-400 leading-relaxed font-medium">
                                            {ERAS[activeEra].desc}
                                        </p>
                                        <div className="flex gap-12 pt-4 border-t border-white/5">
                                            <div className="space-y-1">
                                                <span className="text-2xl font-black text-emerald-400 font-mono tracking-tighter">{ERAS[activeEra].cost}</span>
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{ERAS[activeEra].costLabel}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-2xl font-black text-white uppercase tracking-tighter font-mono">{ERAS[activeEra].overhead}</span>
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Engineering Overhead</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-right-4 duration-700" key={`era-grid-${activeEra}`}>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Can it fit without RAG?</p>
                                        {ERAS[activeEra].fits.map((f, i) => (
                                            <div key={i} className={cn(
                                                "p-6 rounded-2xl border flex items-center justify-between",
                                                f.type === 'fits' ? "bg-emerald-500/5 border-emerald-500/20" : f.type === 'tight' ? "bg-amber-500/5 border-amber-500/20" : "bg-red-500/5 border-red-500/20"
                                            )}>
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                                                        f.type === 'fits' ? "text-emerald-400 bg-emerald-500/10" : f.type === 'tight' ? "text-amber-400 bg-amber-500/10" : "text-red-400 bg-red-500/10"
                                                    )}>
                                                        {f.type === 'fits' ? '✓' : f.type === 'tight' ? '~' : '✗'}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-300">{f.label}</span>
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest",
                                                    f.type === 'fits' ? "text-emerald-400" : f.type === 'tight' ? "text-amber-400" : "text-red-400"
                                                )}>{f.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h4 className="text-xl font-bold text-white flex items-center gap-3">
                                <Layers className="w-5 h-5 text-emerald-400" />
                                From RAG to "Long Context RAG"
                            </h4>
                            <p className="text-slate-400 leading-relaxed font-medium">
                                RAG was primarily a workaround for small windows. As per-token costs fall, the tradeoff tilts toward sending everything and letting the model handle retrieval internally. This is more accurate but requires <strong>Context Budgeting</strong>.
                            </p>
                        </div>
                        <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[32px] space-y-4">
                            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                <Calculator className="w-4 h-4" /> Practical Pattern
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium italic">
                                "Use a tiered memory strategy: <strong>hot context</strong> (last 5 turns), <strong>warm context</strong> (semantic retrieval), <strong>cold storage</strong> (archived). This gives the feel of infinite memory at a fraction of the cost."
                            </p>
                        </div>
                    </div>
                </section>

                {/* LESSON 3.4: FORECASTING */}
                <section id="lesson-4" className="space-y-16 scroll-mt-32">
                    <div className="space-y-4 text-right">
                        <div className="flex items-center gap-4 justify-end">
                            <div className="h-px flex-1 bg-white/5" />
                            <span className="text-6xl font-black text-slate-800/50 font-serif">3.4</span>
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tight">Forecasting Token Costs</h2>
                        <p className="text-xl text-slate-400 font-medium max-w-2xl ml-auto italic">"Intelligence is deflationary. Here's how to build that assumption into long-term planning."</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-5 space-y-8">
                            <p className="text-lg text-slate-300 leading-relaxed font-medium">
                                Most AI budgets overstate future costs because they assume today's pricing is permanent.
                            </p>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex justify-between">
                                        Current Monthly Cost <span className="text-emerald-400 font-mono tracking-tighter">${baseCost.toLocaleString()}</span>
                                    </label>
                                    <input 
                                        type="range" min="100" max="10000" step="100" value={baseCost}
                                        onChange={(e) => setBaseCost(Number(e.target.value))}
                                        className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex justify-between">
                                        Annual Volume Growth <span className="text-emerald-400 font-mono tracking-tighter">+{growthRate}%</span>
                                    </label>
                                    <input 
                                        type="range" min="0" max="200" step="5" value={growthRate}
                                        onChange={(e) => setGrowthRate(Number(e.target.value))}
                                        className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex justify-between">
                                        Cost Halving Period <span className="text-emerald-400 font-mono tracking-tighter">{halvingPeriod} Months</span>
                                    </label>
                                    <input 
                                        type="range" min="6" max="36" step="3" value={halvingPeriod}
                                        onChange={(e) => setHalvingPeriod(Number(e.target.value))}
                                        className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
                                    />
                                </div>
                            </div>
                            <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 space-y-2">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Projection Assumption</p>
                                <p className="text-xs text-slate-400 leading-relaxed italic">
                                    Assumes {halvingPeriod}-month cost halving · {growthRate}% annual volume growth. Base: ${baseCost.toLocaleString()}/mo today.
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <Card className="p-8 bg-black/40 border-white/10 h-full flex flex-col justify-between space-y-8">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">5-Year Monthly Cost Forecast</h4>
                                <div className="space-y-6">
                                    {forecast.map((f, i) => (
                                        <div key={i} className="space-y-2 group">
                                            <div className="flex justify-between items-baseline text-xs font-bold font-mono">
                                                <span className="text-slate-500 uppercase tracking-tighter">Year {f.yr}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className={cn(
                                                        "text-[9px] uppercase tracking-tighter",
                                                        f.monthly > baseCost ? "text-red-400" : "text-emerald-400"
                                                    )}>
                                                        {f.monthly > baseCost ? `+${Math.round((f.monthly/baseCost - 1)*100)}%` : `-${Math.round((1 - f.monthly/baseCost)*100)}%`}
                                                    </span>
                                                    <span className="text-white text-base tracking-tighter">${Math.round(f.monthly).toLocaleString()}/mo</span>
                                                </div>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className={cn("h-full rounded-full transition-all duration-1000", f.monthly > baseCost ? "bg-red-500/40" : "bg-emerald-500/40")} 
                                                    style={{ width: `${Math.max(5, (f.monthly / maxForecastMonthly) * 100)}%` }} 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[10px] text-slate-500 italic text-center">
                                    "Usage grows faster than costs fall. Budget for usage expansion, not just price decay."
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* MODULE SUMMARY */}
                <section className="pt-32 border-t border-white/5 space-y-16">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                            MODULE 3 COMPLETE
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tight">The Big Picture</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { num: "01", text: "<strong>AI pricing is deflationary</strong> — expect 40–50% cost reduction per year for equivalent quality. Never budget based on today's prices." },
                            { num: "02", text: "<strong>Flash tier solves 80% of tasks</strong> at 150× lower cost. Default to Flash, escalate to Frontier only when demonstrably necessary." },
                            { num: "03", text: "<strong>Context abundance is here</strong> — the problem has shifted from fitting data to budgeting for its persistent memory costs." },
                            { num: "04", text: "<strong>Build model-agnostic</strong> — abstract model names behind config variables to capture price improvements as they ship." },
                            { num: "05", text: "<strong>Routing is high-leverage</strong> — a cheap classifier routing to tiers can cut mixed-workload costs by up to 70%." },
                            { num: "06", text: "<strong>Scope expands with efficiency</strong> — teams that discover cheap AI tend to usage-scale aggressively. Budget for growth." }
                        ].map((item, i) => (
                            <Card key={i} className="p-6 bg-slate-900/50 border-white/5 flex gap-4 items-start">
                                <span className="text-3xl font-black text-slate-800 font-serif leading-none">{item.num}</span>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: item.text }} />
                            </Card>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-8 pt-12">
                        <Button size="lg" className="h-16 px-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-tight gap-3 shadow-2xl shadow-emerald-500/20 group" asChild>
                            <Link href="/tokenomics/module-4">
                                Continue to Module 4
                                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <p className="text-sm text-slate-500 italic max-w-md text-center leading-relaxed">
                            "Ready to move to Module 4: Prompt Engineering for Token Efficiency, where we learn how to get the same results using 50% fewer tokens?"
                        </p>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/5 py-16">
                <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Deflationary Intelligence · AI Economics Course</p>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-[0.2em]">Module 3 · TokenSense Academy</p>
                </div>
            </footer>
        </div>
    );
}
