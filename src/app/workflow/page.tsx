import SiteHeader from "@/components/SiteHeader";
import SocialShareBar from "@/components/SocialShareBar";
import MissionSummary from "@/components/MissionSummary";
import { Link } from "@/lib/i18n/navigation";
import { getTranslations } from "next-intl/server";
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

export default async function WorkflowSimulatorPage() {
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
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 font-mono uppercase tracking-widest">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Phase 05: Post-Flight Analysis
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
                            Final Flight <span className="text-indigo-500">Report</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl font-medium">
                            Mission complete. Review your optimization results and manifest below.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                {/* SEMANTIC SEO SHELL: Visible to bots immediately */}
                <section className="sr-only">
                    <h1>LLM Agent Workflow & Cost Analysis Report</h1>
                    <p>
                        Review your optimized AI agent workflow manifest. This report analyzes the 
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

                {/* ──── RELATED CALCULATORS ──── */}
                <section className="mt-16 border-t border-border/40 pt-16">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h2 className="text-2xl font-black tracking-tight text-white uppercase">Initiate New <span className="text-indigo-500">Trajectory</span></h2>
                        <p className="text-lg text-muted-foreground font-medium">
                            Need to recalculate? Explore other specialized optimization modules.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Token Calculator */}
                            <Link href="/">
                                <div className="bg-card border border-border/40 rounded-2xl p-6 hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer space-y-4 h-full group">
                                    <div className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">⚡</div>
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest">The Hangar</h3>
                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                        Reset your mission and load a fresh payload into the central trajectory engine.
                                    </p>
                                </div>
                            </Link>

                            {/* Context Caching */}
                            <Link href="/caching">
                                <div className="bg-card border border-border/40 rounded-2xl p-6 hover:border-green-500/60 hover:shadow-lg hover:shadow-green-500/20 transition-all cursor-pointer space-y-4 h-full group">
                                    <div className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">💾</div>
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Deep Storage</h3>
                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                        Analyze TTL strategies and break-even points for massive static datasets.
                                    </p>
                                </div>
                            </Link>

                            {/* Model Comparison */}
                            <Link href="/comparison">
                                <div className="bg-card border border-border/40 rounded-2xl p-6 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer space-y-4 h-full group">
                                    <div className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">📊</div>
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Comms Matrix</h3>
                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                        Compare your payload across the entire fleet of available LLM airframes.
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
