import SiteHeader from "@/components/SiteHeader";
import MultimodalEstimator from "@/components/MultimodalEstimator";
import SocialShareBar from "@/components/SocialShareBar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from 'next';
import { Link } from "@/lib/i18n/navigation";

export const metadata: Metadata = {
  title: "AI Vision Cost Estimator | GPT-4o & Claude Image Token Calculator",
  description: "Calculate image token costs based on pixel scaling, resolution, and tile counts for GPT-4o, Claude 3.5, and Gemini. 100% private and local processing.",
  alternates: {
      canonical: '/multimodal',
  },  openGraph: {
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
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How are image tokens calculated in GPT-4o?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "GPT-4o uses a tiling system where images are resized to fit a 2048px square and then divided into 512px tiles, with each tile costing 170 tokens in high-detail mode."
            }
          },
          {
            "@type": "Question",
            "name": "Does image file size affect AI vision costs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, AI vision costs are determined by the pixel dimensions (resolution) and the model's tiling strategy, not the compressed file size (MB)."
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

export default async function MultimodalPage() {
    const locale = 'en';
    setRequestLocale(locale);
    const tTools = await getTranslations("tools");

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <MultimodalSchema />
            <SiteHeader />

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                {/* SEMANTIC SEO SHELL: Visible to bots immediately */}
                <section className="sr-only">
                    <h1>Multimodal & Vision AI Token Cost Estimator</h1>
                    <p>
                        Analyze <strong>image-to-token conversion</strong> for leading multimodal models. 
                        Our tool calculates <strong>GPT-4o vision tokens</strong>, 
                        <strong> Claude 3.5 Sonnet image costs</strong>, and <strong>Gemini 1.5 Pro 
                        multimodal payloads</strong> based on resolution, tiling, and pixel density.
                    </p>
                    <ul>
                        <li>Image Tiling & Patch Grid Analysis</li>
                        <li>High vs Low Detail Mode Cost Comparison</li>
                        <li>Pixel-to-Token Ratio Benchmarking</li>
                    </ul>
                    <nav>
                        <ul>
                            <li><Link href="/">Main Text Calculator</Link></li>
                            <li><Link href="/video-planner">Video API Planner</Link></li>
                        </ul>
                    </nav>
                </section>

                <SocialShareBar variant="top" />

                {/* HERO SECTION */}
                <div className="text-center mb-12">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/30 px-3 py-1 rounded-full animate-pulse">
                        Private & Local Processing
                    </span>
                    <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl uppercase tracking-tight">
                        {tTools("image_estimator")}
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto border-l-4 border-blue-500 pl-4 text-left md:text-center">
                        Image token costs are calculated based on pixel scaling, not file size. 
                        Every model resizes and tiles images differently. Compare OpenAI, Anthropic, and Google vision costs side-by-side.
                    </p>
                </div>

                <MultimodalEstimator />

                <SocialShareBar variant="bottom" />

                {/* Server-Rendered Capabilities Summary */}
                <section className="mt-20 border-t border-border/40 pt-16 max-w-4xl mx-auto">
                    <div className="space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">Tool Capabilities</h2>
                            <p className="text-muted-foreground text-lg">Precision engineering for multimodal AI infrastructure.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">01</div>
                                <h4 className="text-lg font-bold text-white">Pixel-to-Token Mapping</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Visualize exactly how your image dimensions translate into API tokens. We simulate the proprietary tiling logic for GPT-4o, Claude, and Gemini.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold">02</div>
                                <h4 className="text-lg font-bold text-white">High/Low Detail Benchmarking</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Compare the cost impact of vision detail modes. Identify if your OCR or object detection task can be handled in 'low-res' to save 80% on tokens.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">03</div>
                                <h4 className="text-lg font-bold text-white">Token Diet Optimization</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Get automated advice on the 'Semantic Floor' for your images. Resize your visual data to the exact resolution where accuracy remains high but costs drop.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Educational Content / SEO Section */}
                <section className="mt-24 border-t border-border/40 pt-20 max-w-4xl mx-auto pb-20">
                    <div className="space-y-16">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight text-white">What is AI Vision Tokenization?</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                                <p>
                                    As generative AI evolves into a multimodal powerhouse with models like OpenAI’s <strong>GPT-4o</strong>, Google’s <strong>Gemini 1.5 Pro</strong>, and Anthropic’s <strong>Claude 3.5 Sonnet</strong>, understanding how these models "see" and "bill" image content is vital for efficient development. Unlike text, where tokens are based on linguistic units, image tokenization is purely spatial.
                                </p>
                                <p>
                                    It involves translating pixel dimensions into a grid of discrete data blocks. Each model provider uses a proprietary "tiling" strategy to break down images into manageable patches that the transformer architecture can process as visual tokens.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    How Models Handle Images
                                </h3>
                                <ul className="space-y-4 text-muted-foreground">
                                    <li>
                                        <strong className="text-slate-200">OpenAI GPT-4o:</strong> Uses a dual-mode system. Images are either processed in "low-res" (flat 85 tokens) or "high-res," where they are resized to fit a 2048px square and then divided into 512px tiles (170 tokens per tile).
                                    </li>
                                    <li>
                                        <strong className="text-slate-200">Google Gemini 1.5:</strong> Operates on a highly efficient "normalized" token count. Most standard images are processed at a fixed rate (e.g., 258 tokens), though extremely high resolutions trigger spatial scaling.
                                    </li>
                                    <li>
                                        <strong className="text-slate-200">Anthropic Claude 3.5:</strong> Employs a dynamic "variable-resolution" approach. Claude 3.5 Sonnet determines token count based on total pixel area, typically averaging ~1,600 tokens for a standard 1MP image.
                                    </li>
                                    <li>
                                        <strong className="text-slate-200">Open-Weights (Llama 3.2):</strong> Often uses "Patch Merging," where the image is divided into fixed 14x14 or 32x32 pixel patches, which are then compressed into latent embeddings.
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    Why Estimating is Hard
                                </h3>
                                <ul className="space-y-4 text-muted-foreground">
                                    <li>
                                        <strong className="text-slate-200">The Tiling Jump:</strong> In models like GPT-4o, increasing an image size by just 1 pixel past a 512px boundary can trigger an entire new "tile," jumping your cost from 255 tokens to 425 tokens instantly.
                                    </li>
                                    <li>
                                        <strong className="text-slate-200">Aspect Ratio Sensitivity:</strong> Some models "pad" images to maintain square tiles. A very wide panoramic image might consume significantly more tokens than a square image of the same total area.
                                    </li>
                                    <li>
                                        <strong className="text-slate-200">Detail vs. Density:</strong> Selecting "High" detail mode doesn't just increase quality; it forces the model to use the maximum tiling grid, often quadrupling the token payload for the same file.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-indigo-500/5 rounded-3xl p-8 border border-indigo-500/10 space-y-4 text-center">
                            <h3 className="text-xl font-bold text-white">Optimize Your Vision Workflow</h3>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                To minimize costs, use the <strong>"Token Diet"</strong> feature above to find the optimal resolution for your specific model. For simple OCR tasks, 
                                switching to "Low Detail" can reduce your API bill by up to 90%.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
