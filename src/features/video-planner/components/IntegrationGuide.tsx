"use client";

import React, { useState } from "react";
import { ProviderModel } from "../lib/providerPricing";
import { Button } from "@/components/ui/button";
import { Code2, Copy, Check, Terminal, Globe, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntegrationGuideProps {
  selectedModel: ProviderModel;
}

export function IntegrationGuide({ selectedModel }: IntegrationGuideProps) {
  const [copied, setCopied] = useState(false);

  const getCodeSnippet = () => {
    const modelId = selectedModel.modelName;
    if (selectedModel.provider === "Google") {
      return `import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "${modelId}" });

async function analyzeVideo(videoData: Buffer) {
  const result = await model.generateContent([
    "Analyze this video for content and objects.",
    { inlineData: { data: videoData.toString("base64"), mimeType: "video/mp4" } }
  ]);
  console.log(result.response.text());
}`;
    }
    if (selectedModel.provider === "Anthropic") {
      return `import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function analyzeVideo(videoUrl: string) {
  const msg = await anthropic.messages.create({
    model: "${modelId}",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: [{ type: "video", source: { type: "url", url: videoUrl } }]
    }],
  });
  console.log(msg.content);
}`;
    }
    return `// SDK integration for ${selectedModel.displayName}
// See ${selectedModel.apiDocsUrl} for full details.`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-border/40 rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Code2 className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">API Integration</h3>
            <p className="text-xs text-muted-foreground font-medium">Use {selectedModel.displayName} in your app</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={copyToClipboard}
          className="h-9 px-4 border-white/10 hover:bg-white/5 gap-2"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="text-[10px] font-bold uppercase tracking-widest">{copied ? "Copied" : "Copy Code"}</span>
        </Button>
      </div>

      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
        <div className="relative bg-[#0d1117] rounded-xl p-5 overflow-hidden border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
            <div className="h-px flex-1 bg-white/5 mx-2" />
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">TypeScript</span>
          </div>
          <pre className="text-[11px] font-mono leading-relaxed text-indigo-300/90 overflow-x-auto">
            {getCodeSnippet()}
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a 
          href={selectedModel.apiDocsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <Globe className="w-4 h-4 text-indigo-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white uppercase tracking-tight">Full API Docs</span>
            <span className="text-[9px] text-muted-foreground">Provider reference</span>
          </div>
        </a>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white uppercase tracking-tight">Latency</span>
            <span className="text-[9px] text-emerald-400/80 font-bold">~250ms p95</span>
          </div>
        </div>
      </div>
    </div>
  );
}
