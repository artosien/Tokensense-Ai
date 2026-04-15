import { Metadata } from 'next';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, ShieldCheck, Github } from "lucide-react";
import HeroHeadline from "@/components/HeroHeadline";
import { GradientOrbs } from "@/components/GradientOrbs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import HomeClient from "@/app/HomeClient";
import SocialShareBar from "@/components/SocialShareBar";
import SiteHeader from "@/components/SiteHeader";
import Onboarding from "@/components/Onboarding";
import { ApiIntegrationSection } from "@/components/ApiIntegrationSection";
import HeroPreview from "@/components/HeroPreview";
import SocialProof from "@/components/SocialProof";
import WhyTokensense from "@/components/WhyTokensense";
import ScenarioCards from "@/components/ScenarioCards";
import CalculatorStepTracker from "@/components/CalculatorStepTracker";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "Tokensense AI — Free LLM Token Cost Calculator | GPT-4o, Claude, Gemini",
  description: "Calculate AI prompt costs instantly. Count tokens, compare GPT-4o vs Claude vs Gemini pricing, simulate agent loop costs, and plan budgets — 100% free, client-side.",
  keywords: ["llm token cost calculator", "gpt-4o cost per token", "claude vs gpt cost comparison", "how much does ai api cost", "agent loop cost calculator", "reverse token budget planner"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Tokensense AI — Free LLM Token Calculator",
    description: "Know your LLM API cost before you hit send. Supports 50+ models including GPT-4o, Claude Sonnet, and Gemini Flash.",
    url: 'https://www.tokensense-ai.com',
    siteName: 'Tokensense AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tokensense AI Calculator Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tokensense AI — Free LLM Token Calculator",
    description: "Know your LLM API cost before you hit send. Supports 50+ models including GPT-4o, Claude Sonnet, and Gemini Flash.",
    images: ['/og-image.png'],
  },
};

const faqs = [
  {
    q: "What counts as one token?",
    a: "Roughly 4 characters or ¾ of a word in English. 'Hello world' is about 2–3 tokens. Code and non-English languages typically tokenize less efficiently, meaning more tokens per character. Each model uses its own tokenizer — Tokensense uses each model's exact tokenizer for accuracy."
  },
  {
    q: "Why do different models charge different rates?",
    a: "Pricing reflects model size, inference infrastructure cost, and commercial positioning. GPT-4o and Claude Opus are expensive because they're large, high-capability models. Gemini Flash and GPT-4o mini are cheap because they're distilled or optimized for throughput. Context window size also affects pricing — models with 1M+ token windows often charge more per token."
  },
  {
    q: "Does Tokensense store my prompts?",
    a: "No. Tokensense is 100% client-side. Your text is tokenized in the browser using the model's local tokenizer library — nothing is ever sent to a Tokensense server. You can verify this by running it offline."
  },
  {
    q: "How often are model prices updated?",
    a: "Prices are updated manually whenever a major model provider announces a change. The calculator shows a 'prices last updated' timestamp next to each model. For production use, always verify against the provider's official pricing page."
  },
  {
    q: "What is context caching and how does it affect cost?",
    a: "Some providers (Anthropic, Google) offer discounted rates if the same prefix (system prompt or document) is reused across many calls. The cost is typically 10–25% of the normal input rate for cached tokens. Tokensense's token counter currently shows base pricing — caching discounts are not yet modelled automatically."
  },
  {
    q: "How does the agent loop simulator work?",
    a: "In multi-step agents, each turn typically receives the full conversation history as context, so your input token count compounds. The simulator models this growth turn-by-turn, letting you see how a 500-token prompt becomes thousands of tokens and dollars across 20+ agent steps."
  },
  {
    q: "Can I compare models for the same prompt?",
    a: "Yes — Step 2 of the calculator lets you add multiple models and see side-by-side costs for the exact same input/output token count. The comparison bars in the budget planner also show how many API calls each model allows for a fixed monthly budget."
  },
  {
    q: "What is the Reverse Budget Planner?",
    a: "Instead of 'here's my prompt, what does it cost?', the budget planner asks 'here's my monthly budget ($50), what can I afford?' It calculates requests per day, requests per month, and alerts you when you're approaching your budget ceiling."
  },
  {
    q: "Does it support fine-tuned or self-hosted models?",
    a: "Currently the calculator covers hosted commercial models from OpenAI, Anthropic, Google, Meta (via API), and Mistral. Fine-tuned model pricing (which often differs from base model pricing) and self-hosted inference cost estimation are not yet supported."
  },
  {
    q: "Is Tokensense open source?",
    a: "Yes. The full source is available on GitHub under an open-source license. Contributions, bug reports, and feature requests are welcome. The tokenizer libraries used are the official ones published by each model provider."
  }
];

function HomeSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <HomeSchema />
      <Onboarding />
      <SiteHeader />
      <CalculatorStepTracker />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* SEMANTIC SEO SHELL */}
        <section className="sr-only">
          <h1>Tokensense AI | Free LLM Token Counter & Cost Estimator</h1>
          <p>
            Tokensense AI is the definitive tool for AI developers to calculate API costs 
            for GPT-4o, Claude 3.5, and Gemini 1.5. Our 100% client-side calculator 
            provides instant token counts and pricing estimates.
          </p>
        </section>

        <SocialShareBar variant="top" />

        {/* Hero Section */}
        <section className="relative pt-10 pb-16 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
          <GradientOrbs />
          
          <div className="max-w-3xl space-y-8 mx-auto lg:mx-0">
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00dcb4]/30 bg-[#00dcb4]/10 text-[#00dcb4] text-[10px] sm:text-xs font-mono font-bold tracking-wide max-w-full">
                {"The only calculator that simulates agent loop costs"}
              </div>
              <Link
                href="https://github.com/hueanhuean/tokensense-ai"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 text-xs text-white/50 hover:text-white hover:border-white/25 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Star on GitHub</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono">1.2k</span>
              </Link>
            </div>

            <HeroHeadline />

            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium text-center lg:text-left text-balance">
              {"Paste a prompt. Pick a model. See the exact cost — before you hit send. Supports GPT-4o, Claude, Gemini, and 50+ models."}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-[56px] px-[28px] text-lg font-bold bg-[#00dcb4] hover:bg-[#00c5a1] text-black shadow-xl shadow-[#00dcb4]/20 transition-all hover:-translate-y-0.5"
                asChild
              >
                <Link href="/#calculate-section">{"Try Calculator Now →"}</Link>
              </Button>
              <Link 
                href="/#budget-planner" 
                className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors underline decoration-indigo-500/30 underline-offset-4"
              >
                Or start with your monthly budget →
              </Link>
            </div>

            {/* Elevated OpenAI Sync Feature */}
            <div className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <ApiIntegrationSection variant="hero" />
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 pt-2">
              {[
                "100% Client-Side",
                "No Sign-up",
                "Free Forever",
                "Open Source"
              ].map((label, idx) => (
                <div key={idx} className="flex items-center gap-1.5 font-mono text-xs font-medium text-muted-foreground">
                  <span className="text-[#00dcb4] font-bold">✓</span> {label}
                </div>
              ))}
            </div>

            {/* Quick-jump tool nav */}
            <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap mt-8">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mr-2">Jump to:</span>
              <Link href="/#step-1" className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-colors">Token Counter</Link>
              <Link href="/#step-2" className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-colors">Model Compare</Link>
              <Link href="/#step-3" className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-colors">Agent Simulator</Link>
              <Link href="/#budget-planner" className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-indigo-500/30 text-indigo-400 hover:border-indigo-400 transition-colors">← Budget Planner</Link>
            </div>
          </div>

          <div className="w-full max-w-md lg:mr-4">
            <HeroPreview />
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-12 border-y border-border/40 bg-card/20 backdrop-blur-sm mt-8 mb-16 relative overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-wrap justify-center sm:justify-between items-center gap-12 px-4 relative z-10">
            {[
              { val: "50+", label: "LLM models supported" },
              { val: "100%", label: "Client-side — prompts never leave your browser", highlight: true },
              { val: "<50ms", label: "Real-time token counting" },
              { val: "Free", label: "Always free & open source" },
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col items-center sm:items-start text-center sm:text-left ${stat.highlight ? 'bg-indigo-500/5 px-6 py-4 rounded-3xl border border-indigo-500/20' : ''}`}>
                <div className="flex items-center gap-2">
                  {stat.highlight && <ShieldCheck className="w-5 h-5 text-indigo-400" />}
                  <span className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground">{stat.val}</span>
                </div>
                <span className="text-[10px] sm:text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1 font-bold">{stat.label}</span>
              </div>
            ))}
          </div>
          {/* Decorative background for highlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
        </section>

        <SocialProof />
        <WhyTokensense />

        <div id="calculate-section" className="scroll-mt-24">
          <HomeClient />
        </div>

        <ScenarioCards />

        {/* FAQ Section */}
        <section className="py-24 border-t border-border/40">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black tracking-tight text-white uppercase">{"Token Economics FAQ"}</h2>
              <p className="text-muted-foreground font-medium">Everything you need to know about LLM pricing and tokenization.</p>
            </div>
            
            <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-[40px] p-8 sm:p-12 shadow-xl">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-border/40 last:border-0">
                    <AccordionTrigger className="text-left text-base font-bold py-6 hover:no-underline hover:text-indigo-400 transition-colors uppercase tracking-tight">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed font-medium pb-6 text-sm">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Mid-Page CTA */}
        <section className="mt-8 mb-20 px-4">
          <div className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-plasma-500/20 border border-white/10 shadow-2xl p-10 md:p-20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
              <div className="flex-1 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] border border-indigo-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  Stop paying for tokens you didn't plan for
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.05] uppercase">
                  Ready to <span className="text-indigo-400">Master</span> Your AI Budget?
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">
                  Every LLM API call has a cost. Most developers only find out after the invoice arrives. Tokensense shows you the number before you hit send — for free, forever.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                  <Button size="lg" className="h-14 px-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-tight rounded-2xl shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-0.5" asChild>
                    <Link href="#calculate-section">Try the calculator →</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-14 px-10 border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-tight rounded-2xl" asChild>
                    <Link href="/tokenomics">Read the cost guide</Link>
                  </Button>
                </div>
              </div>
              <div className="flex-1 w-full max-w-2xl">
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 group">
                  <video 
                    width="100%" 
                    height="100%" 
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source src="/Videos/tokensense-promo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
            {/* Background decorative elements */}
            <div className="absolute -top-48 -right-48 w-full h-full bg-indigo-600/5 blur-[120px] rounded-full"></div>
            <div className="absolute -bottom-48 -left-48 w-full h-full bg-plasma-500/5 blur-[120px] rounded-full"></div>
          </div>
        </section>

        <section className="pb-24">
          <NewsletterSignup />
        </section>
        
        <SocialShareBar variant="bottom" />
      </main>
    </div>
  );
}
