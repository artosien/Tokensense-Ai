import ModelComparisonTable from "@/components/ModelComparisonTable";
import SiteHeader from "@/components/SiteHeader";
import SocialShareBar from "@/components/SocialShareBar";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "LLM Model Pricing Comparison | GPT-4o vs Claude 3.5 vs Gemini",
  description: "Side-by-side cost comparison of top AI models. Analyze input/output token pricing and find the most cost-effective LLM for your scale.",
  alternates: {
    canonical: 'https://www.tokensense-ai.com/comparison',
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

export default function ComparisonPage() {
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
                                Comparison
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
                <SocialShareBar variant="top" />

                <ModelComparisonTable />

                {/* Disclaimer */}
                <p className="mt-8 text-center text-xs text-muted-foreground/50">
                    Prices are based on publicly available API pricing as of March 2026.
                    Actual costs may vary. Always verify with the provider before
                    production use.
                </p>

                <SocialShareBar variant="bottom" />

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
            </main>

        </div>
    );
}
