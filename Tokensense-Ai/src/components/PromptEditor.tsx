"use client";

import React, { useEffect, useRef, useCallback } from "react";
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
import { ChevronDown, Scissors, Sparkles, Mic } from "lucide-react";
import { useTokenSenseStore } from "@/lib/store";
import { countTokens } from "@/lib/tokenizer";
import { compressBasic, compressAdvanced } from "@/lib/compressor";

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
        selectedModelId, // Get this for cost calculation
    } = useTokenSenseStore();

    const [savingsMessage, setSavingsMessage] = React.useState<string | null>(null);

    const [isDictatingSystem, setIsDictatingSystem] = React.useState(false);
    const [isDictatingUser, setIsDictatingUser] = React.useState(false);
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

    const recalcTokens = useCallback(() => {
        const combined = [systemPrompt, userPrompt, fileText]
            .filter(Boolean)
            .join("\n");
        const count = countTokens(combined);
        setInputTokenCount(count);
    }, [systemPrompt, userPrompt, fileText, setInputTokenCount]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(recalcTokens, 150);
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

    const handleCompress = (type: "basic" | "advanced") => {
        // Calculate original tokens
        const originalTokens = countTokens(systemPrompt) + countTokens(userPrompt);
        if (originalTokens === 0) return;

        // Apply compression to both fields
        const compressFn = type === "advanced" ? compressAdvanced : compressBasic;
        const newSystem = compressFn(systemPrompt);
        const newUser = compressFn(userPrompt);

        // Calculate new tokens
        const newTokens = countTokens(newSystem) + countTokens(newUser);
        const tokensSaved = originalTokens - newTokens;

        if (tokensSaved > 0) {
            // Update the text fields
            setSystemPrompt(newSystem);
            setUserPrompt(newUser);

            // Calculate cost savings based on input price per 1M tokens of selected model
            // Fallback to average $3.00 per 1M if no model selected (or just to have a default)
            // Need to import models to get exact price, but we can access it if we know the selectedModelId structure.
            // For now, let's use a dynamic import or simple fallback to get the model details since it isn't in PromptEditor directly.
            import("@/lib/models").then(({ models }) => {
                const model = models.find(m => m.id === selectedModelId) || models[0];
                const pricePer1M = model ? model.inputPricePer1M : 2.50; // GPT-4o default

                // Savings per 1k runs = (tokensSaved / 1,000,000) * pricePer1M * 1000
                const savingsPer1k = (tokensSaved / 1_000_000) * pricePer1M * 1000;

                setSavingsMessage(`You just saved $${savingsPer1k.toFixed(3)} per 1k runs! (${tokensSaved} tokens trimmed)`);

                // Dismiss message after 5 seconds
                setTimeout(() => setSavingsMessage(null), 5000);
            });
        } else {
            setSavingsMessage("Already fully optimized! No tokens to trim.");
            setTimeout(() => setSavingsMessage(null), 3000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Toolbar Area */}
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 gap-1 border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors">
                                <Scissors className="h-3.5 w-3.5" />
                                <span>Token Diet (Compress)</span>
                                <ChevronDown className="h-3 w-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem onClick={() => handleCompress("basic")} className="cursor-pointer flex flex-col items-start py-2">
                                <div className="flex items-center font-medium">
                                    <Scissors className="mr-2 w-3.5 h-3.5" /> Basic Compress
                                </div>
                                <span className="text-xs text-muted-foreground mt-1">Strips whitespace & newlines. Minifies JSON. Very Safe.</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCompress("advanced")} className="cursor-pointer flex flex-col items-start py-2 group">
                                <div className="flex items-center font-medium text-amber-500 group-hover:text-amber-400">
                                    <Sparkles className="mr-2 w-3.5 h-3.5" /> Advanced Compress
                                </div>
                                <span className="text-xs text-muted-foreground mt-1">Strips markdown structure and code comments. Check output carefully.</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {savingsMessage && (
                        <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2.5 py-1 rounded-md ml-2 animate-in fade-in zoom-in duration-300">
                            🎉 {savingsMessage}
                        </span>
                    )}
                </div>
            </div>
            {/* System Prompt */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="system-prompt" className="text-sm font-medium text-muted-foreground">
                            System Prompt
                        </Label>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">
                        {countWords(systemPrompt)} words &bull; {formatTokens(countTokens(systemPrompt))} tokens
                    </Badge>
                </div>
                <div className="relative">
                    <Textarea
                        id="system-prompt"
                        placeholder="You are a helpful assistant..."
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        className="min-h-[100px] resize-y bg-background/50 border-border/50 font-mono text-sm transition-colors focus:border-primary/50 pb-12"
                    />
                    <div className="absolute bottom-2 right-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-8 w-8 rounded-full transition-colors ${isDictatingSystem ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600 animate-pulse" : "text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/10"}`}
                                        onClick={() => toggleDictation("system")}
                                    >
                                        <Mic className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>The web app accepts audio prompts</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>

            {/* User Prompt */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="user-prompt" className="text-sm font-medium text-muted-foreground">
                            User Prompt
                        </Label>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">
                        {countWords(userPrompt)} words &bull; {formatTokens(countTokens(userPrompt))} tokens
                    </Badge>
                </div>
                <div className="relative">
                    <Textarea
                        ref={userPromptInputRef}
                        id="user-prompt"
                        placeholder="Write your prompt here... or paste a large text to see token count."
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        className="min-h-[200px] resize-y bg-background/50 border-border/50 font-mono text-sm transition-colors focus:border-primary/50 pb-12"
                    />
                    <div className="absolute bottom-2 right-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-8 w-8 rounded-full transition-colors ${isDictatingUser ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600 animate-pulse" : "text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/10"}`}
                                        onClick={() => toggleDictation("user")}
                                    >
                                        <Mic className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>The web app accepts audio prompts</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>

            {/* File text indicator */}
            {fileText && (
                <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">📎 Uploaded file content</span>
                        <Badge variant="secondary" className="font-mono text-xs">
                            {formatTokens(countTokens(fileText))} tokens
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                        {fileText.length.toLocaleString()} characters extracted
                    </p>
                </div>
            )}

            {/* Expected Output Length */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-muted-foreground">
                        Expected Output Length
                    </Label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={expectedOutputTokens}
                            onChange={(e) => setExpectedOutputTokens(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-20 rounded-md border border-border/50 bg-background/50 px-2 py-1 text-right font-mono text-sm"
                        />
                        <span className="text-xs text-muted-foreground">tokens</span>
                    </div>
                </div>
                <Slider
                    value={[expectedOutputTokens]}
                    onValueChange={([v]) => setExpectedOutputTokens(v)}
                    max={32000}
                    min={0}
                    step={100}
                    className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground/60">
                    <span>0</span>
                    <span>8k</span>
                    <span>16k</span>
                    <span>24k</span>
                    <span>32k</span>
                </div>
            </div>
        </div>
    );
}
