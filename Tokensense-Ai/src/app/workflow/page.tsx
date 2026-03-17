import WorkflowSimulator from "@/components/WorkflowSimulator";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";
import { Bot } from "lucide-react";
import TrustMessage from "@/components/TrustMessage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Workflow Cost Estimator | Tokensense-Ai",
    description:
        "Estimate your monthly AI automation costs using the Blueprint Model. Compare Zapier, Make, n8n Cloud, and Self-Hosted pricing across real workflows.",
};

export default function WorkflowPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SiteHeader />

            {/* Hero Section */}
            <div className="relative overflow-hidden border-b border-border/40">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-purple-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl" />
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                            Blueprint Model
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                            Workflow{" "}
                            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                Cost Estimator
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            Pick a real-world AI workflow blueprint, set your volume, and
                            instantly see the monthly cost breakdown — from token bills to
                            platform fees. Compare Zapier, Make, and n8n side by side.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                <WorkflowSimulator />

                <p className="mt-8 text-center text-xs text-muted-foreground/50">
                    Estimates are based on publicly available API pricing and typical
                    platform per-operation costs as of March 2026. Actual costs may vary.
                </p>

                {/* ──── EXPLAINER: How Workflow Costs Are Calculated ──── */}
                <section className="mt-16 border-t border-border/40 pt-16">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">How Workflow Costs Are Calculated</h2>
                        <p className="text-lg text-muted-foreground">
                            Each automation platform bills differently. Understanding how your platform counts executions, operations, or tasks is critical to accurate budgeting.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* n8n */}
                            <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-4">
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                                    n8n
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    n8n Cloud charges per workflow execution. Each time your workflow runs, it costs money. However, self-hosted n8n has zero execution cost — you only pay for your server. If your volume is high (100+ executions/month), self-hosting may become cheaper than Cloud.
                                </p>
                                <p className="text-xs text-muted-foreground/70 italic">
                                    💡 Tip: Free tier includes 2,500 executions/month. Self-hosting eliminates this cost entirely.
                                </p>
                            </div>

                            {/* Make */}
                            <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-4">
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                    Make
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Make charges per operation — meaning each module that runs inside a scenario counts as one billable unit. A 5-step scenario costs 5× more per run than a 1-step one. Complex, multi-module workflows become very expensive at scale, making Make ideal for simple automations but costly for sophisticated workflows.
                                </p>
                                <p className="text-xs text-muted-foreground/70 italic">
                                    💡 Tip: Keep scenarios lean. More steps = exponentially higher costs.
                                </p>
                            </div>

                            {/* Zapier */}
                            <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-4">
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    Zapier
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Zapier charges per task — each action step in a Zap is one task. Multi-step Zaps with filters, formatters, and actions burn through your task quota quickly. Simple 2-step Zaps are cost-efficient; complex ones with many steps are not. Pricing is also the highest per-task among the three.
                                </p>
                                <p className="text-xs text-muted-foreground/70 italic">
                                    💡 Tip: Use Zapier for simple integrations. For complex workflows, consider Make or n8n.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ──── RELATED CALCULATORS ──── */}
                <section className="mt-16 border-t border-border/40 pt-16">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Other Tokensense-Ai Tools</h2>
                        <p className="text-lg text-muted-foreground">
                            Explore our other cost calculators to optimize your AI infrastructure.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Token Calculator */}
                            <Link href="/">
                                <div className="bg-card border border-border/40 rounded-2xl p-6 hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer space-y-4 h-full">
                                    <div className="text-3xl">⚡</div>
                                    <h3 className="text-lg font-bold text-foreground">Token Cost Calculator</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Calculate exact token usage and API costs for individual prompts. Paste your system prompt and user message to get instant cost estimates.
                                    </p>
                                    <div className="pt-4 text-xs font-semibold text-indigo-400 flex items-center gap-1">
                                        Open Calculator →
                                    </div>
                                </div>
                            </Link>

                            {/* Context Caching */}
                            <Link href="/caching">
                                <div className="bg-card border border-border/40 rounded-2xl p-6 hover:border-green-500/60 hover:shadow-lg hover:shadow-green-500/20 transition-all cursor-pointer space-y-4 h-full">
                                    <div className="text-3xl">💾</div>
                                    <h3 className="text-lg font-bold text-foreground">Context Caching</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Analyze when prompt caching becomes cost-effective. See savings across multiple turns and break-even analysis for long-context workflows.
                                    </p>
                                    <div className="pt-4 text-xs font-semibold text-green-400 flex items-center gap-1">
                                        Explore Caching →
                                    </div>
                                </div>
                            </Link>

                            {/* Model Comparison */}
                            <Link href="/comparison">
                                <div className="bg-card border border-border/40 rounded-2xl p-6 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer space-y-4 h-full">
                                    <div className="text-3xl">📊</div>
                                    <h3 className="text-lg font-bold text-foreground">Model Comparison</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Compare pricing, capabilities, and value across 30+ LLM models. Find the best model for your specific use case and budget.
                                    </p>
                                    <div className="pt-4 text-xs font-semibold text-purple-400 flex items-center gap-1">
                                        Compare Models →
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/40 mt-auto bg-muted/20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex items-center justify-center w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm text-white">
                                <Bot className="w-3.5 h-3.5 text-indigo-50" />
                            </div>
                            <p className="text-sm font-medium text-foreground">
                                Token clarity, before every call.
                            </p>
                        </div>
                        <TrustMessage />
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-muted-foreground/60">
                            <p>Tokensense-Ai — Prices are estimates based on public API pricing.</p>
                            <span className="hidden sm:inline">•</span>
                            <p>Built with Next.js, Tailwind CSS, and tiktoken</p>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-muted-foreground/80">
                            <Link href="/multimodal" className="hover:text-indigo-400 transition-colors">Image Estimator</Link>
                            <Link href="/caching" className="hover:text-indigo-400 transition-colors">Context Caching</Link>
                            <Link href="/comparison" className="hover:text-indigo-400 transition-colors">Comparison Table</Link>
                            <Link href="/workflow" className="hover:text-indigo-400 transition-colors">Workflow Estimator</Link>
                            <Link href="/faq" className="hover:text-indigo-400 transition-colors">FAQ</Link>
                            <Link href="/about" className="hover:text-indigo-400 transition-colors">About</Link>
                            <Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact Us</Link>
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground/60">
                            <Link href="/terms" className="hover:text-indigo-400 underline underline-offset-2 transition-colors">
                                Terms of Service
                            </Link>
                            <span>|</span>
                            <Link href="/privacy" className="hover:text-indigo-400 underline underline-offset-2 transition-colors">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
