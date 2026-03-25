import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

export default function SEO({
  title = "Tokensense-Ai | Free LLM Token Counter & Prompt Cost Calculator",
  description = "Calculate AI prompt costs instantly. Supports GPT-4o, Claude 3.5, and Gemini. Estimate token usage and compare model pricing 100% client-side.",
  canonical = "https://tokensense-ai.com", // Update with your real domain
  ogImage = "https://tokensense-ai.com/og-image.png",
}: SEOProps) {
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What counts as one token?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tokens are pieces of words used by LLMs. In English, 1,000 tokens is roughly 750 words."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data safe on Tokensense-Ai?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Tokensense-Ai is 100% client-side. Your prompts and API keys never leave your browser."
        }
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Tokensense-Ai",
    "operatingSystem": "All",
    "applicationCategory": "DeveloperApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <Head>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
    </Head>
  );
}
