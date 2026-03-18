import ModelComparisonTable from "@/components/ModelComparisonTable";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Token Cost Comparison Table | Tokensense-Ai",
    description:
        "Compare the real-time token cost of every major LLM provider side by side — OpenAI, Anthropic, Google, DeepSeek, xAI and more. Find the best value model for your workload.",
};

export default function ComparisonPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SiteHeader />

            {/* Hero Section */}
            <div className="relative overflow-hidden border-b border-border/40">
                {/* Background glow */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-indigo-600/10 via-purple-600/5 to-transparent rounded-full blur-3xl" />
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Updated March 2026
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                            Token Cost{" "}
                            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                Comparison Table
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            The ultimate LLM <strong>Model Comparison 2026</strong> tool. Compare real-time token pricing across every major provider.
                            Pick your volume, select your models, and instantly see which
                            gives you the best bang for your token.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                <ModelComparisonTable />

                {/* Disclaimer */}
                <p className="mt-8 text-center text-xs text-muted-foreground/50">
                    Prices are based on publicly available API pricing as of March 2026.
                    Actual costs may vary. Always verify with the provider before
                    production use.
                </p>
            </main>

        </div>
    );
}
