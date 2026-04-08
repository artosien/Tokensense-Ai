import { Metadata } from 'next';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import HeroHeadline from "@/components/HeroHeadline";
import { GradientOrbs } from "@/components/GradientOrbs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import HomeClient from "@/app/HomeClient";
import SocialShareBar from "@/components/SocialShareBar";
import SiteHeader from "@/components/SiteHeader";
import Onboarding from "@/components/Onboarding";
import { ApiIntegrationSection } from "@/components/ApiIntegrationSection";

export const metadata: Metadata = {
  title: "Tokensense-Ai | Free LLM Token Counter & Prompt Cost Calculator",
  description: "Calculate AI prompt costs instantly. Estimate token usage and API pricing for GPT-5, Claude 3.5, and Gemini. 100% client-side, private, and no sign-up required.",
  keywords: ["LLM token counter", "prompt cost calculator", "GPT-5 pricing", "AI developer tools", "Claude token count", "Gemini API cost"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Tokensense-Ai | AI Prompt Cost Calculator",
    description: "Know your API costs before you hit send. 100% private, client-side token counting.",
    url: 'https://www.tokensense-ai.com',
    siteName: 'Tokensense-Ai',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tokensense-Ai Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tokensense-Ai | LLM Token & Cost Calculator",
    description: "Instant cost estimates for GPT, Claude, and Gemini prompts.",
    images: ['/og-image.png'],
  },
};

function HomeSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What counts as one token?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tokens are pieces of words. In English, 1,000 tokens is approximately 750 words."
        }
      },
      {
        "@type": "Question",
        "name": "Why do different models charge different rates for the same text?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Each model (GPT-4o, Claude, Gemini) uses a different tokenizer and pricing structure based on its computational complexity."
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

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <HomeSchema />
      <Onboarding />
      <SiteHeader />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* SEMANTIC SEO SHELL */}
        <section className="sr-only">
          <h1>Tokensense-Ai | Free LLM Token Counter & Cost Estimator</h1>
          <p>
            Tokensense-Ai is the definitive tool for AI developers to calculate API costs 
            for GPT-4o, Claude 3.5, and Gemini 1.5. Our 100% client-side calculator 
            provides instant token counts and pricing estimates.
          </p>
        </section>

        <SocialShareBar variant="top" />

        {/* Start Here Banner */}
        <section className="mt-8 mb-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-plasma-500/20 border border-white/10 shadow-2xl p-6 md:p-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  New to Tokensense?
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-[1.1]">
                  Start Your <span className="text-indigo-400">Optimization</span> Journey
                </h2>
                <p className="text-lg text-muted-foreground font-medium max-w-xl">
                  Watch this 2-minute quickstart guide to learn how to master LLM token costs and build more profitable AI applications.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <Button size="lg" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl" asChild>
                    <Link href="#calculate-section">Jump to Calculator</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 px-8 border-white/10 hover:bg-white/5 text-white font-bold rounded-xl" asChild>
                    <Link href="/tokenomics">Learn Tokenomics</Link>
                  </Button>
                </div>
              </div>
              <div className="flex-1 w-full max-w-2xl">
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 group">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/nKSk_TiR8YA?si=Amxvxk4UzgYe5ms4" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
              </div>
            </div>
            {/* Background decorative elements */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-plasma-500/10 blur-[100px] rounded-full"></div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative pt-10 pb-16 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
          <GradientOrbs />
          
          <div className="max-w-3xl space-y-6 mx-auto lg:mx-0">
            <div className="inline-flex items-center text-center justify-center gap-2 px-3 py-1 rounded-full border border-[#00dcb4]/30 bg-[#00dcb4]/10 text-[#00dcb4] text-[10px] sm:text-xs font-mono font-bold tracking-wide mb-2 max-w-full">
              {"The only calculator that simulates agent loop costs"}
            </div>

            <HeroHeadline />

            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium text-center lg:text-left text-balance">
              {"Know your token counts and pricing across GPT-4o, Claude 3.5, Gemini 1.5, and 50+ other major models before you hit send."}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-[56px] px-[28px] text-lg font-bold bg-[#00dcb4] hover:bg-[#00c5a1] text-black shadow-xl shadow-[#00dcb4]/20 transition-all hover:-translate-y-0.5"
                asChild
              >
                <Link href="/#calculate-section">{"Try Calculator Now →"}</Link>
              </Button>
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
          </div>

          <div className="hidden lg:block w-full max-w-md">
            <div className="relative p-1 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-plasma-500/20 border border-white/10 shadow-2xl">
              <div className="rounded-[22px] overflow-hidden bg-background/40 backdrop-blur-xl border border-white/5">
                <div className="h-8 bg-muted/30 flex items-center px-4 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                </div>
                <div className="p-6 space-y-4">
                  <div className="h-4 w-3/4 bg-indigo-500/10 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted/40 rounded-full" />
                    <div className="h-3 w-5/6 bg-muted/40 rounded-full" />
                    <div className="h-3 w-4/6 bg-muted/40 rounded-full" />
                  </div>
                  <div className="pt-4 grid grid-cols-2 gap-4">
                    <div className="h-16 bg-plasma-500/10 rounded-xl border border-plasma-500/20" />
                    <div className="h-16 bg-indigo-500/10 rounded-xl border border-indigo-500/20" />
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 -inset-4 bg-indigo-500/20 blur-3xl rounded-full opacity-50" />
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-6 border-y border-border/40 bg-card/20 backdrop-blur-sm mt-8 mb-16">
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center sm:justify-between items-center gap-8 px-4">
            {[
              { val: "30+", label: "Models Supported" },
              { val: "100%", label: "Client-Side" },
              { val: "<50ms", label: "Token Count Speed" },
              { val: "$0", label: "Cost to Use" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black tracking-tighter text-foreground">{stat.val}</span>
                <span className="text-[10px] sm:text-xs font-mono text-muted-foreground uppercase">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <HomeClient />

        {/* Features Showcase */}
        <section className="pt-24 pb-12">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">{"Powerful Tools for AI Developers"}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {"Everything you need to optimize your LLM costs and architectural decisions."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group flex flex-col space-y-4 p-8 rounded-3xl bg-card border border-border/40 hover:border-[#00dcb4]/40 hover:bg-black/20 hover:-translate-y-1 transition-all duration-[250ms] relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center text-3xl mb-2">⚡</div>
              <div className="space-y-2 flex-1">
                <h3 className="text-2xl font-bold tracking-tight">{"Instant Token Count"}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  {"Real-time token counting using each model's exact tokenizer — as you type."}
                </p>
              </div>
              <div className="pt-4">
                <Button className="w-full justify-between font-bold group-hover:bg-[#00dcb4] group-hover:text-black transition-colors" asChild>
                  <Link href="/#calculate-section">{"Launch Tool"} <ChevronRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>
            </div>

            <div className="group flex flex-col space-y-4 p-8 rounded-3xl bg-card border border-border/40 hover:border-[#00dcb4]/40 hover:bg-black/20 hover:-translate-y-1 transition-all duration-[250ms] relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center text-3xl mb-2">💸</div>
              <div className="space-y-2 flex-1">
                <h3 className="text-2xl font-bold tracking-tight">{"Pre-Flight Cost Estimate"}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  {"Accurate input + output cost projections before you make a single API call."}
                </p>
              </div>
              <div className="pt-4">
                <Button className="w-full justify-between font-bold group-hover:bg-[#00dcb4] group-hover:text-black transition-colors" asChild>
                  <Link href="/comparison">{"Compare Costs"} <ChevronRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>
            </div>

            <div className="group flex flex-col space-y-4 p-8 rounded-3xl bg-card border border-border/40 hover:border-[#00dcb4]/40 hover:bg-black/20 hover:-translate-y-1 transition-all duration-[250ms] relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-3xl mb-2">🔍</div>
              <div className="space-y-2 flex-1">
                <h3 className="text-2xl font-bold tracking-tight">{"Multi-Step Agent Cost Estimator"}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  {"See how costs compound across multi-step agent workflows, turn by turn."}
                </p>
              </div>
              <div className="pt-4">
                <Button className="w-full justify-between font-bold group-hover:bg-[#00dcb4] group-hover:text-black transition-colors" asChild>
                  <Link href="/workflow">{"Simulate Loops"} <ChevronRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pt-8 pb-16 border-t border-border/40">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{"Token Basics"}</h2>
            <div className="bg-card border border-border/40 rounded-2xl p-6 sm:p-8 shadow-sm">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                    {"What counts as one token?"}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed font-medium">
                    {"A token is a unit of text that LLMs process. In English, one token is roughly 4 characters or about 3/4 of a word."}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                    {"Why do different models charge different rates?"}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed font-medium">
                    {"Pricing is based on computational complexity and provider strategy. GPT-4o costs more than GPT-4o-mini, for instance."}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
        
        <SocialShareBar variant="bottom" />
      </main>
    </div>
  );
}
