import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Pricing Changelog — TokenSense AI",
  description:
    "A reverse-chronological log of pricing data updates for all AI models supported by TokenSense AI, including OpenAI, Anthropic, Google, and more.",
};

interface ChangeEntry {
  date: string;
  entries: Array<{
    type: "add" | "update" | "correct" | "remove";
    text: string;
  }>;
}

const CHANGELOG: ChangeEntry[] = [
  {
    date: "Mar 2026",
    entries: [
      { type: "add", text: "Added GPT-5.2 pricing ($1.75 in / $14.00 out per 1M)." },
      { type: "add", text: "Added GPT-5 Mini pricing ($0.25 in / $2.00 out per 1M)." },
      { type: "add", text: "Added Claude 4.6 Opus pricing ($5.00 in / $25.00 out per 1M)." },
      { type: "add", text: "Added Claude 4.6 Sonnet pricing ($3.00 in / $15.00 out per 1M)." },
      { type: "add", text: "Added Claude 4.5 Haiku pricing ($1.00 in / $5.00 out per 1M)." },
      { type: "add", text: "Added Gemini 3.1 Pro Preview pricing ($2.00 in / $12.00 out per 1M)." },
      { type: "add", text: "Added Gemini 3 Flash pricing ($0.50 in / $3.00 out per 1M)." },
      { type: "add", text: "Added Grok 4 pricing ($3.00 in / $15.00 out per 1M)." },
      { type: "update", text: "Refreshed prompt caching prices for all Anthropic Claude 4.x models." },
    ],
  },
  {
    date: "Feb 2026",
    entries: [
      { type: "add", text: "Added Gemini 2.5 Pro pricing ($1.25 in / $10.00 out per 1M)." },
      { type: "add", text: "Added Gemini 2.5 Flash-Lite pricing ($0.10 in / $0.40 out per 1M)." },
      { type: "update", text: "Updated Gemini context window sizes to reflect 2M token expansion." },
    ],
  },
  {
    date: "Jan 2026",
    entries: [
      { type: "add", text: "Added Llama 3.3 70B via Meta (DeepInfra) pricing ($0.23 in / $0.40 out per 1M)." },
      { type: "correct", text: "Corrected Claude 3.5 Sonnet context window from 100k to 200k tokens." },
    ],
  },
  {
    date: "Dec 2025",
    entries: [
      { type: "add", text: "Added o1 (Reasoning) model pricing ($15.00 in / $60.00 out per 1M)." },
      { type: "update", text: "Updated GPT-4o pricing after OpenAI's December price reduction." },
      { type: "add", text: "Added prompt caching support for Google Gemini models." },
    ],
  },
  {
    date: "Nov 2025",
    entries: [
      { type: "add", text: "Added o3-mini pricing data." },
      { type: "correct", text: "Fixed incorrect GPT-4o vision tile pricing (base: 85 tokens, tile: 170 tokens)." },
      { type: "update", text: "Refreshed OpenAI batch API discount note in FAQ." },
    ],
  },
  {
    date: "Oct 2025",
    entries: [
      { type: "add", text: "Added Claude 3.5 Haiku pricing ($1.00 in / $5.00 out per 1M)." },
      { type: "update", text: "Updated Anthropic cache write pricing across all Claude models." },
    ],
  },
  {
    date: "Sep 2025",
    entries: [
      { type: "add", text: "Initial pricing database launched with GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro." },
      { type: "add", text: "Added vision pricing strategy for OpenAI tile-based image tokens." },
      { type: "add", text: "Added Anthropic scale-based vision pricing." },
    ],
  },
];

const TYPE_STYLES: Record<string, { dot: string; label: string; text: string }> = {
  add: { dot: "bg-cyan-400", label: "text-cyan-400", text: "text-slate-300" },
  update: { dot: "bg-indigo-400", label: "text-indigo-400", text: "text-slate-300" },
  correct: { dot: "bg-amber-400", label: "text-amber-400", text: "text-amber-200/80" },
  remove: { dot: "bg-red-400", label: "text-red-400", text: "text-red-200/80" },
};

const TYPE_LABELS: Record<string, string> = {
  add: "NEW",
  update: "UPDATE",
  correct: "FIX",
  remove: "REMOVED",
};

function ChangelogSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.tokensense-ai.com/changelog/#webpage",
        "url": "https://www.tokensense-ai.com/changelog",
        "name": "Tokensense-Ai Changelog",
        "description": "Stay updated with the latest features, improvements, and model pricing updates for Tokensense-Ai.",
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
              "name": "Changelog"
            }
          ]
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

export default function ChangelogPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <ChangelogSchema />
            <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 space-y-10">
        {/* Page header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400/70">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              ← Back to Calculator
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Pricing Changelog
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            A log of all pricing data updates. We update costs as quickly as possible after official announcements from OpenAI, Anthropic, Google, and other providers.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground/60 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              NEW addition
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
              update
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              correction
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative space-y-10 pl-4 border-l-2 border-slate-800">
          {CHANGELOG.map((group, gi) => (
            <div key={gi} className="relative">
              {/* Date marker */}
              <div className="absolute -left-[25px] top-0 flex items-center">
                <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-cyan-500/50" />
              </div>

              <div className="pl-6 space-y-3">
                <div className="text-sm font-mono font-bold text-cyan-400/80 tracking-widest uppercase">
                  {group.date}
                </div>

                <div className="rounded-xl border border-border/40 bg-card/40 divide-y divide-border/20 overflow-hidden">
                  {group.entries.map((entry, ei) => {
                    const style = TYPE_STYLES[entry.type];
                    return (
                      <div key={ei} className="flex items-start gap-3 px-4 py-3">
                        <span
                          className={`mt-0.5 shrink-0 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                            entry.type === "add" ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" :
                            entry.type === "update" ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" :
                            entry.type === "correct" ? "text-amber-400 bg-amber-500/10 border-amber-500/30" :
                            "text-red-400 bg-red-500/10 border-red-500/30"
                          }`}
                        >
                          {TYPE_LABELS[entry.type]}
                        </span>
                        <p className={`text-sm font-mono leading-relaxed ${style.text}`}>
                          {entry.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Origin dot */}
          <div className="absolute -left-[6px] bottom-0 w-3 h-3 rounded-full bg-slate-700 border border-slate-600" />
        </div>

        {/* Footer note */}
        <div className="rounded-xl border border-border/40 bg-card/30 p-5 space-y-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">About our data: </span>
            All prices are sourced from official provider pricing pages. While we aim to update within a few days of announcements, always verify rates directly with your provider before making cost-critical decisions.
          </p>
          <p className="text-xs font-mono text-muted-foreground/50">
            {" "}Want to report a pricing error?{" "}
            <Link href="/contact" className="text-cyan-400/70 hover:text-cyan-400 underline underline-offset-2">
              Contact us
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
