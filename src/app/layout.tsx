import type { Viewport, Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer"; // Still keep for non-blog if needed, but we'll use BlogFooter globally for now
import BlogFooter from "@/components/BlogFooter";
import LoadingScreen from "@/components/LoadingScreen";
import ThemeProvider from "@/components/ThemeProvider";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { StickyResultsBar } from "@/components/StickyResultsBar";
import { AuthProvider } from "@/components/AuthProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tokensense-ai.com"),
  alternates: {
    canonical: '/',
    types: {
      'text/plain': '/llms.txt',
      'application/xml': '/sitemap.xml',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <link rel="alternate" type="text/plain" href="/robots.txt" />
        <link rel="llms-content" href="/llms.txt" />
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
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <NextIntlClientProvider messages={messages} locale="en">
              <LoadingScreen />
              <PWAInstallPrompt />
              <StickyResultsBar />
              {children}
              <BlogFooter />
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
