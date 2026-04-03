"use client";

import { useState } from "react";
import { Twitter, Linkedin, Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BlogPostShareProps {
  url: string;
  title: string;
}

export default function BlogPostShare({ url, title }: BlogPostShareProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `https://www.tokensense-ai.com${url}`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-foreground">Share:</span>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full w-8 h-8 hover:bg-sky-500/10 hover:text-sky-400 border-border/40" asChild>
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-4 h-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share on X</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full w-8 h-8 hover:bg-blue-600/10 hover:text-blue-500 border-border/40" asChild>
                <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share on LinkedIn</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className={`rounded-full w-8 h-8 border-border/40 transition-colors ${copied ? 'text-green-500 border-green-500/50 bg-green-500/10' : 'hover:bg-indigo-500/10 hover:text-indigo-400'}`}
                onClick={handleCopyLink}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{copied ? "Copied!" : "Copy Link"}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
