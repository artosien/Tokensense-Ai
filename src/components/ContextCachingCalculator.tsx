"use client";

import { useState, useMemo } from "react";
import { models, ModelConfig } from "@/lib/models";
import { calculateCacheCost, CacheCostResult } from "@/lib/costEngine";
import NumberCounter from "@/components/NumberCounter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { 
    HelpCircle, 
    TrendingDown, 
    Zap, 
    Sparkles, 
    Plus, 
    Minus, 
    Scale, 
    Timer, 
    MessageSquare, 
    AlertTriangle,
    ArrowRight,
    LineChart as ChartIcon,
    History
} from "lucide-react";
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip, 
    ResponsiveContainer, 
    Legend 
} from "recharts";

// 2. Visual Stack Diagram Component
const TokenStack = ({ staticTokens, dynamicTokens, outputTokens }: { staticTokens: number, dynamicTokens: number, outputTokens: number }) => {
    const total = staticTokens + dynamicTokens + outputTokens;
    if (total === 0) return <div className="w-16 h-64 bg-slate-800/50 rounded-full border-2 border-white/5" />;
    
    const sPct = (staticTokens / total) * 100;
    const dPct = (dynamicTokens / total) * 100;
    const oPct = (outputTokens / total) * 100;
  
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-16 h-64 bg-slate-900 rounded-full overflow-hidden border-2 border-white/10 flex flex-col-reverse shadow-2xl">
          {/* Static Section (Bottom) */}
          <div 
            style={{ height: `${sPct}%` }} 
            className="bg-indigo-500 w-full transition-all duration-500 ease-out flex items-center justify-center group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="hidden group-hover:block text-[8px] font-black text-white rotate-90 whitespace-nowrap z-10">STATIC ({staticTokens.toLocaleString()})</span>
          </div>
          
          {/* Dynamic Section (Middle) */}
          <div 
            style={{ height: `${dPct}%` }} 
            className="bg-emerald-400 w-full transition-all duration-500 ease-out border-t border-slate-900 flex items-center justify-center group relative"
          >
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <span className="hidden group-hover:block text-[8px] font-black text-slate-900 rotate-90 whitespace-nowrap z-10">INPUT ({dynamicTokens.toLocaleString()})</span>
          </div>
  
          {/* Output Section (Top) */}
          <div 
            style={{ height: `${oPct}%` }} 
            className="bg-amber-400 w-full transition-all duration-500 ease-out border-t border-slate-900 flex items-center justify-center group relative"
          >
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <span className="hidden group-hover:block text-[8px] font-black text-slate-900 rotate-90 whitespace-nowrap z-10">OUTPUT ({outputTokens.toLocaleString()})</span>
          </div>
        </div>
  
        <div className="text-[10px] space-y-1.5 font-bold uppercase tracking-widest text-slate-500">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Cached ({sPct.toFixed(0)}%)</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Dynamic ({dPct.toFixed(0)}%)</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400" /> Output ({oPct.toFixed(0)}%)</div>
        </div>
      </div>
    );
};

