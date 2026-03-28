"use client";

import { useState, useEffect, useRef } from "react";
import SiteHeader from "@/components/SiteHeader";
import dynamic from "next/dynamic";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { RestoredSessionBanner } from "@/components/RestoredSessionBanner";
import { usePersistedCalculator } from "@/hooks/usePersistedCalculator";
import { useTokenSenseStore } from "@/lib/store";
import { useDebounce } from "@/hooks/useDebounce";
import SocialShareBar from "@/components/SocialShareBar";
import { StickyResultsBar } from "@/components/StickyResultsBar";
import { BudgetCalculator } from "@/components/BudgetCalculator";
import { ApiIntegrationSection } from "@/components/ApiIntegrationSection";
import { useShareableUrl } from "@/hooks/useShareableUrl";
import { Card } from "@/components/ui/card";
import { Calculator, LayoutDashboard, ChevronRight, Sparkles, Zap, ShieldCheck, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { models } from "@/lib/models";

// ── Animation A: Typewriter hook ─────────────────────────────────────────────
function useTypewriter(text: string, speed = 60, startDelay = 400) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    const delay = setTimeout(() => {
      let i = 0;
      const tick = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(tick); setDone(true); }
      }, speed);
      return () => clearInterval(tick);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

// ── Animation D: Pricing Ticker ───────────────────────────────────────────────
function PricingTicker() {
  const items = models.map(m => `${m.name}  ·  $${m.inputPricePer1M} in / $${m.outputPricePer1M} out`);
  const doubled = [...items, ...items]; // seamless loop
  return (
    <div className="overflow-hidden w-full py-3 border-t border-b border-[#00dcb4]/10 bg-[#00dcb4]/3 mt-6">
      <div
        className="flex gap-12 whitespace-nowrap"
        style={{
          animation: "ticker-scroll 32s linear infinite",
          width: "max-content",
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="text-[11px] font-mono text-muted-foreground/60 shrink-0">
            <span className="text-[#00dcb4]/60 mr-1">▸</span>{item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Animation E: Gradient Mesh Orbs ──────────────────────────────────────────
function GradientOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      {/* Teal orb — top left */}
      <div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600,
          top: "-20%", left: "-10%",
          background: "radial-gradient(circle, rgba(0,220,180,0.13) 0%, transparent 70%)",
          animation: "orb-drift-1 10s ease-in-out infinite alternate",
        }}
      />
      {/* Indigo orb — top right */}
      <div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          top: "-10%", right: "-5%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          animation: "orb-drift-2 12s ease-in-out infinite alternate",
        }}
      />
      {/* Purple orb — bottom center */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400, height: 400,
          bottom: "-15%", left: "40%",
          background: "radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)",
          animation: "orb-drift-3 14s ease-in-out infinite alternate",
        }}
      />
    </div>
  );
}

// Dynamic imports with loading skeletons to reduce CLS (M11)
const PromptEditor = dynamic(() => import("@/components/PromptEditor"), { 
  ssr: false,
  loading: () => <div className="h-[500px] animate-pulse bg-card/50 rounded-2xl border border-border/40" />
});
const MetricsDashboard = dynamic(() => import("@/components/MetricsDashboard"), { 
  ssr: false,
  loading: () => <div className="h-[600px] animate-pulse bg-card/50 rounded-2xl border border-border/40" />
});
const ConversationSimulator = dynamic(() => import("@/components/ConversationSimulator"), { ssr: false });
const AgentLoopSimulator = dynamic(() => import("@/components/AgentLoopSimulator"), { ssr: false });
const FileContextUploader = dynamic(() => import("@/components/FileContextUploader"), { ssr: false });
const BatchAnalysisTool = dynamic(() => import("@/components/BatchAnalysisTool"), { ssr: false });
const BugReportForm = dynamic(() => import("@/components/BugReportForm"), { ssr: false });
const PromptCostComparisonTable = dynamic(() => import("@/components/PromptCostComparisonTable"), { 
  ssr: false,
  loading: () => <div className="h-[400px] mt-8 animate-pulse bg-card/50 rounded-2xl border border-border/40" />
});
const CompareMode = dynamic(() => import("@/components/CompareMode").then(m => m.CompareMode), { ssr: false });
const ModelComparisonSlider = dynamic(() => import("@/components/ModelComparisonSlider"), { ssr: false });

