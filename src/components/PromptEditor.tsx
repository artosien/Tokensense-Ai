"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, Scissors, Sparkles, Mic, Zap } from "lucide-react";
import { useTokenSenseStore } from "@/lib/store";
import { countTokens, countTokensSync } from "@/lib/tokenizer";
import { compressBasic, compressAdvanced } from "@/lib/compressor";
import { ScenarioPresets } from "@/components/ScenarioPresets";
import { SamplePromptSelection } from "@/components/SamplePromptSelection";
import { TermTooltip } from "@/components/TermTooltip";
import { cn } from "@/lib/utils";

export default function PromptEditor() {
    const {
        systemPrompt,
        userPrompt,
        fileText,
        expectedOutputTokens,
        setSystemPrompt,
        setUserPrompt,
        setExpectedOutputTokens,
        setInputTokenCount,
        selectedModelId,
        setActiveTab,
    } = useTokenSenseStore();

    const [savingsMessage, setSavingsMessage] = useState<string | null>(null);
    const [showSystemPrompt, setShowSystemPrompt] = useState(false);

    const [isDictatingSystem, setIsDictatingSystem] = useState(false);
    const [isDictatingUser, setIsDictatingUser] = useState(false);
    const recognitionRef = useRef<any>(null);
    const systemPromptRef = useRef(systemPrompt);
    const userPromptRef = useRef(userPrompt);
    const userPromptInputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-focus on mount
    useEffect(() => {
        userPromptInputRef.current?.focus();
    }, []);

    useEffect(() => {
        systemPromptRef.current = systemPrompt;
    }, [systemPrompt]);

    useEffect(() => {
        userPromptRef.current = userPrompt;
    }, [userPrompt]);

    // Auto-expand system prompt if it has content (e.g. restored session)
    useEffect(() => {
        if (systemPrompt.trim().length > 0) {
            setShowSystemPrompt(true);
        }
    }, []);

    const toggleDictation = useCallback((type: "system" | "user") => {
        const SpeechRecognitionLocale = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognitionLocale) {
            alert("Speech recognition is not supported in this browser. Try Chrome or Edge.");
            return;
        }

        const isDictating = type === "system" ? isDictatingSystem : isDictatingUser;
        const setDictating = type === "system" ? setIsDictatingSystem : setIsDictatingUser;
        const currentRef = type === "system" ? systemPromptRef : userPromptRef;
        const setPrompt = type === "system" ? setSystemPrompt : setUserPrompt;

        if (isDictating) {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setDictating(false);
            return;
        }

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsDictatingSystem(false);
        setIsDictatingUser(false);

        setDictating(true);
        const recognition = new SpeechRecognitionLocale();
        recognition.continuous = true;
        recognition.interimResults = true;

        let initialText = currentRef.current;
        let cumulativeTranscript = "";

        recognition.onresult = (event: any) => {
            let newlyFinalized = "";
            let interim = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    newlyFinalized += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }

            if (newlyFinalized) {
                cumulativeTranscript += newlyFinalized;
            }

            if (newlyFinalized || interim) {
                const space = initialText && !initialText.endsWith(" ") && !initialText.endsWith("\n") ? " " : "";
                setPrompt(initialText + space + cumulativeTranscript + interim);
            }
        };

        recognition.onerror = (event: any) => {
            if (event.error === "not-allowed") {
                alert("Microphone access was denied. Please allow microphone access in your browser settings to use dictation.");
            } else {
                console.warn("Speech recognition error:", event.error);
            }
            setDictating(false);
        };

        recognition.onend = () => {
            setDictating(false);
        };

        recognitionRef.current = recognition;
        recognition.start();

    }, [isDictatingSystem, isDictatingUser, setSystemPrompt, setUserPrompt]);

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const recalcTokens = useCallback(async () => {
        const combined = [systemPrompt, userPrompt, fileText]
            .filter(Boolean)
            .join("\n");
        const count = await countTokens(combined);
        setInputTokenCount(count);
    }, [systemPrompt, userPrompt, fileText, setInputTokenCount]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(recalcTokens, 200);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [recalcTokens]);

    const formatTokens = (n: number) => {
        if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
        return n.toString();
    };

    const countWords = (text: string) => {
        if (!text.trim()) return 0;
        return text.trim().split(/\s+/).length;
    };

    const handleCompress = async (type: "basic" | "advanced") => {
        const originalTokens = (await countTokens(systemPrompt)) + (await countTokens(userPrompt));
        if (originalTokens === 0) return;

        const compressFn = type === "advanced" ? compressAdvanced : compressBasic;
        const newSystem = compressFn(systemPrompt);
        const newUser = compressFn(userPrompt);

        const newTokens = (await countTokens(newSystem)) + (await countTokens(newUser));
        const tokensSaved = originalTokens - newTokens;

        if (tokensSaved > 0) {
            setSystemPrompt(newSystem);
            setUserPrompt(newUser);

            import("@/lib/models").then(({ models }) => {
                const model = models.find(m => m.id === selectedModelId) || models[0];
                const pricePer1M = model ? model.inputPricePer1M : 2.50;

                const savingsPer1k = (tokensSaved / 1_000_000) * pricePer1M * 1000;

                setSavingsMessage(`You just saved $${savingsPer1k.toFixed(3)} per 1k runs! (${tokensSaved} tokens trimmed)`);

                setTimeout(() => setSavingsMessage(null), 5000);
            });
        } else {
            setSavingsMessage("Already fully optimized! No tokens to trim.");
            setTimeout(() => setSavingsMessage(null), 3000);
        }
    };

    const handleCalculateMobile = () => {
      // Dismiss keyboard
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      // Switch to results tab
      setActiveTab("results");
    };

    return (
        <div className="space-y-6">
            {/* Toolbar Area */}
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-11 md:h-8 px-4 md:px-3 gap-2 border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors">
                                <Scissors className="h-4 w-4 md:h-3.5 md:w-3.5" />
                                <span className="text-sm md:text-xs font-semibold md:font-medium">Token Diet (Compress)</span>
                                <ChevronDown className="h-4 w-4 md:h-3 md:w-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-64 md:w-56">
                            <DropdownMenuItem onClick={() => handleCompress("basic")} className="cursor-pointer flex flex-col items-start py-3 md:py-2 min-h-[52px] md:min-h-0">
                                <div className="flex items-center font-medium">
                                    <Scissors className="mr-2 w-4 h-4 md:w-3.5 md:h-3.5" /> Basic Compress
                                </div>
                                <span className="text-[11px] md:text-xs text-muted-foreground mt-1">Strips whitespace & newlines. Minifies JSON. Very Safe.</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCompress("advanced")} className="cursor-pointer flex flex-col items-start py-3 md:py-2 min-h-[52px] md:min-h-0 group">
                                <div className="flex items-center font-medium text-amber-500 group-hover:text-amber-400">
                                    <Sparkles className="mr-2 w-4 h-4 md:w-3.5 md:h-3.5" /> Advanced Compress
                                </div>
                                <span className="text-[11px] md:text-xs text-muted-foreground mt-1">Strips markdown structure and code comments. Check output carefully.</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {savingsMessage && (
                        <span className="text-[10px] md:text-xs font-medium text-green-500 bg-green-500/10 px-2.5 py-1 rounded-md ml-2 animate-in fade-in zoom-in duration-300">
                            Success {savingsMessage}
                        </span>
                    )}
                </div>
            </div>

            {/* Scenario Presets */}
            <ScenarioPresets />

            {/* Sample Prompt Use Cases */}
            <SamplePromptSelection />

            {/* User Prompt */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="user-prompt" className="text-sm font-medium text-muted-foreground">     
                            User Prompt
                        </Label>
                    </div>
                    <Badge variant="secondary" className="font-mono text-[10px] md:text-xs">
                        {countWords(userPrompt)} words - <TermTooltip termKey="tokens" iconOnly />{formatTokens(countTokensSync(userPrompt))} tokens
                    </Badge>
                </div>
                <div className="relative">
                    <Textarea
                        ref={userPromptInputRef}
                        id="user-prompt"
                        placeholder="Write your prompt here..."       
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        className="min-h-[200px] md:min-h-[250px] resize-y bg-background/50 border-border/50 font-mono text-base md:text-sm transition-colors focus:border-primary/50 pb-14 rounded-xl"
                    />
                    <div className="absolute bottom-2 right-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                          "w-12 h-12 md:w-11 md:h-11 rounded-full transition-all duration-200",
                                          isDictatingUser
                                            ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600 ring-2 ring-red-500/40 animate-pulse"
                                            : "text-muted-foreground hover:text-plasma-400 hover:bg-plasma-500/10 border border-plasma-500/30 hover:border-plasma-400 shadow-sm bg-card"
                                        )}
                                        onClick={() => toggleDictation("user")}
                                        aria-label="Use voice to dictate your prompt"
                                    >
                                        <Mic className="w-6 h-6 md:w-5 md:h-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Use voice to dictate your prompt</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>

            {/* System Prompt Toggle */}
            <button
                onClick={() => setShowSystemPrompt(prev => !prev)}
                className="text-sm text-plasma-400 hover:text-cyan-300 transition-colors flex items-center gap-2 mt-1 min-h-[44px] px-1 font-medium"
                aria-expanded={showSystemPrompt}
            >
                <div className="w-5 h-5 flex items-center justify-center rounded-full bg-plasma-500/10 border border-plasma-500/20">
                  {showSystemPrompt ? '-' : '+'}
                </div>
                {showSystemPrompt ? 'Hide System Prompt' : 'Add System Prompt (optional)'}
            </button>

            {/* System Prompt */}
            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: showSystemPrompt ? '500px' : '0px',
                    opacity: showSystemPrompt ? 1 : 0,
                }}
            >
                <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="system-prompt" className="text-sm font-medium text-muted-foreground">
                                System Prompt <span className="text-muted-foreground/50">(optional)</span>      
                            </Label>
                        </div>
                        <Badge variant="secondary" className="font-mono text-[10px] md:text-xs">
                            {countWords(systemPrompt)} words - <TermTooltip termKey="tokens" iconOnly />{formatTokens(countTokensSync(systemPrompt))} tokens
                        </Badge>
                    </div>
                    <div className="relative">
                        <Textarea
                            id="system-prompt"
                            placeholder="You are a helpful assistant..."
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            className="min-h-[120px] md:min-h-[100px] resize-y bg-background/50 border-border/50 font-mono text-base md:text-sm transition-colors focus:border-primary/50 pb-14 rounded-xl"
                        />
                        <div className="absolute bottom-2 right-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={cn(
                                              "w-12 h-12 md:w-11 md:h-11 rounded-full transition-all duration-200",
                                              isDictatingSystem
                                                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600 ring-2 ring-red-500/40 animate-pulse"
                                                : "text-muted-foreground hover:text-plasma-400 hover:bg-plasma-500/10 border border-plasma-500/30 hover:border-plasma-400 shadow-sm bg-card"
                                            )}
                                            onClick={() => toggleDictation("system")}
                                            aria-label="Use voice to dictate your prompt"
                                        >
                                            <Mic className="w-6 h-6 md:w-5 md:h-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Use voice to dictate your prompt</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </div>

            {/* File text indicator */}
            {fileText && (
                <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">Attached file</span>       
                        <Badge variant="secondary" className="font-mono text-[10px] md:text-xs">
                            {formatTokens(countTokensSync(fileText))} tokens
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                        {fileText.length.toLocaleString()} characters extracted
                    </p>
                </div>
            )}

            {/* Expected Output Length */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">       
                        Output Length
                        <TermTooltip termKey="outputTokens" iconOnly />
                    </Label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            inputMode="numeric"
                            enterKeyHint="done"
                            value={expectedOutputTokens}
                            onBlur={() => { if (window.innerWidth < 768) handleCalculateMobile(); }}
                            onChange={(e) => setExpectedOutputTokens(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-24 h-11 md:h-8 md:w-20 rounded-lg border border-border/50 bg-background/50 px-3 py-1 text-right font-mono text-base md:text-sm focus:ring-1 ring-plasma-500/30 focus:border-plasma-500/50 outline-none"
                        />
                        <span className="text-xs font-semibold text-muted-foreground uppercase">tokens</span>
                    </div>
                </div>
                <div className="px-1 py-4">
                  <Slider
                      value={[expectedOutputTokens]}
                      onValueChange={([v]) => setExpectedOutputTokens(v)}
                      max={32000}
                      min={0}
                      step={100}
                      className="cursor-pointer h-8 flex items-center"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tighter mt-1">
                      <span>0</span>
                      <span>8k</span>
                      <span>16k</span>
                      <span>24k</span>
                      <span>32k</span>
                  </div>
                </div>
            </div>

            {/* Calculate Button (Mobile Only - M7) */}
            <div className="md:hidden pt-4 pb-2">
              <Button 
                onClick={handleCalculateMobile}
                className="w-full h-14 rounded-2xl bg-plasma-500 hover:bg-plasma-400 text-slate-950 font-bold text-lg shadow-lg shadow-plasma-500/20 gap-2"
              >
                <Zap className="w-5 h-5 fill-slate-950" />
                Calculate & View Results
              </Button>
              <p className="text-center text-[10px] text-muted-foreground/50 uppercase tracking-widest mt-3 font-semibold">
                Estimates update in real-time
              </p>
            </div>
        </div>
    );
}
