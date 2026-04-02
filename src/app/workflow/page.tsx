import WorkflowSimulator from "@/components/WorkflowSimulator";
import SiteHeader from "@/components/SiteHeader";
import SocialShareBar from "@/components/SocialShareBar";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "AI Workflow Cost Estimator | n8n, Make & Zapier Pricing",
  description: "Compare monthly automation costs between n8n, Make, and Zapier. Estimate LLM token bills for complex agentic workflows and blueprints.",
  alternates: {
    canonical: 'https://www.tokensense-ai.com/workflow',
  },
  openGraph: {
    title: "AI Workflow Cost Estimator | Tokensense",
    description: "Compare platform fees and LLM costs for AI automations.",
    url: 'https://www.tokensense-ai.com/workflow',
    type: 'website',
    images: [{ url: '/workflow-og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "AI Workflow Estimator",
    description: "n8n vs Make vs Zapier AI cost comparison.",
    images: ['/workflow-og.png'],
  },
};

function WorkflowSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "LLM Agentic Workflow Simulator",
        "description": "Simulate and estimate the cost of complex AI agent loops and multi-step workflows.",
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
            "name": "Which is cheaper for AI: n8n, Make, or Zapier?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "For high-volume AI workflows, n8n (especially self-hosted) is typically the cheapest because it charges per execution, not per operation. Make and Zapier can become expensive as each AI step in a workflow counts as a billable unit."
            }
          },
          {
            "@type": "Question",
            "name": "How does n8n count executions for AI agents?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "n8n counts one execution per full workflow run, regardless of how many LLM nodes or tool calls happen inside that run. This makes it ideal for 'agentic loops' where a single prompt might trigger multiple internal steps."
            }
          },
          {
            "@type": "Question",
            "name": "Is Make.com more expensive than Zapier for LLMs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Make.com is often more cost-effective than Zapier at lower volumes due to its modular pricing, but because it charges 'per operation,' complex AI scenarios with multiple modules can burn through quotas quickly."
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

export default function WorkflowSimulatorPage() {
    const tTools = useTranslations("tools");

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
                        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                            Blueprint Model
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                            {tTools("workflow_estimator")}
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            {tTools("workflow_estimator_subtitle")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                <SocialShareBar variant="top" />

                <WorkflowSimulator />

                <p className="mt-8 text-center text-xs text-muted-foreground/50">
                    Estimates are based on publicly available API pricing and typical
                    platform per-operation costs as of March 2026. Actual costs may vary.
                </p>

                <SocialShareBar variant="bottom" />

                {/* HIDDEN SEMANTIC CONTENT FOR CRAWLERS */}
                <div className="sr-only">
                    <h2>Automation Platforms Supported:</h2>
                    <ul>
                        <li>n8n Cloud (Self-hosted & Cloud)</li>
                        <li>Make (formerly Integromat)</li>
                        <li>Zapier (Standard & Professional)</li>
                    </ul>
                    <h3>AI Models Included:</h3>
                    <p>GPT-4o, GPT-4o mini, Claude 3.5 Sonnet, and more.</p>
                </div>

                {/* ──── EXPLAINER: How Workflow Costs Are Calculated ──── */}
                <section className="mt-16 border-t border-border/40 pt-16">
                    {/* ... (keep existing content) ... */}
                </section>

                {/* ──── FAQ SECTION ──── */}
                <section className="mt-16 border-t border-border/40 pt-16">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Workflow FAQ</h2>
                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-foreground">Which is cheaper for AI: n8n, Make, or Zapier?</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    For high-volume AI workflows, n8n (especially self-hosted) is typically the cheapest because it charges per execution, not per operation. Make and Zapier can become expensive as each AI step in a workflow counts as a billable unit.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-foreground">How does n8n count executions for AI agents?</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    n8n counts one execution per full workflow run, regardless of how many LLM nodes or tool calls happen inside that run. This makes it ideal for 'agentic loops' where a single prompt might trigger multiple internal steps.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-foreground">Is Make.com more expensive than Zapier for LLMs?</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Make.com is often more cost-effective than Zapier at lower volumes due to its modular pricing, but because it charges 'per operation,' complex AI scenarios with multiple modules can burn through quotas quickly.
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

        </div>
    );
}
