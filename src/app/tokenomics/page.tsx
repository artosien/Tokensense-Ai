import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Coins, 
  Zap, 
  Brain, 
  Scale, 
  ArrowRight, 
  Layers, 
  Database, 
  Code,
  LineChart,
  ShieldCheck,
  TrendingDown,
  Globe,
  Cpu
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { GradientOrbs } from "@/components/GradientOrbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tokenomics Academy | Master AI Economics",
  description: "A structured curriculum to help you master the economics of artificial intelligence and build high-margin AI applications.",
  alternates: {
    canonical: "/tokenomics",
  },
};

export default function TokenomicsPage() {
  const modules = [
    {
      id: "module-1",
      title: "Module 1: The Atomic Unit of AI",
      subtitle: "Foundations of Tokenization",
      description: "Understand how LLMs read text, the difference between words and tokens, and why it matters for your budget.",
      icon: Layers,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      lessons: ["What is a Token?", "Words vs. Tokens", "The 0.75 Rule of Thumb"]
    },
    {
      id: "module-2",
      title: "Module 2: The Asymmetric Bill",
      subtitle: "Input vs. Output Economics",
      description: "Learn why providers charge more for generation than processing, and how to optimize your prompt-to-completion ratio.",
      icon: Zap,
      color: "text-plasma-400",
      bg: "bg-plasma-500/10",
      border: "border-plasma-500/20",
      lessons: ["Context Window Costs", "Sequential Generation Overhead", "KV Cache Pricing", "Multimodal Tokens"]
    },
    {
      id: "module-3",
      title: "Module 3: Context Windows",
      subtitle: "AI Working Memory",
      description: "Master AI memory limits, the invisible cost of large documents, and how to prevent the AI from forgetting critical info.",
      icon: Database,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      lessons: ["Working Memory Explained", "The Compute Cost of Attention", "Lost in the Middle", "Stateless Session Costs"]
    },
    {
      id: "module-4",
      title: "Module 4: Prompt Optimization",
      subtitle: "Machine-Efficient Writing",
      description: "Actionable techniques to instantly slash API bills and reduce latency by changing how you structure prompts.",
      icon: TrendingDown,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      lessons: ["Prompt Compression", "Data Format Efficiency", "Leveraging Prompt Caching"]
    },
    {
      id: "module-5",
      title: "Module 5: Building with LLMs",
      subtitle: "Production Cost Control",
      description: "Master API cost constraints, batch economics, and system architecture trade-offs for production apps.",
      icon: Cpu,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      lessons: ["Cost Guardrails", "Batch Processing (50% Off)", "SaaS Unit Economics", "RAG vs Long Context"]
    },
    {
      id: "module-6",
      title: "Module 6: Model Comparison",
      subtitle: "Ecosystem Navigation",
      description: "Architect systems that route tasks to the most cost-effective AI. Understand proprietary vs open-source trade-offs.",
      icon: Globe,
      color: "text-plasma-400",
      bg: "bg-plasma-500/10",
      border: "border-plasma-500/20",
      lessons: ["The Big Three Ecosystems", "Serverless vs Dedicated GPUs", "The 80/20 Model Routing Rule"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* Hero Section */}
        <section className="relative text-center max-w-4xl mx-auto space-y-6">
          <GradientOrbs />
          <Badge variant="outline" className="px-4 py-1.5 border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-mono text-sm">
            TOKENSENSE ACADEMY
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight uppercase">
            Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-plasma-400">Tokenomics</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            A structured 6-module curriculum to help you master the economics of artificial intelligence and build high-margin AI applications.
          </p>
        </section>

        {/* Learning Path Outline */}
        <section className="space-y-12">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Learning Path Outline</h2>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">6 Modules • 20+ Lessons</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((mod) => (
              <Link key={mod.id} href={`/tokenomics/${mod.id}`} className="group block">
                <Card className={`h-full p-8 bg-card border-border/40 hover:${mod.border} hover:${mod.bg} transition-all duration-300 relative overflow-hidden`}>
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-start justify-between">
                      <div className={`w-14 h-14 rounded-2xl ${mod.bg} flex items-center justify-center ${mod.color}`}>
                        <mod.icon className="w-7 h-7" />
                      </div>
                      <Badge variant="outline" className="border-white/10 text-slate-500 font-mono text-[10px]">
                        {mod.lessons.length} LESSONS
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                        {mod.title}
                      </h3>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        {mod.subtitle}
                      </p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {mod.description}
                    </p>

                    <div className="pt-4 space-y-3">
                      <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">What you'll learn:</p>
                      <ul className="grid grid-cols-1 gap-2">
                        {mod.lessons.slice(0, 3).map((lesson, i) => (
                          <li key={i} className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                            <div className="w-1 h-1 rounded-full bg-indigo-500" />
                            {lesson}
                          </li>
                        ))}
                        {mod.lessons.length > 3 && (
                            <li className="text-[10px] text-slate-600 italic">+ more</li>
                        )}
                      </ul>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Start Module</span>
                      <ArrowRight className="w-4 h-4 text-indigo-400 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Start CTA */}
        <section className="text-center py-12">
          <Button size="lg" className="h-16 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl shadow-2xl shadow-indigo-500/20" asChild>
            <Link href="/tokenomics/module-1">Start The Curriculum</Link>
          </Button>
        </section>
      </main>
      
      <footer className="border-t border-border/40 py-12 bg-card/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Tokensense AI • Build Profitable Intelligence</p>
          <div className="flex justify-center gap-6">
            <Link href="/" className="text-xs text-muted-foreground hover:text-white transition-colors">Home</Link>
            <Link href="/blog" className="text-xs text-muted-foreground hover:text-white transition-colors">Blog</Link>
            <Link href="/workflow" className="text-xs text-muted-foreground hover:text-white transition-colors">Workflow</Link>
            <Link href="/comparison" className="text-xs text-muted-foreground hover:text-white transition-colors">Comparison</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
