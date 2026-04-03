import { Metadata } from 'next';
import SiteHeader from "@/components/SiteHeader";
import ContextWindowVisualizer from "@/components/ContextWindowVisualizer";
import { Link } from "@/lib/i18n/navigation";

export const metadata: Metadata = {
  title: "LLM Context Window Visualizer | RAG & Agent Token Manager",
  description: "Visualize how system instructions and long-term history compete for space in an LLM's context window. Perfect for RAG developers and agent builders optimizing GPT-5.2 and Claude 3.5 limits.",
  alternates: {
      canonical: '/tools/context',
  },  openGraph: {
    title: "Context Window Visualizer | Tokensense-Ai",
    description: "Don't hit the wall. Visualize your AI model's finite memory and capacity in real-time.",
    url: 'https://www.tokensense-ai.com/tools/context',
    type: 'website',
    images: [{ url: '/context-og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "AI Context Capacity Visualizer",
    description: "Real-time visualization of LLM context window utilization.",
    images: ['/context-og.png'],
  },
};

function ContextSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "LLM Context Window Visualizer",
        "description": "Visualize LLM context window limits and token competition for GPT-5, Claude, and Gemini.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web",
        "url": "https://www.tokensense-ai.com/tools/context",
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

export default function ContextVisualizerPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ContextSchema />
      <SiteHeader />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* SEMANTIC SEO SHELL: Visible to bots immediately */}
        <section className="sr-only">
            <h1>LLM Context Window Visualization Tool</h1>
            <p>
                Manage <strong>token competition</strong> within Large Language Model 
                context windows. Our visualizer analyzes <strong>GPT-4o (128k)</strong>, 
                <strong> Claude 3.5 (200k)</strong>, and <strong>Gemini 1.5 Pro (2M)</strong> 
                memory utilization for RAG pipelines and AI agents.
            </p>
            <ul>
                <li>Visualizing System Prompt vs History Overhead</li>
                <li>Real-time Capacity Alerts for Context Overflow</li>
                <li>Optimization for Large-Context Window Models</li>
            </ul>
            <nav>
                <ul>
                    <li><Link href="/">Main Token Calculator</Link></li>
                    <li><Link href="/workflow">Workflow Simulator</Link></li>
                </ul>
            </nav>
        </section>

        {/* Semantic H1 and Description from your UI */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-black text-white sm:text-6xl uppercase tracking-tight">
            Context <span className="text-indigo-400">Window</span> Visualizer
          </h1>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto text-lg">
            Don't hit the wall. Visualize how system instructions, long-term history, and user messages compete for space within the model's finite memory.
          </p>
        </section>

        <ContextWindowVisualizer />

        {/* Educational Content / SEO Section */}
        <section className="mt-20 border-t border-border/40 pt-16">
            <div className="max-w-4xl mx-auto space-y-8 text-muted-foreground leading-relaxed">
                <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Optimizing Context Window Utilization</h2>
                <p>
                    As context windows expand, managing the "inner" token economy becomes a primary challenge for AI engineers. Every token allocated to a system instruction is one less token available for the model's actual reasoning or retrieval-augmented generation (RAG) context.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-2">
                        <h3 className="font-bold text-white">Preventing "Lost in the Middle"</h3>
                        <p className="text-sm">Large context windows like Gemini's 2M tokens are powerful, but models can lose track of details buried in the middle of long prompts. Visualizing your density helps you place critical data at the "Head" or "Tail" for better recall.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-white">Budgeting for Agentic Loops</h3>
                        <p className="text-sm">Autonomous agents build context with every turn. Tracking the growth of your window in real-time allows you to implement sliding-window or summary-based pruning before hitting the API limits.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
