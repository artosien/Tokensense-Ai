import type { Viewport, Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import ThemeProvider from "@/components/ThemeProvider";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { AuthProvider } from "@/components/AuthProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tokensense-ai.com"),
  alternates: {
    types: {
      'text/plain': '/llms.txt',
    },
  },
  other: {
    'llms-content': '/llms.txt',
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1XGN4X2TEF"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1XGN4X2TEF');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebApplication",
                  "name": "Tokensense-Ai",
                  "description": "A free, client-side pre-flight LLM token cost calculator.",
                  "applicationCategory": "DeveloperApplication",
                  "operatingSystem": "Any",
                  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
                  "featureList": [
                    "Real-time token counting",
                    "LLM API cost estimation",
                    "Multi-model support",
                    "File context upload",
                    "Agentic loop cost simulator",
                    "100% client-side, private"
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
                        "text": "Each model (GPT-4o, Claude, Gemini) uses a different tokenizer and pricing structure based on its computational complexity."
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <NextIntlClientProvider messages={messages} locale="en">
              <LoadingScreen />
              <PWAInstallPrompt />
              {children}
              <Footer />
              <BackToTop />
            </NextIntlClientProvider>
          </ThemeProvider>
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
