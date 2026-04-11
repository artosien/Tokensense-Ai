"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Info } from 'lucide-react';

const NOTES: Record<string, string> = {
  claude: 'Claude uses a BPE-style tokenizer across Claude 3 and Claude 4 model families. As a helpful rule of thumb, one token is approx 4 characters of English text, so 100 tokens is approx 75 words.',
  gemini: 'Gemini uses SentencePiece tokenization (a BPE/unigram variant). Tokenization may differ slightly from GPT-family models. One token is approx 4 characters of English text.',
  gpt4: 'GPT-4 and GPT-3.5 use the cl100k_base tokenizer via tiktoken. One token is approx 4 characters of common English text, or roughly 75% of a word.',
  gpt3: 'GPT-3 legacy models use the r50k_base tokenizer. Numbers are tokenized digit-by-digit, which differs from newer models. One token is approx 4 characters.',
};

export default function TokenizerPlayground() {
  const [model, setModel] = useState('claude');
  const [viewMode, setViewMode] = useState<'text' | 'ids'>('text');
  const [inputText, setInputText] = useState("Many words map to one token, but some don't: indivisible.\nUnicode characters like emojis may be split into many tokens.\nSequences of characters commonly found next to each other may be grouped together: 1234567890");
  const [tokens, setTokens] = useState<string[]>([]);

  const splitWord = useCallback((word: string, mk: string) => {
    if (word.length <= 3) return [word];
    if (mk === 'gpt3' && word.length > 6) {
      const parts = [];
      for (let k = 0; k < word.length; k += 4) parts.push(word.slice(k, k + 4));
      return parts;
    }
    const lw = word.toLowerCase();
    const suffixes = ['ation', 'tion', 'able', 'ible', 'ment', 'ness', 'ing', 'ful', 'less', 'est', 'ize', 'ise', 'ed', 'er', 'ly'];
    for (const sfx of suffixes) {
      if (lw.endsWith(sfx) && lw.length > sfx.length + 2) {
        return [word.slice(0, word.length - sfx.length), sfx];
      }
    }
    if (word.includes("'")) {
      const idx = word.indexOf("'");
      return [word.slice(0, idx), word.slice(idx)];
    }
    return [word];
  }, []);

  const simpleTokenize = useCallback((text: string, mk: string) => {
    if (!text) return [];
    const result: string[] = [];
    let i = 0;
    while (i < text.length) {
      const code = text.codePointAt(i);
      if (code && code > 0xFFFF) {
        result.push(text.slice(i, i + 2));
        i += 2; continue;
      }
      const ch = text[i];
      if (/\s/.test(ch)) {
        let run = '';
        while (i < text.length && /\s/.test(text[i])) { run += text[i]; i++; }
        if (run === ' ') result.push(' ');
        else for (const c of run) result.push(c === '\n' ? '\n' : c);
        continue;
      }
      if (/\d/.test(ch)) {
        let num = '';
        while (i < text.length && /\d/.test(text[i])) { num += text[i]; i++; }
        if (mk === 'gpt3') { for (const d of num) result.push(d); }
        else { const cs = mk === 'claude' || mk === 'gemini' ? 3 : 4; for (let k = 0; k < num.length; k += cs) result.push(num.slice(k, k + cs)); }
        continue;
      }
      if (/[a-zA-Z]/.test(ch)) {
        let word = '';
        while (i < text.length && /[a-zA-Z']/.test(text[i])) { word += text[i]; i++; }
        result.push(...splitWord(word, mk));
        continue;
      }
      result.push(ch); i++;
    }
    return result;
  }, [splitWord]);

  useEffect(() => {
    setTokens(simpleTokenize(inputText, model));
  }, [inputText, model, simpleTokenize]);

  const getTokenId = (tok: string, mk: string) => {
    let h = ({ claude: 4000, gemini: 8000, gpt4: 1000, gpt3: 500 }[mk] || 1000);
    for (let k = 0; k < tok.length; k++) h = (h * 31 + tok.charCodeAt(k)) & 0xFFFFF;
    return h % 99000 + 1000;
  };

  const getStyleForIndex = (i: number) => {
    const colors = [
      "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200",
      "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200",
      "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200",
      "bg-pink-100 text-pink-900 dark:bg-pink-900/30 dark:text-pink-200",
      "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-200",
      "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-200",
      "bg-cyan-100 text-cyan-900 dark:bg-cyan-900/30 dark:text-cyan-200",
      "bg-lime-100 text-lime-900 dark:bg-lime-900/30 dark:text-lime-200",
      "bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-900/30 dark:text-fuchsia-200",
      "bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-200",
      "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-200",
      "bg-sky-100 text-sky-900 dark:bg-sky-900/30 dark:text-sky-200",
    ];
    return colors[i % colors.length];
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4 font-sans">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Developer Tool</p>
        <h2 className="text-3xl font-light tracking-tight mb-3 text-white">Token<span className="font-semibold">izer</span></h2>
        <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
          Large language models process text using <strong>tokens</strong> — common character sequences. See how a piece of text is tokenized by different models, and the total token count.
        </p>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-4 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {[
            { id: 'claude', name: 'Claude', sub: 'Anthropic', activeColor: 'ring-amber-500', dotColor: 'bg-amber-500' },
            { id: 'gemini', name: 'Gemini', sub: 'Google', activeColor: 'ring-blue-500', dotColor: 'bg-blue-500' },
            { id: 'gpt4', name: 'GPT-4', sub: 'OpenAI · cl100k', activeColor: 'ring-emerald-500', dotColor: 'bg-emerald-500' },
            { id: 'gpt3', name: 'GPT-3', sub: 'OpenAI · r50k', activeColor: 'ring-purple-500', dotColor: 'bg-purple-500' },
          ].map((m) => (
            <button
              key={m.id}
              className={`relative p-3 rounded-lg border text-left transition-all ${
                model === m.id 
                ? `border-slate-700 bg-slate-800 ring-2 ${m.activeColor} ring-opacity-20`
                : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800'
              }`}
              onClick={() => setModel(m.id)}
            >
              <span className={`absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full ${model === m.id ? m.dotColor : 'bg-slate-800'}`} />
              <span className="block text-xs font-semibold text-white">{m.name}</span>
              <span className="block text-[10px] text-slate-500">{m.sub}</span>
            </button>
          ))}
        </div>

        <textarea
          className="w-full h-32 p-3 border border-slate-800 rounded-lg text-sm bg-slate-950 focus:outline-none focus:border-slate-700 transition-all resize-y text-white"
          value={inputText}
          placeholder="Paste or type text to tokenize..."
          onChange={(e) => setInputText(e.target.value)}
        />

        <div className="flex gap-2 mt-3">
          <button className="px-3 py-1.5 border border-slate-800 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs text-slate-400 hover:text-white transition-all" onClick={() => setInputText('')}>Clear</button>
          <button className="px-3 py-1.5 border border-slate-800 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs text-slate-400 hover:text-white transition-all" onClick={() => setInputText("Many words map to one token, but some don't: indivisible.\nUnicode characters like emojis may be split into many tokens.\nSequences of characters commonly found next to each other may be grouped together: 1234567890")}>Show example</button>
        </div>

        <div className="flex flex-wrap gap-8 py-5 my-5 border-y border-slate-800">
          <div className="flex flex-col">
            <label className="text-[10px] font-medium uppercase tracking-wider text-slate-500 mb-1">Tokens</label>
            <span className="text-2xl font-light font-mono text-white">{tokens.length.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-medium uppercase tracking-wider text-slate-500 mb-1">Characters</label>
            <span className="text-2xl font-light font-mono text-white">{inputText.length.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-medium uppercase tracking-wider text-slate-500 mb-1">~Words</label>
            <span className="text-2xl font-light font-mono text-white">{Math.round(tokens.length * 0.75).toLocaleString()}</span>
          </div>
        </div>

        <div className={`min-h-[72px] text-sm leading-[2.2] ${viewMode === 'ids' ? 'font-mono' : 'font-sans'}`}>
          {tokens.map((t, i) => {
            const colorClass = getStyleForIndex(i);
            if (viewMode === 'ids') {
              return (
                <span 
                  key={i} 
                  className={`inline-block m-0.5 px-2 py-0.5 rounded font-mono text-[10px] ${colorClass}`}
                >
                  {getTokenId(t, model)}
                </span>
              );
            } else {
              return (
                <span key={i} className={`inline-block rounded-sm px-0.5 whitespace-pre-wrap ${colorClass}`}>
                  {t === '\n' ? '↵\n' : t}
                </span>
              );
            }
          })}
        </div>

        <div className="flex gap-1 mt-4 pt-4 border-t border-slate-800">
          <button 
            className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all ${viewMode === 'text' ? 'bg-slate-800 border border-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`} 
            onClick={() => setViewMode('text')}
          >
            Text
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all ${viewMode === 'ids' ? 'bg-slate-800 border border-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`} 
            onClick={() => setViewMode('ids')}
          >
            Token IDs
          </button>
        </div>
      </div>

      <div className="flex gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-800 mt-4">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-500" />
        <p className="text-xs text-slate-400 leading-relaxed m-0">{NOTES[model]}</p>
      </div>

      <p className="text-[10px] text-slate-500 text-center mt-8 leading-relaxed">
        Token counts are approximations. For production use, integrate the official tokenizer libraries:<br />
        <strong>Claude</strong>: <code>anthropic-tokenizer</code> &nbsp;·&nbsp;
        <strong>Gemini</strong>: <code>google-generativeai</code> &nbsp;·&nbsp;
        <strong>OpenAI</strong>: <code>tiktoken</code>
      </p>
    </div>
  );
}
