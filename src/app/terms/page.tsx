import { Metadata } from 'next';
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: "Terms of Service | Tokensense-Ai",
  description: "Please read the Terms of Service for Tokensense-Ai. Understand the guidelines, permitted uses, and disclaimers for our free browser-based LLM cost estimation tool.",
  alternates: {
      canonical: '/terms',
  },  openGraph: {
    title: "Terms of Service | Tokensense-Ai",
    description: "Usage policies and legal guidelines for our privacy-first AI token calculator.",
    url: 'https://www.tokensense-ai.com/terms',
    type: 'article',
    images: [
      {
        url: '/og-terms.png', // Recommended: A simple graphic with 'Terms of Service' text
        width: 1200,
        height: 630,
        alt: 'Tokensense-Ai Terms of Service',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: "Terms of Service | Tokensense-Ai",
    description: "Legal and usage guidelines for Tokensense-Ai.",
    images: ['/og-terms.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

function TermsSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.tokensense-ai.com/terms/#webpage",
        "url": "https://www.tokensense-ai.com/terms",
        "name": "Terms of Service",
        "description": "The legal terms and conditions governing the use of the Tokensense-Ai web application.",
        "datePublished": "2026-03-08T00:00:00+00:00",
        "dateModified": "2026-03-08T00:00:00+00:00",
        "publisher": {
          "@type": "Organization",
          "name": "Tokensense-Ai",
          "url": "https://www.tokensense-ai.com"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.tokensense-ai.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Terms of Service"
            }
          ]
        }
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

export const dynamic = 'force-static';

export default function TermsOfServicePage() {
    const locale = 'en';
    setRequestLocale(locale);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <TermsSchema />
            <SiteHeader />

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Terms of Service
                    </h1>
                    <div className="text-sm text-muted-foreground">
                        <p><strong>Effective Date:</strong> March 8, 2026</p>
                        <p><strong>Website:</strong> tokensense-ai.com</p>
                    </div>
                </div>

                <div className="prose prose-sm sm:prose-base prose-invert prose-indigo max-w-none space-y-6 text-muted-foreground leading-relaxed">
                    <p>
                        Please read these Terms of Service carefully before using Tokensense-Ai. By accessing or using the Service, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use the Service.
                    </p>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">1. About the Service</h2>
                        <p>
                            Tokensense-Ai (&quot;the Service&quot;) is a free, browser-based LLM token cost estimation tool available at tokensense-ai.com. It allows users to estimate the approximate cost of API calls to large language model providers — including OpenAI, Anthropic, and Google — based on user-supplied prompts and selected models. All computation occurs client-side within your browser.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">2. Acceptance of Terms</h2>
                        <p>
                            By accessing or using the Service in any way, you confirm that you are at least 13 years of age, that you have read and understood these Terms, and that you agree to be legally bound by them. Your continued use of the Service constitutes ongoing acceptance of these Terms as they may be updated from time to time.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">3. Permitted Use</h2>
                        <p>
                            The Service is provided for lawful, personal, and professional estimation purposes only. You agree not to:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                            <li>Attempt to reverse-engineer, decompile, or tamper with the Service or its source code</li>
                            <li>Use the Service to generate, distribute, or facilitate harmful, abusive, or illegal content</li>
                            <li>Misrepresent the Service, its outputs, or its affiliation with any third-party provider</li>
                            <li>Attempt to overload, disrupt, or interfere with the operation of the Service</li>
                            <li>Use automated scripts or bots to access the Service in a manner that degrades availability for others</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">4. Disclaimers and Limitation of Warranties</h2>
                        <p>This section is important. Please read it carefully.</p>

                        <div className="bg-muted/30 border border-border/50 p-4 rounded-lg my-4">
                            <p className="font-semibold text-foreground mb-2">WARRANTY DISCLAIMER</p>
                            <p className="uppercase text-xs leading-relaxed space-y-2">
                                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, TOKENSENSE-AI AND ITS OPERATOR EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 mt-2 uppercase text-xs">
                                <li>WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE</li>
                                <li>WARRANTIES OF ACCURACY, COMPLETENESS, OR RELIABILITY OF PRICING DATA</li>
                                <li>WARRANTIES THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE</li>
                                <li>WARRANTIES THAT ANY DEFECTS WILL BE CORRECTED</li>
                            </ul>
                            <p className="uppercase text-xs mt-4">YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK.</p>
                        </div>

                        <div className="space-y-4">
                            <p>
                                <strong>4.1 Pricing Accuracy.</strong> Token pricing data displayed by the Service is sourced from publicly available information and is updated periodically. However, Tokensense-Ai does not guarantee that any pricing figure reflects the current, actual rates charged by any third-party LLM provider. API pricing is subject to change by providers at any time without notice. You are solely responsible for verifying current pricing directly with the applicable provider before making any business, financial, or technical decision.
                            </p>
                            <p>
                                <strong>4.2 Estimation Only.</strong> All cost figures, token counts, and related outputs produced by the Service are estimates. They are not invoices, quotes, or binding commitments of any kind. Actual costs incurred when using third-party LLM APIs may differ materially from estimates provided by the Service, including due to differences in tokenization, model updates, tiered pricing, usage discounts, or regional pricing variations.
                            </p>
                            <p>
                                <strong>4.3 No Guarantee of Availability.</strong> The Service is provided free of charge and may be modified, suspended, or discontinued at any time, with or without notice, for any reason, including maintenance, technical issues, or cessation of operations. Tokensense-Ai shall have no liability to you for any such interruption or discontinuation.
                            </p>
                            <p>
                                <strong>4.4 External Links and Third-Party Content.</strong> The Service may reference or link to third-party websites, documentation, or pricing pages. Tokensense-Ai does not control these external resources and is not responsible for their accuracy, availability, or content. Linking to a third-party resource does not constitute endorsement.
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="bg-muted/30 border border-border/50 p-4 rounded-lg my-4">
                            <p className="font-semibold text-foreground mb-2">LIMITATION OF LIABILITY</p>
                            <p className="uppercase text-xs leading-relaxed space-y-2">
                                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL TOKENSENSE-AI OR ITS OPERATOR BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE SERVICE, INCLUDING BUT NOT LIMITED TO:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 mt-2 uppercase text-xs">
                                <li>FINANCIAL LOSSES OR UNEXPECTED API CHARGES BASED ON RELIANCE ON COST ESTIMATES</li>
                                <li>LOSS OF REVENUE, PROFITS, DATA, OR BUSINESS OPPORTUNITIES</li>
                                <li>BUSINESS INTERRUPTION OR PROCUREMENT OF SUBSTITUTE SERVICES</li>
                                <li>ANY OTHER INTANGIBLE LOSSES</li>
                            </ul>
                            <p className="uppercase text-xs mt-4">
                                THIS LIMITATION APPLIES REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE) AND EVEN IF TOKENSENSE-AI HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                            </p>
                            <p className="uppercase text-xs mt-4">
                                BECAUSE THE SERVICE IS FREE OF CHARGE, OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS SHALL NOT EXCEED ZERO DOLLARS ($0.00 USD).
                            </p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">5. No Financial or Professional Advice</h2>
                        <p>
                            Nothing in the Service constitutes financial, business, legal, technical, or investment advice. Cost estimates produced by the Service are informational approximations only. You should not rely on them as a substitute for professional judgment or direct consultation with the relevant API provider.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">6. Intellectual Property</h2>
                        <p>
                            All content, design, code, branding, and materials associated with Tokensense-Ai are the property of the Service operator and are protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any part of the Service without prior written permission. Nothing in these Terms grants you any ownership interest in the Service.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">7. Third-Party Services and Trademarks</h2>
                        <p>
                            The Service displays information related to third-party products and services including, but not limited to, OpenAI, Anthropic, and Google. Tokensense-Ai is independent of and not affiliated with, endorsed by, sponsored by, or in partnership with any of these third parties. All product names, logos, and trademarks are the property of their respective owners and are used for identification purposes only.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">8. Changes to These Terms</h2>
                        <p>
                            We may revise these Terms at any time. Revisions will be indicated by an updated effective date at the top of this document. Your continued use of the Service after any revisions constitutes your acceptance of the updated Terms. If you do not agree to revised Terms, please stop using the Service.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">9. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the Service operator is based, without regard to conflict of law provisions. Any disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of that jurisdiction.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">10. Severability</h2>
                        <p>
                            If any provision of these Terms is found to be unenforceable or invalid under applicable law, that provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall continue in full force and effect.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">11. Contact</h2>
                        <p>
                            If you have any questions about these Terms of Service, you may contact us via the website at: tokensense-ai.com
                        </p>
                    </div>
                </div>
            </main>

        </div>
    );
}
