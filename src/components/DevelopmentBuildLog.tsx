'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const buildLogItems = [
  "[2026-03-06] Initialize Next.js 15 repository with React 19 & Tailwind CSS v4.",
  "[2026-03-06] Setup shadcn/ui components (Textarea, Slider, Progress, Badges).",
  "[2026-03-06] Implement Zustand for cross-component state management.",
  "[2026-03-06] Implement tiktoken WASM for client-side purely private token counting.",
  "[2026-03-06] Build Cost Dashboard with dynamic provider/model pricing list.",
  "[2026-03-06] Add FileContextUploader using react-dropzone and pdfjs-dist for local parsing.",
  "[2026-03-06] Implement Agent Loop Simulator math for compounded execution costs.",
  "[2026-03-07] Add Context Caching Calculator for break-even analysis.",
  "[2026-03-07] Add Multi-Modal Image Token Estimator utilizing dimension-based slice math.",
  "[2026-03-08] Add Prompt Compression (Token Diet) utility, basic and advanced.",
  "[2026-03-08] Add Web Speech API integration for direct prompt voice dictation.",
  "[2026-03-08] Polishing UI/UX: Parallax hero images, Back-to-Top bots, semantic HTML.",
  "[2026-03-08] Add Terms of Service and Privacy Policy pages.",
  "[2026-03-08] Update App Branding with new logo and tagline.",
  "[2026-03-09] Refactor navigation to include an animated Mobile Hamburger Menu.",
  "[2026-03-10] Add Token Cost Comparison Table with real-time math and Best Value highlight.",
  "[2026-03-10] Add Workflow Cost Estimator with Blueprint Model, platform tax, and ROI calculator.",
  "[2026-03-16] Implement LoadingScreen component with animated computing icon and auto-hide logic.",
  "[2026-03-16] Enhance FAQ page: Set first 2 accordion items to open by default, add prominent CTA section.",
  "[2026-03-16] Expand Image Estimator upload zone (h-48 → h-80) with enhanced hover states and visual feedback.",
  "[2026-03-16] Build NumberCounter component with smooth ease-out animations for dynamic cost displays.",
  "[2026-03-16] Add visual emphasis to Context Caching cost output card with gradient backgrounds and animated counters.",
  "[2026-03-16] Create TrustBadge component with lock icon and interactive tooltip; replace generic badges across nav.",
  "[2026-03-16] Add Token Basics FAQ section (4 questions) to homepage with accordion styling.",
  "[2026-03-16] Add Pricing & Accuracy FAQ section (4 questions) to homepage covering updates, tax, batch discounts.",
  "[2026-03-16] Add Image / Multimodal FAQ section (4 questions) to Image Estimator page.",
  "[2026-03-16] Add Context Caching FAQ section (4 questions) to Context Caching page.",
  "[2026-03-16] Add Workflow / Agentic FAQ section (4 questions) to main FAQ page covering multi-turn costs, tool calls, system prompts, RAG.",
  "[2026-03-16] Fix build error: Remove duplicate closing div tag from Context Caching page.",
  "[2026-03-16] Expand Workflow Estimator page: Add 'How Workflow Costs Are Calculated' explainer (n8n, Make, Zapier billing models).",
  "[2026-03-16] Add 'Related Calculators' section to Workflow page linking to Token Calculator, Context Caching, and Model Comparison.",
  "[2026-03-16] Create PlatformComparisonTable component with desktop table + mobile cards; displays cost per 1K runs, monthly, annual, best-value badge.",
  "[2026-03-16] Implement dynamic 'Smart Insight' callout in comparison showing best platform and monthly savings.",
  "[2026-03-16] Create BreakevenCallout component: Analyzes platform crossover points and cost differences; suggests n8n self-hosting for complex workflows.",
  "[2026-03-16] Create SelfHostingTipCard component: Contextual n8n self-hosting opportunity card with ROI math and dismissible state.",
  "[2026-03-16] Fix nav layout: Remove TrustBadge from SiteHeader navigation (desktop + mobile), remove nav border-l for cleaner header.",
  "[2026-03-16] Create TrustMessage component: Reusable footer-friendly privacy indicator with lock icon. Replaces nav badge placement.",
  "[2026-03-16] Integrate TrustMessage across all 10 page footers (homepage, faq, about, multimodal, caching, workflow, comparison, contact, terms, privacy).",
  "[2026-03-16] Create HeroBadges component: Three product pills ('100% Client-Side', 'No Sign-up', 'Free Forever') with cyan borders and hover effects.",
  "[2026-03-16] Integrate HeroBadges below hero headline on homepage for stronger first impression with trust signals.",
  "[2026-03-16] Refactor FAQ page from 10 to 19 questions organized into 6 searchable categories (General, Models & Pricing, How It Works, Use Cases, Privacy & Trust, Workflow & Automation).",
  "[2026-03-16] Add category subheadings to FAQ page for improved scannability and information architecture.",
  "[2026-03-16] Pre-expand first question in each FAQ category on page load for better discoverability.",
  "[2026-03-16] Add 12 new FAQ questions covering: token counting architecture, model accuracy tiers, n8n vs Make pricing, prompt caching strategy, open-source transparency, and document processing workflows.",
  "[2026-03-16] Add HTML link to tiktoken GitHub in 'How It Works' FAQ section for developer credibility.",
  "[2026-03-17] Fix 1 — Increase hero section height: Set min-h-screen (85vh mobile, 100vh desktop) for vertical breathing room and proper centering.",
  "[2026-03-17] Fix 2 — Strengthen headline hierarchy: Split headline across two lines with second line in gradient (cyan→indigo→purple), bump font to 5xl-7xl.",
  "[2026-03-17] Fix 3 — Add trust badge row below CTA: Four cyan-bordered pills (100% Client-Side, No Sign-up, Free Forever, Open Source) with backdrop blur.",
  "[2026-03-17] Fix 4 — Hero image gradient overlay: Add bottom-to-top fade (from background → transparent) to elegantly blend image into page.",
  "[2026-03-17] Fix 5 — Add social proof line: 'Trusted by developers, AI engineers, and prompt designers worldwide' in italic below badges.",
  "[2026-03-17] Fix 6 — Improve CTA button: Updated copy to 'Estimate My First Prompt' (more action-forward), larger size (h-14 px-10), gradient hover with cyan glow.",
  "[2026-03-17] Fix 7 — Verified mobile responsiveness: Headlines scale gracefully (5xl→6xl→7xl), badges wrap cleanly, CTA full-width on mobile, min-height preserved at 85vh.",
  "[2026-03-17] Fix hydration error: Moved scroll handler to component level, added typeof check for client-side DOM access.",
  "[2026-03-17] Fix missing imports: Added TrustMessage imports to workflow, caching, and contact pages.",
  "[2026-04-02] Comprehensive Tool Overhaul: Transform static dashboards into interactive developer workbases.",
  "[2026-04-02] Update Batch Cost Planner: Add 'Optimization Suite' with Throughput Forecaster, Reliability Buffer, and Print-ready Executive Reports.",
  "[2026-04-02] Enhance Pricing History: Implement 'Deflation Index', 'Model Migration ROI' forecaster, and 'Value Outlier' benchmark scatter plots.",
  "[2026-04-02] Upgrade Prompt Compression: Add Lossless vs. Extreme modes, Semantic Fidelity Scoring, Visual Diffing, and Data Minification.",
  "[2026-04-02] Refactor Context Visualizer: Add 'Needle-in-a-Haystack' simulator, interactive history pruning, and TTFT latency estimates.",
  "[2026-04-02] Rebuild Caching Tool: Integrate 'Break-Even' logic, TTL strategy planning, and multi-turn conversation growth simulations.",
  "[2026-04-02] System-wide Update: Synchronize Tokenizer Sync across all tools; update Sitemap and metadata for new tool discovery.",
  "[2026-04-08] Clean Up: Delete /token-learning and /token-learning/how-tokenizers-work pages; update sitemaps.",
  "[2026-04-08] Home Restructure: Move 'Start Your Optimization Journey' banner to bottom; link 'Learn Tokenomics' to /tokenomics.",
  "[2026-04-08] Media Overhaul: Replace hero image with autoplaying promo video; swap local videos in Modules 1-4 for optimized YouTube embeds.",
  "[2026-04-08] Performance: Compress 15+ large blog images (PNG → WebP) with 95%+ size reduction; update blog-posts.json with new assets.",
  "[2026-04-15] Media: Replace YouTube iframe with local high-performance promo video in 'Master Your AI Budget' section.",
];

const RECENT_COUNT = 8;

export default function DevelopmentBuildLog() {
  const [isExpanded, setIsExpanded] = useState(false);

  const recentItems = buildLogItems.slice(-RECENT_COUNT).reverse();
  const allItems = [...buildLogItems].reverse();
  const displayItems = isExpanded ? allItems : recentItems;

  return (
    <div className="space-y-4">
      <div className="bg-muted/30 p-4 rounded-lg border border-border/40 font-mono text-sm overflow-x-auto space-y-2 text-foreground/80">
        {displayItems.map((item, idx) => (
          <p key={idx}>{item}</p>
        ))}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all text-sm font-semibold text-indigo-400"
      >
        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        {isExpanded ? `Collapse (${allItems.length} total)` : `Show All Logs (${allItems.length} total)`}
      </button>

      <p className="text-indigo-400 text-sm font-medium">
        Status: Build log live. Latest updates: {recentItems[0].match(/\d{4}-\d{2}-\d{2}/)?.[0] || 'today'}.
      </p>
    </div>
  );
}
