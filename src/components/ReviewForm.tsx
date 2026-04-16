"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, CheckCircle2, MessageSquare } from "lucide-react";

const shareUrl = "https://tokensense-ai.com";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function ReviewForm() {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please select a star rating.");
            return;
        }
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        const shareText = `Just reviewed @TokensenseAI — gave it ${rating} stars! 🚀 My take: "${reviewText.slice(0, 100)}${reviewText.length > 100 ? '...' : ''}" Check out this free LLM calculator:`;
        const twitterLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        const linkedinLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

        return (
            <div className="flex flex-col items-center justify-center p-8 bg-plasma-500/5 border border-plasma-500/20 rounded-3xl text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-plasma-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-plasma-400" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Review Submitted!</h3>
                    <p className="text-sm text-slate-400 font-medium">
                        Thank you for your feedback, {name || "friend"}! Your support helps us build a better tool for the community.
                    </p>
                </div>

                <div className="w-full pt-4 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Share your review</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                            variant="outline" 
                            className="flex-1 h-12 border-white/10 hover:bg-black hover:text-white transition-all gap-2"
                            asChild
                        >
                            <a href={twitterLink} target="_blank" rel="noopener noreferrer">
                                <XIcon className="w-4 h-4" />
                                Share on X
                            </a>
                        </Button>
                        <Button 
                            variant="outline" 
                            className="flex-1 h-12 border-white/10 hover:bg-[#0077B5] hover:text-white transition-all gap-2"
                            asChild
                        >
                            <a href={linkedinLink} target="_blank" rel="noopener noreferrer">
                                <LinkedInIcon className="w-4 h-4" />
                                Share on LinkedIn
                            </a>
                        </Button>
                    </div>
                </div>

                <Button variant="ghost" onClick={() => { setIsSubmitted(false); setRating(0); setReviewText(""); setName(""); }} className="text-xs font-bold text-plasma-400 hover:text-plasma-300">
                    Submit another review
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 border border-white/10 rounded-[40px] bg-[#061417]/50 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-plasma-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-plasma-500/10 transition-colors duration-500" />

            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-plasma-500/10 rounded-2xl text-plasma-400 shadow-inner">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tight text-white uppercase">Write a Review</h2> 
                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest font-bold">Share your experience</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Your Rating</Label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="transition-transform hover:scale-110 active:scale-90"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star 
                                    className={`w-8 h-8 ${
                                        (hoverRating || rating) >= star 
                                            ? "fill-plasma-400 text-plasma-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]" 
                                            : "text-white/10"
                                    } transition-colors duration-200`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="rev-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Full Name</Label>
                    <Input 
                        id="rev-name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Dev" 
                        className="h-12 bg-white/5 border-white/10 focus:border-plasma-500/50 rounded-xl text-white font-medium" 
                    />
                </div>

                <div className="space-y-3">
                    <Label htmlFor="rev-message" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Feedback</Label>
                    <Textarea
                        id="rev-message"
                        required
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="What do you think about Tokensense AI?"
                        className="min-h-[120px] bg-white/5 border-white/10 focus:border-plasma-500/50 rounded-xl text-white font-medium resize-none"
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 bg-plasma-500 hover:bg-plasma-400 text-black font-black uppercase tracking-tight rounded-2xl shadow-xl shadow-plasma-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                            <span>Posting...</span>
                        </div>
                    ) : (
                        <span>Post Review →</span>
                    )}
                </Button>
            </form>
        </div>
    );
}