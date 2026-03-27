import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import ThemeProvider from "@/components/ThemeProvider";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tokensense-ai.com'),
  title: {
    default: "Tokensense-Ai - Free LLM Token Cost Calculator",
    template: "%s | Tokensense-Ai" 
  },
  description:
    "Estimate LLM API costs before you send a request. Tokensense-Ai is a free, client-side token cost calculator for GPT-4o, Claude, Gemini, and more. No account needed.",
  keywords: "LLM token cost calculator, token cost estimator, GPT-4o pricing, Claude API cost, AI token counter, OpenAI token calculator, prompt token count, LLM API pricing tool",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Tokensense-Ai - Free LLM Token Cost Calculator",
    description:
      "Know your token cost before every API call. Supports GPT-4o, Claude, Gemini & more. Free, private, client-side.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // M4: Prevent viewport zoom on input focus
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <LoadingScreen />
            <PWAInstallPrompt />
            {children}
            <Footer />
            <BackToTop />
          </ThemeProvider>
        </AuthProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Tokensense-Ai",
              "description": "A free, client-side pre-flight LLM token cost calculator. Estimate API costs for GPT-4o, Claude, Gemini, and more before sending any request.",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Real-time token counting",
                "LLM API cost estimation",
                "Multi-model support",
                "File context upload",
                "Agentic loop cost simulator",
                "100% client-side, private"
              ]
            })
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}