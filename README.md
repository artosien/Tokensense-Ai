# Tokensense-Ai 💎
### The Ultimate Open-Source LLM Token Intelligence & Cost Strategy Suite

Tokensense-Ai is a privacy-first, professional-grade cost intelligence platform designed for AI developers, prompt engineers, and architects. It provides a "pre-flight" environment to calculate, simulate, and optimize API costs across 50+ major models (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, Llama 3) before you make a single API call.

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25_Client--Side-green?style=for-the-badge)](https://www.tokensense-ai.com)
[![License](https://img.shields.io/badge/License-Apache_2.0-orange?style=for-the-badge)](LICENSE)

---

## 🛠️ The Toolkit

Tokensense-Ai isn't just a simple counter; it's a comprehensive suite of optimization tools:

### 1. **High-Precision Prompt Editor**
- **Function:** Real-time token counting utilizing each provider's exact tokenizer via `tiktoken` WASM.
- **Key Feature:** Side-by-side editing of System and User prompts with instant cost projection.
- **Optimizers:** Integrated "Token Diet" tools to strip whitespace and compress prompts without losing context.

### 2. **Multimodal (Vision) Estimator**
- **Function:** Calculates tokens for image processing based on resolution and detail settings (High/Low).
- **Functionality:** Supports OpenAI's tile-based pricing and Anthropic's vision padding logic.

### 3. **Context Caching Calculator**
- **Function:** Solves the "Break-Even" math for cached context (Anthropic & Gemini).
- **Strategic Insight:** Determine exactly how many turns or documents you need to process before the caching premium pays for itself in read-discounts.

### 4. **Agentic Loop Simulator**
- **Function:** Forecasts the compounded cost of autonomous agent workflows.
- **Functionality:** Simulates recursive context growth, planning turns, and "worst-case" billing scenarios for loops that retry or branch.

### 5. **Batch Optimization Suite**
- **Function:** Compare standard API pricing vs. asynchronous Batch API discounts.
- **Functionality:** Plan large-scale data processing jobs with projected savings of 50%+.

### 6. **Model Comparison & Benchmarking**
- **Function:** Side-by-side cost analysis across 50+ LLMs.
- **Key Metric:** Real-time calculation of Input vs. Output token ratios and cost-per-1M-tokens.

### 7. **Pricing History Tracker**
- **Function:** Visual timeline of LLM price drops and provider competition.
- **Strategic Insight:** Track the "Commoditization of Reasoning" as frontier models become progressively cheaper.

### 8. **Tokenomics Academy**
- **Function:** Interactive educational modules (Lessons 1-4) covering the math behind tokenization, multilingual penalties, and agentic architecture.

---

## 🔒 Privacy & Security: The "Zero-Server" Mandate

In the era of sensitive data, Tokensense-Ai operates on a **Zero-Server** architecture:
- **Client-Side Processing:** All tokenization and logic happen 100% in your browser.
- **No Data Retention:** Your prompts, files, and API keys (optional) are never uploaded or stored.
- **WASM Performance:** High-speed computation using WebAssembly for local efficiency.

---

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router, RSC)
- **UI:** Tailwind CSS v4, Lucide Icons, Framer Motion
- **State:** Zustand (Persistence-enabled)
- **Tokenization:** Tiktoken (WASM), Google AI Edge
- **Deployment:** Netlify / Vercel
- **Localization:** next-intl (Root-level flattened architecture)

---

## 📸 Screenshots

### The Mission Control Dashboard
![TokenSense Calculator](./screenshots/calculator-demo.png)

### Multi-Step Cost Breakdown
![Cost Breakdown](./screenshots/cost-breakdown.png)

### Features & Utilities
![Features Overview](./screenshots/features-overview.png)

---

## 📥 Getting Started

Tokensense-Ai is ready for local development or self-hosting:

1. **Clone & Install:**
   ```bash
   git clone https://github.com/artosien/Tokensense-Ai.git
   cd Tokensense-Ai
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🤝 Contributing & License

We believe in open-source transparency. If you find a pricing discrepancy or want to add a new model:
1. Open a PR following our [CONTRIBUTING.md](./CONTRIBUTING.md).
2. Check the [CHANGELOG.md](./CHANGELOG.md) for recent architectural updates.

**License:** Apache 2.0 (Open Core) — Built by **Angelo S. Enriquez**.

---
*Architecting the Future with Agentic Intelligence.*