export default function ContextCachingCalculator() {
    const defaultModel = models.find(m => m.id === "claude-4.6-sonnet") || models.find(m => m.cacheReadPricePer1M !== undefined) || models[0];
    
    const [selectedModelId, setSelectedModelId] = useState(defaultModel.id);
    const [staticTokens, setStaticTokens] = useState<number>(50000);
    const [dynamicTokens, setDynamicTokens] = useState<number>(1000);
    const [outputTokens, setOutputTokens] = useState<number>(500);
    const [cachingEnabled, setCachingEnabled] = useState(true);
    const [callsPerDay, setCallsPerDay] = useState<number>(1000);
    const [hitRate, setHitRate] = useState(100);
    const [ttlHours, setTtlHours] = useState(1);
    const [isMultiTurn, setIsMultiTurn] = useState(false);

    const model = models.find((m) => m.id === selectedModelId) || models[0];
    const isCacheSupported = model.cacheReadPricePer1M !== undefined;

    // 1. Break-Even Point Logic
    const breakEven = useMemo(() => {
        if (!isCacheSupported || !model.cacheWritePricePer1M || !model.cacheReadPricePer1M) return null;
        const cIn = model.inputPricePer1M;
        const cWrite = model.cacheWritePricePer1M;
        const cRead = model.cacheReadPricePer1M;
        
        // N = (C_write - C_read) / (C_in - C_read)
        const n = (cWrite - cRead) / (cIn - cRead);
        return Math.ceil(n);
    }, [model, isCacheSupported]);

    const result = useMemo(() => {
        const baseResult = calculateCacheCost(
            staticTokens || 0,
            dynamicTokens || 0,
            outputTokens || 0,
            model
        );

        // Adjust for Hit Rate
        const hitRateFactor = hitRate / 100;
        const blendedCachedInputCost = (baseResult.cachedInputCost * hitRateFactor) + (baseResult.standardInputCost * (1 - hitRateFactor));
        const totalBlendedCachedCost = blendedCachedInputCost + baseResult.outputCost;

        // TTL Impact (rough estimate: 1 cache write per TTL window)
        const writesPerDay = Math.ceil(24 / ttlHours);
        const dailyWriteCost = ((staticTokens || 0) / 1_000_000) * (model.cacheWritePricePer1M || model.inputPricePer1M) * writesPerDay;
        
        return {
            ...baseResult,
            totalBlendedCachedCost,
            dailyWriteCost
        };
    }, [staticTokens, dynamicTokens, outputTokens, model, hitRate, ttlHours]);

    const activeCost = (cachingEnabled && isCacheSupported) ? result.totalBlendedCachedCost : result.totalStandardCost;
    const monthlySavings = (result.totalStandardCost - result.totalBlendedCachedCost) * callsPerDay * 30 - (result.dailyWriteCost * 30);

    // Chart Data with Multi-Turn Simulation
    const chartData = useMemo(() => {
        const points = [];
        let cumulativeStandard = 0;
        let cumulativeCached = 0;
        
        // Setup cache once
        const setupCost = (model.cacheWritePricePer1M || model.inputPricePer1M) * (staticTokens / 1_000_000);
        
        for (let i = 1; i <= 20; i++) {
            // In multi-turn, dynamic context grows every turn
            const turnDynamicTokens = isMultiTurn ? dynamicTokens + (i * 200) : dynamicTokens; // assume 200 tokens growth per turn
            
            const standardTurn = calculateCacheCost(staticTokens, turnDynamicTokens, outputTokens, model).totalStandardCost;
            const cachedTurn = calculateCacheCost(staticTokens, turnDynamicTokens, outputTokens, model).totalCachedCost;
            
            cumulativeStandard += standardTurn;
            if (i === 1) {
                cumulativeCached += setupCost + (calculateCacheCost(0, turnDynamicTokens, outputTokens, model).totalStandardCost);
            } else {
                cumulativeCached += cachedTurn;
            }

            if (i % 2 === 0 || i === 1) {
                points.push({
                    calls: i,
                    standard: cumulativeStandard,
                    cached: isCacheSupported ? cumulativeCached : cumulativeStandard
                });
            }
        }
        return points;
    }, [result, model, staticTokens, isCacheSupported, isMultiTurn, dynamicTokens, outputTokens]);

    const providers = Array.from(new Set(models.map(m => m.provider)));

    const isBelowThreshold = model.minCacheTokens ? staticTokens < model.minCacheTokens : false;

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Controls Panel */}
                <Card className="lg:col-span-1 shadow-xl border-white/5 bg-slate-900/50 backdrop-blur-md">
                    <CardHeader className="pb-4 border-b border-white/5">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Caching Variables</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2.5">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Model Selection</Label>
                            <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                                <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 text-slate-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10">
                                    {providers.map(provider => (
                                        <SelectGroup key={provider}>
                                            <SelectLabel className="text-[10px] font-black uppercase text-indigo-400 opacity-70 px-2 py-1.5">{provider}</SelectLabel>
                                            {models.filter(m => m.provider === provider).map((m) => (
                                                <SelectItem key={m.id} value={m.id} className="text-xs">
                                                    {m.name} {m.cacheReadPricePer1M ? "✓" : ""}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex justify-between">
                                    Static Context (Cached)
                                    <span className="text-indigo-400 font-mono">{staticTokens.toLocaleString()}</span>
                                </Label>
                                <Input
                                    type="number"
                                    value={staticTokens}
                                    onChange={(e) => setStaticTokens(parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/10 h-10 font-mono text-sm"
                                />
                                {isBelowThreshold && isCacheSupported && (
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[9px] text-amber-400 font-bold uppercase animate-pulse">
                                        <AlertTriangle className="w-3 h-3" />
                                        Below {model.minCacheTokens?.toLocaleString()} token threshold
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex justify-between">
                                    Dynamic Input
                                    <span className="text-emerald-400 font-mono">{dynamicTokens.toLocaleString()}</span>
                                </Label>
                                <Input
                                    type="number"
                                    value={dynamicTokens}
                                    onChange={(e) => setDynamicTokens(parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/10 h-10 font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex justify-between">
                                    Expected Output
                                    <span className="text-amber-400 font-mono">{outputTokens.toLocaleString()}</span>
                                </Label>
                                <Input
                                    type="number"
                                    value={outputTokens}
                                    onChange={(e) => setOutputTokens(parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/10 h-10 font-mono text-sm"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                        Cache Hit Rate
                                        <TooltipProvider><Tooltip><TooltipTrigger><HelpCircle className="w-3 h-3 text-slate-600" /></TooltipTrigger><TooltipContent className="bg-slate-900 border-white/10 text-[10px]">What % of requests will successfully find the cached content?</TooltipContent></Tooltip></TooltipProvider>
                                    </Label>
                                    <span className="text-[10px] font-black text-white font-mono">{hitRate}%</span>
                                </div>
                                <Slider value={[hitRate]} onValueChange={(val) => setHitRate(val[0])} max={100} step={5} />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                        Cache TTL (Life)
                                        <TooltipProvider><Tooltip><TooltipTrigger><HelpCircle className="w-3 h-3 text-slate-600" /></TooltipTrigger><TooltipContent className="bg-slate-900 border-white/10 text-[10px]">How often does your static data change? (e.g., every 1 hour)</TooltipContent></Tooltip></TooltipProvider>
                                    </Label>
                                    <span className="text-[10px] font-black text-white font-mono">{ttlHours}h</span>
                                </div>
                                <Slider value={[ttlHours]} onValueChange={(val) => setTtlHours(val[0])} min={1} max={24} step={1} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="space-y-0.5">
                                <Label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Chat Simulation</Label>
                                <p className="text-[9px] text-slate-500 font-bold uppercase">Simulate growing history</p>
                            </div>
                            <Switch checked={isMultiTurn} onCheckedChange={setIsMultiTurn} />
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Visual & Results Panel */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Token Stack Visualizer */}
                        <div className="md:col-span-1 flex justify-center py-4 bg-white/5 rounded-3xl border border-white/5 shadow-inner">
                            <TokenStack staticTokens={staticTokens} dynamicTokens={dynamicTokens} outputTokens={outputTokens} />
                        </div>

                        {/* Cost Results */}
                        <div className="md:col-span-3 space-y-6">
                            <Card className={`border-2 transition-all duration-500 overflow-hidden relative shadow-2xl ${cachingEnabled && isCacheSupported ? "border-green-500/30 bg-slate-900/80" : "border-white/5 bg-slate-900/50"}`}>
                                <CardHeader className="pb-4 border-b border-white/5">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Cost Analysis</CardTitle>
                                        <Badge className={`${monthlySavings > 0 ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"} border-0 text-[10px] font-black uppercase`}>
                                            {monthlySavings > 500 ? "Highly Recommended" : monthlySavings > 0 ? "Standard Recommended" : "Check TTL Costs"}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-8">
                                    <div className="text-center space-y-2 mb-8">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Effective Cost / Call</div>
                                        <div className={`text-6xl font-black font-mono tracking-tighter ${cachingEnabled && isCacheSupported ? "text-green-400" : "text-indigo-400"}`}>
                                            $<NumberCounter value={activeCost} decimals={5} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                                            <span className="text-[9px] font-black text-slate-500 uppercase block">Standard Rate</span>
                                            <span className="text-xl font-bold text-slate-200 font-mono">${result.totalStandardCost.toFixed(5)}</span>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                                            <span className="text-[9px] font-black text-indigo-400 uppercase block">Cached Rate</span>
                                            <span className="text-xl font-bold text-white font-mono">${result.totalBlendedCachedCost.toFixed(5)}</span>
                                        </div>
                                    </div>

                                    {breakEven && (
                                        <div className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                                                <Scale className="w-5 h-5 text-amber-400" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-black text-amber-400 uppercase">Break-Even Point</p>
                                                <p className="text-xs text-slate-400 font-medium">You need <span className="text-white font-bold">{breakEven} requests</span> per cache window to save money.</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="bg-slate-900 border-white/5">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
                                            <TrendingDown className="w-3 h-3 text-green-400" />
                                            Monthly Savings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-black text-white font-mono">${monthlySavings.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Based on {callsPerDay.toLocaleString()} calls/day</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-slate-900 border-white/5">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
                                            <Timer className="w-3 h-3 text-indigo-400" />
                                            Cache Strategy
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm font-bold text-slate-200">Refresh every {ttlHours}h</div>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Est. Setup: ${result.dailyWriteCost.toFixed(4)}/day</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Chart */}
                    <Card className="bg-slate-900/50 border-white/10 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                <ChartIcon className="w-4 h-4 text-indigo-400" />
                                Long-Term Savings Argument
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="calls" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} label={{ value: 'Number of Requests', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(2)}`} />
                                        <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }} />
                                        <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '20px' }} />
                                        <Line type="monotone" dataKey="standard" name="No Cache" stroke="#6366f1" strokeWidth={3} dot={false} />
                                        <Line type="monotone" dataKey="cached" name="With Cache" stroke="#10b981" strokeWidth={3} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Technical Detail Table */}
            <div className="pt-12 border-t border-white/5">
                <Card className="bg-slate-900 border-white/10 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Caching Metric</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Without Cache</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-indigo-400">With Cache (Read)</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-amber-400">Write/Setup Cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-300">Input (per 1M)</td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-400">${model.inputPricePer1M.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-xs font-mono text-indigo-400 font-bold">${model.cacheReadPricePer1M?.toFixed(2) || "N/A"} (-90%)</td>
                                    <td className="px-6 py-4 text-xs font-mono text-amber-400 font-bold">${model.cacheWritePricePer1M?.toFixed(2) || model.inputPricePer1M.toFixed(2)} (1.25x)</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-300">Output (per 1M)</td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-400">${model.outputPricePer1M.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-400">${model.outputPricePer1M.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-500">N/A</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-300">Min. Tokens</td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-400">1</td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{model.minCacheTokens?.toLocaleString() || "1,024"}</td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{model.minCacheTokens?.toLocaleString() || "1,024"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Context Caching FAQ Section */}
            <section className="mx-auto w-full max-w-5xl px-0 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black tracking-tight text-white uppercase">Caching <span className="text-indigo-500">Intelligence</span></h2>
                        <div className="h-px flex-1 bg-white/5" />
                    </div>
                    
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
        </div>
    );
}