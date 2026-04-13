import React from 'react';
import { Zap, Repeat, Calculator } from 'lucide-react';

export default function WhyTokensense() {
  const differentiators = [
    {
      title: "Pre-flight cost estimation",
      desc: "Know your exact input + output cost before a single API call. Eliminate surprise invoices.",
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      bg: "bg-emerald-500/10",
      border: "border-white/8"
    },
    {
      title: "Multi-step agent loop simulation",
      desc: "See how costs compound across 10, 50, or 100 agent turns — before you build. Model the full workflow, not just one call.",
      icon: <Repeat className="w-5 h-5 text-indigo-400" />,
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/30",
      highlight: true
    },
    {
      title: "Reverse budget planning",
      desc: "Start from your monthly API budget and work backwards to how many calls, users, or turns you can afford.",
      icon: <Calculator className="w-5 h-5 text-amber-400" />,
      bg: "bg-amber-500/10",
      border: "border-white/8"
    }
  ];

  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-[10px] text-indigo-400 font-black tracking-[0.4em] uppercase">Why developers choose this</p>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Not just a token counter</h2>
          <p className="text-white/50 text-base max-w-2xl mx-auto font-medium leading-relaxed">
            Most tools count tokens. Tokensense helps you understand, compare, and control LLM costs across your entire architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {differentiators.map((d, i) => (
            <div key={i} className={`rounded-[32px] border ${d.border} ${d.highlight ? 'bg-indigo-500/5' : 'bg-white/3'} p-8 transition-all hover:scale-[1.02] duration-300 relative overflow-hidden`}>
              {d.highlight && (
                <div className="text-[10px] text-indigo-400 font-black tracking-widest uppercase mb-4 bg-indigo-500/10 inline-block px-3 py-1 rounded-full border border-indigo-500/20">
                  Only tool that does this
                </div>
              )}
              <div className={`w-12 h-12 rounded-2xl ${d.bg} flex items-center justify-center mb-6`}>
                {d.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">{d.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed font-medium">
                {d.desc}
              </p>
              
              {/* Decorative orb */}
              {d.highlight && (
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
