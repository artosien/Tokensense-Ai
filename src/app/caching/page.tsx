import SiteHeader from "@/components/SiteHeader";
import { Zap } from "lucide-react";
import ContextCachingCalculator from "@/components/ContextCachingCalculator";
import SocialShareBar from "@/components/SocialShareBar";
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "LLM Context Caching Calculator | Anthropic & Gemini Cost Savings",
  description: "Calculate your savings with Prompt Caching. Compare standard vs. cached input costs for Anthropic Claude and Google Gemini. Reduce long-context API bills by up to 90%.",
  alternates: {
    canonical: 'https://www.tokensense-ai.com/caching',
  },
  openGraph: {
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

export default function CachingCalculatorPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <CachingSchema />
            <SiteHeader />


            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <SocialShareBar variant="top" />

                <div className="space-y-4 mb-10 text-center md:text-left relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest mb-2 animate-in fade-in slide-in-from-top-2 duration-700">
                        <Zap className="w-3 h-3" />
                        Up to 90% Cost Reduction
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
                        Context <span className="text-indigo-500">Caching</span> Calculator
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl border-l-4 border-indigo-500 pl-4">
                        Anthropic and Google offer prompt caching, drastically reducing the cost of long-context inputs if they are reused. Understand your exact savings by splitting your input into static and dynamic context.
                    </p>
                </div>

                <ContextCachingCalculator />

                <SocialShareBar variant="bottom" />

                {/* HIDDEN SEMANTIC CONTENT FOR GOOGLE */}
                <div className="sr-only">
                    <h2>Caching Intelligence: Frequently Asked Questions</h2>
                    <ul>
                        <li>How long does a cached prompt stay cached before it expires?</li>
                        <li>Does context caching work for image inputs, or just text?</li>
                        <li>Is there a minimum token threshold to qualify for cache pricing?</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
