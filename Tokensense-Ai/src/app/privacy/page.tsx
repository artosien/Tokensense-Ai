import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { Bot } from "lucide-react";
import TrustMessage from "@/components/TrustMessage";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Privacy Policy
                    </h1>
                    <div className="text-sm text-muted-foreground">
                        <p><strong>Effective Date:</strong> March 8, 2026</p>
                        <p><strong>Website:</strong> tokensense-ai.com</p>
                    </div>
                </div>

                <div className="prose prose-sm sm:prose-base prose-invert prose-indigo max-w-none space-y-6 text-muted-foreground leading-relaxed">

                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-xl my-8">
                        <p className="font-semibold text-indigo-300 mb-4 uppercase tracking-wider text-sm">The Short Version</p>
                        <p className="text-foreground font-medium mb-4">
                            Tokensense-Ai is built on a simple principle: your prompts are yours.
                        </p>
                        <p className="mb-4">
                            Unlike cloud-based AI tools that send your inputs to remote servers for processing, Tokensense-Ai runs entirely inside your browser. Every token count, every cost estimate, every file you upload is processed locally on your own device. Nothing you type or upload is ever transmitted to, or stored on, any server operated by Tokensense-Ai.
                        </p>
                        <p>
                            This is not a policy promise. It is a technical reality enforced by how the application is built.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">1. How Tokensense-Ai Works — and Why It Matters for Privacy</h2>
                        <p>
                            Most web applications work by sending your data to a server, processing it there, and returning a result. This means your inputs — in the case of AI tools, often sensitive prompts, business logic, and internal documents — are transmitted over the internet and handled by a third party.
                        </p>
                        <p>
                            Tokensense-Ai is different. It is a fully client-side application, meaning all logic runs in JavaScript executed by your own browser. When you paste a prompt or upload a file:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                            <li>Your text is tokenized locally using browser-based code — it never leaves your device</li>
                            <li>Your file is parsed in memory within your browser tab — it is never uploaded anywhere</li>
                            <li>Cost estimates are calculated on-device using pricing data that was loaded when the page opened</li>
                            <li>When you close or refresh the page, all session data is discarded entirely</li>
                        </ul>
                        <p className="mt-2 text-foreground font-medium">
                            There is no Tokensense-Ai backend. There is no database. There is no server receiving your prompts. This is not a configuration choice — it is the architecture.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">2. What We Do Not Collect</h2>
                        <p>
                            Because of the client-side architecture described above, the following data is never collected, transmitted, or stored by Tokensense-Ai:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                            <li>The contents of any system prompt or user message you enter</li>
                            <li>Any files you upload for token context estimation</li>
                            <li>Your API keys or any other credentials</li>
                            <li>Any personally identifiable information (name, email, address, phone number)</li>
                            <li>IP addresses linked to individual user activity</li>
                            <li>Financial or billing information of any kind</li>
                        </ul>
                        <p className="mt-2 text-foreground font-medium">
                            We have no access to your prompts because your prompts never reach us.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">3. What We May Collect — Anonymous Analytics</h2>
                        <p>
                            We may use a privacy-respecting, cookieless analytics tool (such as Plausible Analytics or a similar service) to understand aggregate usage patterns. If so, this may include:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                            <li>Total page views and general session counts</li>
                            <li>Browser type and operating system (aggregated, not individual)</li>
                            <li>Country-level geographic data — not city, address, or precise location</li>
                            <li>Referral source (e.g., how users found the site)</li>
                        </ul>
                        <p className="mt-2">
                            This data is used exclusively to understand how the Service is used at a macro level and to guide improvements. It is never sold, never shared with advertisers, and never linked to any individual user or session. If analytics are not enabled, no usage data of any kind is collected.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">4. Cookies and Local Storage</h2>
                        <p>
                            Tokensense-Ai does not use tracking cookies or advertising cookies of any kind.
                        </p>
                        <p>
                            The Service may use your browser's local storage to remember your preferences between visits — for example, your last selected model or output length slider position. This data is:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                            <li>Stored only on your own device</li>
                            <li>Never transmitted to any server</li>
                            <li>Easily cleared by clearing site data for this domain in your browser settings</li>
                        </ul>
                        <p className="mt-2">
                            This is a convenience feature, not a data collection mechanism.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">5. Third-Party Links and Services</h2>
                        <p>
                            The Service may display information about or links to third-party LLM providers such as OpenAI, Anthropic, and Google. Clicking those links takes you to external websites governed by their own privacy policies. Tokensense-Ai is not responsible for the data practices of any third party. We encourage you to review the privacy policies of any external service you visit.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">6. Data Security</h2>
                        <p>
                            Conventional data security concerns — breaches, unauthorized access, data leakage — do not apply to Tokensense-Ai in the traditional sense, because we do not hold your data. There is no centralized repository of user prompts or personal information that could be compromised.
                        </p>
                        <p>
                            The only data that exists in relation to your session is data you have chosen to enter into your own browser. It lives in your browser's memory and is discarded the moment you leave the page.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">7. Children's Privacy</h2>
                        <p>
                            The Service is not directed to children under the age of 13, and we do not knowingly collect personal information from children. If you believe a child has provided personal information through the Service, please contact us so we may take appropriate steps.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">8. Your Rights</h2>
                        <p>
                            Under applicable privacy laws (including GDPR, CCPA, and similar regulations), you may have rights including the right to access, correct, port, or delete personal data held about you.
                        </p>
                        <p>
                            Because Tokensense-Ai does not collect or retain personal data, there is no data for us to provide, correct, or delete on our end. Your prompts and files are processed entirely on your own device and are never in our possession.
                        </p>
                        <p>
                            If you have questions about your rights or believe we have inadvertently collected data about you, please contact us.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">9. Changes to This Privacy Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time to reflect changes in the Service, applicable law, or our practices. Updates will be reflected by a revised effective date. We encourage you to review this policy periodically. Continued use of the Service after any changes constitutes your acceptance of the updated policy.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">10. Contact</h2>
                        <p>
                            If you have any questions, requests, or concerns about this Privacy Policy, please contact us at: tokensense-ai.com
                        </p>
                    </div>

                    <div className="bg-muted/30 border border-border/50 p-6 rounded-xl mt-8 mb-4">
                        <p className="text-foreground">
                            In plain terms: we built Tokensense-Ai so that you never have to worry about where your prompts go.
                        </p>
                        <p className="text-foreground font-medium mt-1">
                            They go nowhere. They stay with you.
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
