import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function ScenarioCards() {
  const scenarios = [
    {
      role: "Indie developer",
      title: "Budget before you build",
      desc: "Estimate whether your side project can afford GPT-4o or should use a cheaper model. Set a monthly cap and see exactly what you can ship.",
      link: "/#calculate-section",
      linkText: "Try the budget planner"
    },
    {
      role: "Growing startup",
      title: "Cut costs without cutting quality",
      desc: "Compare 50+ models side by side for the same prompt. Find the cheapest model that meets your accuracy bar before signing an enterprise contract.",
      link: "/comparison",
      linkText: "Compare models"
    },
    {
      role: "AI / ML engineer",
      title: "Model agent cost before deployment",
      desc: "Simulate multi-turn agent workflows with compounding context windows. See exactly how costs grow across 20, 50, or 100 turns.",
      link: "/workflow",
      linkText: "Simulate agent loops"
    }
  ];

  return (
    <section className="py-24 px-4 border-t border-white/5 relative bg-black/20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-white text-center mb-16 uppercase tracking-tight leading-none">How teams use it</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((s, i) => (
            <div key={i} className="group rounded-[40px] bg-white/[0.03] border border-white/8 p-10 flex flex-col hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300">
              <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-black mb-4">{s.role}</p>
              <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight leading-tight">{s.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed font-medium mb-8 flex-1">
                {s.desc}
              </p>
              <Link href={s.link} className="inline-flex items-center text-xs font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest gap-2 group/link">
                {s.linkText}
                <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
