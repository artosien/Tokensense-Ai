"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Sparkles, 
  Zap,
  Info,
  ChevronRight,
  Target,
  CheckCircle2,
  Globe,
  Settings,
  Cpu,
  Binary,
  AlertTriangle,
  MousePointer2,
  Combine,
  Coins,
  TrafficCone,
  ShieldAlert,
  RefreshCcw,
  Code2,
  Microscope,
  Fingerprint,
  Play,
  BookOpen,
  Layout
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { GradientOrbs } from "@/components/GradientOrbs";
import TokenizerWrapper from "./TokenizerWrapper";

function VideoPreview({ videoId, title, duration }: { videoId: string, title: string, duration: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isExpanded) {
    return (
      <div className="aspect-video rounded-[32px] overflow-hidden border border-white/10 bg-black shadow-2xl relative">
        <iframe 
          width="100%" 
          height="100%" 
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        ></iframe>
      </div>
    );
  }

  return (
    <div className="video-preview" onClick={() => setIsExpanded(true)}>
      <img
        className="video-thumbnail"
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt={`Video: ${title}`}
        loading="lazy"
      />
      <div className="video-overlay">
        <div className="video-play-btn" aria-label="Play video">
          <Play className="w-6 h-6 fill-current ml-1" />
        </div>
        <div className="video-meta">
          <span className="video-title">{title}</span>
          <span className="video-duration">{duration}</span>
        </div>
      </div>
    </div>
  );
}

