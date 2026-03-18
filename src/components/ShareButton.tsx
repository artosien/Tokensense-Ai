"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shareOrCopy } from "@/lib/share";

type ShareButtonProps = {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
};

export default function ShareButton({
  title,
  text,
  url,
  className,
  variant = "ghost",
  size = "icon",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const result = await shareOrCopy({ title, text, url });
    if (result.ok && result.method === "clipboard") {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    }
    if (!result.ok) {
      alert("Sharing is not supported in this browser.");
    }
  };

  return (
    <Button
      type="button"
      onClick={handleShare}
      variant={variant}
      size={size}
      className={className}
      title="Share"
    >
      {copied ? <Check className="h-4 w-4" /> : url ? <Copy className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      <span className="sr-only">Share</span>
    </Button>
  );
}

