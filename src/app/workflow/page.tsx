import SiteHeader from "@/components/SiteHeader";
import SocialShareBar from "@/components/SocialShareBar";
import MissionSummary from "@/components/MissionSummary";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
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
};

export default function WorkflowSimulatorPage() {
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
