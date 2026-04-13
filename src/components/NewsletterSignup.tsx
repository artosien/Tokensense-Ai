"use client";

import React, { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <div className="mt-12 border-t border-white/5 pt-12 max-w-md mx-auto lg:mx-0">
      <p className="text-xs text-white/40 mb-2 font-black uppercase tracking-[0.2em]">Get model pricing alerts</p>
      <p className="text-xs text-white/30 mb-6 font-medium leading-relaxed">When GPT-5 drops or Gemini reprices, we'll email you.</p>
      
      {status === 'success' ? (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold animate-in fade-in zoom-in duration-300">
          ✓ You're on the list! We'll notify you of the next price drop.
        </div>
      ) : (
        <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-8 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : 'Notify me'}
          </button>
        </form>
      )}
      <p className="text-[10px] text-white/20 mt-4 font-medium italic">No spam. Unsubscribe anytime. Price alerts only.</p>
    </div>
  );
}
