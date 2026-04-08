import React from "react";
import SiteHeader from "@/components/SiteHeader";
import SocialShareBar from "@/components/SocialShareBar";
import MissionSummary from "@/components/MissionSummary";
import { Link } from "@/lib/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Mission Flight Report | TokenSense AI Workflow Summary",
  description: "Final optimization report for your LLM payload. Review cost savings, token allocation, and export your flight manifest for production.",
  alternates: {
    canonical: '/workflow',
  },
  openGraph: {
    title: "Mission Flight Report | Tokensense",
    description: "Final optimization summary for your AI mission.",
    url: 'https://www.tokensense-ai.com/workflow',
    type: 'website',
    images: [{ url: '/workflow-og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Mission Flight Report",
    description: "Final optimization summary for your AI mission.",
    images: ['/workflow-og.png'],
  },
};

function WorkflowSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "AI Agent Workflow Optimizer",
        "description": "Simulator for multi-turn AI agent costs. Forecast token compounding and recursive pricing for complex LLM workflows.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web",
        "url": "https://www.tokensense-ai.com/workflow",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is token compounding in AI workflows?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Token compounding occurs in multi-turn conversations where each subsequent turn includes the entire history of previous turns, leading to exponential growth in context and cost."
            }
          },
          {
            "@type": "Question",
            "name": "How does the workflow simulator calculate costs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The simulator models a multi-turn agent loop, factoring in system prompts, tool call overhead, and growing conversation history to provide an accurate estimate of total session cost."
            }
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function WorkflowSimulatorPage() {
    const locale = 'en';
    setRequestLocale(locale);
    
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <WorkflowSchema />
            <SiteHeader />

            {/* Hero Section */}
            <div className="relative overflow-hidden border-b border-border/40">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-purple-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl" />
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 font-mono uppercase tracking-widest">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Step 5: Analysis Complete
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
                            Cost Optimization <span className="text-indigo-500">Report</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl font-medium">
                            Here&apos;s a summary of your optimization run, including cost savings achieved and your final model configuration.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                {/* Progress Indicator */}
                <div className="mb-12 flex items-center justify-between max-w-3xl mx-auto">
                    {[
                        { step: 1, label: "Input", active: true },
                        { step: 2, label: "Context", active: true },
                        { step: 3, label: "Model", active: true },
                        { step: 4, label: "Simulator", active: true },
                        { step: 5, label: "Report", active: true },
                    ].map((s, i) => (
                        <React.Fragment key={s.step}>
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 ${s.active ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-border text-muted-foreground'}`}>
                                    {s.step}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${s.active ? 'text-indigo-400' : 'text-muted-foreground'}`}>{s.label}</span>
                            </div>
                            {i < 4 && <div className={`h-0.5 flex-1 mx-2 mb-6 ${s.active ? 'bg-indigo-600' : 'bg-border'}`} />}
                        </React.Fragment>
                    ))}
                </div>

                {/* SEMANTIC SEO SHELL: Visible to bots immediately */}
                <section className="sr-only">
                    <h1>LLM Agent Workflow & Cost Analysis Report</h1>
                    <p>
                        Review your optimized AI agent workflow results. This report analyzes the 
                        <strong> multi-turn token usage</strong>, <strong>recursive cost compounding</strong>, 
                        and <strong>payload optimization strategies</strong> for your specific AI mission.
                    </p>
                    <ul>
                        <li>Turn-by-turn Token Allocation Breakdown</li>
                        <li>Estimated Total Mission Cost across GPT-4o and Claude 3.5</li>
                        <li>Optimization Recommendations for Long-running Agent Loops</li>
                    </ul>
                    <nav>
                        <ul>
                            <li><Link href="/">Reset to Main Calculator</Link></li>
                            <li><Link href="/comparison">Compare Model Prices</Link></li>
                        </ul>
                    </nav>
                </section>

                <SocialShareBar variant="top" />

                <MissionSummary />

                <SocialShareBar variant="bottom" />

                {/* Server-Rendered Capabilities Summary */}
                <section className="mt-20 border-t border-border/40 pt-16 max-w-4xl mx-auto">
                    <div className="space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">Tool Capabilities</h2>
                            <p className="text-muted-foreground text-lg">Advanced simulation for agentic AI architectures.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">01</div>
                                <h4 className="text-lg font-bold text-white">Multi-Turn Cost Modeling</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Forecast the total budget for long-running agent loops. We simulate the cumulative cost of history as it grows turn-by-turn.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold">02</div>
                                <h4 className="text-lg font-bold text-white">Recursive Token Analysis</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Visualize how your system prompt and tool definitions impact every turn. Identify "token leaks" in your agentic logic before deploying.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">03</div>
                                <h4 className="text-lg font-bold text-white">Payload Optimization</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Get automated advice on summarization intervals and context pruning to maintain high performance at the lowest possible cost.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ──── RELATED CALCULATORS ──── */}
                <section className="mt-16 border-t border-border/40 pt-16">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h2 className="text-2xl font-black tracking-tight text-white uppercase">Start New <span className="text-indigo-500">Optimization</span></h2>
                        <p className="text-lg text-muted-foreground font-medium">
                            Need to recalculate? Explore other specialized optimization modules.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Token Calculator */}
                            <Link href="/">
                                <div className="bg-card border border-border/40 rounded-2xl p-6 hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer space-y-4 h-full group">
                                    <div className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">⚡</div>
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Main Calculator</h3>
                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                        Reset your parameters and load a fresh payload into the cost engine.
                                    </p>
                                </div>
                            </Link>

                            {/* Context Caching */}
                            <Link href="/caching">
                                <div className="bg-card border border-border/40 rounded-2xl p-6 hover:border-green-500/60 hover:shadow-lg hover:shadow-green-500/20 transition-all cursor-pointer space-y-4 h-full group">
                                    <div className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">💾</div>
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Context Caching</h3>
                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                        Analyze TTL strategies and break-even points for massive static datasets.
                                    </p>
                                </div>
                            </Link>

                            {/* Model Comparison */}
                            <Link href="/comparison">
                                <div className="bg-card border border-border/40 rounded-2xl p-6 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer space-y-4 h-full group">
                                    <div className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">📊</div>
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Model Comparison</h3>
                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                        Compare your payload across the entire fleet of available LLM models.
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
