import SiteHeader from "@/components/SiteHeader";
import BatchCostPlanner from "@/components/BatchCostPlanner";
import SocialShareBar from "@/components/SocialShareBar";
import { Database } from "lucide-react";
import { Metadata } from 'next';

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

export default function BatchCostPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <BatchSchema />
            <SiteHeader />

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
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

                {/* SEMANTIC CONTENT FOR CRAWLERS */}
                <div className="sr-only">
                    <h2>Understanding Batch Dynamics</h2>
                    <p>Scaling from one prompt to millions requires different strategies.</p>
                    <ul>
                        <li><strong>Batch APIs:</strong> Many providers (OpenAI, Anthropic) offer a "Batch API" that provides a ~50% discount if you can wait up to 24 hours for results.</li>
                        <li><strong>Output Variability:</strong> Unlike input tokens, output tokens vary per request. Always pad your output token estimate by 20-30% to account for unexpected verbosity.</li>
                    </ul>
                    <h3>Supported Models for Batching:</h3>
                    <ul>
                        <li>Gemini 1.5 Flash & Flash-Lite</li>
                        <li>Llama 3.3 70B (MSTA/DeepInfra)</li>
                        <li>GPT-5 Mini</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
