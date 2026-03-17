"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";
import { Bot } from "lucide-react";
import { models, ModelConfig } from "@/lib/models";
import { calculateCacheCost, CacheCostResult } from "@/lib/costEngine";
import NumberCounter from "@/components/NumberCounter";
import TrustMessage from "@/components/TrustMessage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function ContextCachingPage() {
    const [selectedModelId, setSelectedModelId] = useState(models[0].id);
    const [staticTokens, setStaticTokens] = useState<number>(100000);
    const [dynamicTokens, setDynamicTokens] = useState<number>(500);
    const [outputTokens, setOutputTokens] = useState<number>(200);
    const [cachingEnabled, setCachingEnabled] = useState(true);

    const model = models.find((m) => m.id === selectedModelId) || models[0];
    const isCacheSupported = model.cacheReadPricePer1M !== undefined;

    const result: CacheCostResult = calculateCacheCost(
        staticTokens || 0,
        dynamicTokens || 0,
        outputTokens || 0,
        model
    );

    // If caching is off or unsupported, the "active" cost is standard
    const activeCost = (cachingEnabled && isCacheSupported) ? result.totalCachedCost : result.totalStandardCost;

    return (
        <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="space-y-4 mb-10 text-center md:text-left">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                        Context Caching Calculator
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        Anthropic and Google offer prompt caching, drastically reducing the cost of long-context inputs if they are reused. Understand your exact savings by splitting your input into static and dynamic context.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Controls Panel */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Caching Variables</CardTitle>
                            <CardDescription>Adjust your context and model to see the cost difference.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2.5">
                                <Label htmlFor="cachingModel">AI Model</Label>
                                <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                                    <SelectTrigger id="cachingModel">
                                        <SelectValue placeholder="Select a model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {models.map((m) => (
                                            <SelectItem key={m.id} value={m.id}>
                                                {m.name} {!m.cacheReadPricePer1M && "(No Caching)"}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2.5">
                                <Label htmlFor="staticContext" className="flex items-center justify-between">
                                    <span>Static Context Tokens</span>
                                    <span className="text-xs text-muted-foreground font-normal">Uploaded once, cached</span>
                                </Label>
                                <Input
                                    id="staticContext"
                                    type="number"
                                    min="0"
                                    value={staticTokens}
                                    onChange={(e) => setStaticTokens(parseInt(e.target.value) || 0)}
                                />
                            </div>

                            <div className="space-y-2.5">
                                <Label htmlFor="dynamicContext" className="flex items-center justify-between">
                                    <span>Dynamic Context Tokens</span>
                                    <span className="text-xs text-muted-foreground font-normal">Changes per request</span>
                                </Label>
                                <Input
                                    id="dynamicContext"
                                    type="number"
                                    min="0"
                                    value={dynamicTokens}
                                    onChange={(e) => setDynamicTokens(parseInt(e.target.value) || 0)}
                                />
                            </div>

                            <div className="space-y-2.5">
                                <Label htmlFor="outputTokens" className="flex items-center justify-between">
                                    <span>Expected Output Tokens</span>
                                    <span className="text-xs text-muted-foreground font-normal">Model response</span>
                                </Label>
                                <Input
                                    id="outputTokens"
                                    type="number"
                                    min="0"
                                    value={outputTokens}
                                    onChange={(e) => setOutputTokens(parseInt(e.target.value) || 0)}
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-border/40">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-semibold">Enable Context Caching</Label>
                                    <p className="text-xs text-muted-foreground">Compare standard vs. cached pricing</p>
                                </div>
                                <Switch
                                    checked={cachingEnabled}
                                    onCheckedChange={setCachingEnabled}
                                    disabled={!isCacheSupported}
                                />
                            </div>
                            {!isCacheSupported && (
                                <p className="text-xs text-amber-500 mt-2">
                                    Note: Context caching is not currently supported or documented by this model/provider.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Results Panel */}
                    <div className="space-y-6">
                        <Card className={`shadow-lg border-2 transition-all duration-300 ${cachingEnabled && isCacheSupported 
                            ? "bg-gradient-to-br from-green-500/5 via-card to-green-500/5 border-green-500/40 shadow-green-500/20" 
                            : "bg-gradient-to-br from-card to-card/50 border-border shadow-indigo-500/10"}`}>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">Cost per Turn</CardTitle>
                                <CardDescription>Estimated cost for a single API call (after the initial cache write).</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 mb-6 transition-all duration-300 ${cachingEnabled && isCacheSupported 
                                    ? "bg-green-500/15 border-green-500/40 shadow-lg shadow-green-500/20" 
                                    : "bg-indigo-500/10 border-indigo-500/30 shadow-lg shadow-indigo-500/10"}`}>
                                    <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                                        {cachingEnabled && isCacheSupported ? "💾 Cached Total Cost" : "Standard Total Cost"}
                                    </div>
                                    <div className={`text-6xl font-black tracking-tighter transition-colors duration-300 ${cachingEnabled && isCacheSupported ? "text-green-500" : "text-indigo-500"}`}>
                                        $<NumberCounter 
                                            value={activeCost} 
                                            decimals={5}
                                            duration={600}
                                            className="font-black"
                                        />
                                    </div>
                                </div>

                                {/* Comparison Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-5 rounded-xl border-2 flex flex-col justify-between h-full transition-all duration-300 ${!cachingEnabled || !isCacheSupported 
                                        ? "bg-indigo-500/15 border-indigo-500/40 shadow-md shadow-indigo-500/10" 
                                        : "bg-card/40 border-border/40 opacity-60"}`}>
                                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                                            Without Cache
                                        </div>
                                        <div className={`text-3xl font-black tabular-nums transition-colors duration-300 ${!cachingEnabled || !isCacheSupported 
                                            ? "text-indigo-500" 
                                            : "text-foreground"}`}>
                                            ${result.totalStandardCost.toFixed(5)}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-3">
                                            All {staticTokens + dynamicTokens} tokens at standard rate.
                                        </div>
                                    </div>

                                    <div className={`p-5 rounded-xl border-2 flex flex-col justify-between h-full transition-all duration-300 ${cachingEnabled && isCacheSupported 
                                        ? "bg-green-500/15 border-green-500/40 shadow-md shadow-green-500/10" 
                                        : "bg-card/40 border-border/40 opacity-60"}`}>
                                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                                            <span>With Cache</span>
                                            {isCacheSupported && (
                                                <span className={`text-[10px] font-black px-2 py-1 rounded-full ml-2 hidden sm:inline-block transition-colors duration-300 ${cachingEnabled && isCacheSupported
                                                    ? "bg-green-500/30 text-green-600 dark:text-green-400" 
                                                    : "bg-muted text-muted-foreground"}`}>
                                                    -{((1 - result.totalCachedCost / result.totalStandardCost) * 100).toFixed(0)}%
                                                </span>
                                            )}
                                        </div>
                                        <div className={`text-3xl font-black tabular-nums transition-colors duration-300 ${isCacheSupported && cachingEnabled
                                            ? "text-green-600 dark:text-green-400" 
                                            : "text-muted-foreground"}`}>
                                            {isCacheSupported ? `$${result.totalCachedCost.toFixed(5)}` : "N/A"}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-3">
                                            {isCacheSupported
                                                ? "Discounted rate on cached context."
                                                : "Not supported by this model."}
                                        </div>
                                    </div>
                                </div>

                                {isCacheSupported && (
                                    <div className="mt-6 text-xs text-muted-foreground/80 bg-muted/40 p-3 rounded-lg border border-border/50">
                                        <strong>Note on first run:</strong> Writing to the cache typically costs slightly more or the same as standard input (e.g., Anthropic charges 1.25x for writes). The savings outlined above apply to the subsequent read turns utilizing the existing cache.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Context Caching FAQ Section */}
            <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Context Caching</h2>
                    <p className="text-lg text-muted-foreground">
                        Frequently asked questions about how context caching works and what to expect.
                    </p>
                    
                    <div className="bg-card border border-border/40 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <Accordion type="single" collapsible className="w-full">
                            
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                    How long does a cached prompt stay cached before it expires?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Cache retention policies vary by provider. Anthropic retains cached prompts for 5 minutes or until your session ends, whichever is shorter. Google Gemini caches for up to 1 hour. These timeframes are designed to balance cost savings with freshness — if you need longer-lived caches, you may want to re-upload your cached context more frequently or batch your requests within the cache window. Always check your provider&apos;s documentation for current retention policies.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                    Does context caching work for image inputs, or just text?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Context caching works for both text and images. Anthropic and Google allow you to cache image content just like text. This is especially powerful for workflows where you repeatedly analyze the same images or documents. When you cache an image, the token cost breakdown still applies — you save on the discounted read rate for any repeated analysis. For multimodal workflows with heavy image usage, caching can provide substantial cost reductions.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                    Is there a minimum token threshold to qualify for cache pricing?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Yes, most providers require a minimum token count to enable caching. Anthropic requires at least 1,024 tokens of cached context, and Google Gemini typically requires a similar threshold. If your prompt is below this minimum, caching won&apos;t activate, and you&apos;ll pay standard rates instead. Tokensense-Ai will indicate if your prompt is below the minimum threshold for your selected model, so you can decide whether to expand your context or use standard pricing.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-4" className="border-b-0">
                                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                    What happens if my cached prompt changes slightly — does it bust the cache?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Yes, any change to the cached content will bust the cache. Even a single character difference, a whitespace change, or a different line break will cause the cache to miss and start fresh. This is by design — the cache key is based on the exact hash of your cached content. If you need to make adjustments, plan for the cache to reset. However, you can structure prompts strategically by putting frequently-changing content in the &quot;dynamic&quot; section and keeping stable content in the &quot;static&quot; cached section to minimize cache misses.
                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/40 mt-auto bg-muted/20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex items-center justify-center w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm text-white">
                                <Bot className="w-3.5 h-3.5 text-indigo-50" />
                            </div>
                            <p className="text-sm font-medium text-foreground">
                                Token clarity, before every call.
                            </p>
                        </div>
                        <TrustMessage />
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-muted-foreground/60">
                            <p>Tokensense-Ai — Prices are estimates based on public API pricing.</p>
                            <span className="hidden sm:inline">•</span>
                            <p>Built with Next.js, Tailwind CSS, and tiktoken</p>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-muted-foreground/80">
                            <Link href="/multimodal" className="hover:text-indigo-400 transition-colors">Image Estimator</Link>
                            <Link href="/caching" className="hover:text-indigo-400 transition-colors">Context Caching</Link>
                            <Link href="/faq" className="hover:text-indigo-400 transition-colors">FAQ</Link>
                            <Link href="/about" className="hover:text-indigo-400 transition-colors">About</Link>
                            <Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact Us</Link>
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground/60">
                            <Link href="/terms" className="hover:text-indigo-400 underline underline-offset-2 transition-colors">
                                Terms of Service
                            </Link>
                            <span>|</span>
                            <Link href="/privacy" className="hover:text-indigo-400 underline underline-offset-2 transition-colors">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
