import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import BugReportForm from "@/components/BugReportForm";
import { Bot, Mail, MessageSquare } from "lucide-react";
import TrustMessage from "@/components/TrustMessage";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Contact Us
                    </h1>
                </div>

                <div className="prose prose-sm sm:prose-base prose-invert prose-indigo max-w-none space-y-6 text-muted-foreground leading-relaxed">
                    <p>
                        Have a question, feedback, or found a bug? We'd love to hear from you. Use the forms below to get in touch with the Tokensense-Ai team to improve your developer experience.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 mb-16">
                        <div className="p-6 rounded-lg bg-card/50 border border-border/40 flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-2">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground m-0">Email Support</h3>
                            <p className="text-sm m-0">Drop us a line directly at support@tokensense-ai.com</p>
                        </div>
                        <div className="p-6 rounded-lg bg-card/50 border border-border/40 flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-2">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground m-0">Community</h3>
                            <p className="text-sm m-0">Join our Discord community or visit our GitHub</p>
                        </div>
                    </div>

                    <BugReportForm />
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
