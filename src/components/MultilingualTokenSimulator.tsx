"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Zap, Info, ArrowRight } from "lucide-react";
import { countTokensSync } from "@/lib/tokenizer";

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', sample: 'The cost of artificial intelligence is dropping rapidly.', script: 'Latin' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', sample: 'El costo de la inteligencia artificial está bajando rápidamente.', script: 'Latin' },
  { code: 'de', name: 'German', flag: '🇩🇪', sample: 'Die Kosten für künstliche Intelligenz sinken rapide.', script: 'Latin' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', sample: '人工智能的成本正在迅速下降。', script: 'Logographic' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', sample: '人工知能のコストは急速に低下しています。', script: 'Mixed' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', sample: 'تكلفة الذكاء الاصطناعي تنخفض بسرعة.', script: 'Abjad' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', sample: 'आर्टिफिशियल इंटेलिजेंस की लागत तेजी से गिर रही है।', script: 'Abugida' },
];

export default function MultilingualTokenSimulator() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customText, setCustomText] = useState('');
  
  const currentLang = LANGUAGES[selectedIdx];
  const textToProcess = customText || currentLang.sample;
  
  // In a real app, countTokensSync uses cl100k_base if loaded.
  // For the simulator, we want to highlight the script differences.
  const tokenCount = useMemo(() => {
    return countTokensSync(textToProcess);
  }, [textToProcess]);

  const englishBaseline = useMemo(() => {
    // We compare against the English sample of roughly the same meaning
    return countTokensSync(LANGUAGES[0].sample);
  }, []);

  const overhead = ((tokenCount / englishBaseline) * 100).toFixed(0);

  return (
    <Card className="p-6 md:p-8 bg-slate-900/50 border-white/10 shadow-2xl space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400" />
          Multilingual Token Stress-Test
        </h3>
        <p className="text-sm text-slate-400 font-medium">
          Compare how different scripts and languages impact token density.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {LANGUAGES.map((lang, idx) => (
          <button
            key={lang.code}
            onClick={() => {
                setSelectedIdx(idx);
                setCustomText('');
            }}
            className={cn(
              "p-2 rounded-xl border transition-all flex flex-col items-center gap-1",
              selectedIdx === idx 
                ? "bg-indigo-500/20 border-indigo-500/50 ring-1 ring-indigo-500/50" 
                : "bg-slate-800/50 border-white/5 hover:bg-slate-800"
            )}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-white">{lang.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Input Text ({currentLang.name})</label>
                <Badge variant="outline" className="text-[9px] uppercase border-white/10 text-indigo-400">{currentLang.script} Script</Badge>
            </div>
            <textarea
                value={textToProcess}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full h-32 p-4 rounded-2xl bg-slate-950 border border-white/5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
            />
        </div>

        <div className="flex flex-col justify-center space-y-6 bg-indigo-500/5 rounded-3xl p-6 border border-indigo-500/10">
            <div className="flex justify-around items-center text-center">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Token Count</p>
                    <p className="text-4xl font-black text-white">{tokenCount}</p>
                </div>
                <div className="h-12 w-px bg-white/5" />
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Efficiency</p>
                    <p className={cn(
                        "text-4xl font-black",
                        parseInt(overhead) > 150 ? "text-rose-500" : parseInt(overhead) > 110 ? "text-amber-500" : "text-emerald-500"
                    )}>
                        {overhead}%
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span>Relative to English</span>
                    <span>{tokenCount} vs {englishBaseline}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                        className={cn(
                            "h-full transition-all duration-1000",
                            parseInt(overhead) > 150 ? "bg-rose-500" : parseInt(overhead) > 110 ? "bg-amber-500" : "bg-emerald-500"
                        )}
                        style={{ width: `${Math.min(100, (englishBaseline / tokenCount) * 100)}%` }}
                    />
                </div>
                <p className="text-[9px] text-slate-400 text-center italic">
                    {parseInt(overhead) > 100 
                        ? `This text is ${parseInt(overhead) - 100}% more expensive than the English equivalent.`
                        : `This text is as efficient as English.`}
                </p>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-[10px] text-slate-400 font-medium">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <p>
            <strong>Why the difference?</strong> Most tokenizers use Byte Pair Encoding (BPE) optimized for English. 
            Languages with non-Latin scripts (like Arabic or Hindi) often require 2-3 tokens per character, 
            whereas common English words are often just 1 token.
        </p>
      </div>
    </Card>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
