"use client";

import React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface CostDisclaimerProps {
    className?: string;
}

/**
 * A standard disclaimer for estimated cost outputs across the application.
 */
export default function CostDisclaimer({ className }: CostDisclaimerProps) {
    return (
        <div className={cn("flex items-start gap-1.5 text-[10px] text-muted-foreground/60 leading-tight", className)}>
            <Info className="w-3 h-3 mt-0.5 shrink-0" />
            <p>
                Estimated range based on your inputs. Actual costs may vary by model version, prompt structure, and API pricing changes.
            </p>
        </div>
    );
}
