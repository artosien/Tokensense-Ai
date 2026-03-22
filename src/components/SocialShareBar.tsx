"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const shareUrl = "https://tokensense-ai.com";
const shareText =
  "Just calculated my AI prompt costs with TokenSense AI — see the breakdown across every major model. Free & open source 🚀";

const shareLinks = {
  twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
};

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

interface SocialShareBarProps {
  variant: "top" | "bottom";
}

export default function SocialShareBar({ variant }: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const buttonBase =
    "inline-flex items-center justify-center rounded-full transition-all duration-200 text-muted-foreground hover:text-cyan-400";
  const buttonSize = variant === "top" ? "w-8 h-8" : "w-9 h-9";
  const iconSize = variant === "top" ? "w-4 h-4" : "w-[18px] h-[18px]";

  const buttons = [
    {
      label: "Share on X",
      href: shareLinks.twitter,
      icon: <XIcon className={iconSize} />,
    },
    {
      label: "Share on LinkedIn",
      href: shareLinks.linkedin,
      icon: <LinkedInIcon className={iconSize} />,
    },
    {
      label: "Share on Facebook",
      href: shareLinks.facebook,
      icon: <FacebookIcon className={iconSize} />,
    },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={`flex items-center gap-2 ${
          variant === "top"
            ? "justify-end py-2"
            : "justify-center py-6 flex-col"
        }`}
      >
        {variant === "bottom" && (
          <p className="text-sm text-muted-foreground mb-2">
            Found this useful? Share it →
          </p>
        )}

        <div className="flex items-center gap-1.5">
          {buttons.map((btn) => (
            <Tooltip key={btn.label}>
              <TooltipTrigger asChild>
                <a
                  href={btn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${buttonBase} ${buttonSize} hover:bg-cyan-500/10`}
                  aria-label={btn.label}
                >
                  {btn.icon}
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>{btn.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}

          {/* Copy Link */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleCopyLink}
                className={`${buttonBase} ${buttonSize} hover:bg-cyan-500/10 ${
                  copied ? "text-green-400" : ""
                }`}
                aria-label="Copy link"
              >
                {copied ? (
                  <CheckIcon className={iconSize} />
                ) : (
                  <CopyIcon className={iconSize} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "Copied!" : "Copy link"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
