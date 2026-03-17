import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { Bot } from "lucide-react";
import TrustMessage from "@/components/TrustMessage";
import { Button } from "@/components/ui/button";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
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
                            Tokensense-Ai ("the Service") is a free, browser-based LLM token cost estimation tool available at tokensense-ai.com. It allows users to estimate the approximate cost of API calls to large language model providers — including OpenAI, Anthropic, and Google — based on user-supplied prompts and selected models. All computation occurs client-side within your browser.
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
                                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, TOKENSENSE-AI AND ITS OPERATOR EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
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

            {/* Footer */}
            <footer className="border-t border-border/40 mt-auto bg-muted/20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex items-center justify-center w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm text-white">
                                <Bot className="w-3.5 h-3.5 text-indigo-50" />
                            </div>
                            <p className="text-sm font-medium text-foreground">
                                Token clarity, before every call.
                            </p>
                        </div>
                        <TrustMessage />
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-muted-foreground/60">
                            <p>Tokensense-Ai — Prices are estimates based on public API pricing.</p>
                            <span className="hidden sm:inline">•</span>
                            <p>Built with Next.js, Tailwind CSS, and tiktoken</p>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-muted-foreground/80">
                            <Link href="/multimodal" className="hover:text-indigo-400 transition-colors">Image Estimator</Link>
                            <Link href="/caching" className="hover:text-indigo-400 transition-colors">Context Caching</Link>
                            <Link href="/faq" className="hover:text-indigo-400 transition-colors">FAQ</Link>
                            <Link href="/about" className="hover:text-indigo-400 transition-colors">About</Link>
                            <Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact Us</Link>
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground/60">
                            <Link href="/terms" className="hover:text-indigo-400 underline underline-offset-2 transition-colors">
                                Terms of Service
                            </Link>
                            <span>|</span>
                            <Link href="/privacy" className="hover:text-indigo-400 underline underline-offset-2 transition-colors">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
