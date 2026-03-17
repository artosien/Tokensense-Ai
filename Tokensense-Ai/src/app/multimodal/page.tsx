"use client";

import { useState, useCallback } from "react";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { ImageIcon, Bot } from "lucide-react";
import { models } from "@/lib/models";
import { calculateImageTokens } from "@/lib/imageTokenMath";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import TrustMessage from "@/components/TrustMessage";

export default function MultimodalPage() {
    const visionModels = models.filter((m) => m.visionPricing);
    const [selectedModelId, setSelectedModelId] = useState(visionModels.length > 0 ? visionModels[0].id : "");

    const [imageWidth, setImageWidth] = useState<number | null>(null);
    const [imageHeight, setImageHeight] = useState<number | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const model = visionModels.find((m) => m.id === selectedModelId) || visionModels[0];

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setImagePreview(dataUrl);

            // Load into HTMLImageElement to extract true width/height
            const img = new Image();
            img.onload = () => {
                setImageWidth(img.width);
                setImageHeight(img.height);
            };
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
            "image/gif": [],
        },
        maxFiles: 1,
    });

    // Calculate Token Estimations
    const result = (imageWidth && imageHeight && model)
        ? calculateImageTokens(imageWidth, imageHeight, model)
        : { tokens: 0 };

    const estimatedCost = model ? (result.tokens / 1_000_000) * model.inputPricePer1M : 0;

    return (
        <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="space-y-4 mb-10 text-center md:text-left">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                        Multimodal Image Estimator
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl border-l-4 border-indigo-500 pl-4">
                        Image token costs are calculated based on pixel scaling Math, not file size.
                        Every model scales, resizes, and tiles images differently. Upload an image to
                        calculate the exact token payload before sending it to an API.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Controls Panel */}
                    <div className="space-y-6">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Upload Image</CardTitle>
                                <CardDescription>Processed locally. Never sent to a server.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    {...getRootProps()}
                                    className={`relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer group
                                        ${isDragActive 
                                            ? "border-indigo-500 bg-indigo-500/15 scale-105" 
                                            : "border-border/50 bg-muted/30 hover:bg-indigo-500/10 hover:border-indigo-400 hover:scale-[1.02]"}`}
                                >
                                    <input {...getInputProps()} />
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                        <ImageIcon className={`w-16 h-16 mb-4 transition-all duration-300 ${isDragActive ? "text-indigo-500 scale-110" : "text-muted-foreground/60 group-hover:text-indigo-400 group-hover:scale-110"}`} />
                                        <p className="mb-2 text-lg text-foreground font-semibold">
                                            <span className="text-indigo-500">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-sm text-muted-foreground">PNG, JPG, WEBP, or GIF (Max 10MB)</p>
                                    </div>
                                </div>

                                {imageWidth && imageHeight && (
                                    <div className="mt-4 flex items-center justify-between text-sm bg-muted/40 px-4 py-3 rounded-lg border border-border/50">
                                        <div className="truncate pr-4 flex-1">
                                            <span className="font-medium text-foreground">{fileName}</span>
                                        </div>
                                        <div className="text-muted-foreground shrink-0 tabular-nums">
                                            {imageWidth}px × {imageHeight}px
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Vision Model Setup</CardTitle>
                                <CardDescription>Select a model to see its unique image computation pricing.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <Label htmlFor="visionModel">AI Multimodal Vision Model</Label>
                                    <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                                        <SelectTrigger id="visionModel">
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {visionModels.map((m) => (
                                                <SelectItem key={m.id} value={m.id}>
                                                    {m.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results Panel */}
                    <div className="space-y-6">
                        <Card className="border-border shadow-sm h-full flex flex-col">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">Image Token Analysis</CardTitle>
                                <CardDescription>The final calculated input tokens and cost.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                                {imageWidth && imageHeight ? (
                                    <div className="space-y-6">
                                        {imagePreview && (
                                            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border/50 bg-black/10">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl border bg-card/60 flex flex-col justify-between">
                                                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                                    Token Payload
                                                </div>
                                                <div className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
                                                    {result.tokens.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl border bg-card/60 flex flex-col justify-between">
                                                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                                    Image Cost
                                                </div>
                                                <div className="text-3xl font-bold tracking-tight text-green-500 tabular-nums">
                                                    ${estimatedCost.toFixed(5)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm text-muted-foreground bg-muted/20 p-4 rounded-lg border border-border/40">
                                            <p className="font-semibold text-foreground mb-2">Model Calculation Logic:</p>
                                            {model?.visionPricing?.strategy === "openai-tiles" && (
                                                <ul className="list-disc pl-4 space-y-1">
                                                    <li>Base image cost: <span className="font-medium text-foreground">{model.visionPricing.baseTokens} tokens</span></li>
                                                    <li>Tiles generated: <span className="font-medium text-foreground">{result.tiles} tiles</span> ({model.visionPricing.tileTokens} tokens each)</li>
                                                    <li>Scaled resolution: {result.scaledWidth}px × {result.scaledHeight}px</li>
                                                </ul>
                                            )}
                                            {model?.visionPricing?.strategy === "anthropic-scale" && (
                                                <ul className="list-disc pl-4 space-y-1">
                                                    <li>Scale image to fit within 1568×1568px.</li>
                                                    <li>Divide scaled area by 750 (Anthropic formula).</li>
                                                    <li>Scaled resolution: {result.scaledWidth}px × {result.scaledHeight}px</li>
                                                </ul>
                                            )}
                                            {model?.visionPricing?.strategy === "gemini-flat" && (
                                                <ul className="list-disc pl-4 space-y-1">
                                                    <li>Gemini charges a flat rate of <span className="font-medium text-foreground">{model.visionPricing.flatTokens} tokens</span> per image.</li>
                                                    <li>Resolution scaling is handled natively by the model without affecting price.</li>
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-xl border border-dashed border-border/60">
                                        <ImageIcon className="w-12 h-12 text-muted-foreground/40 mb-4" />
                                        <h3 className="text-lg font-medium text-foreground">Awaiting Image</h3>
                                        <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                                            Upload an image to see its exact token dimensions and estimated API cost.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Image / Multimodal FAQ Section */}
                <div className="pt-16 border-t border-border/40">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Image / Multimodal</h2>
                        <p className="text-lg text-muted-foreground">
                            Common questions about image tokenization and vision model pricing.
                        </p>
                        
                        <div className="bg-card border border-border/40 rounded-2xl p-6 sm:p-8 shadow-sm">
                            <Accordion type="single" collapsible className="w-full">
                                
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                        Why does image size affect token cost more than file size?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        LLM image pricing is based on the image&apos;s pixel dimensions (width × height), not the file size in bytes. A 10MB JPEG compressed at low quality and a 2MB PNG at high resolution will have very different token costs. This is because models process the actual visual information (pixels), not the compressed file format. Tokensense-Ai calculates tokens based on image dimensions because that&apos;s how models like GPT-4o, Claude, and Gemini tokenize images for billing.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                        What&apos;s the difference between "high detail" and "low detail" mode in GPT-4o vision?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        GPT-4o offers two detail modes for images: &quot;low&quot; and &quot;high&quot;. In low detail mode, OpenAI automatically downscales your image, resulting in fewer tokens. High detail mode preserves more of the original resolution and incurs higher token costs. OpenAI also tiles large images in high detail mode, processing them as multiple chunks. Tokensense-Ai shows you the exact token breakdown for your chosen image and model, so you can compare the cost difference between detail levels before submitting.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                        Does sending the same image twice cost the same tokens both times?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        Yes, sending the same image twice will typically cost the same tokens both times — unless you explicitly enable prompt caching (available with some models like Claude). Without caching, each image is processed independently. With caching enabled, you can reuse the same cached image tokens across multiple requests, reducing costs significantly. Organizations doing repeated analysis on the same images should definitely look into prompt caching options offered by their model provider.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-4" className="border-b-0">
                                    <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                        Which vision model gives the most tokens-per-dollar for image analysis?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        This depends on your use case and image dimensions. Generally, Gemini 2.0 Flash offers very competitive pricing for images, while Claude 3.5 Sonnet provides strong vision capabilities at a mid-tier price. GPT-4o sits between them in terms of cost but excels in accuracy and detail understanding. The &quot;best&quot; value model changes as pricing updates. Use Tokensense-Ai to upload your typical images and compare the token costs across models — the calculator will show you exact dollar costs so you can make an informed decision based on your actual workflows.
                                    </AccordionContent>
                                </AccordionItem>

                            </Accordion>
                        </div>
                    </div>
                </div>
            </main>

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
