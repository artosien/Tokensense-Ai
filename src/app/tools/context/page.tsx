import { Metadata } from 'next';
import SiteHeader from "@/components/SiteHeader";
import ContextWindowVisualizer from "@/components/ContextWindowVisualizer";

export const metadata: Metadata = {
  title: "LLM Context Window Visualizer | RAG & Agent Token Manager",
  description: "Visualize how system instructions and long-term history compete for space in an LLM's context window. Perfect for RAG developers and agent builders optimizing GPT-5.2 and Claude 3.5 limits.",
  alternates: {
    canonical: 'https://www.tokensense-ai.com/tools/context',
  },
  openGraph: {
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

      <main className="flex-1">
        {/* Semantic H1 and Description from your UI */}
        <section className="text-center mb-12 py-12 px-4">
          <h1 className="text-4xl font-black text-white sm:text-6xl uppercase tracking-tight">
            Context <span className="text-indigo-400">Window</span> Visualizer
          </h1>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto text-lg">
            Don't hit the wall. Visualize how system instructions, long-term history, and user messages compete for space within the model's finite memory.
          </p>
        </section>

        <ContextWindowVisualizer />

        {/* SEMANTIC CONTENT FOR CRAWLERS */}
        <div className="sr-only">
          <h2>Optimizing Context Window Utilization</h2>
          <p>Perfect for RAG developers and agent builders who need to balance prompt complexity with remaining capacity.</p>
          <ul>
            <li><strong>Live Visualization:</strong> Track real-time token counts against model limits (e.g., 400k for GPT-5.2).</li>
            <li><strong>Resource Breakdown:</strong> See exactly what percentage of the window is used by system prompts vs. user input.</li>
            <li><strong>Capacity Alerts:</strong> Visual indicators show "Capacity Left" to prevent API overflow errors.</li>
          </ul>
          <h3>Supported Target Environments:</h3>
          <p>Analyze context windows for GPT-5.2 (400k), Claude 3.5 (200k), and Gemini 1.5 Pro (2M).</p>
        </div>
      </main>
    </div>
  );
}
