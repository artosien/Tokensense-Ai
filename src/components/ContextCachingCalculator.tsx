"use client";

import { useState } from "react";
import { models } from "@/lib/models";
import { calculateCacheCost, CacheCostResult } from "@/lib/costEngine";
import NumberCounter from "@/components/NumberCounter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, TrendingDown, Zap, Sparkles, Plus, Minus } from "lucide-react";

export default function ContextCachingCalculator() {
    // Find a default model that supports caching
    const defaultModel = models.find(m => m.id === "claude-4.6-sonnet") || models.find(m => m.cacheReadPricePer1M !== undefined) || models[0];
    
    const [selectedModelId, setSelectedModelId] = useState(defaultModel.id);
    const [staticTokens, setStaticTokens] = useState<number>(50000);
    const [dynamicTokens, setDynamicTokens] = useState<number>(1000);
    const [outputTokens, setOutputTokens] = useState<number>(500);
    const [cachingEnabled, setCachingEnabled] = useState(true);
    const [callsPerDay, setCallsPerDay] = useState<number>(1000);

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
    
    const savingsPerCall = result.totalStandardCost - result.totalCachedCost;
    const monthlySavings = savingsPerCall * callsPerDay * 30;

    // Group models by provider
    const providers = Array.from(new Set(models.map(m => m.provider)));

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controls Panel */}
                <Card className="shadow-xl border-white/5 bg-slate-900/50 backdrop-blur-md">
                    <CardHeader className="pb-4 border-b border-white/5">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Caching Variables</CardTitle>
                        <CardDescription className="text-xs">Adjust your context and model to see the cost difference.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2.5">
                            <Label htmlFor="cachingModel" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">AI Model</Label>
                            <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                                <SelectTrigger id="cachingModel" className="h-12 rounded-xl bg-white/5 border-white/10 text-slate-200">
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10">
                                    {providers.map(provider => (
                                        <SelectGroup key={provider}>
                                            <SelectLabel className="text-[10px] font-black uppercase text-indigo-400 tracking-tighter opacity-70 px-2 py-1.5">{provider}</SelectLabel>
                                            {models.filter(m => m.provider === provider).map((m) => (
                                                <SelectItem key={m.id} value={m.id} className="text-xs">
                                                    <div className="flex items-center justify-between w-full gap-2">
                                                        <span>{m.name}</span>
                                                        {m.cacheReadPricePer1M ? 
                                                            <span className="text-[9px] font-black bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded ml-auto">SUPPORTS CACHING</span> : 
                                                            <span className="text-[9px] font-bold text-slate-600 ml-auto">(NO CACHE)</span>
                                                        }
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <TooltipProvider>
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="staticContext" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                        Static Context Tokens
                                        <Tooltip>
                                            <TooltipTrigger><HelpCircle className="w-3 h-3 text-slate-600 hover:text-indigo-400" /></TooltipTrigger>
                                            <TooltipContent className="bg-slate-900 border-white/10 text-xs p-3 max-w-[200px]">Large blocks of text (system prompts, documents, or history) that don&apos;t change between multiple requests.</TooltipContent>
                                        </Tooltip>
                                    </Label>
                                    <span className="text-[9px] font-bold text-indigo-400 uppercase">Cached</span>
                                </div>
                                <Input
                                    id="staticContext"
                                    type="number"
                                    min="0"
                                    value={staticTokens}
                                    onChange={(e) => setStaticTokens(parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/10 h-11 font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-2.5">
                                <Label htmlFor="dynamicContext" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                    Dynamic Context Tokens
                                    <Tooltip>
                                        <TooltipTrigger><HelpCircle className="w-3 h-3 text-slate-600 hover:text-indigo-400" /></TooltipTrigger>
                                        <TooltipContent className="bg-slate-900 border-white/10 text-xs p-3 max-w-[200px]">The unique user message or instructions that change with every new API call.</TooltipContent>
                                    </Tooltip>
                                </Label>
                                <Input
                                    id="dynamicContext"
                                    type="number"
                                    min="0"
                                    value={dynamicTokens}
                                    onChange={(e) => setDynamicTokens(parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/10 h-11 font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-2.5">
                                <Label htmlFor="outputTokens" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                    Expected Output Tokens
                                    <Tooltip>
                                        <TooltipTrigger><HelpCircle className="w-3 h-3 text-slate-600 hover:text-indigo-400" /></TooltipTrigger>
                                        <TooltipContent className="bg-slate-900 border-white/10 text-xs p-3 max-w-[200px]">The predicted length of the model&apos;s response.</TooltipContent>
                                    </Tooltip>
                                </Label>
                                <Input
                                    id="outputTokens"
                                    type="number"
                                    min="0"
                                    value={outputTokens}
                                    onChange={(e) => setOutputTokens(parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/10 h-11 font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-2.5 pt-4 border-t border-white/5">
                                <Label htmlFor="callsPerDay" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                    API Calls Per Day
                                    <Tooltip>
                                        <TooltipTrigger><HelpCircle className="w-3 h-3 text-slate-600 hover:text-indigo-400" /></TooltipTrigger>
                                        <TooltipContent className="bg-slate-900 border-white/10 text-xs p-3 max-w-[200px]">Estimated volume of requests to calculate total monthly savings.</TooltipContent>
                                    </Tooltip>
                                </Label>
                                <Input
                                    id="callsPerDay"
                                    type="number"
                                    min="1"
                                    value={callsPerDay}
                                    onChange={(e) => setCallsPerDay(parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/10 h-11 font-mono text-sm"
                                />
                            </div>
                        </TooltipProvider>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="space-y-0.5">
                                <Label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Enable Context Caching</Label>
                                <p className="text-[10px] text-slate-500 font-medium">Toggle to see the price gap</p>
                            </div>
                            <Switch
                                checked={cachingEnabled}
                                onCheckedChange={setCachingEnabled}
                                disabled={!isCacheSupported}
                            />
                        </div>
                        {!isCacheSupported && (
                            <p className="text-[10px] text-amber-500/80 font-bold bg-amber-500/5 p-2 rounded-lg border border-amber-500/10 text-center italic">
                                Note: Caching is not currently supported by this model.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Results Panel */}
                <div className="space-y-6">
                    <Card className={`shadow-2xl border-2 transition-all duration-500 overflow-hidden relative ${cachingEnabled && isCacheSupported 
                        ? "border-green-500/30 bg-slate-900/80" 
                        : "border-white/5 bg-slate-900/50"}`}>
                        
                        {cachingEnabled && isCacheSupported && (
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles className="w-16 h-12 text-green-400" />
                            </div>
                        )}

                        <CardHeader className="pb-4 border-b border-white/5">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Cost Analysis</CardTitle>
                            <CardDescription className="text-xs">Comparison for a single cached API call.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 mb-6 transition-all duration-500 ${cachingEnabled && isCacheSupported 
                                ? "bg-green-500/10 border-green-500/30 shadow-2xl shadow-green-500/10" 
                                : "bg-white/5 border-white/10 shadow-xl"}`}>
                                <div className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">
                                    {cachingEnabled && isCacheSupported ? "💾 Cached Total Cost" : "Standard Total Cost"}
                                </div>
                                <div className={`text-6xl font-black tracking-tighter transition-colors duration-500 font-mono ${cachingEnabled && isCacheSupported ? "text-green-400" : "text-indigo-400"}`}>
                                    $<NumberCounter 
                                        value={activeCost} 
                                        decimals={5}
                                        duration={600}
                                        className="font-black"
                                    />
                                </div>
                            </div>

                            {/* Estimated Savings Callout */}
                            {isCacheSupported && cachingEnabled && savingsPerCall > 0 && (
                                <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-center space-y-1 animate-in zoom-in-95 duration-500">
                                    <div className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center justify-center gap-2">
                                        <TrendingDown className="w-3 h-3" />
                                        Estimated Monthly Savings
                                    </div>
                                    <div className="text-3xl font-black text-white font-mono">${monthlySavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                                    <p className="text-[10px] text-green-400/70 font-bold uppercase">Saving ${savingsPerCall.toFixed(4)} per request at {callsPerDay.toLocaleString()} calls/day</p>
                                </div>
                            )}

                            {/* Comparison Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-5 rounded-2xl border transition-all duration-500 flex flex-col justify-between h-full ${!cachingEnabled || !isCacheSupported 
                                    ? "bg-indigo-500/10 border-indigo-500/30 shadow-lg" 
                                    : "bg-white/5 border-white/5 opacity-40 scale-95"}`}>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                                        Without Cache
                                    </div>
                                    <div className={`text-3xl font-black tabular-nums transition-colors duration-500 font-mono ${!cachingEnabled || !isCacheSupported 
                                        ? "text-indigo-400" 
                                        : "text-slate-200"}`}>
                                        ${result.totalStandardCost.toFixed(5)}
                                    </div>
                                    <div className="text-[9px] text-slate-500 font-bold uppercase mt-3">
                                        Standard Rate
                                    </div>
                                </div>

                                <div className={`p-5 rounded-2xl border transition-all duration-500 flex flex-col justify-between h-full ${cachingEnabled && isCacheSupported 
                                    ? "bg-green-500/10 border-green-500/30 shadow-lg" 
                                    : "bg-white/5 border-white/5 opacity-40 scale-95"}`}>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center justify-between">
                                        <span>With Cache</span>
                                        {isCacheSupported && (
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded bg-green-500 text-black ml-2 hidden sm:inline-block transition-all duration-500 ${cachingEnabled && isCacheSupported
                                                ? "opacity-100 translate-y-0" 
                                                : "opacity-0 translate-y-1"}`}>
                                                -{((1 - result.totalCachedCost / result.totalStandardCost) * 100).toFixed(0)}%
                                            </span>
                                        )}
                                    </div>
                                    <div className={`text-3xl font-black tabular-nums transition-colors duration-500 font-mono ${isCacheSupported && cachingEnabled
                                        ? "text-green-400" 
                                        : "text-slate-400"}`}>
                                        {isCacheSupported ? `$${result.totalCachedCost.toFixed(5)}` : "N/A"}
                                    </div>
                                    <div className="text-[9px] text-slate-500 font-bold uppercase mt-3">
                                        {isCacheSupported
                                            ? "Discounted Rate"
                                            : "Unsupported"}
                                    </div>
                                </div>
                            </div>

                            {isCacheSupported && (
                                <div className="mt-6 text-[10px] text-slate-500 font-medium leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                                    <strong className="text-slate-300 uppercase mr-1">First Run Cost:</strong> Writing to the cache typically costs slightly more or the same as standard input (e.g., Anthropic charges 1.25x for writes). The savings outlined above apply to the <strong>subsequent read turns</strong> utilizing the existing cache window.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Context Caching FAQ Section */}
            <section className="mx-auto w-full max-w-5xl px-0 py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-black tracking-tight text-white uppercase">Caching <span className="text-indigo-500">Intelligence</span></h2>
                        <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <p className="text-lg text-slate-400">
                        Frequently asked questions about how context caching works and what to expect.
                    </p>
                    
                    <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
                        <Accordion type="single" collapsible className="w-full">
                            
                            <AccordionItem value="item-1" className="border-white/5">
                                <AccordionTrigger className="group text-left text-base font-bold text-slate-200 hover:no-underline hover:text-indigo-400 transition-colors">
                                    <div className="flex items-center justify-between w-full pr-4">
                                        <span>How long does a cached prompt stay cached before it expires?</span>
                                        <div className="relative w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors">
                                            <Plus className="absolute inset-0 w-4 h-4 opacity-100 group-data-[state=open]:opacity-0 transition-all duration-300 rotate-0 group-data-[state=open]:rotate-90" />
                                            <Minus className="absolute inset-0 w-4 h-4 opacity-0 group-data-[state=open]:opacity-100 transition-all duration-300" />
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-400 font-medium leading-relaxed pt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                    Cache retention policies vary by provider. Anthropic retains cached prompts for 5 minutes or until your session ends, whichever is shorter. Google Gemini caches for up to 1 hour. These timeframes are designed to balance cost savings with freshness. Always check your provider&apos;s documentation for current retention policies.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2" className="border-white/5">
                                <AccordionTrigger className="group text-left text-base font-bold text-slate-200 hover:no-underline hover:text-indigo-400 transition-colors">
                                    <div className="flex items-center justify-between w-full pr-4">
                                        <span>Does context caching work for image inputs, or just text?</span>
                                        <div className="relative w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors">
                                            <Plus className="absolute inset-0 w-4 h-4 opacity-100 group-data-[state=open]:opacity-0 transition-all duration-300 rotate-0 group-data-[state=open]:rotate-90" />
                                            <Minus className="absolute inset-0 w-4 h-4 opacity-0 group-data-[state=open]:opacity-100 transition-all duration-300" />
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-400 font-medium leading-relaxed pt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                    Context caching works for both text and images. Anthropic and Google allow you to cache image content just like text. This is especially powerful for workflows where you repeatedly analyze the same images or documents. For multimodal workflows with heavy image usage, caching can provide substantial cost reductions.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3" className="border-white/5">
                                <AccordionTrigger className="group text-left text-base font-bold text-slate-200 hover:no-underline hover:text-indigo-400 transition-colors">
                                    <div className="flex items-center justify-between w-full pr-4">
                                        <span>Is there a minimum token threshold to qualify for cache pricing?</span>
                                        <div className="relative w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors">
                                            <Plus className="absolute inset-0 w-4 h-4 opacity-100 group-data-[state=open]:opacity-0 transition-all duration-300 rotate-0 group-data-[state=open]:rotate-90" />
                                            <Minus className="absolute inset-0 w-4 h-4 opacity-0 group-data-[state=open]:opacity-100 transition-all duration-300" />
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-400 font-medium leading-relaxed pt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                    Yes, most providers require a minimum token count to enable caching. Anthropic requires at least 1,024 tokens of cached context, and Google Gemini typically requires a similar threshold (often 32k for 1.5 Pro). If your prompt is below this minimum, caching won&apos;t activate, and you&apos;ll pay standard rates instead.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-4" className="border-b-0">
                                <AccordionTrigger className="group text-left text-base font-bold text-slate-200 hover:no-underline hover:text-indigo-400 transition-colors">
                                    <div className="flex items-center justify-between w-full pr-4">
                                        <span>What happens if my cached prompt changes slightly?</span>
                                        <div className="relative w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors">
                                            <Plus className="absolute inset-0 w-4 h-4 opacity-100 group-data-[state=open]:opacity-0 transition-all duration-300 rotate-0 group-data-[state=open]:rotate-90" />
                                            <Minus className="absolute inset-0 w-4 h-4 opacity-0 group-data-[state=open]:opacity-100 transition-all duration-300" />
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-400 font-medium leading-relaxed pt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                    Any change to the cached content will bust the cache. Even a single character difference or a whitespace change will cause the cache to miss and start fresh. The cache key is based on the exact hash of your content. You can minimize misses by keeping stable content in the &quot;static&quot; section and variable content in the &quot;dynamic&quot; section.
                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>
                    </div>
                </div>
            </section>
        </>
    );
}