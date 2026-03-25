import { Metadata } from 'next';
import HomeClient from './HomeClient';
import HomeSchema from '@/components/HomeSchema';

export const metadata: Metadata = {
  title: "Tokensense-Ai | Free LLM Token Counter & Prompt Cost Calculator",
  description: "Calculate AI prompt costs instantly. Estimate token usage and API pricing for GPT-5, Claude 3.5, and Gemini. 100% client-side, private, and no sign-up required.",
  keywords: ["LLM token counter", "prompt cost calculator", "GPT-5 pricing", "AI developer tools", "Claude token count", "Gemini API cost"],
  alternates: {
    canonical: 'https://www.tokensense-ai.com',
  },
  openGraph: {
    title: "Tokensense-Ai | AI Prompt Cost Calculator",
    description: "Know your API costs before you hit send. 100% private, client-side token counting.",
    url: 'https://www.tokensense-ai.com',
    siteName: 'Tokensense-Ai',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tokensense-Ai Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tokensense-Ai | LLM Token & Cost Calculator",
    description: "Instant cost estimates for GPT, Claude, and Gemini prompts.",
    images: ['/og-image.png'],
  },
};

export default function Home() {
  return (
    <>
      <HomeSchema />
      <HomeClient />
    </>
  );
}
