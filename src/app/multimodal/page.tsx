"use client";

import { useState, useCallback } from "react";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { ImageIcon, ArrowRight } from "lucide-react";
import { models } from "@/lib/models";
import { calculateImageTokens } from "@/lib/imageTokenMath";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";       

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
            const img = new window.Image();
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
                        <Card className="shadow-sm border-border/40 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Upload Image</CardTitle>
                                <CardDescription>Processed locally. Never sent to a server.</CardDescription>   
                            </CardHeader>
                            <CardContent>
                                <div
                                    {...getRootProps()}
                                    className={`relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer group
                                        ${isDragActive
                                            ? "border-indigo-500 bg-indigo-500/15 scale-[1.02]"
                                            : "border-border/50 bg-muted/20 hover:bg-indigo-500/10 hover:border-indigo-400"}`}
                                >
                                    <input {...getInputProps()} />
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                        <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
                                          <ImageIcon className={`w-10 h-10 transition-all duration-300 ${isDragActive ? "text-indigo-500" : "text-muted-foreground/60 group-hover:text-indigo-400"}`} />
                                        </div>
                                        <p className="mb-2 text-lg text-foreground font-semibold">
                                            <span className="text-indigo-500">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-sm text-muted-foreground">PNG, JPG, WEBP, or GIF (Max 10MB)</p>
                                    </div>
                                </div>

                                {imageWidth && imageHeight && (
                                    <div className="mt-4 flex items-center justify-between text-sm bg-indigo-500/5 px-4 py-3 rounded-xl border border-indigo-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="truncate pr-4 flex-1">
                                            <span className="font-medium text-foreground">{fileName}</span>     
                                        </div>
                                        <div className="text-indigo-400 shrink-0 font-mono text-xs">
                                            {imageWidth}px x {imageHeight}px
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-border/40 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Vision Model Setup</CardTitle>
                                <CardDescription>Select a model to see its unique image computation pricing.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <Label htmlFor="visionModel" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Multimodal Vision Model</Label>
                                    <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                                        <SelectTrigger id="visionModel" className="h-12 rounded-xl bg-background/50 border-border/50">
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/50">
                                            {visionModels.map((m) => (
                                                <SelectItem key={m.id} value={m.id} className="h-11 cursor-pointer">
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
                        <Card className="border-border shadow-sm h-full flex flex-col border-border/40 bg-card/50 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Image Token Analysis</CardTitle>
                                <CardDescription>The final calculated input tokens and cost.</CardDescription>  
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                                {imageWidth && imageHeight ? (
                                    <div className="space-y-6 animate-in fade-in duration-500">
                                        {imagePreview && (
                                            <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-border/50 bg-black/20 flex items-center justify-center">
                                                <Image 
                                                  src={imagePreview} 
                                                  alt="Preview" 
                                                  fill
                                                  unoptimized
                                                  className="object-contain" 
                                                />
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="p-5 rounded-2xl border border-border/40 bg-card flex flex-col justify-between shadow-sm">
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                                                    Token Payload
                                                </div>
                                                <div className="text-4xl font-bold tracking-tight text-foreground tabular-nums font-mono">
                                                    {result.tokens.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="p-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 flex flex-col justify-between shadow-sm">
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-2">
                                                    Image Cost
                                                </div>
                                                <div className="text-4xl font-bold tracking-tight text-cyan-400 tabular-nums font-mono">
                                                    ${estimatedCost.toFixed(5)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 text-sm text-muted-foreground bg-muted/20 p-5 rounded-2xl border border-border/40">
                                            <p className="font-bold text-foreground mb-2 text-xs uppercase tracking-wider">Model Calculation Logic:</p>
                                            <div className="space-y-2 text-xs leading-relaxed">
                                              {model?.visionPricing?.strategy === "openai-tiles" && (
                                                  <ul className="space-y-2">
                                                      <li className="flex justify-between border-b border-border/20 pb-1">
                                                        <span>Base image cost:</span>
                                                        <span className="font-bold text-foreground">{model.visionPricing.baseTokens} tokens</span>
                                                      </li>
                                                      <li className="flex justify-between border-b border-border/20 pb-1">
                                                        <span>Tiles generated:</span>
                                                        <span className="font-bold text-foreground">{result.tiles} tiles (${model.visionPricing.tileTokens} tokens each)</span>
                                                      </li>
                                                      <li className="flex justify-between border-b border-border/20 pb-1">
                                                        <span>Scaled resolution:</span>
                                                        <span className="font-mono">{result.scaledWidth}px x {result.scaledHeight}px</span>
                                                      </li>
                                                  </ul>
                                              )}
                                              {model?.visionPricing?.strategy === "anthropic-scale" && (
                                                  <ul className="space-y-2">
                                                      <li className="border-b border-border/20 pb-1">Scale image to fit within 1568x1568px.</li>
                                                      <li className="border-b border-border/20 pb-1">Divide scaled area by 750 (Anthropic formula).</li>     
                                                      <li className="flex justify-between border-b border-border/20 pb-1">
                                                        <span>Scaled resolution:</span>
                                                        <span className="font-mono">{result.scaledWidth}px x {result.scaledHeight}px</span>
                                                      </li>
                                                  </ul>
                                              )}
                                              {model?.visionPricing?.strategy === "gemini-flat" && (
                                                  <ul className="space-y-2">
                                                      <li className="flex justify-between border-b border-border/20 pb-1">
                                                        <span>Flat rate:</span>
                                                        <span className="font-bold text-foreground">{model.visionPricing.flatTokens} tokens</span>
                                                      </li>
                                                      <li className="text-[10px] text-muted-foreground/60 italic">Resolution scaling is handled natively by Gemini without affecting price.</li>
                                                  </ul>
                                              )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-muted/20 rounded-2xl border border-dashed border-border/60">
                                        <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center mb-4">
                                          <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground uppercase tracking-tight">Awaiting Image</h3> 
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
                                        LLM image pricing is based on the image&apos;s pixel dimensions (width x height), not the file size in bytes. A 10MB JPEG compressed at low quality and a 2MB PNG at high resolution will have very different token costs. This is because models process the actual visual information (pixels), not the compressed file format. Tokensense-Ai calculates tokens based on image dimensions because that&apos;s how models like GPT-4o, Claude, and Gemini tokenize images for billing.
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
                                        Yes, sending the same image twice will typically cost the same tokens both times - unless you explicitly enable prompt caching (available with some models like Claude). Without caching, each image is processed independently. With caching enabled, you can reuse the same cached image tokens across multiple requests, reducing costs significantly. Organizations doing repeated analysis on the same images should definitely look into prompt caching options offered by their model provider.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-4" className="border-b-0">
                                    <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-indigo-400">
                                        Which vision model gives the most tokens-per-dollar for image analysis? 
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">        
                                        This depends on your use case and image dimensions. Generally, Gemini 2.0 Flash offers very competitive pricing for images, while Claude 3.5 Sonnet provides strong vision capabilities at a mid-tier price. GPT-4o sits between them in terms of cost but excels in accuracy and detail understanding. The &quot;best&quot; value model changes as pricing updates. Use Tokensense-Ai to upload your typical images and compare the token costs across models - the calculator will show you exact dollar costs so you can make an informed decision based on your actual workflows.
                                    </AccordionContent>
                                </AccordionItem>

                            </Accordion>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}