import { Metadata } from 'next';
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import BugReportForm from "@/components/BugReportForm";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Tokensense-Ai | Precision AI Cost Intelligence",
  description: "Learn how Tokensense-Ai helps developers master LLM API costs. Count tokens, estimate multi-modal vision costs, and calculate context caching savings for GPT-4o, Claude, and Gemini—100% client-side.",
  alternates: {
    canonical: 'https://www.tokensense-ai.com/about',
  },
  openGraph: {
    title: "About Tokensense-Ai | Mastering LLM Economics",
    description: "Privacy-first AI cost estimation. No sign-ups, no servers, just precise token intelligence for developers.",
    url: 'https://www.tokensense-ai.com/about',
    type: 'website',
    images: [
      {
        url: '/og-about.png', // Recommended: A branding image or screenshot of the About sections
        width: 1200,
        height: 630,
        alt: 'About Tokensense-Ai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tokensense-Ai | AI Cost Transparency",
    description: "The ultimate pre-flight tool for AI prompt designers and engineers.",
    images: ['/og-about.png'],
  },
};

function AboutSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://www.tokensense-ai.com/about/#webpage",
        "url": "https://www.tokensense-ai.com/about",
        "name": "About Tokensense-Ai",
        "description": "Information about the Tokensense-Ai LLM token calculator and its features.",
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
              "name": "About"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": "Tokensense-Ai",
        "applicationCategory": "DeveloperApplication",
        "description": "Privacy-first LLM cost estimator supporting GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro.",
        "featureList": [
          "Multi-Modal Image Estimation",
          "Context Caching Calculator",
          "Agentic Loop Simulator",
          "Zero-Server Privacy Model"
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

export const dynamic = 'force-static';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AboutSchema />
            <SiteHeader />

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                        What Is Tokensense-Ai?
                    </h1>
                </div>

                <div className="prose prose-sm sm:prose-base prose-invert prose-indigo max-w-none space-y-6 text-muted-foreground leading-relaxed">
                    <p>
                        Tokensense-Ai is a free LLM token cost calculator built for developers, AI engineers, and prompt designers who want to estimate API costs before going live.
                    </p>
                    <p>
                        When you build with large language model APIs like OpenAI, Anthropic Claude, or Google Gemini, you&apos;re billed by the token — not the word, not the character. A single system prompt, a long user message, or an attached file can quietly balloon your cost-per-call. Tokensense-Ai makes that visible.
                    </p>

                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">With Tokensense-Ai you can:</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Count tokens in any prompt (system, user, or combined)</li>
                        <li>Estimate cost per API call across popular models like GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro</li>
                        <li>Adjust expected output length to see how response tokens affect your bill</li>
                        <li>Attach files (.txt, .md, .csv, code, .pdf) to measure file context costs</li>
                        <li>Simulate agentic loop costs across multiple LLM calls</li>
                        <li>Compare input token price vs. output token price side-by-side</li>
                    </ul>
                    <p className="font-medium text-foreground">
                        No sign-up. No server. Your prompts never leave your browser.
                    </p>

                    <hr className="my-8 border-border/40" />

                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Included Tools & Use Cases</h2>

                    <div className="space-y-6">
                        <div className="p-4 rounded-lg bg-card border border-border/40 shadow-sm">
                            <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                                <span>📝</span> The Prompt Editor
                            </h3>
                            <p className="mb-2"><strong>Problem solved:</strong> You want to know exactly how much your zero-shot or few-shot prompt will cost before execution.</p>
                            <p><strong>Use case:</strong> Tweak your System Prompts and User Instructions side-by-side. The tool uses <code>tiktoken</code> to count tokens exactly as major LLMs do, giving you an immediate, client-side token count and cost estimate. You can even dictate your prompts using the built-in voice input feature or compress your prompts to strip whitespace and save tokens.</p>
                        </div>

                        <div className="p-4 rounded-lg bg-card border border-border/40 shadow-sm">
                            <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                                <span>🖼️</span> Image Estimator (Multi-Modal)
                            </h3>
                            <p className="mb-2"><strong>Problem solved:</strong> Vision APIs calculate cost based on image dimensions, resolution detail, and base token cost, which is difficult to guess mentally.</p>
                            <p><strong>Use case:</strong> Upload an image or define its dimensions. Tokensense-Ai applies OpenAI&apos;s vision pricing logic (using high/low detail tile calcs) or standard padding rules to tell you exactly how many tokens that specific image will consume in a request.</p>
                        </div>

                        <div className="p-4 rounded-lg bg-card border border-border/40 shadow-sm">
                            <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                                <span>🧠</span> Context Caching Calculator
                            </h3>
                            <p className="mb-2"><strong>Problem solved:</strong> APIs like Anthropic's Claude and Gemini Pro offer context caching, which charges a premium for writing to the cache but offers discounts for reading from it. Math gets tricky for break-even points.</p>
                            <p><strong>Use case:</strong> Input your massive system prompt or RAG retrieval blob. Tokensense-Ai charts out how many subsequent turns or chats you need to execute for caching to become cheaper than standard API calls.</p>
                        </div>

                        <div className="p-4 rounded-lg bg-card border border-border/40 shadow-sm">
                            <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                                <span>🔁</span> Agentic Loop Simulator
                            </h3>
                            <p className="mb-2"><strong>Problem solved:</strong> Auto-GPTs, LangChain workflows, and autonomous agents burn through tokens as they retry, plan, and loop. A $0.02 call becomes $1.50 rapidly.</p>
                            <p><strong>Use case:</strong> Set the maximum number of iterations for a simulated agent. Tokensense-Ai compounds your current context window, showing the ballooning context overhead and calculating the nightmare scenario maximum runtime cost.</p>
                        </div>
                    </div>

                    <hr className="my-8 border-border/40" />

                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Development Build Log</h2>
                    <div className="bg-[#0a0f1e] p-6 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.05)] font-mono text-sm overflow-hidden h-[400px] flex flex-col group">
                        <div className="flex items-center gap-2 mb-4 border-b border-border/40 pb-3">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                            </div>
                            <div className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-bold">
                                terminal — tokensense-build.log
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar text-foreground/80 selection:bg-cyan-500/30">
                             <p className="text-cyan-400 font-bold mb-3">[2026-03-27] v1.5.0 — The "Abundance" Update & CMS Release</p>
                             <p className="pl-4 border-l border-cyan-500/20 py-0.5 hover:bg-cyan-500/5 transition-colors">Launched Local Blog Admin Dashboard with live preview, media management, and draft scheduling.</p>
                             <p className="pl-4 border-l border-cyan-500/20 py-0.5 hover:bg-cyan-500/5 transition-colors">Integrated "Create Image (Gemini)" AI assistant into the blog workflow with auto-copy prompt logic.</p>
                             <p className="pl-4 border-l border-cyan-500/20 py-0.5 hover:bg-cyan-500/5 transition-colors">Redesigned Homepage Hero and Feature Showcase for high-impact UX and tool discoverability.</p>
                             <p className="pl-4 border-l border-cyan-500/20 py-0.5 hover:bg-cyan-500/5 transition-colors">Implemented Sample Use Cases (Light/Medium/Heavy) in Prompt Editor for instant benchmarking.</p>
                             <p className="pl-4 border-l border-cyan-500/20 py-0.5 hover:bg-cyan-500/5 transition-colors">Refactored Global Navigation with persistent "Tools" dropdown and better IA hierarchy.</p>
                             <p className="pl-4 border-l border-cyan-500/20 py-0.5 hover:bg-cyan-500/5 transition-colors">Standardized support badges: Resized Product Hunt badge to match GitHub Sponsors button.</p>
                             <p className="pl-4 border-l border-cyan-500/20 py-0.5 hover:bg-cyan-500/5 transition-colors">Optimized FAQ structure and removed friction points by relocating the bug report form.</p>

                             <p className="text-cyan-400 font-bold mb-3 mt-6">[2026-03-23] v0.2.0 — UI/UX Refresh & Platform Update</p>                            <p className="pl-4 border-l border-cyan-500/20 py-0.5 hover:bg-cyan-500/5 transition-colors">Redesigned About page build log section into a scrollable terminal-style text area.</p>
                            <p className="pl-4 border-l border-cyan-500/20 py-0.5 hover:bg-cyan-500/5 transition-colors">Updated header social share icons: removed Facebook, added Reddit and GitHub with brand colors.</p>
                            <p className="pl-4 border-l border-cyan-500/20 py-0.5 hover:bg-cyan-500/5 transition-colors">Added GitHub repository link to the site navigation bar for developer accessibility.</p>
                            <p className="pl-4 border-l border-cyan-500/20 py-0.5 hover:bg-cyan-500/5 transition-colors">Removed the "Join Community" Discord badge and invitation links from the Contact page.</p>

                            <div className="h-4" />

                            <p className="text-muted-foreground/60">[2026-03-17] Fix 7 — Verified mobile responsiveness: Headlines scale gracefully (5xl→6xl→7xl), badges wrap cleanly, CTA full-width on mobile, min-height preserved at 85vh.</p>
                            <p className="text-muted-foreground/60">[2026-03-17] Fix 6 — Improve CTA button: Updated copy to "Estimate My First Prompt" (more action-forward), larger size (h-14 px-10), gradient hover with cyan glow.</p>
                            <p className="text-muted-foreground/60">[2026-03-17] Fix 5 — Add social proof line: "Trusted by developers, AI engineers, and prompt designers worldwide" in italic below badges.</p>
                            <p className="text-muted-foreground/60">[2026-03-17] Fix 4 — Hero image gradient overlay: Add bottom-to-top fade (from background → transparent) to elegantly blend image into page.</p>
                            <p className="text-muted-foreground/60">[2026-03-17] Fix 3 — Add trust badge row below CTA: Four cyan-bordered pills (100% Client-Side, No Sign-up, Free Forever, Open Source) with backdrop blur.</p>
                            <p className="text-muted-foreground/60">[2026-03-17] Fix 2 — Strengthen headline hierarchy: Split headline across two lines with second line in gradient (cyan→indigo→purple), bump font to 5xl-7xl.</p>
                            <p className="text-muted-foreground/60">[2026-03-17] Fix 1 — Increase hero section height: Set min-h-screen (85vh mobile, 100vh desktop) for vertical breathing room and proper centering.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Add HTML link to tiktoken GitHub in "How It Works" FAQ section for developer credibility.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Add 12 new FAQ questions covering: token counting architecture, model accuracy tiers, n8n vs Make pricing, prompt caching strategy, open-source transparency, and document processing workflows.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Pre-expand first question in each FAQ category on page load for better discoverability.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Add category subheadings to FAQ page for improved scannability and information architecture.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Refactor FAQ page from 10 to 19 questions organized into 6 searchable categories (General, Models & Pricing, How It Works, Use Cases, Privacy & Trust, Workflow & Automation).</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Integrate HeroBadges below hero headline on homepage for stronger first impression with trust signals.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Create HeroBadges component: Three product pills ("100% Client-Side", "No Sign-up", "Free Forever") with cyan borders and hover effects.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Integrate TrustMessage across all 10 page footers (homepage, faq, about, multimodal, caching, workflow, comparison, contact, terms, privacy).</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Create TrustMessage component: Reusable footer-friendly privacy indicator with lock icon. Replaces nav badge placement.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Fix nav layout: Remove TrustBadge from SiteHeader navigation (desktop + mobile), remove nav border-l for cleaner header.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Create SelfHostingTipCard component: Contextual n8n self-hosting opportunity card with ROI math and dismissible state.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Create BreakevenCallout component: Analyzes platform crossover points and cost differences; suggests n8n self-hosting for complex workflows.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Implement dynamic "Smart Insight" callout in comparison showing best platform and monthly savings.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Create PlatformComparisonTable component with desktop table + mobile cards; displays cost per 1K runs, monthly, annual, best-value badge.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Add "Related Calculators" section to Workflow page linking to Token Calculator, Context Caching, and Model Comparison.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Expand Workflow Estimator page: Add "How Workflow Costs Are Calculated" explainer (n8n, Make, Zapier billing models).</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Fix build error: Remove duplicate closing div tag from Context Caching page.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Add Workflow / Agentic FAQ section (4 questions) to main FAQ page covering multi-turn costs, tool calls, system prompts, RAG.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Add Context Caching FAQ section (4 questions) to Context Caching page.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Add Image / Multimodal FAQ section (4 questions) to Image Estimator page.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Add Pricing & Accuracy FAQ section (4 questions) to homepage covering updates, tax, batch discounts.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Add Token Basics FAQ section (4 questions) to homepage with accordion styling.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Create TrustBadge component with lock icon and interactive tooltip; replace generic badges across nav.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Add visual emphasis to Context Caching cost output card with gradient backgrounds and animated counters.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Build NumberCounter component with smooth ease-out animations for dynamic cost displays.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Expand Image Estimator upload zone (h-48 → h-80) with enhanced hover states and visual feedback.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Enhance FAQ page: Set first 2 accordion items to open by default, add prominent CTA section.</p>
                            <p className="text-muted-foreground/60">[2026-03-16] Implement LoadingScreen component with animated computing icon and auto-hide logic.</p>
                            <p className="text-muted-foreground/60">[2026-03-10] Add Workflow Cost Estimator with Blueprint Model, platform tax, and ROI calculator.</p>
                            <p className="text-muted-foreground/60">[2026-03-10] Add Token Cost Comparison Table with real-time math and Best Value highlight.</p>
                            <p className="text-muted-foreground/60">[2026-03-09] Refactor navigation to include an animated Mobile Hamburger Menu.</p>
                            <p className="text-muted-foreground/60">[2026-03-08] Update App Branding with new logo and tagline.</p>
                            <p className="text-muted-foreground/60">[2026-03-08] Add Terms of Service and Privacy Policy pages.</p>
                            <p className="text-muted-foreground/60">[2026-03-08] Polishing UI/UX: Parallax hero images, Back-to-Top bots, semantic HTML.</p>
                            <p className="text-muted-foreground/60">[2026-03-08] Add Web Speech API integration for direct prompt voice dictation.</p>
                            <p className="text-muted-foreground/60">[2026-03-08] Add Prompt Compression (Token Diet) utility, basic and advanced.</p>
                            <p className="text-muted-foreground/60">[2026-03-07] Add Multi-Modal Image Token Estimator utilizing dimension-based slice math.</p>
                            <p className="text-muted-foreground/60">[2026-03-07] Add Context Caching Calculator for break-even analysis.</p>
                            <p className="text-muted-foreground/60">[2026-03-06] Implement Agent Loop Simulator math for compounded execution costs.</p>
                            <p className="text-muted-foreground/60">[2026-03-06] Add FileContextUploader using react-dropzone and pdfjs-dist for local parsing.</p>
                            <p className="text-muted-foreground/60">[2026-03-06] Build Cost Dashboard with dynamic provider/model pricing list.</p>
                            <p className="text-muted-foreground/60">[2026-03-06] Implement tiktoken WASM for client-side purely private token counting.</p>
                            <p className="text-muted-foreground/60">[2026-03-06] Implement Zustand for cross-component state management.</p>
                            <p className="text-muted-foreground/60">[2026-03-06] Setup shadcn/ui components (Textarea, Slider, Progress, Badges).</p>
                            <p className="text-muted-foreground/60">[2026-03-06] Initialize Next.js 15 repository with React 19 & Tailwind CSS v4.</p>
                        </div>
                    </div>

                    <hr className="my-8 border-border/40" />

                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Contact Us</h2>
                    <BugReportForm />
                </div>
            </main>

        </div>
    );
}
