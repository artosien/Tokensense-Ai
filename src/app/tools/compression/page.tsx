import SiteHeader from "@/components/SiteHeader";
import PromptCompressionAnalyzer from "@/components/PromptCompressionAnalyzer";
import SocialShareBar from "@/components/SocialShareBar";
import { Sparkles } from "lucide-react";
import { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "AI Prompt Compression Tool | Reduce Token Usage & Save Costs",
  description: "Identify token-wasteful patterns and redundancies in your AI prompts. Reduce your token payload by 10-30% without losing instruction quality. Optimize for GPT-5.2, Claude, and Gemini.",
  alternates: {
    canonical: 'https://www.tokensense-ai.com/tools/compression',
  },
  openGraph: {
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

export default function PromptCompressionPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <CompressionSchema />
            <SiteHeader />

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
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

                {/* SEMANTIC CONTENT FOR CRAWLERS */}
                <div className="sr-only">
                    <h2>The Art of Prompt Compression</h2>
                    <ul>
                        <li><strong>Remove Fluff:</strong> Strip away phrases like "I'm looking for" or "It would be great if."</li>
                        <li><strong>Structure Data:</strong> Use symbols like "#" for headers or "-" for lists instead of full sentences.</li>
                        <li><strong>Direct Action:</strong> Start prompts with strong verbs like "Analyze," "Rewrite," or "Extract."</li>
                    </ul>
                    <p>Pro Tip: LLMs don't need excessive politeness. "Write a summary" costs only 3 tokens compared to 14 tokens for polite meta-talk.</p>
                </div>
            </main>
        </div>
    );
}
