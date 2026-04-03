import SiteHeader from "@/components/SiteHeader";
import PromptCompressionAnalyzer from "@/components/PromptCompressionAnalyzer";
import SocialShareBar from "@/components/SocialShareBar";
import { Sparkles } from "lucide-react";
import { Metadata } from 'next';
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "AI Prompt Compression Tool | Reduce Token Usage & Save Costs",
  description: "Identify token-wasteful patterns and redundancies in your AI prompts. Reduce your token payload by 10-30% without losing instruction quality. Optimize for GPT-5.2, Claude, and Gemini.",
  alternates: {
      canonical: '/tools/compression',
  },  openGraph: {
    title: "AI Prompt Compression Analyzer | Tokensense",
    description: "Cut the fluff, keep the intelligence. Paste your prompt to save on API costs instantly.",
    url: 'https://www.tokensense-ai.com/tools/compression',
    type: 'website',
    images: [{ url: '/compression-og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Prompt Compression & Optimization Tool",
    description: "Stop paying for redundant prompt text. Optimize your token payload today.",
    images: ['/compression-og.png'],
  },
};

function CompressionSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "LLM Prompt Compression Optimizer",
        "description": "Reduce LLM API costs by compressing prompts and stripping unnecessary tokens.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web",
        "url": "https://www.tokensense-ai.com/tools/compression",
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

export default async function PromptCompressionPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <CompressionSchema />
            <SiteHeader />

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                {/* SEMANTIC SEO SHELL: Visible to bots immediately */}
                <section className="sr-only">
                    <h1>LLM Prompt Compression & Optimization Tool</h1>
                    <p>
                        Analyze and optimize your AI prompts for <strong>GPT-4o, Claude 3.5, 
                        and Gemini</strong>. Our compression tool identifies <strong>token-wasteful 
                        patterns</strong>, removes <strong>natural language redundancies</strong>, 
                        and suggests <strong>shorter alternatives</strong> to reduce your API 
                        bill by 10-30%.
                    </p>
                    <ul>
                        <li>Redundancy Detection & Token Reduction</li>
                        <li>Instruction Quality Preservation Analysis</li>
                        <li>Cost-per-call Savings Calculator</li>
                    </ul>
                    <nav>
                        <ul>
                            <li><Link href="/">Token Counter</Link></li>
                            <li><Link href="/workflow">Workflow Optimizer</Link></li>
                        </ul>
                    </nav>
                </section>

                <SocialShareBar variant="top" />

                <div className="space-y-4 mb-10 text-center md:text-left relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2 animate-in fade-in slide-in-from-top-2 duration-700">
                        <Sparkles className="w-3 h-3" />
                        Optimize Your Budget
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
                        Prompt <span className="text-indigo-500">Compression</span> Analyzer
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl border-l-4 border-indigo-500 pl-4">
                        Cut the fluff, keep the intelligence. Paste your prompt to identify token-wasteful patterns, filler phrases, and redundancies. Reduce your token payload by 10-30% without losing instruction quality.
                    </p>
                </div>

                <PromptCompressionAnalyzer />

                <SocialShareBar variant="bottom" />

                {/* Educational Content / SEO Section */}
                <section className="mt-20 border-t border-border/40 pt-16">
                    <div className="max-w-4xl mx-auto space-y-8 text-muted-foreground leading-relaxed">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">The Art of Prompt Compression</h2>
                        <p>
                            Prompt compression is the process of reducing the number of tokens in an LLM request without altering the core instructions or desired output quality. Every token saved directly reduces your API expenditure.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className="space-y-2">
                                <h3 className="font-bold text-white">Remove Politeness & Meta-Talk</h3>
                                <p className="text-sm">LLMs do not require "Please" or "I would like you to." Starting a prompt with "Analyze this" is 11 tokens cheaper than "Could you please take a look at this and analyze it for me?"</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-white">Use Structural Symbols</h3>
                                <p className="text-sm">Replace long descriptive sentences with Markdown or YAML structures. Symbols like "#" or "-" convey hierarchy more efficiently than "The following section is a list of items."</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
