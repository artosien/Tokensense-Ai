import { VideoPlanner } from "@/features/video-planner";
import SiteHeader from "@/components/SiteHeader";
import SocialShareBar from "@/components/SocialShareBar";
import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";

const PAGE_DESCRIPTION = "Estimate AI video generation and processing costs for Sora, Gemini 1.5, Runway Gen-3, Kling, and Seedance. Compare tokenization models and budget your video workflows.";

export const metadata: Metadata = {
  title: "AI Video Cost Planner: Sora, Gemini 1.5, Runway, Kling & Seedance - tokensense",
  description: PAGE_DESCRIPTION,
  keywords: ["AI video cost calculator", "Sora pricing", "Gemini 1.5 Pro video tokens", "Runway Gen-3 cost", "Kling AI video", "Seedance AI price", "video AI tokenization", "AI video budgeting"],
  alternates: {
      canonical: '/video-planner',
  },  openGraph: {
    title: "AI Video Cost Planner: Sora, Gemini 1.5, Runway, Kling & Seedance",
    description: PAGE_DESCRIPTION,
    url: 'https://www.tokensense-ai.com/video-planner',
    siteName: 'Tokensense-Ai',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tokensense-Ai Video Planner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AI Video Cost Planner: Sora, Gemini, Runway & More",
    description: PAGE_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

function VideoPlannerSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "AI Video Cost Planner",
        "description": "Calculate and compare tokens and costs for AI video models like Sora, Gemini, Kling, and Seedance.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web",
        "url": "https://www.tokensense-ai.com/video-planner",
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
            "name": "How does OpenAI Sora tokenize video?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sora uses a 'video patches' approach, decomposing video into smaller spacetime patches that act like tokens. This allows the model to process diverse durations, resolutions, and aspect ratios."
            }
          },
          {
            "@type": "Question",
            "name": "How are video costs calculated in Gemini 1.5 Pro?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Google Gemini 1.5 Pro typically processes video by sampling frames at a specific rate (e.g., 1 frame per second) and charging a fixed number of tokens per second of video, roughly 265 tokens/sec in current versions."
            }
          },
          {
            "@type": "Question",
            "name": "Does resolution affect AI video pricing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. For many models, higher resolutions (like 4K vs 720p) increase the spatial complexity, leading to higher token counts per frame and consequently higher processing costs."
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

export default function VideoPlannerPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <VideoPlannerSchema />
      <SiteHeader />
      
      {/* Hero/Header Section */}
      <div className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-blue-600/10 via-cyan-600/5 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground">
              AI Video{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Cost Planner
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Estimate and compare video generation costs for <strong><a href="https://sora.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Sora</a></strong>, <strong><a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Gemini 1.5</a></strong>, <strong><a href="https://runwayml.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Runway</a></strong>, <strong><a href="https://klingai.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Kling</a></strong>, and <strong><a href="https://seed.bytedance.com/en/seedance" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Seedance</a></strong>.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* SEMANTIC SEO SHELL: Visible to bots immediately */}
        <section className="sr-only">
          <h1>AI Video API Cost & Token Planner</h1>
          <p>
            Estimate and compare costs for state-of-the-art AI video generation models. 
            Our planner supports <strong>OpenAI Sora spacetime patches</strong>, 
            <strong> Google Gemini 1.5 Pro video tokens</strong>, <strong>Runway Gen-3</strong>, 
            <strong> Kling AI</strong>, and <strong>Seedance</strong>. Calculate your 
            multimodal budget based on duration, resolution, and frame rate.
          </p>
          <ul>
            <li>Temporal & Spatial Video Tokenization Analysis</li>
            <li>Cost-per-second Benchmarking for Sora vs Gemini</li>
            <li>Video Resolution Scaling Impact (720p vs 1080p vs 4K)</li>
          </ul>
          <nav>
            <ul>
              <li><Link href="/">Text Token Counter</Link></li>
              <li><Link href="/multimodal">Image Vision Estimator</Link></li>
              <li><Link href="/comparison">LLM Pricing Comparison</Link></li>
            </ul>
          </nav>
        </section>

        <SocialShareBar variant="top" />
        
        <VideoPlanner />

        <SocialShareBar variant="bottom" />

        {/* Static Content / SEO Section */}
        <section className="mt-20 border-t border-border/40 pt-16 max-w-4xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">What is AI Video Tokenization?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  As generative AI expands into video with models like OpenAI’s <strong><a href="https://sora.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Sora</a></strong>, Google’s <strong><a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Gemini 1.5 Pro</a></strong>, <strong><a href="https://runwayml.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Runway Gen-3</a></strong>, <strong><a href="https://klingai.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Kling AI</a></strong>, and ByteDance's <strong><a href="https://seed.bytedance.com/en/seedance" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Seedance</a></strong>, understanding how these models "see" and "bill" video content is becoming critical for developers and creators. Unlike text, where tokens are based on words or characters, video tokenization is multidimensional.
                </p>
                <p>
                  It involves processing temporal (time) and spatial (resolution) data simultaneously. Each model uses its own proprietary method to break down video into manageable "patches" or "frames" for the transformer architecture to process.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">How Models Handle Video</h3>
                <ul className="space-y-4 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">OpenAI Sora:</strong> Uses a "video patches" approach, decomposing videos into smaller spacetime patches that act like tokens.
                  </li>
                  <li>
                    <strong className="text-foreground">Google Gemini 1.5:</strong> Treats video as a series of frames, typically charging a fixed token count per second (e.g., ~265 tokens/sec).
                  </li>
                  <li>
                    <strong className="text-foreground">Runway & Kling:</strong> Often use credit-based systems that translate internally to GPU-hour or per-frame metrics.
                  </li>
                  <li>
                    <strong className="text-foreground">Seedance:</strong> ByteDance's video model architecture optimized for high-fidelity motion consistency across temporal patches.
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">Why Budgeting is Hard</h3>
                <ul className="space-y-4 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Resolution Scaling:</strong> Moving from 720p to 4K quadruples the tokens spatially, not just doubling them.
                  </li>
                  <li>
                    <strong className="text-foreground">Temporal Complexity:</strong> High-motion scenes may require higher sampling rates for consistency.
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-muted/30 rounded-3xl p-8 border border-border/40 space-y-4">
              <h3 className="text-xl font-bold text-foreground text-center">Optimizing Your Video AI Workflow</h3>
              <p className="text-muted-foreground text-center max-w-2xl mx-auto">
                To keep costs low, consider downsampling for initial analysis, using keyframe extraction to reduce token usage, and leveraging context caching for repeated queries.
              </p>
            </div>

            <div className="space-y-8 pt-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground text-center">Video AI Deep Dives</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl border border-border/40 bg-card hover:border-indigo-500/50 transition-colors">
                  <h3 className="font-bold text-white mb-2">Video Tokenization 101</h3>
                  <p className="text-sm text-muted-foreground mb-4">A developer's guide to Sora and Runway Gen-3 pricing philosophies.</p>
                  <Link href="/blog/video-tokenization-101-sora-runway-pricing" className="text-indigo-400 text-sm font-medium hover:underline">Read Article →</Link>
                </div>
                <div className="p-6 rounded-2xl border border-border/40 bg-card hover:border-indigo-500/50 transition-colors">
                  <h3 className="font-bold text-white mb-2">The Math of Sight</h3>
                  <p className="text-sm text-muted-foreground mb-4">Explore the mechanics of how AI models turn pixels into tokens.</p>
                  <Link href="/blog/math-of-sight-ai-vision-tokens" className="text-indigo-400 text-sm font-medium hover:underline">Read Article →</Link>
                </div>
                <div className="p-6 rounded-2xl border border-border/40 bg-card hover:border-indigo-500/50 transition-colors">
                  <h3 className="font-bold text-white mb-2">The 1 FPS Magic Number</h3>
                  <p className="text-sm text-muted-foreground mb-4">Learn why 1 FPS is the optimal frame rate for most AI video tasks.</p>
                  <Link href="/blog/why-1-fps-magic-number-video-ai" className="text-indigo-400 text-sm font-medium hover:underline">Read Article →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
