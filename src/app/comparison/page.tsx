import ModelComparisonTable from "@/components/ModelComparisonTable";
import SiteHeader from "@/components/SiteHeader";
import SocialShareBar from "@/components/SocialShareBar";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "LLM Model Pricing Comparison | GPT-4o vs Claude 3.5 vs Gemini",
  description: "Side-by-side cost comparison of top AI models. Analyze input/output token pricing and find the most cost-effective LLM for your scale.",
  alternates: {
    canonical: '/comparison',
  },
  openGraph: {
    title: "LLM Price Comparison Tool | Tokensense",
    description: "Real-time pricing data for OpenAI, Anthropic, and Google models.",
    url: 'https://www.tokensense-ai.com/comparison',
    type: 'website',
    images: [{ url: '/comparison-og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "LLM Pricing Comparison",
    description: "Find the cheapest LLM for your project.",
    images: ['/comparison-og.png'],
  },
};

function ComparisonSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "LLM Model Pricing Comparison Tool",
        "description": "Compare token pricing and features across GPT-4, Claude 3.5, Gemini 1.5, and more.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web",
        "url": "https://www.tokensense-ai.com/comparison",
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
            "name": "Which is cheaper: GPT-4o or Claude 3.5 Sonnet?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "As of early 2026, Claude 3.5 Sonnet is often more cost-effective for large-scale production, particularly when factoring in output token costs. However, GPT-4o offers competitive input token pricing and high rate limits."
            }
          },
          {
            "@type": "Question",
            "name": "Does Gemini 1.5 Pro offer the best value for long context?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Gemini 1.5 Pro's 2M context window and free tier options for developers make it the top choice for long-document analysis, though its 'cost per token' on the paid tier is comparable to Claude 3.5 Opus."
            }
          },
          {
            "@type": "Question",
            "name": "Which LLM has the lowest output token price?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "For the lowest possible output cost, 'Flash' or 'Mini' models like GPT-4o mini, Gemini 1.5 Flash, and Claude 3.5 Haiku are the industry leaders, often priced at a fraction of a cent per 1M tokens."
            }
          },
          {
            "@type": "Question",
            "name": "How often is AI pricing updated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We track and update model pricing weekly to ensure accuracy. Our comparison tool reflects the latest 2026 API price drops for OpenAI, Anthropic, Google, and DeepSeek."
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

export default async function ComparisonPage() {
    const locale = 'en';
    setRequestLocale(locale);
    const tCompare = await getTranslations("compare");

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <ComparisonSchema />
            <SiteHeader />


            {/* Hero Section */}
            <div className="relative overflow-hidden border-b border-border/40">
                {/* Background glow */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-indigo-600/10 via-purple-600/5 to-transparent rounded-full blur-3xl" />
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="space-y-4 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400 shadow-lg shadow-emerald-500/10 animate-in fade-in slide-in-from-top-4 duration-700">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            Live Pricing Verified: March 2026
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground">
                            LLM Pricing{" "}
                            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                {tCompare("title").split(" ").pop()}
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            The ultimate <strong>Model Comparison 2026</strong> tool. Compare real-time token pricing across every major provider.
                            Pick your volume, select your models, and instantly see which
                            gives you the best bang for your token.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                {/* SEMANTIC SEO SHELL: Visible to bots immediately */}
                <section className="sr-only">
                    <h1>LLM API Price Comparison Tool 2026</h1>
                    <p>
                        Comprehensive real-time comparison of API token pricing for Large Language Models. 
                        We track <strong>OpenAI GPT-4o, GPT-5, Anthropic Claude 3.5 Sonnet, 
                        Google Gemini 1.5 Pro, Meta Llama 3</strong> and more. Use our tool to find the 
                        best price-to-performance ratio for your AI application scale.
                    </p>
                    <ul>
                        <li>Compare Input Token vs Output Token Costs</li>
                        <li>Analyze Model Performance Tiers</li>
                        <li>Find the Cheapest High-Reasoning LLMs</li>
                    </ul>
                    <nav>
                        <ul>
                            <li><Link href="/">Main Calculator</Link></li>
                            <li><Link href="/workflow">Workflow Simulator</Link></li>
                        </ul>
                    </nav>
                </section>

                <SocialShareBar variant="top" />

                <ModelComparisonTable />

                {/* Disclaimer */}
                <p className="mt-8 text-center text-xs text-muted-foreground/50">
                    Prices are based on publicly available API pricing as of March 2026.
                    Actual costs may vary. Always verify with the provider before
                    production use.
                </p>

                <SocialShareBar variant="bottom" />

                {/* Server-Rendered Capabilities Summary */}
                <section className="mt-20 border-t border-border/40 pt-16 max-w-4xl mx-auto">
                    <div className="space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">Tool Capabilities</h2>
                            <p className="text-muted-foreground text-lg">Detailed benchmarking for LLM infrastructure decision-making.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">01</div>
                                <h4 className="text-lg font-bold text-white">Multi-Provider Benchmarking</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Side-by-side comparison of input and output costs for OpenAI, Anthropic, Google, and Meta. No more jumping between documentation pages.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold">02</div>
                                <h4 className="text-lg font-bold text-white">Performance-to-Price Index</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Identify which models offer the highest reasoning scores per dollar. Optimize your architecture by choosing the right model tier for every task.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">03</div>
                                <h4 className="text-lg font-bold text-white">Live Market Tracking</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Stay updated with the 2026 'token deflation' trend. We track weekly price cuts and model updates across the entire LLM ecosystem automatically.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ACCESSIBILITY TIP / SEO DATA */}
                <div className="sr-only">
                    <h2>Comparing models including:</h2>
                    <ul>
                        <li>Claude 4.6 Sonnet & Opus</li>
                        <li>GPT-5.2 (Flagship) & Pro</li>
                        <li>Gemini 3.1 Pro & Flash</li>
                        <li>DeepSeek V3.2</li>
                        <li>Llama 3.3 70B</li>
                        <li>Grok 4</li>
                    </ul>
                </div>

                {/* ──── FAQ SECTION ──── */}
                <section className="mt-16">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Model Comparison FAQ</h2>
                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Which is cheaper: GPT-4o or Claude 3.5 Sonnet?</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    As of early 2026, Claude 3.5 Sonnet is often more cost-effective for large-scale production, particularly when factoring in output token costs. However, GPT-4o offers competitive input token pricing and high rate limits.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Does Gemini 1.5 Pro offer the best value for long context?</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    Yes, Gemini 1.5 Pro's 2M context window and free tier options for developers make it the top choice for long-document analysis, though its 'cost per token' on the paid tier is comparable to Claude 3.5 Opus.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Which LLM has the lowest output token price?</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    For the lowest possible output cost, 'Flash' or 'Mini' models like GPT-4o mini, Gemini 1.5 Flash, and Claude 3.5 Haiku are the industry leaders, often priced at a fraction of a cent per 1M tokens.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

        </div>
    );
}
