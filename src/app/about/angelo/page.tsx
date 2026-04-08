import { Metadata } from 'next';
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { ArrowLeft, Code, Cpu, Terminal, Sparkles, Globe, Laptop, Zap, ExternalLink, Linkedin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradientOrbs } from "@/components/GradientOrbs";

export const metadata: Metadata = {
  title: "Angelo S. Enriquez | AI Developer Bio",
  description: "Meet Angelo S. Enriquez, the developer behind Tokensense-Ai, exploring the frontier of AI-driven development and vibe coding.",
};

export default function AngeloBioPage() {
  return (
    <div className="min-h-screen bg-[#020817] text-slate-200 flex flex-col relative overflow-hidden">
      <GradientOrbs />
      <SiteHeader />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-24 relative z-10">
        <div className="space-y-12">
          {/* Breadcrumb */}
          <Link 
            href="/about" 
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            BACK TO ABOUT
          </Link>

          {/* Hero Section */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                <Badge variant="outline" className="px-3 py-1 border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-black text-[10px] tracking-[0.2em] uppercase">
                  Lead Developer
                </Badge>
                <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-tight uppercase">
                  Angelo S. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Enriquez</span>
                </h1>
              </div>

              <a 
                href="https://www.linkedin.com/in/angelo-s-enriquez-aug2022/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0077b5]/10 border border-[#0077b5]/30 text-[#0077b5] hover:bg-[#0077b5]/20 hover:border-[#0077b5]/50 transition-all font-bold uppercase tracking-widest text-xs"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn Profile
              </a>
            </div>
            
            <Card className="p-8 bg-slate-900/50 border-white/5 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="w-32 h-32 text-indigo-400" />
              </div>
              <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed relative z-10">
                "I’m a developer who loves exploring the frontier of AI-driven development. While I started in the world of Shopify and WordPress e-commerce, I’ve transitioned into <span className="text-white font-bold underline decoration-indigo-500/50">'vibe coding'</span> web utilities as a side business."
              </p>
            </Card>
          </div>

          {/* Bio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 uppercase tracking-tight">
                <Code className="w-6 h-6 text-indigo-400" />
                The Workflow
              </h2>
              <p className="text-slate-400 leading-relaxed font-medium">
                My current workflow revolves around <strong>Antigravity</strong>, <strong>Firebase Studio</strong>, and <strong>Gemini-cli</strong>, using the latest models to architect and troubleshoot apps like <strong>AITokenSense</strong> and <strong>FontSniff</strong>. 
              </p>
              <p className="text-slate-400 leading-relaxed font-medium">
                I’m a big believer in using the best tool for the job—whether that’s designing prototypes in <strong>Stitch</strong> or running deep GEO audits with <strong>Claude</strong>. For me, it’s all about the synergy between human creativity and agentic AI.
              </p>

              {/* Current Projects */}
              <div className="pt-8 space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Globe className="w-3 h-3 text-indigo-400" /> Current Projects
                </h3>
                <div className="flex flex-col gap-3">
                  {[
                    { name: "AyoSPC", url: "https://www.ayospc.com" },
                    { name: "See & Do Places PH", url: "https://www.seeanddoplacesph.com" },
                    { name: "FontSniff", url: "https://www.fontsniff.com" }
                  ].map((project) => (
                    <a 
                      key={project.url} 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group/link flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all"
                    >
                      <span className="text-sm font-bold text-slate-300 group-hover/link:text-white transition-colors">{project.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover/link:text-indigo-400 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 uppercase tracking-tight">
                <Zap className="w-6 h-6 text-cyan-400" />
                Tools & Tech Stack
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Laptop className="w-3 h-3" /> Agentic IDE's
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["Antigravity", "Cursor", "VS Code", "Firebase Studio"].map(tool => (
                      <Badge key={tool} variant="secondary" className="bg-white/5 text-slate-300 border-white/10 hover:bg-white/10">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Cpu className="w-3 h-3" /> AI Models Use
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["Gemini Ai", "Claude Sonnet"].map(model => (
                      <Badge key={model} variant="secondary" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
                        {model}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Command Line Tools
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20">
                      Gemini-Cli
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quote Footer */}
          <div className="pt-12 border-t border-white/5 text-center">
            <p className="text-sm font-mono text-slate-500 uppercase tracking-[0.3em]">
              Architecting the Future with Agentic Intelligence
            </p>
          </div>
        </div>
      </main>

      <footer className="py-12 mt-auto text-center border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs text-slate-600">
            &copy; 2026 Tokensense-Ai. Built by Angelo S. Enriquez.
          </p>
        </div>
      </footer>
    </div>
  );
}
