"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const shareUrl = "https://tokensense-ai.com";
const shareText =
  "Just calculated my AI prompt costs with TokenSense AI — see the breakdown across every major model. Free & open source 🚀";

const shareLinks = {
  twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
  github: "https://github.com/artosien/Tokensense-Ai.git",
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

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485.25.25.56.394.894.394.334 0 .644-.144.894-.394.25-.25.394-.56.394-.894 0-.334-.144-.644-.394-.894C3.723 17.114 2.625 14.685 2.625 12c0-5.176 4.201-9.375 9.375-9.375s9.375 4.199 9.375 9.375c0 2.685-1.098 5.114-2.684 6.701-.25.25-.394.56-.394.894 0 .334.144.644.394.894.25.25.56.394.894.394.334 0 .644-.144.894-.394C22.657 18.314 24 15.314 24 12c0-6.627-5.373-12-12-12zm0 13.5c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm0 4.5c-3.314 0-6-2.686-6-6 0-.414.336-.75.75-.75s.75.336.75.75c0 2.481 2.019 4.5 4.5 4.5s4.5-2.019 4.5-4.5c0-.414.336-.75.75-.75s.75.336.75.75c0 3.314-2.686 6-6 6zm11.25-13.5c-.828 0-1.5.672-1.5 1.5 0 .307.094.59.253.828-1.42.923-3.344 1.547-5.467 1.666l1.242-3.921 4.053.861c.018.823.689 1.485 1.516 1.485 1.5 0 2.25-.75 2.25-1.5s-.75-1.5-1.5-1.5c-.538 0-1.01.285-1.275.711l-4.505-.957c-.201-.043-.404.047-.506.223L13.8 6.556c-2.148-.094-4.103-.717-5.545-1.651.17-.247.273-.545.273-.867 0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5c0 .322.103.62.273.867-1.442.934-3.397 1.557-5.545 1.651l-1.445-4.571c-.102-.176-.305-.266-.506-.223l-4.505.957C-7.265 2.785-7.737 2.5-8.275 2.5c-.75 0-1.5.75-1.5 1.5s.75 1.5 1.5 1.5c.827 0 1.498-.662 1.516-1.485l4.053-.861 1.242 3.921c-2.123-.119-4.047-.743-5.467-1.666.159-.238.253-.521.253-.828 0-.828-.672-1.5-1.5-1.5z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
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
    "inline-flex items-center justify-center rounded-full transition-all duration-200 text-muted-foreground hover:text-plasma-400";
  const buttonSize = variant === "top" ? "w-8 h-8" : "w-9 h-9";
  const iconSize = variant === "top" ? "w-4 h-4" : "w-[18px] h-[18px]";

  const buttons = [
    {
      label: "Share on X",
      href: shareLinks.twitter,
      icon: <XIcon className={iconSize} />,
      color: "hover:text-white hover:bg-black",
    },
    {
      label: "Share on LinkedIn",
      href: shareLinks.linkedin,
      icon: <LinkedInIcon className={iconSize} />,
      color: "hover:text-white hover:bg-[#0077B5]",
    },
    {
      label: "TokenSense AI on Reddit",
      href: shareLinks.reddit,
      icon: <RedditIcon className={iconSize} />,
      color: "hover:text-white hover:bg-[#FF4500]",
    },
    {
      label: "View TokenSense AI on GitHub",
      href: shareLinks.github,
      icon: <GithubIcon className={iconSize} />,
      color: "hover:text-white hover:bg-[#24292e]",
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
                  className={`${buttonBase} ${buttonSize} ${
                    btn.color || "hover:bg-plasma-500/10"
                  }`}
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
                className={`${buttonBase} ${buttonSize} hover:bg-plasma-500/10 ${
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