export default function Module1Page() {
  const [activeLesson, setActiveLesson] = useState("lesson-1-1");

  useEffect(() => {
    const lessonSections = document.querySelectorAll('section[id^="lesson-"]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLesson(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    lessonSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const testMyLanguage = () => {
    const samples: Record<string, string> = {
      'es': '¿Cómo podemos mejorar la experiencia del usuario con IA?',
      'hi': 'हम AI के साथ उपयोगकर्ता अनुभव को कैसे बेहतर बना सकते हैं?',
      'fr': 'Comment améliorer l\'expérience utilisateur with l\'IA?',
      'de': 'Wie können wir die Benutzererfahrung with KI verbessern?',
      'zh': '我们如何用AI改善用户体验？',
      'ar': 'كيف يمكننا تحسين تجربة المستخدم مع الذكاء الاصطناعي؟',
    };

    const locale = typeof navigator !== 'undefined' ? navigator.language?.slice(0, 2) || 'en' : 'en';
    const sample = samples[locale] || 'How can we improve user experience with AI?';

    const tokenizerInput = document.querySelector('.tokenizer-input textarea') as HTMLTextAreaElement;
    if (tokenizerInput) {
      tokenizerInput.value = sample;
      tokenizerInput.dispatchEvent(new Event('input', { bubbles: true }));
      tokenizerInput.closest('.tokenizer-tool')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLessons = [
    { id: "lesson-1-1", number: "1.1", title: "The Anatomy of a Token" },
    { id: "lesson-1-2", number: "1.2", title: "How Tokenizers Work" },
    { id: "lesson-1-3", number: "1.3", title: "Multilingual Penalty" },
    { id: "lesson-1-4", number: "1.4", title: "The Token Autopsy" },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-slate-200 selection:bg-indigo-500/30">
      <SiteHeader />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <GradientOrbs />
        
        <div className="flex flex-col lg:flex-row gap-12 relative">
          {/* Sidebar Navigation */}
          <nav className="lesson-sidenav" aria-label="Module lessons">
            <p className="sidenav-title">Module 1</p>
            <ol className="sidenav-list list-none p-0 m-0">
              {navLessons.map((lesson) => (
                <li key={lesson.id}>
                  <a 
                    href={`#${lesson.id}`} 
                    className={`sidenav-link ${activeLesson === lesson.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(lesson.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span className="sidenav-number">{lesson.number}</span>
                    {lesson.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex-1 space-y-20">
            {/* Navigation & Header */}
            <div className="space-y-8 relative">
              <Link 
                href="/tokenomics" 
                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                BACK TO ACADEMY
              </Link>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="px-3 py-1 border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-black text-[10px] tracking-[0.2em] uppercase">
                    Module 1
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-black text-[10px] tracking-[0.2em] uppercase">
                    Beginner · Foundation
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight uppercase">
                  The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Atomic Unit</span> of AI
                </h1>
                <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
                  To master AI costs, you must first master the unit of measurement. Shift your mental model from "words" to "tokens."
                </p>
              </div>
            </div>

            {/* Learning Objectives */}
            <Card className="p-8 bg-slate-900/50 border-white/5 space-y-6">
                <h4 className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-widest">
                    <Target className="w-4 h-4 text-indigo-400" />
                    Learning Objectives
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        "Define what a token is in the context of LLMs.",
                        "Understand the character-to-token ratio (The 4:1 Rule).",
                        "Identify why tokenization is more resilient than word-matching.",
                        "Calculate basic prompt costs based on token counts."
                    ].map((obj, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-300">{obj}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Lesson 1.1: The Anatomy of a Token */}
            <section className="space-y-12 relative" id="lesson-1-1">
              <div className="lesson-header">
                <span className="lesson-eyebrow">Lesson 1.1</span>
                <h2 className="lesson-title">The Anatomy of a Token</h2>
              </div>

              <div className="grid grid-cols-1 gap-12">
                <div className="prose prose-invert max-w-none space-y-8">
                  <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
                    <div className="flex items-center gap-3 text-indigo-400">
                      <Microscope className="w-6 h-6" />
                      <h4 className="text-lg font-black uppercase tracking-tighter">Performing the Autopsy</h4>
                    </div>
                    <p className="text-lg text-slate-300 leading-relaxed font-medium">
                      To truly master AI automation, you have to look past the text on the screen. A token isn't just a piece of text—it exists in <span className="text-white font-bold underline decoration-indigo-500/50">three distinct states simultaneously</span>. Understanding this "anatomy" is the key to predicting how an LLM will behave.
                    </p>
                  </div>

                  {/* The Three Identities */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="w-5 h-5 text-indigo-400" />
                      <h4 className="text-xl font-bold text-white uppercase tracking-tight">🔬 The Three Identities</h4>
                    </div>
                    
                    <div className="card-grid-3">
                      {/* Surface Identity */}
                      <Card className="p-6 bg-slate-950 border-indigo-500/20 space-y-4">
                        <h5 className="text-xs font-black text-indigo-400 uppercase tracking-widest">1. Surface Identity</h5>
                        <p className="card-body text-slate-400 font-medium">
                          The human-readable string. A token can be a word, a syllable, or even just a space. 
                          <span className="block mt-2 text-white/70 font-bold">Rule: 1 token ≈ 4 characters.</span>
                        </p>
                        <div className="flex flex-col gap-1.5">
                          <div className="p-1.5 bg-indigo-500/10 rounded border border-indigo-500/20 text-center font-bold text-indigo-300 text-[10px]">"Hamburger"</div>
                          <div className="flex gap-1 justify-center">
                          {['Ham','bur','ger'].map(s => <span key={s} className="px-1.5 py-0.5 bg-white/5 rounded text-[8px] font-mono text-slate-500">{s}</span>)}
                          </div>
                        </div>
                        </Card>

                        {/* Numerical Identity */}
                        <Card className="p-6 bg-slate-950 border-emerald-500/20 space-y-4">
                        <h5 className="text-xs font-black text-emerald-400 uppercase tracking-widest">2. Numerical Identity</h5>
                        <p className="card-body text-slate-400 font-medium">
                          The unique integer ID. AI doesn't see letters; it sees barcodes. Case sensitivity matters!
                        </p>
                        <div className="space-y-1 pt-2">
                          <div className="flex justify-between text-[9px] font-mono"><span className="text-slate-500">" apple"</span> <span className="text-emerald-400">17163</span></div>
                          <div className="flex justify-between text-[9px] font-mono"><span className="text-slate-500">"Apple"</span> <span className="text-emerald-400">12312</span></div>
                        </div>
                        </Card>

                        {/* Semantic Identity */}
                        <Card className="p-6 bg-slate-950 border-amber-500/20 space-y-4">
                        <h5 className="text-xs font-black text-amber-400 uppercase tracking-widest">3. Semantic Identity</h5>
                        <p className="card-body text-slate-400 font-medium">
                          The <b>Embedding Vector</b>. A list of 4,096+ numbers representing "meaning" in space.
                        </p>
                        <div className="p-2 bg-amber-500/10 rounded border border-amber-500/20 font-mono text-[8px] text-amber-300 overflow-hidden leading-tight">
                          [0.02, -0.41, 0.89, 0.12, -0.77, ...]
                        </div>
                        <p className="text-[8px] text-slate-500 italic text-center">"King" sits near "Queen" in vector space.</p>
                        </Card>
                        </div>
                        </div>

                        {/* Bridge heading to introduce the tool */}
                        <div className="tool-intro">
                        <p className="tool-intro-label">🔬 Try it now</p>
                        <p className="tool-intro-text">
                        Paste any text below and watch it get sliced into tokens in real time.
                        Try English, then a different language — notice the token count change.
                        </p>
                        </div>

                        <TokenizerWrapper />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-4">
                        <h4 className="text-xl font-bold text-white flex items-center gap-2 uppercase tracking-tight">
                        <Zap className="w-5 h-5 text-amber-400" />
                        Capitalization &amp; Spaces
                        </h4>
                        <p className="text-slate-400 leading-relaxed font-medium text-sm">
                        A capitalized word often tokenizes differently than lowercase, and a leading space counts! This is why " apple" and "Apple" have different <b>Numerical Identities</b>.
                        </p>
                        </div>
                        <div className="space-y-4">
                        <h4 className="text-xl font-bold text-white flex items-center gap-2 uppercase tracking-tight">
                        <Info className="w-5 h-5 text-cyan-400" />
                        Why not just use words?
                        </h4>
                        <p className="text-slate-400 leading-relaxed font-medium text-sm">
                        If AI only learned full words, it would crash on a typo. Tokens allow the AI to understand the <span className="text-white font-bold">"building blocks"</span> of language, making it more resilient.
                        </p>
                        </div>
                        </div>

                        {/* Visual Deep Dive */}
                        <div className="space-y-6 pt-8">
                        <div className="flex items-center justify-between px-2">
                        <h4 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Visual Deep Dive</h4>
                        <Badge className="bg-white/5 text-slate-400 border-white/10">90 SECONDS</Badge>
                        </div>
                        <VideoPreview 
                        videoId="_SfClDjWubY" 
                        title="Performing the Autopsy" 
                        duration="90 seconds" 
                        />
                        </div>

                        {/* The Assembly Line */}
                        <div className="space-y-8 pt-8">
                        <div className="flex items-center gap-3">
                        <Combine className="w-5 h-5 text-indigo-400" />
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight">🛠️ The Assembly Line</h4>
                        </div>

                        <div className="relative border border-white/5 rounded-3xl bg-slate-900/30 p-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                        {[
                          { title: "Slicing", desc: "Fragmented into sub-word chunks" },
                          { title: "Indexing", desc: "Matched to unique integer IDs" },
                          { title: "Embedding", desc: "IDs traded for vectors of meaning" },
                          { title: "Encoding", desc: "Positional signal added to vector" }
                        ].map((step, i) => (
                          <div key={i} className="space-y-2 text-center md:text-left">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs mx-auto md:mx-0 border border-indigo-500/30">
                              {i + 1}
                            </div>
                            <h6 className="text-[10px] font-black text-white uppercase tracking-widest">{step.title}</h6>
                            <p className="text-[9px] text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                          </div>
                        ))}
                        </div>
                        </div>
                        </div>

                        {/* Discussion Trap */}
                        <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl space-y-6">
                        <div className="flex items-center gap-3 text-amber-400">
                        <AlertTriangle className="w-6 h-6" />
                        <h4 className="text-lg font-black uppercase tracking-tighter">💡 The "Typos and Tokens" Trap</h4>
                        </div>
                        <div className="space-y-4">
                        <p className="card-body text-slate-300 font-medium">
                        <b>Why does an AI sometimes fail to count letters?</b> Because it rarely "sees" them. It sees the <b>Token ID</b>. If "Banana" is a single token, the model doesn't inherently know it has three "a"s.
                        </p>
                        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                        <p className="tip-content text-amber-200/80 font-medium italic">
                          <b>Pro Tip:</b> For precise character work, ask the AI to "separate with dashes" (B-A-N-A-N-A). This forces every letter into its own <b>Numerical Identity</b>.
                        </p>
                        </div>
                        </div>
                        </div>

                        {/* Summary Checklist */}
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-8 space-y-6">
                        <h4 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        🎓 Lesson 1.1 Summary
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                        {[
                        { title: "Tokens are not words", desc: "They are the chunks of text AI uses to digest information." },
                        { title: "IDs are barcodes", desc: "Every token maps to a specific number the neural network understands." },
                        { title: "Vectors are coordinates", desc: "Embedding vectors represent the 'meaning' in high-dimensional space." }
                        ].map((item, i) => (
                        <div key={i} className="checklist-item flex gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-white">{item.title}</p>
                            <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                          </div>
                        </div>
                        ))}
                        </div>
                        </div>
                        </div>
                        </div>
                        </section>

                        {/* Lesson 1.2 */}
                        <section className="space-y-8 pt-12" id="lesson-1-2">
                        <div className="lesson-header">
                        <span className="lesson-eyebrow">Lesson 1.2</span>
                        <h2 className="lesson-title">How Tokenizers Actually Work (BPE)</h2>
                        </div>

                        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
                        <div className="flex items-center gap-3 text-indigo-400">
                        <Settings className="w-6 h-6" />
                        <h4 className="text-lg font-black uppercase tracking-tighter">The Core Philosophy: "Compression via Frequency"</h4>
                        </div>
                        <p className="text-slate-300 leading-relaxed font-medium">
                        To understand Byte-Pair Encoding (BPE), you have to stop thinking like a linguist and start thinking like a <span className="text-white font-bold underline decoration-indigo-500/50">data compressor</span>. BPE is the "gold standard" because it finds the perfect middle ground between letters and words.
                        </p>
                        <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
                        <p className="text-sm text-slate-400">
                          If AI learned every word as a unique unit, its vocabulary would be millions of items long. If it only looked at single letters, the sequences would be too long for the AI's "memory" to handle.
                        </p>
                        </div>
                        </div>

                        {/* Step-by-Step Algorithm */}
                        <div className="space-y-6">
                        <div className="flex items-center gap-3">
                        <Combine className="w-5 h-5 text-indigo-400" />
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight">Step-by-Step: The BPE Algorithm in Action</h4>
                        </div>
                        <p className="text-sm text-slate-400 font-medium italic">Imagine we are training on a tiny dataset: "hug" (10x), "pug" (5x), "pun" (12x), "bun" (4x)</p>

                        <div className="card-grid-3">
                        <Card className="p-6 bg-slate-950 border-white/5 space-y-4 relative">
                          <Badge className="absolute top-4 right-4 bg-white/5 text-[8px]">STEP A</Badge>
                          <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest">Character Base</h5>
                          <div className="flex flex-wrap gap-2">
                              {['h','u','g','p','n','b'].map(l => <span key={l} className="w-6 h-6 flex items-center justify-center bg-white/5 rounded font-mono text-white">{l}</span>)}
                          </div>
                          <p className="card-body text-slate-500">Break everything down to the smallest units.</p>
                        </Card>

                        <Card className="p-6 bg-slate-950 border-indigo-500/20 space-y-4 relative">
                          <Badge className="absolute top-4 right-4 bg-indigo-500/20 text-indigo-400 text-[8px]">STEP B</Badge>
                          <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest">Find Most Frequent</h5>
                          <div className="space-y-2">
                              <div className="flex justify-between text-[10px]"><span className="text-indigo-400 font-mono">u + n</span> <span className="text-white">16 times</span></div>
                              <div className="flex justify-between text-[10px]"><span className="text-slate-500 font-mono">u + g</span> <span className="text-slate-500">15 times</span></div>
                          </div>
                          <p className="card-body text-indigo-300">"un" wins and becomes a new token.</p>
                        </Card>

                        <Card className="p-6 bg-indigo-500/10 border-indigo-500/40 space-y-4 relative">
                          <Badge className="absolute top-4 right-4 bg-indigo-500 text-white text-[8px]">STEP C</Badge>
                          <h5 className="text-xs font-black text-white uppercase tracking-widest">Repeat &amp; Iterate</h5>
                          <p className="card-body text-indigo-200 leading-relaxed">Next most frequent pair "ug" is merged. Repeat until pre-defined Vocabulary Size is reached.</p>
                          <div className="flex flex-wrap gap-2">
                              {['un','ug'].map(l => <span key={l} className="px-2 py-1 bg-indigo-500 text-white rounded font-mono text-[10px] font-bold">{l}</span>)}
                          </div>
                        </Card>
                        </div>
                        </div>

                        {/* Visual Deep Dive - Lesson 1.2 */}
                        <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between px-2">
                        <h4 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Visual Deep Dive</h4>
                        <Badge className="bg-white/5 text-slate-400 border-white/10">60 SECONDS</Badge>
                        </div>
                        <VideoPreview 
                        videoId="AC-T7iYorA8" 
                        title="How Tokenizers Actually Work" 
                        duration="60 seconds" 
                        />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                        <h4 className="text-xl font-bold text-white flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-amber-400" />
                          Why BPE is a "Superpower"
                        </h4>
                        <ul className="space-y-4">
                          <li className="space-y-1">
                              <p className="text-sm font-bold text-white">The "Out-of-Vocabulary" Solution</p>
                              <p className="text-xs text-slate-400 leading-relaxed">Older AI failed on new words ([UNK]). BPE falls back to letters. It can read "Zylophonix" as [Zy], [lo], [phon], [ix].</p>
                          </li>
                          <li className="space-y-1">
                              <p className="text-sm font-bold text-white">Efficiency (The "The" Effect)</p>
                              <p className="text-xs text-slate-400 leading-relaxed">"the" is 1 token. This lets AI read much more information within limited memory (Context Window).</p>
                          </li>
                        </ul>
                        </div>

                        <div className="space-y-4">
                        <h4 className="text-xl font-bold text-white flex items-center gap-2">
                          <Binary className="w-5 h-5 text-indigo-400" />
                          Digital Translation
                        </h4>
                        <div className="overflow-hidden border border-white/10 rounded-xl">
                          <table className="w-full text-[10px] text-left">
                              <thead className="bg-white/5 text-slate-500 uppercase">
                                  <tr><th className="p-2">Token</th><th className="p-2">ID Number</th></tr>
                              </thead>
                              <tbody className="text-slate-300 font-mono">
                                  <tr className="border-t border-white/5"><td className="p-2">the</td><td className="p-2">464</td></tr>
                                  <tr className="border-t border-white/5"><td className="p-2">cat</td><td className="p-2">9246</td></tr>
                                  <tr className="border-t border-white/5"><td className="p-2">sat</td><td className="p-2">3381</td></tr>
                                  <tr className="border-t border-white/5"><td className="p-2">.</td><td className="p-2">13</td></tr>
                              </tbody>
                          </table>
                        </div>
                        <p className="text-[10px] text-slate-500 italic">"The cat sat." → [464, 9246, 3381, 13]</p>
                        </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-amber-400">
                          <AlertTriangle className="w-4 h-4" />
                          <h5 className="text-sm font-black uppercase tracking-widest">Glitch Tokens</h5>
                        </div>
                        <p className="card-body text-slate-400 leading-relaxed">
                          BPE is statistical. It sometimes creates tokens for weird strings that appeared often in training (like usernames or code).
                        </p>
                        <p className="text-xs text-amber-200/70 font-medium">Example: SolidGoldMagikarp was a single token in early models, often causing "hallucinations" because the AI didn't know what it meant!</p>
                        </div>

                        <div className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-indigo-400">
                          <MousePointer2 className="w-4 h-4" />
                          <h5 className="text-sm font-black uppercase tracking-widest">Practical Check</h5>
                        </div>
                        <p className="card-body text-slate-400 font-medium">
                          Type random letters in a tokenizer playground. Notice how every letter becomes its own colored block—that's BPE falling back to the base characters!
                        </p>
                        </div>
                        </div>

                        <div className="p-4 bg-slate-900 border border-indigo-500/30 rounded-xl">
                        <p className="text-sm font-bold text-white text-center">
                        Key Takeaway: BPE balances the granularity of letters with the speed of words.
                        </p>
                        </div>
                        </section>

                        {/* Lesson 1.3 */}
                        <section className="space-y-8 pt-12" id="lesson-1-3">
                        <div className="lesson-header">
                        <span className="lesson-eyebrow">Lesson 1.3</span>
                        <h2 className="lesson-title">The Multilingual Token Penalty</h2>
                        </div>

                        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
                        <div className="flex items-center gap-3 text-emerald-400">
                        <Globe className="w-6 h-6" />
                        <h4 className="text-lg font-black uppercase tracking-tighter">The "Language Tax" Inequality</h4>
                        </div>
                        <p className="text-slate-300 leading-relaxed font-medium">
                        The Multilingual Token Penalty (often called the <span className="text-white font-bold underline decoration-emerald-500/50">"Language Tax"</span>) is a significant hidden inequality. Non-English speakers pay more, wait longer, and have less "AI memory" than English speakers for the exact same task.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                        <div className="space-y-2">
                          <h5 className="text-xs font-black text-white uppercase tracking-widest">1. Data Bias</h5>
                          <p className="card-body text-slate-400">Most LLMs are trained on datasets like "Common Crawl," where ~90% of text is English. Tokenizers are "built" for English.</p>
                        </div>
                        <div className="space-y-2">
                          <h5 className="text-xs font-black text-white uppercase tracking-widest">2. Merging Gap</h5>
                          <p className="card-body text-slate-400">Tokenizer sees "the" billions of times and creates an efficient single token. It rarely sees Tamil or Khmer words.</p>
                        </div>
                        <div className="space-y-2">
                          <h5 className="text-xs font-black text-white uppercase tracking-widest">3. Fragmentation</h5>
                          <p className="card-body text-slate-400">Rare scripts are treated as collections of individual characters or raw bytes, forcing the AI to work much harder.</p>
                        </div>
                        </div>
                        </div>

                        {/* Visual Deep Dive - Lesson 1.3 */}
                        <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between px-2">
                        <h4 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Visual Deep Dive</h4>
                        <Badge className="bg-white/5 text-slate-400 border-white/10">45 SECONDS</Badge>
                        </div>
                        <VideoPreview 
                        videoId="gcNbNaN6Yq4" 
                        title="The Multilingual Token Penalty" 
                        duration="45 seconds" 
                        />
                        </div>

                        {/* The Three-Way Penalty */}
                        <div className="space-y-6">
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight">The Three-Way Penalty</h4>
                        <div className="card-grid-3">
                        <Card className="p-6 bg-slate-950 border-red-500/20 space-y-3">
                          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                              <Coins className="w-5 h-5" />
                          </div>
                          <h5 className="font-bold text-white text-sm">Financial Penalty</h5>
                          <p className="card-body text-slate-400">If "Hello" is 1 token in English but 6 in Hindi, the Hindi user is charged 600% more for the same meaning.</p>
                        </Card>
                        <Card className="p-6 bg-slate-950 border-amber-500/20 space-y-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                              <Cpu className="w-5 h-5" />
                          </div>
                          <h5 className="font-bold text-white text-sm">Context Penalty</h5>
                          <p className="card-body text-slate-400">An English user can fit a whole novel in memory; a Kannada user might only fit a few chapters before the AI "forgets."</p>
                        </Card>
                        <Card className="p-6 bg-slate-950 border-indigo-500/20 space-y-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                              <Zap className="w-5 h-5" />
                          </div>
                          <h5 className="font-bold text-white text-sm">Latency Penalty</h5>
                          <p className="card-body text-slate-400">AI generates one token at a time. English outputs syllables; penalized scripts output character-fragments, feeling "slower."</p>
                        </Card>
                        </div>
                        </div>

                        <div className="space-y-4">
                        <div className="overflow-hidden border border-white/10 rounded-2xl">
                        <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500 border-b border-white/10">Language</th>
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500 border-b border-white/10">"How are you?"</th>
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-emerald-400 border-b border-white/10">Token Count</th>
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500 border-b border-white/10">Relative Cost</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-white/5">
                                <td className="p-4 font-bold text-white">English</td>
                                <td className="p-4 text-slate-400 italic">"How are you?"</td>
                                <td className="p-4 text-white font-mono">4</td>
                                <td className="p-4 text-emerald-400 font-bold">1.0x</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="p-4 font-bold text-white">Spanish</td>
                                <td className="p-4 text-slate-400 italic">"¿Cómo estás?"</td>
                                <td className="p-4 text-white font-mono">6</td>
                                <td className="p-4 text-yellow-400 font-bold">1.5x</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="p-4 font-bold text-white">Hindi</td>
                                <td className="p-4 text-slate-400 italic">"आप कैसे हैं?"</td>
                                <td className="p-4 text-white font-mono">12</td>
                                <td className="p-4 text-orange-400 font-bold">3.0x</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="p-4 font-bold text-white">Burmese</td>
                                <td className="p-4 text-slate-400 italic">"နေကောင်းလား"</td>
                                <td className="p-4 text-white font-mono">28</td>
                                <td className="p-4 text-red-400 font-bold">7.0x</td>
                            </tr>
                        </tbody>
                        </table>
                        </div>

                        <div className="table-cta">
                        <button className="btn-secondary" onClick={testMyLanguage}>
                        Test your own language →
                        </button>
                        <p className="table-cta-hint">Pre-fills the tokenizer with your browser's language</p>
                        </div>
                        </div>

                        {/* The Slicing Effect Visual */}
                        <div className="space-y-6 pt-6">
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight">The Visual Breakdown: "The Slicing Effect"</h4>
                        <p className="text-sm text-slate-400">How a tokenizer sees the word <span className="text-white font-bold italic">"Education"</span>:</p>
                        <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col gap-2 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">English (Efficient)</span>
                          <div className="flex gap-1">
                              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded text-xs font-bold">Education</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tamil (Fragmented)</span>
                          <div className="flex flex-wrap gap-1">
                              {['க', 'ல்', 'வி'].map((t, i) => (
                                  <span key={i} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs font-bold">{t}</span>
                              ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Amharic (Highly Fragmented)</span>
                          <div className="flex flex-wrap gap-1">
                              {['ት', 'ም', 'ህ', 'ር', 'ት'].map((t, i) => (
                                  <span key={i} className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded text-xs font-bold">{t}</span>
                              ))}
                          </div>
                        </div>
                        </div>
                        </div>

                        <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl space-y-6">
                        <h4 className="text-lg font-bold text-white uppercase tracking-tight">Mitigating the Penalty: Developer Guide</h4>
                        <p className="card-body text-slate-400">
                        In 2026, ignoring the language tax is a recipe for budget disaster. Here's how to build global-ready apps:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-white uppercase tracking-widest">1. Model Selection</p>
                          <p className="card-body text-slate-500">Some models (Gemini 3, Qwen) use massive vocabularies (200k+) specifically optimized for non-Latin scripts.</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-white uppercase tracking-widest">2. Hybrid Prompting</p>
                          <p className="card-body text-slate-500">Give instructions in English and only ask for output in the target language to minimize high-cost input tokens.</p>
                        </div>
                        </div>
                        </div>

                        <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Globe className="w-24 h-24 text-emerald-500" />
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400 mb-2 relative z-10">
                        <Info className="w-4 h-4" />
                        <h5 className="text-sm font-black uppercase tracking-widest">Discussion: Digital Colonialism?</h5>
                        </div>
                        <p className="discussion-body text-slate-400 italic relative z-10">
                        Since the "cost of thought" is cheaper in English, innovation naturally gravitates toward English-speaking markets. While 2026 models are leveling the field, developers must remain conscious of this built-in bias.
                        </p>
                        </div>
                        </section>

                        {/* Lesson 1.4 */}
                        <section className="space-y-12 pt-12" id="lesson-1-4">
                        <div className="lesson-header">
                        <span className="lesson-eyebrow">Lesson 1.4</span>
                        <h2 className="lesson-title">The Token Autopsy: From Text to Vector</h2>
                        </div>

                        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
                        <div className="flex items-center gap-3 text-purple-400">
                        <Microscope className="w-6 h-6" />
                        <h4 className="text-lg font-black uppercase tracking-tighter">Performing the Autopsy</h4>
                        </div>
                        <p className="text-slate-300 leading-relaxed font-medium">
                        To truly master AI automation, you have to look past the text on the screen. In this deep-dive lesson, we are going to perform an <span className="text-white font-bold underline decoration-purple-500/50">"autopsy"</span> on a single token. We will trace its journey from a raw character in a prompt to a mathematical coordinate in the AI’s "brain."
                        </p>
                        </div>

                        {/* The Three Identities */}
                        <div className="space-y-8">
                        <div className="flex items-center gap-3">
                        <Fingerprint className="w-5 h-5 text-purple-400" />
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight">🔬 The Three Identities of a Token</h4>
                        </div>
                        <p className="text-sm text-slate-400 font-medium">A token isn't just a piece of text; it exists in three distinct states simultaneously.</p>

                        <div className="card-grid-3">
                        <Card className="p-6 bg-slate-950 border-white/5 space-y-4">
                          <h5 className="text-xs font-black text-indigo-400 uppercase tracking-widest">1. Surface Identity</h5>
                          <p className="card-body text-slate-400">The human-readable string. Algorithms like BPE slice text into the most efficient chunks possible.</p>
                          <div className="p-2 bg-indigo-500/10 rounded border border-indigo-500/20 text-center font-bold text-indigo-300 text-xs">"Learning"</div>
                        </Card>

                        <Card className="p-6 bg-slate-950 border-white/5 space-y-4">
                          <h5 className="text-xs font-black text-emerald-400 uppercase tracking-widest">2. Numerical Identity</h5>
                          <p className="card-body text-slate-400">The unique integer ID assigned to every token in the vocabulary. The AI only understands these numbers.</p>
                          <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20 text-center font-mono text-emerald-300 text-xs">ID: 17163</div>
                        </Card>

                        <Card className="p-6 bg-slate-950 border-white/5 space-y-4">
                          <h5 className="text-xs font-black text-amber-400 uppercase tracking-widest">3. Semantic Identity</h5>
                          <p className="card-body text-slate-400">The <b>Embedding Vector</b>. A list of 4,096+ numbers representing the "meaning" and its relation to other tokens.</p>
                          <div className="p-2 bg-amber-500/10 rounded border border-amber-500/20 text-center font-mono text-[8px] text-amber-300 overflow-hidden">
                              [0.02, -0.41, 0.89, ...]
                          </div>
                        </Card>
                        </div>
                        </div>

                        {/* The Assembly Line */}
                        <div className="space-y-8">
                        <div className="flex items-center gap-3">
                        <Combine className="w-5 h-5 text-purple-400" />
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight">🛠️ The Assembly Line: From Text to Vector</h4>
                        </div>

                        <div className="relative border border-white/5 rounded-3xl bg-slate-900/30 p-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                          {[
                              { title: "Slicing", desc: "Fragmented into sub-word chunks" },
                              { title: "Indexing", desc: "Matched to unique integer IDs" },
                              { title: "Embedding", desc: "IDs traded for vectors of meaning" },
                              { title: "Encoding", desc: "Positional signal added to vector" }
                          ].map((step, i) => (
                              <div key={i} className="space-y-2 text-center md:text-left">
                                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-black text-xs mx-auto md:mx-0 border border-purple-500/30">
                                      {i + 1}
                                  </div>
                                  <h6 className="text-[10px] font-black text-white uppercase tracking-widest">{step.title}</h6>
                                  <p className="text-[9px] text-slate-500 leading-relaxed">{step.desc}</p>
                              </div>
                          ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-4">
                          <div className="px-4 py-2 bg-black/40 rounded-lg border border-white/10 font-mono text-[10px] text-slate-400">
                              <span className="text-white font-bold">V<sub>final</sub></span> = V<sub>embedding</sub> + V<sub>position</sub>
                          </div>
                          <p className="text-[10px] text-slate-500 italic">
                              Without positional encoding, "The dog bit the man" and "The man bit the dog" would look identical!
                          </p>
                        </div>
                        </div>
                        </div>

                        {/* Special Tokens */}
                        <div className="space-y-8">
                        <div className="flex items-center gap-3 text-purple-400">
                        <TrafficCone className="w-6 h-6" />
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight">The "Invisible Traffic Cops"</h4>
                        </div>
                        <p className="text-slate-300 leading-relaxed font-medium">
                        Special Tokens are <span className="text-white font-bold underline decoration-purple-500/50">"atomic" commands</span>—hidden structural markers that act as the stage directions in a play.
                        </p>

                        <div className="overflow-hidden border border-white/10 rounded-2xl">
                        <table className="w-full text-left border-collapse">
                          <thead>
                              <tr className="bg-white/5">
                                  <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500 border-b border-white/10">Token Type</th>
                                  <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500 border-b border-white/10">Examples</th>
                                  <th className="p-4 text-xs font-black uppercase tracking-widest text-purple-400 border-b border-white/10">Purpose</th>
                              </tr>
                          </thead>
                          <tbody className="text-sm">
                              <tr className="border-b border-white/5">
                                  <td className="p-4 font-bold text-white">BOS</td>
                                  <td className="p-4 font-mono text-[10px] text-slate-400">{"<s>, <begin_of_text>"}</td>
                                  <td className="p-4 text-slate-400">Start of sequence</td>
                              </tr>
                              <tr className="border-b border-white/5">
                                  <td className="p-4 font-bold text-white">EOS</td>
                                  <td className="p-4 font-mono text-[10px] text-slate-400">{"</s>, <endoftext>"}</td>
                                  <td className="p-4 text-slate-400">End of sequence</td>
                              </tr>
                              <tr className="border-b border-white/5">
                                  <td className="p-4 font-bold text-white">Roles</td>
                                  <td className="p-4 font-mono text-[10px] text-slate-400">{"<user>, <assistant>"}</td>
                                  <td className="p-4 text-slate-400">Identity markers</td>
                              </tr>
                              <tr>
                                  <td className="p-4 font-bold text-white">System</td>
                                  <td className="p-4 font-mono text-[10px] text-slate-400">{"[INST], <system>"}</td>
                                  <td className="p-4 text-slate-400">Core instructions</td>
                              </tr>
                          </tbody>
                        </table>
                        </div>
                        </div>

                        {/* ChatML Breakdown */}
                        <div className="space-y-6">
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight">Behind the Scenes: The ChatML Format</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">What YOU see</span>
                          <div className="p-4 bg-slate-900 rounded-xl border border-white/5 h-full">
                              <p className="text-sm text-indigo-400 font-bold">User: <span className="text-slate-300 font-medium">What is 2+2?</span></p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">What the AI sees</span>
                          <div className="p-4 bg-black rounded-xl border border-purple-500/30 h-full font-mono text-[10px] leading-relaxed">
                              <span className="text-purple-400">{"<|im_start|>"}</span><span className="text-slate-500">system</span><br/>
                              You are a helpful assistant.<span className="text-purple-400">{"<|im_end|>"}</span><br/>
                              <span className="text-purple-400">{"<|im_start|>"}</span><span className="text-slate-500">user</span><br/>
                              What is 2+2?<span className="text-purple-400">{"<|im_end|>"}</span><br/>
                              <span className="text-purple-400">{"<|im_start|>"}</span><span className="text-slate-500">assistant</span>
                          </div>
                        </div>
                        </div>
                        </div>

                        <div className="card-grid-3 pt-6">
                        <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-indigo-400">
                          <Layout className="w-4 h-4" />
                          <h5 className="text-xs font-black uppercase tracking-widest">Invisible Cost</h5>
                        </div>
                        <p className="card-body text-slate-400">
                          Even a 1-word prompt like "Hi" can trigger <span className="text-white font-bold">50+ tokens</span> of hidden system instructions and formatting overhead.
                        </p>
                        </div>
                        <div className="p-6 bg-slate-900 border border-red-500/20 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-red-400">
                          <ShieldAlert className="w-4 h-4" />
                          <h5 className="text-xs font-black uppercase tracking-widest">Token Injection</h5>
                        </div>
                        <p className="card-body text-slate-400">
                          If a user types <span className="text-white font-mono bg-white/5 px-1 rounded">{"<|endoftext|>"}</span>, they might "jailbreak" the AI by making it think its turn is over!
                        </p>
                        </div>
                        <div className="p-6 bg-slate-900 border border-amber-500/20 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-amber-400">
                          <RefreshCcw className="w-4 h-4" />
                          <h5 className="text-xs font-black uppercase tracking-widest">The Loop Bug</h5>
                        </div>
                        <p className="card-body text-slate-400">
                          If the model fails to generate its EOS token, it will keep "guessing" forever until it hits the hard context limit.
                        </p>
                        </div>
                        </div>

                        {/* The Typos and Tokens Trap */}
                        <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl space-y-6">
                        <div className="flex items-center gap-3 text-amber-400">
                        <AlertTriangle className="w-6 h-6" />
                        <h4 className="text-lg font-black uppercase tracking-tighter">💡 Discussion: The "Typos and Tokens" Trap</h4>
                        </div>
                        <div className="space-y-4">
                        <p className="card-body text-slate-300">
                          <b>The Scenario:</b> Why does an AI sometimes fail to spell a simple word correctly when asked, even though it can write complex essays?
                        </p>
                        <p className="card-body text-slate-400">
                          <b>The Discussion:</b> Because the AI rarely "sees" the individual letters. It sees the <b>Token ID</b>. If the word "Banana" is a single token, the model doesn't inherently know it contains three "a"s.
                        </p>
                        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                          <p className="tip-content text-amber-200/80 font-medium italic">
                              <b>Guide for New Users:</b> For precise character work, ask the AI to "separate with dashes" (e.g., B-A-N-A-N-A). This forces every letter to be an individual token!
                          </p>
                        </div>
                        </div>
                        </div>

                        {/* Summary Checklist */}
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-3xl p-8 space-y-6">
                        <h4 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-purple-400" />
                        🎓 Summary Checklist
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                        {[
                          { title: "Tokens are not words", desc: "They are chunks of text that the AI can digest." },
                          { title: "IDs are fixed", desc: "A specific word always maps to the same number in a specific model." },
                          { title: "Vectors are meaning", desc: "The 'numbers' in a vector tell the AI how that token relates to every other word in human history." }
                        ].map((item, i) => (
                          <div key={i} className="checklist-item flex gap-4">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                  <p className="text-sm font-bold text-white">{item.title}</p>
                                  <p className="text-xs text-slate-400">{item.desc}</p>
                              </div>
                          </div>
                        ))}
                        </div>
                        <p className="text-sm text-indigo-300 italic pt-4 border-t border-white/5">
                        "Would you like to explore how these vectors allow the AI to 'calculate' the next word using the Attention mechanism?"
                        </p>
                        </div>

                        <div className="p-6 bg-purple-500/5 border border-purple-500/20 rounded-2xl flex items-start gap-4">
                        <Code2 className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
                        <div>
                        <p className="text-sm font-bold text-white uppercase tracking-tight">Developer Practical Tip</p>
                        <p className="card-body text-slate-400">GPT-5.4 uses the <span className="text-white font-mono">o200k_base</span> vocabulary. The special token <span className="text-purple-400 font-mono">{"<|im_start|>"}</span> is assigned to ID <span className="text-white font-bold">200264</span>.</p>
                        </div>
                        </div>
                        </section>

                        {/* Summary Task */}
                        <div className="pt-12">
                        <Card className="p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/30">
                        <div className="space-y-4">
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          Summary Task
                        </h4>
                        <p className="card-body text-slate-300">
                          Next time you use an AI, try to visualize the words being sliced into blocks. If you're using a complex word or a different language, remember: you're using more "blocks" than a simple English sentence!
                        </p>
                        <p className="text-sm text-indigo-300 italic pt-2">
                          "Now that you understand the 'bricks' the AI uses to build its thoughts, would you like to see how these tokens are actually converted into mathematical vectors in the next module?"
                        </p>
                        </div>
                        </Card>
                        </div>
            {/* Suggested Tools Section */}
            <div className="pt-12 space-y-8">
              <div className="flex items-center gap-3">
                <Badge className="bg-indigo-500/20 text-indigo-400 border-none px-3 py-1 text-[10px] font-black tracking-widest uppercase">
                  Interactive Tools
                </Badge>
                <h4 className="text-lg font-bold text-white uppercase tracking-tight">Suggested Tools to check out</h4>
              </div>
              
              <div className="card-grid-3">
                <a 
                  href="https://platform.openai.com/tokenizer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="p-6 bg-slate-900/50 border-white/5 h-full hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-300">
                    <h5 className="font-bold text-white mb-3 group-hover:text-indigo-400">OpenAI Tokenizer</h5>
                    <p className="card-body text-slate-400">
                      The gold standard for seeing how models like GPT-4o break down text. It color-codes the tokens and provides a "Tokens per Word" ratio.
                    </p>
                  </Card>
                </a>

                <a 
                  href="https://bbycroft.net/llm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="p-6 bg-slate-900/50 border-white/5 h-full hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-300">
                    <h5 className="font-bold text-white mb-3 group-hover:text-indigo-400">LLM Visualization</h5>
                    <p className="card-body text-slate-400">
                      An incredible 3D walkthrough by Brendan Bycroft that shows how tokens are converted into numbers (embeddings) and processed through neural layers.
                    </p>
                  </Card>
                </a>

                <a 
                  href="https://gptforwork.com/tools/openai-chatgpt-token-counter" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="p-6 bg-slate-900/50 border-white/5 h-full hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-300">
                    <h5 className="font-bold text-white mb-3 group-hover:text-indigo-400">GPT for Work Tokenizer</h5>
                    <p className="card-body text-slate-400">
                      A great comparison tool that shows how tokenization varies across different providers like OpenAI, Anthropic (Claude), and Google (Gemini).
                    </p>
                  </Card>
                </a>
              </div>
            </div>

            {/* Footer CTA */}
            <section className="pt-20 border-t border-white/5 text-center space-y-8">
              <div className="max-w-xl mx-auto space-y-4">
                <h3 className="text-2xl font-bold text-white">Module 1 Progress</h3>
                <p className="text-slate-400 font-medium">
                  You've mastered the atoms. Ready to see how they impact your AI development budget?
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-tight gap-2" asChild>
                  <Link href="/tokenomics/module-2">
                    Continue to Module 2
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-tight" asChild>
                  <Link href="/tokenomics">Back to Academy</Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 mt-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-[0.3em]">Module 1 Complete • TokenSense Academy</p>
        </div>
      </footer>
    </div>
  );
}
