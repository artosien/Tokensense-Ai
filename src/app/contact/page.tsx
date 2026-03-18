import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import BugReportForm from "@/components/BugReportForm";
import { Mail, MessageSquare } from "lucide-react";
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

        </div>
    );
}
