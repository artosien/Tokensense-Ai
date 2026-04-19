'use client';

import React from 'react';
import { 
  Zap, 
  Cpu, 
  Network, 
  Database, 
  Lock, 
  MessageSquare, 
  Search, 
  Layers, 
  Repeat, 
  Activity, 
  GitBranch, 
  Target,
  Brain,
  Code,
  LineChart,
  Eye,
  Microscope,
  Box,
  Key,
  List
} from 'lucide-react';

interface TermInfographicProps {
  id: string;
  term: string;
  categories: string[];
}

const TermInfographic: React.FC<TermInfographicProps> = ({ id, term, categories }) => {
  // Category to Icon mapping
  const getIcon = () => {
    if (categories.includes('architecture')) return <Layers className="w-12 h-12 text-[#00e5ff]" />;
    if (categories.includes('training')) return <Activity className="w-12 h-12 text-purple-400" />;
    if (categories.includes('inference')) return <Zap className="w-12 h-12 text-yellow-400" />;
    if (categories.includes('alignment')) return <Target className="w-12 h-12 text-green-400" />;
    if (categories.includes('prompting')) return <MessageSquare className="w-12 h-12 text-blue-400" />;
    if (categories.includes('data')) return <Database className="w-12 h-12 text-orange-400" />;
    return <Brain className="w-12 h-12 text-indigo-400" />;
  };

  const categoryColor = () => {
    if (categories.includes('architecture')) return 'from-[#00e5ff]/20 to-transparent';
    if (categories.includes('training')) return 'from-purple-500/20 to-transparent';
    if (categories.includes('inference')) return 'from-yellow-500/20 to-transparent';
    if (categories.includes('alignment')) return 'from-green-500/20 to-transparent';
    if (categories.includes('prompting')) return 'from-blue-500/20 to-transparent';
    return 'from-indigo-500/20 to-transparent';
  };

  // Specific Visualizations
  const renderSpecificVisual = () => {
    switch (id) {
      case 'attention-mechanism':
        return (
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400">Token A</div>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent animate-pulse" />
              <div className="p-3 rounded-xl bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-white font-bold text-xs uppercase tracking-tighter">Query & Key</div>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent animate-pulse" />
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400">Token B</div>
            </div>
            <div className="text-[10px] text-[#00e5ff] font-mono uppercase tracking-[0.2em] animate-pulse">Computing Weights...</div>
          </div>
        );
      case 'autoregressive':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="p-2 rounded bg-white/5 border border-white/10 text-slate-500">The</div>
              <div className="p-2 rounded bg-white/5 border border-white/10 text-slate-400">cat</div>
              <div className="p-2 rounded bg-white/5 border border-white/10 text-slate-300">sat</div>
              <div className="p-2 rounded bg-[#00e5ff]/20 border border-[#00e5ff]/50 text-white font-bold animate-pulse">on</div>
              <div className="p-2 rounded bg-white/5 border border-white/10 border-dashed text-slate-600">...</div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              <Repeat className="w-3 h-3" /> Step-by-Step Generation
            </div>
          </div>
        );
      case 'tokens':
      case 'tokenization':
        return (
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="flex flex-wrap justify-center gap-2 max-w-[200px]">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-xs font-mono">Token</span>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-xs font-mono">ize</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded text-xs font-mono">r</span>
              <span className="px-2 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded text-xs font-mono">AI</span>
            </div>
            <div className="h-px w-32 bg-white/10 relative">
               <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00e5ff] animate-[ping_2s_infinite]" />
            </div>
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Chunks → Math</div>
          </div>
        );
      case 'context-window':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-48 h-24 rounded-2xl border-2 border-dashed border-[#00e5ff]/30 flex items-center justify-center relative overflow-hidden bg-white/[0.02]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#00e5ff]/10 to-transparent" />
              <div className="grid grid-cols-6 gap-2 p-4 w-full">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`h-2 rounded ${i < 8 ? 'bg-[#00e5ff]/40' : 'bg-slate-800'}`} />
                ))}
              </div>
              <div className="absolute bottom-2 right-2 text-[8px] font-black text-[#00e5ff] uppercase">Limit</div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Fixed Memory Capacity</div>
          </div>
        );
      case 'rlhf':
        return (
          <div className="flex items-center gap-6 py-8">
            <div className="p-3 rounded-full bg-slate-800 border border-white/10 text-slate-400">
               <Brain className="w-6 h-6" />
            </div>
            <div className="h-px w-8 bg-white/10" />
            <div className="p-4 rounded-2xl bg-green-500/20 border border-green-500/40 text-green-400 relative">
               <CheckCircle2 className="w-6 h-6" />
               <div className="absolute -top-1 -right-1">
                 <div className="w-3 h-3 rounded-full bg-[#00e5ff] animate-ping" />
               </div>
            </div>
            <div className="h-px w-8 bg-white/10" />
            <div className="p-3 rounded-full bg-slate-800 border border-white/10 text-slate-400">
               <Target className="w-6 h-6" />
            </div>
          </div>
        );
      case 'temperature':
        return (
          <div className="flex flex-col items-center gap-6 py-8 w-full max-w-[240px]">
            <div className="w-full h-1 bg-slate-800 rounded-full relative">
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 rounded-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]" style={{ left: '70%' }} />
            </div>
            <div className="flex justify-between w-full text-[8px] font-black text-slate-500 uppercase tracking-widest">
              <span>Predictable</span>
              <span className="text-[#00e5ff]">Creative</span>
            </div>
            <div className="p-3 rounded-xl bg-[#00e5ff]/5 border border-[#00e5ff]/10 text-[10px] text-[#00e5ff] font-mono">
               Randomness Scaling
            </div>
          </div>
        );
      case 'latency':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-[#00e5ff] origin-bottom rounded-full animate-[spin_3s_linear_infinite]" />
              <Activity className="w-6 h-6 text-slate-800" />
            </div>
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Time to First Token</div>
          </div>
        );
      case 'fine-tuning':
      case 'finetuning':
        return (
          <div className="flex items-center gap-4 py-8">
            <div className="p-4 rounded-2xl bg-slate-800 border border-white/10 opacity-50 scale-90">
              <Brain className="w-8 h-8 text-slate-500" />
              <div className="text-[8px] mt-2 text-center uppercase font-black text-slate-600">Base</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-700" />
            <div className="p-5 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 relative">
              <Brain className="w-10 h-10 text-indigo-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00e5ff] rounded-full flex items-center justify-center">
                <Target className="w-2 h-2 text-black" />
              </div>
              <div className="text-[8px] mt-2 text-center uppercase font-black text-indigo-300">Expert</div>
            </div>
          </div>
        );
      case 'hallucination':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative">
              <div className="p-4 rounded-2xl bg-slate-800 border border-white/10">
                <MessageSquare className="w-8 h-8 text-slate-500" />
              </div>
              <div className="absolute -top-2 -right-2 p-2 rounded-xl bg-red-500/20 border border-red-500/40 backdrop-blur-md animate-bounce">
                <Eye className="w-4 h-4 text-red-400" />
              </div>
            </div>
            <div className="text-[10px] text-red-400 font-mono uppercase tracking-widest">Factually Incorrect Output</div>
          </div>
        );
      case 'embeddings':
      case 'embedding':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex gap-2">
              <div className="w-2 h-16 bg-gradient-to-t from-blue-500 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-16 bg-gradient-to-t from-purple-500 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              <div className="w-2 h-16 bg-gradient-to-t from-[#00e5ff] to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="w-2 h-16 bg-gradient-to-t from-indigo-500 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            </div>
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Text → High-D Vector</div>
          </div>
        );
      case 'prompt-engineering':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded bg-white/5 border border-white/10 text-slate-600 italic">User Input</div>
              <ChevronRight className="w-4 h-4 text-slate-700" />
              <div className="p-3 rounded-xl bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-white font-bold text-xs">
                Context + Examples + Task
              </div>
            </div>
            <div className="text-[10px] text-[#00e5ff] font-mono uppercase tracking-widest">Optimizing the "Ask"</div>
          </div>
        );
      default:
        return (
          <div className="relative py-12 flex flex-col items-center justify-center group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent rounded-3xl group-hover:via-[#00e5ff]/5 transition-colors duration-700" />
            <div className="z-10 bg-slate-950 p-6 rounded-2xl border border-white/10 shadow-2xl transform group-hover:scale-110 group-hover:border-[#00e5ff]/30 transition-all duration-500">
              {getIcon()}
            </div>
            <div className="mt-6 text-center z-10">
              <div className="text-xs font-black uppercase tracking-[0.3em] text-[#00e5ff] mb-2">{categories[0] || 'Core Concept'}</div>
              <div className="text-xl font-bold text-white group-hover:tracking-widest transition-all duration-500">{term}</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-sm`}>
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${categoryColor()}`} />
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 w-full">
          {renderSpecificVisual()}
        </div>
        
        <div className="hidden md:block w-px h-24 bg-white/5" />
        
        <div className="flex-1 space-y-4">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Microscope className="w-4 h-4" />
            Visual Logic
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed">
            This visual represents the core mechanism of <span className="text-white font-bold">{term}</span> within the context of LLM operations and system architecture.
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <span key={cat} className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-slate-500 uppercase font-bold tracking-tighter">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#00e5ff]/5 rounded-full blur-3xl" />
    </div>
  );
};

export default TermInfographic;