// ── Animation A: Hero Headline with typewriter ────────────────────────────────
function HeroHeadline() {
  const { displayed, done } = useTypewriter("instantly.", 65, 500);
  return (
    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-foreground mt-0">
      Calculate your AI <br className="hidden lg:block" />
      prompt costs{" "}
      <span className="bg-gradient-to-r from-plasma-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
        {displayed}
        <span
          className="inline-block w-[3px] h-[0.85em] ml-0.5 align-middle rounded-sm bg-plasma-400"
          style={{
            animation: done ? "cursor-blink 1s step-end infinite" : "none",
            opacity: done ? undefined : 1,
          }}
        />
      </span>
    </h1>
  );
}

export default function HomeClient() {
  const [mounted, setMounted] = useState(false);

  const { input, model, restored, setRestored } = usePersistedCalculator();
  const { 
    userPrompt, 
    systemPrompt, 
    setUserPrompt, 
    setSelectedModelId, 
    setExpectedOutputTokens
  } = useTokenSenseStore();
  const { parseUrlState } = useShareableUrl();

  const debouncedPrompt = useDebounce(userPrompt, 800);
  const hasPromptContent = userPrompt.trim().length > 0;
  const showComparisonTable = debouncedPrompt.trim().length > 0;

  // Restore persisted session or URL state on mount
  useEffect(() => {
    const urlState = parseUrlState();

    if (urlState) {
      if (urlState.modelId) setSelectedModelId(urlState.modelId);
      if (urlState.outputTokens) setExpectedOutputTokens(urlState.outputTokens);
    } else {
      if (input) setUserPrompt(input);
      if (model) setSelectedModelId(model);
    }
    setMounted(true);
  }, [input, model, parseUrlState, setSelectedModelId, setUserPrompt, setExpectedOutputTokens]);



  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <StickyResultsBar />
      <SiteHeader />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Social Share - Top */}
        <SocialShareBar variant="top" />

        {/* CTA Block — wraps in a relative container for the orbs */}
        <div className="relative pt-10 pb-16 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Animation E: Gradient Mesh Orbs */}
          <GradientOrbs />

          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00dcb4]/30 bg-[#00dcb4]/10 text-[#00dcb4] text-xs font-mono font-bold tracking-wide mb-2 animate-in fade-in slide-in-from-bottom-2">
              The only calculator that simulates agent loop costs
            </div>

            {/* Animation A: Typewriter on 'instantly.' */}
            <HeroHeadline />

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Know your token counts and pricing across GPT-4o, Claude 3.5, Gemini 1.5, and 50+ other major models before you hit send.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-[56px] px-[28px] text-lg font-bold bg-[#00dcb4] hover:bg-[#00c5a1] text-black shadow-xl shadow-[#00dcb4]/20 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,220,180,0.4)] active:scale-95"
                asChild
              >
                <Link href="/#calculate-section">Try Calculator Now &rarr;</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto h-14 px-8 text-lg font-semibold border-border/60 hover:bg-muted/50 transition-all active:scale-95"
                asChild
              >
                <Link href="/faq">Learn How It Works</Link>
              </Button>
            </div>

            {/* Animation D: Pricing Ticker */}
            <PricingTicker />

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 pt-2">
              {["100% Client-Side", "No Sign-up", "Free Forever", "Open Source"].map((label, idx) => (
                <div key={idx} className="flex items-center gap-1.5 font-mono text-xs font-medium text-muted-foreground">
                  <span className="text-[#00dcb4] font-bold">✓</span> {label}
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual - Dashboard Preview Mini */}
          <div className="hidden lg:block w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-1000">
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
              {/* Decorative Glow */}
              <div className="absolute -z-10 -inset-4 bg-indigo-500/20 blur-3xl rounded-full opacity-50" />
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="py-6 border-y border-border/40 bg-card/20 backdrop-blur-sm mt-8 mb-16">
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
        </div>

        {/* Inline Header for Calculator (Step 01) */}
        <div className="text-center mb-8 mt-12">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#00dcb4]/10 text-[#00dcb4] text-sm font-mono font-bold tracking-widest uppercase mb-4 border border-[#00dcb4]/20">
              STEP 01 &mdash; Count your tokens &amp; estimate cost
            </div>
            <p className="text-muted-foreground text-lg font-medium">
              Paste your prompt, choose a model, and see your cost instantly.
            </p>
        </div>

        {/* Two-panel layout: Step 01 stacked on mobile, inline on desktop */}
        <div id="calculate-section" className="relative scroll-mt-20">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Panel - 60% */}
            <div className="w-full lg:w-[60%] space-y-6">
              {mounted && restored && (
                <RestoredSessionBanner onClear={() => setRestored(false)} />
              )}
              <PromptEditor />
            </div>

            {/* Right Panel - 40%, sticky */}
            <div className="w-full lg:w-[40%]">
              <div className="lg:sticky lg:top-[72px]">
                <div className="space-y-6">
                  <MetricsDashboard />
                  {hasPromptContent && <ConversationSimulator />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Connector */}
        <div className="hidden md:flex justify-center mt-8 mb-4">
          <div className="w-px h-16 border-l-2 border-dashed border-[#00dcb4]/40"></div>
        </div>

        {/* Step 02 - Compare Mode */}
        {showComparisonTable && (
          <>
            <div className="animate-fade-in my-8 relative z-10">
              <CompareMode />
            </div>
            
            {/* Visual Connector */}
            <div className="hidden md:flex justify-center mt-8 mb-4">
              <div className="w-px h-16 border-l-2 border-dashed border-[#00dcb4]/40"></div>
            </div>
          </>
        )}

        {/* Step 03 - Agentic Loop Simulator section */}
        <div className="my-8 relative z-10 text-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#00dcb4]/10 text-[#00dcb4] text-sm font-mono font-bold tracking-widest uppercase mb-4 border border-[#00dcb4]/20">
              STEP 03 &mdash; Simulate your agent&apos;s total cost over time
            </div>
            <p className="text-muted-foreground text-lg font-medium mb-8">
              See how costs compound across multiple turns &mdash; before you build.
            </p>
            <div className="text-left space-y-6 max-w-4xl mx-auto">
              <div className="text-xs font-mono text-[#00dcb4] uppercase tracking-wider mb-2">Step 1 — Set your initial context (optional)</div>
              <FileContextUploader />
              
              <div className="text-xs font-mono text-[#00dcb4] uppercase tracking-wider mb-2 mt-8">Step 2 — Configure your loop parameters</div>
              <AgentLoopSimulator />
            </div>
        </div>


        {/* API Integration Section */}
        <div className="pt-8">
          <ApiIntegrationSection />
        </div>

        {/* Budget Reverse Calculator */}
        <div className="pt-4">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
            <BudgetCalculator />
          </Card>
        </div>



        {/* Features Showcase */}
        <div className="pt-24 pb-12">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">Powerful Tools for AI Developers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Everything you need to optimize your LLM costs and architectural decisions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group flex flex-col space-y-4 p-8 rounded-3xl bg-card border border-border/40 hover:border-[#00dcb4]/40 hover:bg-black/20 hover:-translate-y-1 transition-all duration-[250ms] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-[#00dcb4]/70 transition-all duration-300"></div>
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center text-3xl mb-2 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-2xl font-bold tracking-tight">Instant Token Count</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  Real-time token counting using each model&apos;s exact tokenizer &mdash; as you type.
                </p>
              </div>
              <div className="pt-4">
                <Button className="w-full justify-between font-bold group-hover:bg-[#00dcb4] group-hover:text-black transition-colors" asChild>
                  <Link href="/#calculate-section">Launch Tool <ChevronRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group flex flex-col space-y-4 p-8 rounded-3xl bg-card border border-border/40 hover:border-[#00dcb4]/40 hover:bg-black/20 hover:-translate-y-1 transition-all duration-[250ms] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-[#00dcb4]/70 transition-all duration-300"></div>
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center text-3xl mb-2 group-hover:scale-110 transition-transform">
                💸
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-2xl font-bold tracking-tight">Pre-Flight Cost Estimate</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  Accurate input + output cost projections before you make a single API call.
                </p>
              </div>
              <div className="pt-4">
                <Button className="w-full justify-between font-bold group-hover:bg-[#00dcb4] group-hover:text-black transition-colors" asChild>
                  <Link href="/comparison">Compare Costs <ChevronRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group flex flex-col space-y-4 p-8 rounded-3xl bg-card border border-border/40 hover:border-[#00dcb4]/40 hover:bg-black/20 hover:-translate-y-1 transition-all duration-[250ms] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-[#00dcb4]/70 transition-all duration-300"></div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-3xl mb-2 group-hover:scale-110 transition-transform">
                🔍
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-2xl font-bold tracking-tight">Multi-Step Agent Cost Estimator</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  See how costs compound across multi-step agent workflows, turn by turn.
                  <span className="block mt-2 text-xs italic text-muted-foreground/70">e.g. 10 tool calls + 5 replies = $X total</span>
                </p>
              </div>
              <div className="pt-4">
                <Button className="w-full justify-between font-bold group-hover:bg-[#00dcb4] group-hover:text-black transition-colors" asChild>
                  <Link href="/workflow">Simulate Loops <ChevronRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* What Is Tokensense-Ai Section */}
        <div className="pt-8 pb-16 border-t border-border/40">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">What Is Tokensense-Ai?</h2>       

            <div className="space-y-4 text-muted-foreground leading-relaxed font-medium">
              <p>
                Tokensense-Ai is a free LLM token cost calculator built for developers, AI engineers, and prompt designers who want to estimate API costs before going live.
              </p>
              <p>
                When you build with large language model APIs like OpenAI, Anthropic Claude, or Google Gemini, you&apos;re billed by the token - not the word, not the character. A single system prompt, a long user message, or an attached file can quietly balloon your cost-per-call. Tokensense-Ai makes that visible.
              </p>

              <div className="pt-4">
                <p className="font-bold text-foreground mb-3 uppercase tracking-wider text-sm">With Tokensense-Ai you can:</p>
                <ul className="space-y-2 list-none pl-0">
                  {[
                    "Count tokens in any prompt (system, user, or combined)",
                    "Estimate cost per API call across popular models like GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro",
                    "Adjust expected output length to see how response tokens affect your bill",
                    "Attach files (.txt, .md, .csv, code, .pdf) to measure file context costs",
                    "Simulate agentic loop costs across multiple LLM calls",
                    "Compare input token price vs. output token price side-by-side"
                  ].map((item, i) => (
                    <li key={i} className="flex flex-row items-start gap-3 mt-1">
                      <svg className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="pt-6 font-bold text-foreground text-center bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10">
                No sign-up. No server. Your prompts never leave your browser.
              </p>
            </div>
          </div>
        </div>



        {/* Token Basics FAQ Section */}
        <div className="pt-8 pb-16 border-t border-border/40">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Token Basics</h2>
            <p className="text-lg text-muted-foreground font-medium">
              Quick answers to common questions about tokens and how they work.
            </p>

            <div className="bg-card border border-border/40 rounded-2xl p-6 sm:p-8 shadow-sm">
              <Accordion type="single" collapsible className="w-full">

                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                    What counts as one token? Is it a word, character, or something else?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed font-medium">
                    A token is a unit of text that LLMs process. In English, one token is roughly 3-4 characters or about 3/4 of a word. However, tokenization isn&apos;t perfectly linear - it depends on the model and its tokenizer. Common words and punctuation like &quot;the&quot; or &quot;,&quot; usually cost 1 token, while longer or uncommon text might cost more. The exact breakdown varies between models (GPT-4o, Claude, Gemini, etc.) because each has its own tokenizer.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                    Why do different models charge different rates for the same text?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed font-medium">
                    Different models have different pricing strategies based on their capabilities, compute costs, and market positioning. For example, GPT-4o costs more than GPT-4 Turbo because it&apos;s more capable. Additionally, each provider (OpenAI, Anthropic, Google) has different business models. Some charge per-token, others offer usage tiers or flat pricing. Input and output tokens are also typically priced differently - output tokens usually cost 2-4x more than input tokens because generating responses is computationally more expensive.   
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                    Do spaces and punctuation count as tokens?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed font-medium">
                    Yes, spaces and punctuation typically count toward your token usage, but not always as full tokens. Spaces are often bundled with adjacent words - &quot;hello world&quot; might tokenize as [&quot;hello&quot;, &quot; world&quot;] (2 tokens) rather than [&quot;hello&quot;, &quot; &quot;, &quot;world&quot;] (3 tokens). Punctuation like periods, commas, and question marks usually take 1 token each. Special characters and formatting can vary. The best way to know for sure is to paste your exact text into Tokensense-Ai and see your model&apos;s actual token count.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                    Why does my token count change slightly between runs with the same prompt?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed font-medium">
                    In most cases, token counts are deterministic - the same text should produce the same count. However, you might see slight variations if you&apos;re switching models, which use different tokenizers. Whitespace differences (tabs vs. spaces), encoding issues, or pasting from different sources can also cause tiny variations. If you&apos;re testing the same prompt and seeing different counts with the same model, try clearing your browser cache or checking for hidden characters. Tokensense-Ai uses the official tokenizer for each model, so you can trust the accuracy.
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </div>
          </div>
        </div>

        {/* Pricing & Accuracy FAQ Section */}
        <div className="pt-8 pb-16 border-t border-border/40">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground uppercase tracking-widest text-sm text-muted-foreground">Frequently Asked Questions</h2>
            <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Pricing & Accuracy</h3>
                <p className="text-lg text-muted-foreground font-medium">
                Questions about pricing data, accuracy, and how estimates are calculated.
                </p>
            </div>

            <div className="bg-card border border-border/40 rounded-2xl p-6 sm:p-8 shadow-sm">
              <Accordion type="single" collapsible className="w-full">

                <AccordionItem value="pricing-1">
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                    How often does Tokensense-Ai update its pricing data?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed font-medium">
                    Tokensense-Ai pricing is updated manually when we become aware of official price changes announced by OpenAI, Anthropic, Google, and other LLM providers. We aim to update within a few days of official announcements. However, pricing can change frequently, so we recommend always verifying the latest rates directly with your provider before making major cost estimates. You&apos;ll see a timestamp on the calculator showing when our price database was last refreshed.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="pricing-2">
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                    Why might my actual API bill differ from Tokensense-Ai&apos;s estimate?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed font-medium">
                    Several factors can cause differences between Tokensense-Ai estimates and your actual bill: 1) Pricing updates - rates may have changed since we last updated. 2) Model routing - some providers automatically route requests to different models or variants. 3) Batch processing discounts - if you use batch APIs, you may receive discounts. 4) Usage tier discounts - reaching higher usage tiers can lower per-token costs. 5) Special agreements - enterprise customers may have custom pricing. Always cross-check with your provider&apos;s usage dashboard for accurate billing.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="pricing-3">
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                    Are the prices shown inclusive of taxes or fees?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed font-medium">
                    No, Tokensense-Ai displays base API pricing only, before taxes, VAT, or any platform fees. The prices shown are the per-token rates published by each provider. Your final invoice may include: regional sales tax, VAT (if applicable), payment processing fees, or platform surcharges (e.g., if you&apos;re using a third-party API gateway). Check your provider&apos;s billing page and local tax regulations to understand your actual total cost.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="pricing-4" className="border-b-0">
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                    Do batch API discounts get reflected in the estimates?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed font-medium">
                    No, Tokensense-Ai shows standard pay-as-you-go pricing only. Batch API discounts (offered by OpenAI, Anthropic, and others) are not reflected in the estimates because they vary by provider and batch size. If you plan to use batch APIs, you should manually apply the discount percentage (typically 40-50% off) to Tokensense-Ai&apos;s estimates. We may add batch pricing as a separate calculator option in the future, so check back for updates.
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </div>
          </div>
        </div>

        {/* Bug Report Section removed from main flow as per UX guide */}
        {/* Social Share - Bottom */}
        <SocialShareBar variant="bottom" />
      </main>

    </div>
  );
}

