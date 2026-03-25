import SiteHeader from "@/components/SiteHeader";
import MultimodalEstimator from "@/components/MultimodalEstimator";
import SocialShareBar from "@/components/SocialShareBar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Vision Cost Estimator | GPT-4o & Claude Image Token Calculator",
  description: "Calculate image token costs based on pixel scaling, resolution, and tile counts for GPT-4o, Claude 3.5, and Gemini. 100% private and local processing.",
  alternates: {
    canonical: 'https://www.tokensense-ai.com/multimodal',
  },
  openGraph: {
    title: "AI Vision Cost Estimator | Tokensense",
    description: "Analyze image tokenization and costs for GPT-4o and Claude.",
    url: 'https://www.tokensense-ai.com/multimodal',
    type: 'website',
    images: [{ url: '/vision-og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "AI Vision Cost Estimator",
    description: "Calculate image API costs accurately.",
    images: ['/vision-og.png'],
  },
};

export const dynamic = 'force-static';

function MultimodalSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "LLM Vision & Multimodal Token Estimator",
        "description": "Calculate image token costs for GPT-4o, Claude 3.5 Sonnet, and Gemini Vision APIs.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web",
        "url": "https://www.tokensense-ai.com/multimodal",
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

export default function MultimodalPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <MultimodalSchema />
            <SiteHeader />

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <SocialShareBar variant="top" />

                {/* HERO SECTION */}
                <div className="text-center mb-12">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/30 px-3 py-1 rounded-full animate-pulse">
                        Private & Local Processing
                    </span>
                    <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl uppercase tracking-tight">
                        Multimodal <span className="text-blue-500">Vision</span> Estimator
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto border-l-4 border-blue-500 pl-4 text-left md:text-center">
                        Image token costs are calculated based on pixel scaling, not file size. 
                        Every model resizes and tiles images differently. Compare OpenAI, Anthropic, and Google vision costs side-by-side.
                    </p>
                </div>

                <MultimodalEstimator />

                <SocialShareBar variant="bottom" />

                {/* FAQ SECTION */}
                <section className="mt-20 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">
                        Vision <span className="text-blue-500">Insights</span>
                    </h2>
                    <div className="bg-card/50 border border-border/40 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-blue-400">
                                    Why does image size affect token cost more than file size?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    LLM providers like OpenAI and Anthropic charge based on pixel dimensions and tiling. A small-sized but high-resolution PNG can cost significantly more tokens than a large, low-resolution JPEG because the model "sees" the pixels, not the compressed file bytes.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-blue-400">
                                    What is the difference between high detail and low detail mode?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Low detail mode uses a flat token cost for the entire image regardless of size. High detail mode analyzes the image resolution and breaks it into 512px tiles, charging per tile. This allows the model to see fine details like text or small objects.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-blue-400">
                                    How are Gemini vision costs calculated?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Google Gemini handles images differently by using a fixed number of tokens for most images (typically 258 or 768 tokens depending on the specific model version), making it highly cost-predictable for high-resolution processing.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </section>

                {/* SEMANTIC DATA FOR CRAWLERS */}
                <div className="sr-only">
                    <h3>Vision Parameters supported:</h3>
                    <ul>
                        <li>Model Selection (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro)</li>
                        <li>Detail Level (High vs Low)</li>
                        <li>Tokenization Breakdown (Effective resolution, Tile Count)</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
