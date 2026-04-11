const fs = require('fs');

const htmlContent = `<div class="space-y-8 text-muted-foreground leading-relaxed">
  <h1 class="text-4xl font-bold text-white mb-4">BPE vs SentencePiece vs Tiktoken</h1>
  <p class="text-xl text-foreground font-medium leading-relaxed italic border-l-4 border-indigo-500 pl-6">How tokenizers actually work — from first principles to production</p>

  <div class="flex gap-2 mb-8">
    <span class="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">NLP</span>
    <span class="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">Tokenization</span>
    <span class="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">LLMs</span>
  </div>

  <p>Every large language model processes text by first breaking it into pieces called tokens. The algorithm you use to split text — your tokenizer — quietly shapes vocabulary size, multilingual capability, context window efficiency, and even what the model can reason about. This guide unpacks three dominant approaches from the ground up.</p>

  <p>Before a single weight is trained, the tokenizer is already making decisions that can't be undone. A poor tokenizer wastes context, mangles numbers, and breaks non-English text — all without any visible error.</p>

  <h2 class="text-3xl font-bold text-white mt-12 mb-6">Why tokenization exists at all</h2>
  <p>Neural networks operate on vectors of numbers. Text is a sequence of characters. The naive approach — one number per character — works but produces very long sequences and loses word-level meaning. The other extreme — one number per word — keeps sequences short but requires an enormous vocabulary for all inflected forms, misspellings, and rare words.</p>

  <p>Subword tokenization sits in between: common words stay whole, rare or novel words get split into meaningful fragments, and the vocabulary stays manageably sized (typically 32,000–100,000 tokens). Here's how that looks in practice:</p>

  <h3 class="text-2xl font-bold text-white mt-8 mb-4">The same sentence, three different tokenizations</h3>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
    <div class="p-6 rounded-2xl bg-slate-900 border border-border/40">
      <h4 class="font-bold text-white mb-2 uppercase text-[10px] tracking-widest text-slate-500">Character-level</h4>
      <p class="text-xs text-slate-400 mb-4 italic">Too granular — 25 tokens</p>
      <div class="flex flex-wrap gap-1 font-mono text-[10px]">
        ${["U","n","t","o","k","e","n","i","z","a","b","l","e"," ","w","o","r","d","s"," ","e","x","i","s","t"].map(c => `<span class="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">${c === ' ' ? '␣' : c}</span>`).join('')}
      </div>
    </div>
    <div class="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
      <h4 class="font-bold text-white mb-2 uppercase text-[10px] tracking-widest text-indigo-400">Subword (BPE)</h4>
      <p class="text-xs text-indigo-300/60 mb-4 italic">5 tokens</p>
      <div class="flex flex-wrap gap-1 font-mono text-xs">
        <span class="bg-indigo-500/20 text-indigo-200 px-2 py-0.5 rounded border border-indigo-500/30">Un</span>
        <span class="bg-indigo-500/20 text-indigo-200 px-2 py-0.5 rounded border border-indigo-500/30">token</span>
        <span class="bg-indigo-500/20 text-indigo-200 px-2 py-0.5 rounded border border-indigo-500/30">iz</span>
        <span class="bg-indigo-500/20 text-indigo-200 px-2 py-0.5 rounded border border-indigo-500/30">able</span>
        <span class="bg-indigo-500/20 text-indigo-200 px-2 py-0.5 rounded border border-indigo-500/30">words exist</span>
      </div>
    </div>
    <div class="p-6 rounded-2xl bg-slate-900 border border-border/40">
      <h4 class="font-bold text-white mb-2 uppercase text-[10px] tracking-widest text-slate-500">Word-level</h4>
      <p class="text-xs text-slate-400 mb-4 italic">Too coarse — fails on OOV</p>
      <div class="flex flex-wrap gap-1 font-mono text-xs">
        <span class="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Untokenizable</span>
        <span class="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded border border-rose-500/30">[UNK]</span>
        <span class="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">exist</span>
      </div>
    </div>
  </div>

  <p>Subword tokenization handles rare/novel words without collapsing to [UNK] or exploding into individual characters.</p>

  <h2 class="text-3xl font-bold text-white mt-12 mb-6">Method 1 — Byte Pair Encoding (BPE)</h2>
  <p>BPE was originally a data-compression algorithm from 1994 before being adapted for NLP by Sennrich et al. in 2016. The idea is beautifully simple: find the most frequent adjacent pair of symbols, merge them into a single new symbol, and repeat until you reach a target vocabulary size.</p>

  <h3 class="text-2xl font-bold text-white mt-8 mb-4">Building the BPE vocabulary step by step</h3>
  <div class="space-y-6 my-10">
    <div class="p-6 rounded-2xl bg-slate-900/50 border border-border/40 flex gap-6">
      <div class="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-indigo-500/20">1</div>
      <div class="space-y-2">
        <h4 class="font-bold text-white text-lg">Start with individual characters</h4>
        <p class="text-sm text-slate-400 leading-relaxed">Begin with a corpus split into characters (with a special end-of-word marker ▁). Each unique character becomes its own token.</p>
        <pre class="text-[10px] bg-slate-950 p-3 rounded-lg border border-slate-800 text-indigo-300 font-mono"><code>corpus: "low", "lower", "newest", "widest"</code></pre>
      </div>
    </div>
    <div class="p-6 rounded-2xl bg-slate-900/50 border border-border/40 flex gap-6">
      <div class="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-indigo-500/20">2</div>
      <div class="space-y-2">
        <h4 class="font-bold text-white text-lg">Count pairs</h4>
        <p class="text-sm text-slate-400 leading-relaxed">Identify the most frequent adjacent pair of symbols.</p>
        <pre class="text-[10px] bg-slate-950 p-3 rounded-lg border border-slate-800 text-indigo-300 font-mono"><code>l o w ▁   → freq: 2\\nl o w e r ▁ → freq: 3\\nn e w e s t ▁ → freq: 6\\nw i d e s t ▁ → freq: 3</code></pre>
      </div>
    </div>
  </div>

  <h3 class="text-2xl font-bold text-white mt-8 mb-4">How BPE encodes at inference time</h3>
  <p>At inference, the tokenizer takes a new word and applies all merge rules in order from the first merge to the last. The greedy left-to-right application means the same word always gets the same tokenization — which is important for consistency.</p>

  <div class="bg-slate-950 p-8 rounded-3xl border border-border/40 my-8">
    <h4 class="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-6 text-center">Encoding "tokenization" with learned BPE rules</h4>
    <div class="flex flex-col md:flex-row items-center justify-center gap-8">
      <div class="flex flex-wrap gap-1 justify-center max-w-[200px]">
        ${["t","o","k","e","n","i","z","a","t","i","o","n"].map(c => `<span class="w-8 h-8 flex items-center justify-center bg-slate-900 border border-slate-800 rounded text-slate-400 font-mono text-sm">${c}</span>`).join('')}
      </div>
      <div class="text-indigo-500 font-bold text-2xl animate-pulse">→</div>
      <div class="flex gap-2">
        <span class="bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-indigo-500/20">token</span>
        <span class="bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-indigo-500/20">ization</span>
      </div>
    </div>
  </div>

  <h3 class="text-2xl font-bold text-white mt-8 mb-4">Byte-level BPE</h3>
  <p>GPT-2 introduced an important variant: instead of starting with characters, start with raw bytes (the 256 possible byte values). This guarantees every possible UTF-8 string can be encoded — no unknown tokens, ever. It's how GPT-3, GPT-4, and most OpenAI models work.</p>

  <h2 class="text-3xl font-bold text-white mt-12 mb-6">Method 2 — SentencePiece</h2>
  <p>SentencePiece, released by Google in 2018, takes a different philosophical stance: treat the input as a raw stream of Unicode characters — including whitespace — with no pre-tokenization step whatsoever. This makes it language-agnostic by design.</p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
    <div class="p-6 rounded-3xl bg-slate-900/50 border border-border/40">
      <h4 class="font-bold text-white mb-4 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-500"></span>BPE mode</h4>
      <p class="text-sm text-slate-400">The same BPE merge algorithm, but operating directly on Unicode code points. The ▁ (U+2581) marker prepended to words handles whitespace.</p>
    </div>
    <div class="p-6 rounded-3xl bg-slate-900/50 border border-border/40">
      <h4 class="font-bold text-white mb-4 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-blue-500"></span>Unigram mode</h4>
      <p class="text-sm text-slate-400">A probabilistic model. Starts with a huge vocabulary and prunes it — choosing the most probable tokenization.</p>
    </div>
  </div>

  <h3 class="text-2xl font-bold text-white mt-8 mb-4">What makes SentencePiece different</h3>
  <p>The killer feature is the ▁ whitespace marker. Instead of pre-splitting on spaces, SentencePiece inserts ▁ before each "word boundary" position and learns whether that boundary should be a token split. This means Chinese, Japanese, Thai, and Arabic text are handled identically to English.</p>

  <div class="bg-slate-950 p-6 rounded-2xl border border-border/40 overflow-x-auto my-8">
    <div class="grid grid-cols-2 gap-8 min-w-[500px]">
      <div class="space-y-2">
        <h5 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Standard BPE (Language-specific)</h5>
        <div class="flex flex-wrap gap-1 font-mono text-xs">
          <span class="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-400">Hello</span>
          <span class="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-400">Ġworld</span>
        </div>
      </div>
      <div class="space-y-2">
        <h5 class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4">SentencePiece (Language-agnostic)</h5>
        <div class="flex flex-wrap gap-1 font-mono text-xs">
          <span class="bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 text-indigo-300">▁Hello</span>
          <span class="bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 text-indigo-300">▁world</span>
        </div>
      </div>
    </div>
  </div>

  <h2 class="text-3xl font-bold text-white mt-12 mb-6">Method 3 — Tiktoken</h2>
  <p>Tiktoken is OpenAI's tokenizer, used in GPT-3.5 and GPT-4. Algorithmically it's byte-level BPE — but it uses regex-based pre-tokenization to enforce hard rules before BPE runs.</p>

  <pre class="bg-slate-950 p-6 rounded-2xl border border-border/40 overflow-x-auto my-8"><code class="text-xs text-indigo-300 font-mono"># cl100k_base (GPT-4) pre-tokenization pattern
PAT = r"""(?i:'s|'t|'re|'ve|'m|'ll|'d)|""" # contractions
    r"""[^\\r\\n\\p{L}\\p{N}]?+\\p{L}+|""" # words
    r"""\\p{N}{1,3}|""" # max 3 digits at a time!</code></pre>

  <p>Notice <code>\\p{N}{1,3}</code> — numbers are split into chunks of at most 3 digits. This forces the model to process numbers more granularly, improving arithmetic performance.</p>

  <h2 class="text-3xl font-bold text-white mt-12 mb-6">Interactive Tokenizer Playground</h2>
  <p>Try tokenizing text below to see how different tokenizer styles handle it in real-time.</p>
  
  {{TOKENIZER_PLAYGROUND}}

  <h2 class="text-3xl font-bold text-white mt-12 mb-6">Side-by-side comparison</h2>
  <div class="overflow-x-auto my-10 rounded-2xl border border-border/40 shadow-2xl bg-slate-900/50">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-indigo-500/10 border-b border-border/40">
          <th class="p-4 font-bold text-white text-sm">Property</th>
          <th class="p-4 font-bold text-white text-sm">BPE</th>
          <th class="p-4 font-bold text-white text-sm">SentencePiece</th>
          <th class="p-4 font-bold text-white text-sm">Tiktoken</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border/20">
        <tr>
          <td class="p-4 text-sm text-white font-medium">Multilingual</td>
          <td class="p-4 text-sm">Partial</td>
          <td class="p-4 text-sm text-emerald-400 font-bold">Excellent</td>
          <td class="p-4 text-sm">Good</td>
        </tr>
        <tr>
          <td class="p-4 text-sm text-white font-medium">Unknown Tokens</td>
          <td class="p-4 text-sm">Possible</td>
          <td class="p-4 text-sm text-emerald-400 font-bold">None (Unigram)</td>
          <td class="p-4 text-sm text-emerald-400 font-bold">None (Byte-level)</td>
        </tr>
        <tr>
          <td class="p-4 text-sm text-white font-medium">Used by</td>
          <td class="p-4 text-sm text-slate-500">GPT-2, RoBERTa</td>
          <td class="p-4 text-sm text-slate-500">LLaMA, Mistral, T5</td>
          <td class="p-4 text-sm text-slate-500">GPT-4, GPT-4o</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2 class="text-3xl font-bold text-white mt-12 mb-6">Choosing a tokenizer for your project</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
    <div class="p-6 rounded-3xl bg-slate-900 border border-border/40 hover:border-indigo-500/50 transition-colors">
      <h4 class="font-bold text-white mb-2">Multilingual</h4>
      <p class="text-xs text-slate-400">Use SentencePiece with Unigram for best cross-language balance.</p>
    </div>
    <div class="p-6 rounded-3xl bg-slate-900 border border-border/40 hover:border-indigo-500/50 transition-colors">
      <h4 class="font-bold text-white mb-2">OpenAI Stack</h4>
      <p class="text-xs text-slate-400">Use Tiktoken (cl100k) for 1:1 compatibility with GPT-4.</p>
    </div>
    <div class="p-6 rounded-3xl bg-slate-900 border border-border/40 hover:border-indigo-500/50 transition-colors">
      <h4 class="font-bold text-white mb-2">Custom Research</h4>
      <p class="text-xs text-slate-400">Use HuggingFace Tokenizers for full control over domain rules.</p>
    </div>
  </div>

  <h2 class="text-3xl font-bold text-white mt-12 mb-6">Code: Using each in Python</h2>
  <pre class="bg-slate-950 p-6 rounded-2xl border border-border/40 overflow-x-auto my-8"><code class="text-xs text-indigo-300 font-mono"># Tiktoken (GPT-4)
import tiktoken
enc = tiktoken.get_encoding("cl100k_base")
tokens = enc.encode("Hello world") # [9906, 1917]</code></pre>

  <div class="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl mt-12 flex flex-wrap gap-4 items-center justify-between">
    <p class="text-sm text-indigo-300 font-medium cursor-pointer hover:text-white transition-colors">Explore subword regularization →</p>
    <p class="text-sm text-indigo-300 font-medium cursor-pointer hover:text-white transition-colors">Best tokenizer for code models →</p>
  </div>
</div>`;

const dataFile = 'data/blog-posts.json';
const rawData = fs.readFileSync(dataFile, 'utf8');
const posts = JSON.parse(rawData);

const postIndex = posts.findIndex(p => p.id === "26");
if (postIndex === -1) {
  console.error("Post 26 not found");
  process.exit(1);
}

posts[postIndex].content = htmlContent;

fs.writeFileSync(dataFile, JSON.stringify(posts, null, 2), 'utf8');
console.log("Blog post 26 updated successfully.");
