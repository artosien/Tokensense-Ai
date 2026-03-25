export default function HomeSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Tokensense-Ai",
        "description": "A free, client-side LLM token cost calculator for developers and AI engineers.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Instant token counting",
          "Multi-model cost estimation",
          "Agentic loop simulation",
          "File context support (.pdf, .code, .csv)",
          "100% Client-side privacy"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What counts as one token?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tokens are pieces of words. In English, 1,000 tokens is approximately 750 words."
            }
          },
          {
            "@type": "Question",
            "name": "Why do different models charge different rates for the same text?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Each model (GPT-4, Claude, Gemini) uses a different tokenizer and pricing structure based on its computational complexity."
            }
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
