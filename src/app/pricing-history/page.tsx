import { Metadata } from 'next';
import PricingHistoryClient from "@/components/PricingHistoryClient";
import SiteHeader from "@/components/SiteHeader";
import { setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: "LLM Pricing Tracker | Historical AI Token Cost Trends",
  description: "Track the deflation of intelligence. Monitor historical API price cuts for OpenAI, Anthropic, and Google from 2023 to 2026. View our frontier intelligence cost index.",
  alternates: {
      canonical: '/pricing-history',
  },  openGraph: {
    title: "LLM Pricing Tracker & Historical Index | Tokensense",
    description: "Average cost per 1M tokens has dropped by 65%. See the full timeline of LLM price cuts and model releases.",
    url: 'https://www.tokensense-ai.com/pricing-history',
    type: 'article', // Using 'article' since this is data-heavy/timeline content
    images: [{ url: '/pricing-history-og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "LLM Pricing History & Trends",
    description: "Is AI getting cheaper? Track every major price drop since 2023.",
    images: ['/pricing-history-og.png'],
  },
};

function PricingSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "LLM Pricing History Tracker",
        "description": "Historical tracking of AI model pricing from 2023 to 2026. Monitor intelligence deflation and API price cuts.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web",
        "url": "https://www.tokensense-ai.com/pricing-history",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://www.tokensense-ai.com/pricing-history/#webpage",
        "url": "https://www.tokensense-ai.com/pricing-history",
        "name": "LLM Pricing History Tracker",
        "description": "Historical tracking of AI model pricing from 2023 to 2026, including GPT-4, Claude, and Gemini price cuts.",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.tokensense-ai.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Pricing History"
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much has AI pricing dropped since 2023?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "On average, the cost per 1M tokens for frontier-grade intelligence has dropped by over 90% since early 2023, driven by architectural efficiency and hardware breakthroughs."
            }
          },
          {
            "@type": "Question",
            "name": "What is the 'intelligence deflation' trend?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Intelligence deflation refers to the rapid decrease in the cost of high-level AI reasoning, making advanced LLMs accessible for high-volume automated workflows."
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

export default function PricingHistoryPage() {
  const locale = 'en';
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PricingSchema />
      <SiteHeader />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Hero Section from UI */}
        <section className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-400/10 border border-indigo-400/30 px-3 py-1 rounded-full">
            Historical Price Index
          </span>
          <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl uppercase">
            LLM <span className="text-indigo-500">Pricing</span> Tracker
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            The intelligence deflation is real. Track every major price cut and model release since 2023.
          </p>
        </section>

        <PricingHistoryClient />

        {/* Server-Rendered Capabilities Summary */}
        <section className="mt-20 border-t border-border/40 pt-16 max-w-4xl mx-auto">
            <div className="space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">Tool Capabilities</h2>
                    <p className="text-muted-foreground text-lg">The definitive record of AI infrastructure economics.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">01</div>
                        <h4 className="text-lg font-bold text-white">Historical Price Indexing</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">Track the exact dates and magnitudes of price cuts for GPT-4, Claude, and Gemini. Map your past infrastructure spend against the market average.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold">02</div>
                        <h4 className="text-lg font-bold text-white">Market Trend Forecasting</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">Analyze the rate of 'intelligence deflation' to forecast your 2027-2028 AI budget. Identify the intervals between major model architectural shifts.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">03</div>
                        <h4 className="text-lg font-bold text-white">Competitive Benchmarking</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">See how price leaders like DeepSeek and Meta have forced proprietary providers to slash rates. Understand the hardware cycles driving your API bill.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* SEMANTIC DATA FOR CRAWLERS (Based on 'Economics of LLM Pricing' section) */}
        <div className="sr-only">
          <h2>The Economics of LLM Pricing</h2>
          <p>LLM pricing is driven by hardware efficiency (H100/B200 clusters), architectural breakthroughs (MoE), and fierce market competition.</p>
          
          <h3>Milestone Timeline 2026:</h3>
          <ul>
            <li><strong>March 2026:</strong> Anthropic Claude 4.6 Series launch.</li>
            <li><strong>January 2026:</strong> OpenAI GPT-5.2 Series - Optimized inference reduced input costs.</li>
            <li><strong>October 2025:</strong> DeepSeek V3 - Set a new floor for open-weights performance.</li>
          </ul>

          <h3>Model Tier Price Floors (Per 1M Tokens):</h3>
          <ul>
            <li>Frontier (GPT-5/Opus): $1.75 - $5.00</li>
            <li>Balanced (Sonnet/Pro): $1.25 - $3.00</li>
            <li>Efficient (Flash/Haiku): $0.05 - $0.50</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
