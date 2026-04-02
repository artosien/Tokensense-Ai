import { Metadata } from 'next';
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tokensense-Ai FAQ | Understanding AI Tokens & API Costs",
  description: "Find answers to common questions about AI tokens, LLM API pricing, and how Tokensense-Ai calculates costs privately for GPT-4, Claude, and Gemini.",
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: "Frequently Asked Questions | Tokensense-Ai",
    description: "Everything you need to know about AI tokens, API pricing, and privacy-first cost estimation.",
    url: 'https://www.tokensense-ai.com/faq',
    type: 'website',
    images: [
      {
        url: '/og-faq.png', // Recommended: An image with FAQ text or a clean screenshot of the UI
        width: 1200,
        height: 630,
        alt: 'Tokensense-Ai FAQ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "AI Token & Pricing FAQ",
    description: "Get answers to common questions about LLM economics and privacy.",
    images: ['/og-faq.png'],
  },
};

function FAQSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a token in AI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A token is the basic unit of text that large language models process. In English, one token is roughly 3–4 characters or about 3/4 of a word. Pricing for LLM APIs like OpenAI and Anthropic is based on the number of tokens consumed."
        }
      },
      {
        "@type": "Question",
        "name": "How does Tokensense-Ai count tokens without sending my data to a server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tokensense-Ai uses tiktoken, OpenAI's open-source tokenizer library, compiled to WebAssembly and running entirely in your browser. Your text is tokenized locally—nothing is transmitted to any server."
        }
      },
      {
        "@type": "Question",
        "name": "Does Tokensense-Ai store my prompts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Tokensense-Ai is 100% client-side. Your prompts are processed locally in your browser and never sent to any server, ensuring total privacy."
        }
      },
      {
        "@type": "Question",
        "name": "What is an agentic loop in LLM cost estimation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An agentic loop is when an AI agent calls an LLM repeatedly across multiple steps (planning, tool use, reflection). Tokensense-Ai's Agentic Loop Simulator shows the compounding total cost across these iterations so you can budget accurately."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use Tokensense-Ai to estimate costs for a chatbot or multi-turn conversation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The Agentic Loop Simulator is designed for this. Set your system prompt, average message length, and number of turns to see how compounding token costs affect your full conversation bill."
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

export const dynamic = 'force-static';

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-background">
            <FAQSchema />
            <SiteHeader />

            {/* Main Content */}
            <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Everything you need to know about AI tokens, API pricing, and how Tokensense-Ai works.
                    </p>
                </div>

                {/* Structured Data Section for SEO */}
                <section aria-label="FAQ Content" className="bg-card border border-border/40 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <Accordion type="multiple" defaultValue={["item-1", "item-4", "item-8", "item-11", "item-14", "item-17"]} className="w-full">

                        {/* General Category */}
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4 mt-6 first:mt-0">General</h3>

                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                What is a token in AI?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                A token is the basic unit of text that large language models process. In English, one token is roughly 3–4 characters or about ¾ of a word. Pricing for LLM APIs like OpenAI and Anthropic is based on the number of tokens consumed, not characters or words.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                What is the difference between input tokens and output tokens?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                Input tokens are the tokens in your prompt — the text you send to the model. Output tokens are the tokens in the model&apos;s response. Output tokens typically cost more than input tokens, which is why controlling response length is an important cost lever.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                Is Tokensense-Ai free?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                Yes. Tokensense-Ai is completely free to use and requires no account or sign-up.
                            </AccordionContent>
                        </AccordionItem>

                        {/* Models & Pricing Category */}
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4 mt-8">Models & Pricing</h3>

                        <AccordionItem value="item-4">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                How do I calculate GPT-4o token cost?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                GPT-4o is priced at $2.50 per million input tokens and $10.00 per million output tokens (as of March 2026). Tokensense-Ai automatically calculates this for any prompt you paste in. Always verify rates with OpenAI before production deployment, as pricing may change.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-5">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                Which AI models does Tokensense-Ai support?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                Tokensense-Ai supports models from OpenAI (GPT-4o, GPT-4 Turbo, GPT-3.5), Anthropic (Claude 3.5 Sonnet, Claude 3 Opus, Haiku), Google (Gemini 1.5 Pro, Flash), and Meta (Llama 3 via API providers). The comparison table shows all supported models and their current pricing side by side.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-6">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                How often are the token prices updated?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                Prices are updated manually when providers announce changes. Always verify final pricing against your provider&apos;s official pricing page before budgeting production workloads. A timestamp of the last update is shown in the Comparison Table.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-7">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                Why do different models cost different amounts per token?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                Pricing reflects model size, capability, and inference cost for the provider. Larger, more capable models (like GPT-4o or Claude 3 Opus) cost significantly more per token than smaller, faster models (like GPT-3.5 Turbo or Claude Haiku). Choosing the right model for the task is often the single biggest lever for reducing API costs.
                            </AccordionContent>
                        </AccordionItem>

                        {/* How It Works Category */}
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4 mt-8">How It Works</h3>

                        <AccordionItem value="item-8">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                How does Tokensense-Ai count tokens without sending my data to a server?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                Tokensense-Ai uses <a href="https://github.com/openai/tiktoken" className="text-plasma-400 underline hover:text-cyan-300">tiktoken</a>, OpenAI&apos;s open-source tokenizer library, compiled to WebAssembly and running entirely in your browser. Your text is tokenized locally — nothing is transmitted. This means counts are accurate for OpenAI models, and approximate for other providers that use similar BPE tokenization schemes.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-9">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                Are Tokensense-Ai&apos;s token counts 100% accurate?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                For OpenAI models, counts are highly accurate as Tokensense-Ai uses the same tiktoken library OpenAI uses internally. For Anthropic and Google models, counts are close approximations — these providers use their own tokenizers which are not publicly released. Treat non-OpenAI counts as reliable estimates, not exact figures.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-10">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                What is the difference between Tokensense-Ai and just reading the API docs?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                API docs give you a per-token price. Tokensense-Ai tells you what your <em>actual prompt</em> will cost — accounting for system prompts, user messages, expected output length, and multi-turn conversation overhead — before you make a single API call. It also lets you compare that cost across multiple models simultaneously.
                            </AccordionContent>
                        </AccordionItem>

                        {/* Use Cases Category */}
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4 mt-8">Use Cases</h3>

                        <AccordionItem value="item-11">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                Can I use Tokensense-Ai to estimate costs for a chatbot or multi-turn conversation?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                Yes. The Agentic Loop Simulator is designed for exactly this. Set your system prompt, average user message length, expected output, and number of turns — and Tokensense-Ai will show you the compounding token cost across the full conversation. Multi-turn conversations are one of the most common sources of unexpectedly high API bills.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-12">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                How do I estimate costs for an AI app that processes user-uploaded documents?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                Use the main Token Calculator to paste in a representative sample of the document content alongside your system prompt. For image-heavy documents, use the Multimodal Image Estimator to calculate the vision token overhead per image. Add both figures for a per-request estimate, then multiply by your expected daily volume.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-13">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                What is prompt caching and when should I use it?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                Prompt caching (offered by Anthropic and Google) lets you cache a static portion of your input — like a long system prompt or reference document — so it isn&apos;t re-billed at full price on every request. It&apos;s most cost-effective when you have a large static context (10,000+ tokens) that repeats across many requests. Use the Context Caching Calculator to see your exact savings.
                            </AccordionContent>
                        </AccordionItem>

                        {/* Privacy & Trust Category */}
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4 mt-8">Privacy & Trust</h3>

                        <AccordionItem value="item-14">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                Does Tokensense-Ai store my prompts?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                No. Tokensense-Ai is 100% client-side. Your prompts are processed locally in your browser and never sent to any server.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-15">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                Does Tokensense-Ai require an account or API key?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                No. Tokensense-Ai requires no sign-up, no account, and no API key. Open the app and start calculating immediately. Your prompts and usage data never leave your browser.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-16">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                Is Tokensense-Ai open source?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                Yes. Tokensense-Ai is open source under the Apache 2.0 license. You can view the source code, report issues, or contribute on GitHub. The open core model means the core calculator will always be free.
                            </AccordionContent>
                        </AccordionItem>

                        {/* Workflow & Automation Category */}
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4 mt-8">Workflow & Automation</h3>

                        <AccordionItem value="item-17">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                What is an agentic loop in LLM cost estimation?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                An agentic loop is when an AI agent calls an LLM repeatedly across multiple steps or iterations (e.g., planning, tool use, reflection). Each loop re-sends context, meaning token costs compound quickly. Tokensense-Ai&apos;s Agentic Loop Simulator shows total cost across N iterations so you can budget AI agent workflows accurately.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-18">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                What is the difference between an n8n execution and a Make operation?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                An n8n execution is one full run of a workflow — regardless of how many steps it contains. A Make operation is one module activation — so a 5-step scenario costs 5 operations per run. This fundamental billing difference means complex workflows are significantly cheaper on n8n at scale.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-19" className="border-b-0">
                            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                Does the Workflow Estimator account for self-hosted n8n?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                The Workflow Estimator shows n8n Cloud pricing. Self-hosted n8n has no per-execution cost — your only cost is the server. If your estimated n8n Cloud bill exceeds ~$20–30/month, self-hosting on a basic VPS ($5–10/month) is likely worth considering.
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                </section>

                {/* CTA Section */}
                <section className="mt-16 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-2xl p-8 sm:p-12 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        Ready to estimate your LLM costs?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Start using Tokensense-Ai right now to calculate token costs before every API call. No signup required, 100% client-side, completely free.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/">
                            <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold">
                                Start Calculating
                            </Button>
                        </Link>
                        <Link href="/workflow">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                Try Agent Loop Simulator
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

        </div>
    );
}

