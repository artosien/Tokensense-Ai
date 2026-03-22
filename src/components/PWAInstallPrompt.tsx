"use client";

import { useState, useEffect } from "react";
import { X, Share, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    // Check if already in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (navigator as any).standalone 
      || document.referrer.includes('android-app://');

    // Check if user has already dismissed it
    const isDismissed = localStorage.getItem("pwa-prompt-dismissed") === "true";

    if (isIOS && !isStandalone && !isDismissed) {
      // Delay showing to not overwhelm
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[110] animate-in fade-in slide-in-from-bottom-4 duration-500 md:hidden">
      <div className="bg-indigo-600 text-white rounded-2xl p-4 shadow-2xl shadow-indigo-500/40 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-inner">
            <PlusSquare className="w-6 h-6" />
          </div>
          <div className="space-y-1 pr-6">
            <h3 className="font-bold text-sm tracking-tight">Add to Home Screen</h3>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Install TokenSense AI for a full-screen experience and quick access.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-white/10 w-fit px-2 py-1 rounded-md">
              Tap <Share className="w-3 h-3" /> then "Add to Home Screen"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}