"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle2, MessageSquareText } from "lucide-react";

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const form = e.currentTarget;
            const formData = new FormData(form);

            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });

            setIsSubmitting(false);
            if (response.ok) {
                setIsSubmitted(true);
                form.reset();
                return;
            }
        } catch {
            // fall through to error state below
        }

        setIsSubmitting(false);
        alert("Submission failed. Please try again.");
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto flex flex-col items-center justify-center p-8 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-indigo-500" />
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-foreground">Message Sent</h3>
                    <p className="text-sm text-indigo-600/80 dark:text-indigo-400/80">
                        Thank you for reaching out! We will get back to you as soon as possible.
                    </p>
                </div>
                <Button variant="outline" onClick={() => setIsSubmitted(false)} className="mt-4 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20">
                    Send Another Message
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-8 border border-border/50 rounded-2xl bg-card shadow-sm">    
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                    <MessageSquareText className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Send us a message</h2> 
            </div>
            <p className="text-sm text-muted-foreground mb-8">
                Have a question about Tokensense-Ai, a feature request, or just want to say hi? Fill out the form below and we will get back to you.
            </p>

            <form
                action="https://formspree.io/f/xbdzpnjy"
                method="POST"
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Full Name <span className="text-red-500">*</span></Label>
                        <Input id="name" name="name" required placeholder="John Doe" className="bg-background/50 border-border/50 focus:border-indigo-500/50" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Email Address <span className="text-red-500">*</span></Label>
                        <Input id="email" name="email" type="email" required placeholder="john@example.com" className="bg-background/50 border-border/50 focus:border-indigo-500/50" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="subject" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Subject</Label>
                    <Input id="subject" name="subject" placeholder="How can we help?" className="bg-background/50 border-border/50 focus:border-indigo-500/50" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Message <span className="text-red-500">*</span></Label>
                    <Textarea
                        id="message"
                        name="message"
                        required
                        placeholder="Tell us what is on your mind..."
                        className="min-h-[140px] bg-background/50 border-border/50 focus:border-indigo-500/50 resize-y"
                    />
                </div>
                <Button type="submit" className="w-full sm:w-auto h-11 px-8" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <div className="flex items-center">
                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            Sending...
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                        </div>
                    )}
                </Button>
            </form>
        </div>
    );
}