import SiteHeader from "@/components/SiteHeader";
import BatchCostPlanner from "@/components/BatchCostPlanner";
import SocialShareBar from "@/components/SocialShareBar";
import { Database } from "lucide-react";
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "LLM Batch Cost Planner | Predict Large-Scale AI API Expenses",
  description: "Estimate total investment for large-scale AI batches. Calculate costs per batch, daily runs, and monthly projections across OpenAI, Google Gemini, and Llama models.",
  alternates: {
      canonical: '/tools/batch',
  },  openGraph: {
    title: "LLM Batch Cost Planner | Tokensense",
    description: "Scale from one prompt to millions. Predict your AI budget for massive data workloads instantly.",
    url: 'https://www.tokensense-ai.com/tools/batch',
    type: 'website',
    images: [{ url: '/batch-og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "AI Batch Processing Cost Calculator",
    description: "Plan your monthly LLM spend for high-volume data runs.",
    images: ['/batch-og.png'],
  },
};

function BatchSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "LLM Batch Cost Planner",
        "description": "Estimate and plan budgets for large-scale LLM API requests and datasets.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web",
        "url": "https://www.tokensense-ai.com/tools/batch",
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
            "name": "What is the OpenAI Batch API discount?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "OpenAI and other providers offer a 50% discount for asynchronous batch requests that are processed within 24 hours, significantly reducing high-volume costs for non-urgent tasks."
            }
          },
          {
            "@type": "Question",
            "name": "How do I estimate costs for 100,000 AI requests?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use our batch planner to input your average prompt size and total row count. We automatically apply current API rates and volume discounts to project total monthly spend across providers."
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

export default async function BatchCostPage() {
    const locale = 'en';
    setRequestLocale(locale);
    
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <BatchSchema />
            <SiteHeader />

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                {/* SEMANTIC SEO SHELL: Visible to bots immediately */}
                <section className="sr-only">
                    <h1>High-Volume LLM Batch API Cost Planner</h1>
                    <p>
                        Scale your AI infrastructure from single prompts to <strong>million-token 
                        batches</strong>. Our planner calculates <strong>daily, weekly, 
                        and monthly LLM spend</strong> for high-volume data processing pipelines using 
                        OpenAI Batch API, Google Gemini, and Anthropic.
                    </p>
                    <ul>
                        <li>Cost Projections for 50k+ Prompt Batches</li>
                        <li>Batch API Discount Analysis (50% Off Strategies)</li>
                        <li>High-Scale Output Token Variance Estimator</li>
                    </ul>
                    <nav>
                        <ul>
                            <li><Link href="/">Main Calculator</Link></li>
                            <li><Link href="/comparison">Price Index</Link></li>
                        </ul>
                    </nav>
                </section>

                <SocialShareBar variant="top" />

                <div className="space-y-4 mb-10 text-center md:text-left relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2 animate-in fade-in slide-in-from-top-2 duration-700">
                        <Database className="w-3 h-3" />
                        Scale Your Workload
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
                        Batch <span className="text-indigo-500">Cost</span> Planner
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl border-l-4 border-indigo-500 pl-4 italic">
                        "I need to run this prompt against 50,000 rows of data."
                        Estimate the total investment for large-scale batches. Calculate cost per batch, daily runs, and monthly projections across all major providers.
                    </p>
                </div>

                <BatchCostPlanner />

                <SocialShareBar variant="bottom" />

                {/* Server-Rendered Capabilities Summary */}
                <section className="mt-20 border-t border-border/40 pt-16 max-w-4xl mx-auto">
                    <div className="space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">Tool Capabilities</h2>
                            <p className="text-muted-foreground text-lg">Industrial-grade forecasting for high-volume data processing.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">01</div>
                                <h4 className="text-lg font-bold text-white">High-Volume Forecasting</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Model the cost of processing 50,000+ rows instantly. Understand how small per-token differences scale into thousands of dollars in infrastructure spend.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold">02</div>
                                <h4 className="text-lg font-bold text-white">Batch API Discounting</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Automatically calculate potential savings using specialized 'Batch' endpoints. Compare standard 24-hour delivery vs. real-time priority pricing.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">03</div>
                                <h4 className="text-lg font-bold text-white">Multi-Tier Spend Projection</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Visualize your daily, weekly, and monthly AI runway. Identify the exact point where switching to a smaller 'Flash' model saves your project from budget exhaustion.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Educational Content / SEO Section */}
                <section className="mt-20 border-t border-border/40 pt-16">
                    <div className="max-w-4xl mx-auto space-y-8 text-muted-foreground leading-relaxed">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Understanding Batch Dynamics</h2>
                        <p>Scaling from one prompt to millions requires different strategies. High-volume processing is often more about latency-cost tradeoffs than raw speed.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className="space-y-2">
                                <h3 className="font-bold text-white">The Batch API Advantage</h3>
                                <p className="text-sm">Many providers like OpenAI offer a "Batch API" which provides a 50% discount on standard token rates. This is ideal for asynchronous tasks like summarizing an entire database where immediate response isn't required.</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-white">Output Variability at Scale</h3>
                                <p className="text-sm">Unlike input tokens, output tokens vary per request. When planning a 100,000 prompt batch, always pad your output token estimate by 20-30% to account for unexpected LLM verbosity and maintain your margins.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
