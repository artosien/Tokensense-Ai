"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bug, Send, CheckCircle2 } from "lucide-react";

export default function BugReportForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate network request
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto flex flex-col items-center justify-center p-8 bg-green-500/10 border border-green-500/30 rounded-2xl text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-foreground">Report Submitted</h3>
                    <p className="text-sm text-green-600/80 dark:text-green-400/80">
                        Thank you for your feedback! We will look into the issue right away.
                    </p>
                </div>
                <Button variant="outline" onClick={() => setIsSubmitted(false)} className="mt-4 border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500/20">
                    Submit Another Report
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-8 border border-border/50 rounded-2xl bg-card shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                    <Bug className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Spot a bug? Let us know.</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-8">
                Tokensense-Ai is built to make developers' lives easier. If token counting seems off or the app isn't behaving properly, tell us so we can issue a fix.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Name (Optional)</Label>
                        <Input id="name" placeholder="John Doe" className="bg-background/50 border-border/50 focus:border-indigo-500/50" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Email (Optional)</Label>
                        <Input id="email" type="email" placeholder="john@example.com" className="bg-background/50 border-border/50 focus:border-indigo-500/50" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Description <span className="text-red-500">*</span></Label>
                    <Textarea
                        id="description"
                        required
                        placeholder="What went wrong? Any steps to reproduce?"
                        className="min-h-[140px] bg-background/50 border-border/50 focus:border-indigo-500/50 resize-y"
                    />
                </div>
                <Button type="submit" className="w-full sm:w-auto h-11" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <div className="flex items-center">
                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            Submitting...
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <Send className="w-4 h-4 mr-2" />
                            Submit Report
                        </div>
                    )}
                </Button>
            </form>
        </div>
    );
}
