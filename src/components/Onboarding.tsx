"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Bot, 
  Zap, 
  LineChart, 
  GraduationCap 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    id: "calculator-step",
    title: "The Token Counter",
    description: "Paste your prompt here to see the exact token count and estimated cost for your selected model.",
    icon: <Bot className="w-5 h-5 text-[#00dcb4]" />,
  },
  {
    id: "comparison-step",
    title: "Side-by-Side Comparison",
    description: "Compare your prompt across 30+ major LLMs instantly to find the best balance between intelligence and cost.",
    icon: <Zap className="w-5 h-5 text-indigo-400" />,
  },
  {
    id: "simulator-step",
    title: "Workflow Simulation",
    description: "Plan your agentic loops here. See how costs compound across multiple turns before you write a single line of code.",
    icon: <LineChart className="w-5 h-5 text-plasma-400" />,
  },
  {
    id: "tokenomics-link",
    title: "Master Tokenomics",
    description: "Want to deep dive? Visit our new Tokenomics page to learn how LLM pricing actually works.",
    icon: <GraduationCap className="w-5 h-5 text-emerald-400" />,
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetPos, setTargetPos] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const updateTargetPosition = useCallback((stepIdx: number) => {
    const step = STEPS[stepIdx];
    let element = document.getElementById(step.id);
    
    // Fallback if element not found
    if (!element && step.id === "tokenomics-link") {
      element = document.querySelector('a[href="/tokenomics"]');
    }

    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      setTargetPos({
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft,
        width: rect.width,
        height: rect.height
      });

      // Smooth scroll to target
      window.scrollTo({
        top: Math.max(0, rect.top + scrollTop - 200),
        behavior: "smooth"
      });
    }
  }, []);

  useEffect(() => {
    const hasVisited = localStorage.getItem("tokensense-onboarding-v1");
    
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      if (isVisible) {
        updateTargetPosition(currentStep);
      }
    };

    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);

    if (!hasVisited) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        updateTargetPosition(0);
      }, 1500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", handleResize);
      };
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [isVisible, currentStep, updateTargetPosition]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      updateTargetPosition(next);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      updateTargetPosition(prev);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem("tokensense-onboarding-v1", "true");
  };

  if (!isVisible) return null;

  const current = STEPS[currentStep];

  // Tooltip positioning logic
  const tooltipWidth = Math.min(windowSize.width - 32, 380);
  const idealLeft = targetPos.left + (targetPos.width / 2) - (tooltipWidth / 2);
  const left = Math.max(16, Math.min(windowSize.width - tooltipWidth - 16, idealLeft));
  
  // Decide if tooltip should be above or below target
  const showBelow = targetPos.top + targetPos.height + 300 < windowSize.height + (window.pageYOffset || document.documentElement.scrollTop);
  const top = showBelow 
    ? targetPos.top + targetPos.height + 24 
    : Math.max(20, targetPos.top - 320);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Dimmed Overlay with a hole */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-auto cursor-pointer"
        onClick={handleComplete}
        style={{
          clipPath: `polygon(
            0% 0%, 0% 100%, 
            ${targetPos.left}px 100%, 
            ${targetPos.left}px ${targetPos.top}px, 
            ${targetPos.left + targetPos.width}px ${targetPos.top}px, 
            ${targetPos.left + targetPos.width}px ${targetPos.top + targetPos.height}px, 
            ${targetPos.left}px ${targetPos.top + targetPos.height}px, 
            ${targetPos.left}px 100%, 
            100% 100%, 100% 0%
          )`
        }}
        title="Click to skip tour"
      />

      {/* Highlighting border around target */}
      <div 
        className="absolute transition-all duration-500 border-2 border-[#00dcb4] rounded-2xl shadow-[0_0_30px_rgba(0,220,180,0.3)] pointer-events-none"
        style={{
          top: targetPos.top - 4,
          left: targetPos.left - 4,
          width: targetPos.width + 8,
          height: targetPos.height + 8
        }}
      />

      {/* Tooltip Card */}
      <div 
        className="absolute pointer-events-auto transition-all duration-500 px-4"
        style={{
          top,
          left,
          width: tooltipWidth + 32, // +32 for the px-4 padding
          maxWidth: '100vw'
        }}
      >
        <Card className="bg-[#09090b] border-indigo-500/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  {current.icon}
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-tight text-white text-lg">{current.title}</h3>
                  <div className="flex gap-1">
                    {STEPS.map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "h-1 rounded-full transition-all duration-300",
                          i === currentStep ? "w-4 bg-[#00dcb4]" : "w-1.5 bg-white/10"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <button 
                onClick={handleComplete}
                className="text-muted-foreground hover:text-white transition-colors"
                aria-label="Skip tour"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-muted-foreground font-medium leading-relaxed">
              {current.description}
            </p>

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="text-muted-foreground hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleComplete}
                  className="text-muted-foreground hover:text-white"
                >
                  Skip
                </Button>
              </div>
              <Button 
                size="sm" 
                onClick={handleNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                {currentStep === STEPS.length - 1 ? (
                  <span className="flex items-center gap-2">Got it! <CheckCircle2 className="w-4 h-4" /></span>
                ) : (
                  <span className="flex items-center gap-1">Next <ChevronRight className="w-4 h-4" /></span>
                )}
              </Button>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-plasma-500" />
        </Card>
      </div>
    </div>
  );
}
