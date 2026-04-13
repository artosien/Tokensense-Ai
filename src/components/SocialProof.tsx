import React from 'react';

export default function SocialProof() {
  const testimonials = [
    {
      quote: "Finally know my agent loop costs before shipping. Saved us from a $400 surprise invoice.",
      author: "@jakekirkland",
      role: "Indie hacker",
      initials: "JK",
      color: "bg-cyan-500/20 text-cyan-400"
    },
    {
      quote: "The multi-model comparison alone is worth bookmarking. Switched from GPT-4o to Gemini Flash and cut our costs 80%.",
      author: "@sarah_dev",
      role: "Startup CTO",
      initials: "SD",
      color: "bg-purple-500/20 text-purple-400"
    },
    {
      quote: "The reverse budget planner is insanely useful. I now plan every feature around token budget first.",
      author: "@mike_ai",
      role: "ML Engineer",
      initials: "MA",
      color: "bg-indigo-500/20 text-indigo-400"
    }
  ];

  return (
    <section className="py-12 border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* User count */}
        <div className="text-center mb-10">
          <p className="text-xs sm:text-sm text-white/40 uppercase tracking-[0.3em] font-black">
            Trusted by <span className="text-white">12,000+</span> developers worldwide
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="group rounded-3xl bg-white/5 border border-white/8 p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
              <p className="text-sm text-white/70 leading-relaxed mb-6 font-medium italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl ${t.color} flex items-center justify-center text-sm font-black shadow-lg`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-xs text-white font-black tracking-tight">{t.author}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
