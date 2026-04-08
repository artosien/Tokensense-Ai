import SiteHeader from "@/components/SiteHeader";
import { Zap } from "lucide-react";
import ContextCachingCalculator from "@/components/ContextCachingCalculator";
import SocialShareBar from "@/components/SocialShareBar";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from 'next';
import { Link } from "@/lib/i18n/navigation";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "LLM Context Caching Calculator | Anthropic & Gemini Cost Savings",
  description: "Calculate your savings with Prompt Caching. Compare standard vs. cached input costs for Anthropic Claude and Google Gemini. Reduce long-context API bills by up to 90%.",
  alternates: {
      canonical: '/caching',
  },  openGraph: {
    title: "LLM Context Caching Calculator | Tokensense",
    description: "Estimate savings for reused long-context prompts on Anthropic and Google Gemini.",
    url: 'https://www.tokensense-ai.com/caching',
    type: 'website',
    images: [{ url: '/caching-og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Context Caching Cost Calculator",
    description: "Calculate the ROI of prompt caching for your AI agents.",
    images: ['/caching-og.png'],
  },
};

function CachingSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "LLM Context Caching Calculator",
        "description": "Calculate break-even points and savings for LLM context caching on Claude and Gemini.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web",
        "url": "https://www.tokensense-ai.com/caching",
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
            "name": "How much can prompt caching save on API costs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Prompt caching can reduce input token costs by up to 90% for reused content. Anthropic Claude and Google Gemini offer significantly lower rates for 'Cache Read' tokens compared to standard input tokens."
            }
          },
          {
            "@type": "Question",
            "name": "What is the minimum token count for caching?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "For Anthropic Claude 3.5 Sonnet, the minimum threshold to trigger prompt caching is 1,024 tokens. Google Gemini has different requirements based on the model tier and data type."
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

export default async function CachingCalculatorPage() {
    const locale = 'en';
    setRequestLocale(locale);
    const tTools = await getTranslations("tools");

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <CachingSchema />
            <SiteHeader />


            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                {/* SEMANTIC SEO SHELL: Visible to bots immediately */}
                <section className="sr-only">
                    <h1>LLM Prompt & Context Caching Savings Calculator</h1>
                    <p>
                        Calculate the ROI of <strong>Anthropic Prompt Caching</strong> and 
                        <strong> Google Gemini Context Caching</strong>. Our tool helps you 
                        determine the <strong>break-even point</strong> for long-context 
                        reusability, analyzing TTL (Time To Live) and cached vs. non-cached 
                        input token pricing.
                    </p>
                    <ul>
                        <li>Claude 3.5 Sonnet Cache Write vs Cache Read Costs</li>
                        <li>Gemini 1.5 Pro Context Caching TTL Analysis</li>
                        <li>Optimizing RAG Pipelines with Caching</li>
                    </ul>
                    <nav>
                        <ul>
                            <li><Link href="/">Main Token Counter</Link></li>
                            <li><Link href="/workflow">Workflow Simulator</Link></li>
                        </ul>
                    </nav>
                </section>

                <SocialShareBar variant="top" />

                <div className="space-y-4 mb-10 text-center md:text-left relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest mb-2 animate-in fade-in slide-in-from-top-2 duration-700">
                        <Zap className="w-3 h-3" />
                        Up to 90% Cost Reduction
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
                        {tTools("context_caching")}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl border-l-4 border-indigo-500 pl-4">
                        Anthropic and Google offer prompt caching, drastically reducing the cost of long-context inputs if they are reused. Understand your exact savings by splitting your input into static and dynamic context.
                    </p>
                </div>

                <ContextCachingCalculator />

                <SocialShareBar variant="bottom" />

                {/* Server-Rendered Capabilities Summary */}
                <section className="mt-20 border-t border-border/40 pt-16 max-w-4xl mx-auto">
                    <div className="space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">Tool Capabilities</h2>
                            <p className="text-muted-foreground text-lg">Financial modeling for long-context LLM applications.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">01</div>
                                <h4 className="text-lg font-bold text-white">Break-Even ROI Analysis</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Calculate exactly how many times a prompt must be reused before caching becomes profitable. Factor in the initial 'Cache Write' overhead.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold">02</div>
                                <h4 className="text-lg font-bold text-white">Multi-Provider TTL Modeling</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Compare the Time-To-Live (TTL) strategies of Claude vs Gemini. Understand how auto-refreshing TTL impacts your long-term storage costs.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">03</div>
                                <h4 className="text-lg font-bold text-white">Static vs Dynamic Partitioning</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Visualize the optimal split for your system prompts and knowledge bases. Maximize cache hits by isolating static data from user-specific queries.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Educational Content / FAQ Section */}
                <section className="mt-20 border-t border-border/40 pt-16">
                    <div className="max-w-4xl mx-auto space-y-8 text-muted-foreground leading-relaxed">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">How Does Context Caching Save Money?</h2>
                        <p>
                            In traditional LLM calls, you are billed for every token in your input, every single time. With prompt caching, you pay a one-time "Cache Write" fee to store a massive block of static content (like a knowledge base or system prompt). Subsequent calls then pay a significantly lower "Cache Read" fee for that same content.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className="space-y-2">
                                <h3 className="font-bold text-white">Anthropic Caching</h3>
                                <p className="text-sm">Claude 3.5 Sonnet requires a minimum of 1,024 tokens to trigger caching. The cache remains active for 5 minutes, but the TTL is refreshed with every hit.</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-white">Google Gemini Caching</h3>
                                <p className="text-sm">Gemini 1.5 Pro allows for multi-gigabyte context caching with a user-defined TTL. It is ideal for large codebases or hour-long video files.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
