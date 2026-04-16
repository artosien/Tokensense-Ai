"use client";

import { Star, User } from "lucide-react";

interface Review {
    id: string;
    name: string;
    rating: number;
    text: string;
    date: string;
}

const MOCK_REVIEWS: Review[] = [
    {
        id: "1",
        name: "Sarah Chen",
        rating: 5,
        text: "The only tool that actually uses the correct tokenizers for Claude and Gemini. Saved me hundreds on my agent loop planning.",
        date: "2 days ago"
    },
    {
        id: "2",
        name: "Marcus Thorne",
        rating: 5,
        text: "I was blindly sending prompts to GPT-4o. Tokensense showed me I could save 60% by switching to Gemini Flash for my specific task. Essential.",
        date: "1 week ago"
    },
    {
        id: "3",
        name: "Elena Rodriguez",
        rating: 4,
        text: "Love the agent simulator. It's the first time I've seen context compounding visualized so clearly. A must-have for AI devs.",
        date: "3 days ago"
    },
    {
        id: "4",
        name: "David Park",
        rating: 5,
        text: "Clean, fast, and 100% client-side. My privacy is respected and my budget is finally under control.",
        date: "5 days ago"
    }
];

export default function CommunityWall() {
    return (
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            <div className="space-y-4">
                {MOCK_REVIEWS.map((review) => (
                    <div 
                        key={review.id} 
                        className="p-6 rounded-3xl bg-card/30 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all duration-300 group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white tracking-tight">{review.name}</h4>
                                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{review.date}</p>
                                </div>
                            </div>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-3 h-3 ${i < review.rating ? "fill-plasma-400 text-plasma-400" : "text-white/10"}`} 
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium italic group-hover:text-slate-300 transition-colors">
                            "{review.text}"
                        </p>
                    </div>
                ))}
            </div>
            
            {/* Fade effect at the bottom */}
            <div className="sticky bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
    );
}