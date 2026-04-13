"use client";

import React, { useState, useEffect } from 'react';

export default function HeroPreview() {
  const [cost, setCost] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const targetCost = 0.0120;
    const duration = 2000; // 2 seconds
    const frameRate = 1000 / 60;
    const totalFrames = duration / frameRate;
    let currentFrame = 0;

    const timer = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      const currentCost = progress * targetCost;
      
      if (currentFrame >= totalFrames) {
        setCost(targetCost);
        clearInterval(timer);
      } else {
        setCost(currentCost);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`relative rounded-3xl border border-white/10 bg-[#0d1117]/80 backdrop-blur-xl overflow-hidden p-6 w-full max-w-sm mx-auto shadow-2xl transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
      {/* Simulated input row */}
      <div className="text-[10px] text-white/40 mb-3 font-mono uppercase tracking-widest">
        Prompt · GPT-4o · 1,200 tokens
      </div>

      {/* Animated cost readout */}
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-white/40">$</span>
        <div className="text-5xl font-black text-white tabular-nums tracking-tighter">
          {cost.toFixed(4)}
        </div>
      </div>

      {/* Input / output breakdown */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-[10px] uppercase tracking-wider font-bold">
        <div className="flex flex-col gap-1">
          <span className="text-white/30">Input</span>
          <span className="text-white/80">$0.0050</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-white/30">Output</span>
          <span className="text-white/80">$0.0070</span>
        </div>
      </div>

      {/* Pulsing "live" indicator */}
      <div className="absolute top-6 right-6 flex items-center gap-1.5 text-[10px] text-emerald-400 font-black uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        Live
      </div>

      {/* Model comparison pills */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between items-center text-[11px] rounded-xl bg-white/5 px-4 py-3 border border-white/5 group hover:bg-white/10 transition-colors">
          <span className="text-white/60 font-bold uppercase tracking-tight">GPT-4o</span>
          <span className="text-white font-mono font-bold">$0.0120</span>
        </div>
        <div className="flex justify-between items-center text-[11px] rounded-xl bg-emerald-500/10 px-4 py-3 border border-emerald-500/20 group hover:bg-emerald-500/20 transition-colors">
          <span className="text-emerald-400 font-bold uppercase tracking-tight">Claude Sonnet</span>
          <span className="text-emerald-400 font-mono font-bold">$0.0090</span>
        </div>
        <div className="flex justify-between items-center text-[11px] rounded-xl bg-white/5 px-4 py-3 border border-white/5 group hover:bg-white/10 transition-colors">
          <span className="text-white/60 font-bold uppercase tracking-tight">Gemini 1.5 Flash</span>
          <span className="text-white/60 font-mono font-bold">$0.0018</span>
        </div>
      </div>

      {/* Decorative background blur */}
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
    </div>
  );
}
