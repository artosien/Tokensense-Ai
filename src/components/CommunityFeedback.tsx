"use client";

import ReviewForm from "./ReviewForm";
import CommunityWall from "./CommunityWall";
import { MessageCircle } from "lucide-react";

export default function CommunityFeedback() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-plasma-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-plasma-500/10 text-plasma-400 text-xs font-black uppercase tracking-[0.2em] border border-plasma-500/20">
                        <MessageCircle className="w-4 h-4" />
                        Community & Reviews
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.05] uppercase">
                        Built for <span className="text-[#00e5ff]">Builders</span>. <br />
                        Loved by the <span className="text-indigo-400">Community</span>.
                    </h2>
                    <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Join the hundreds of developers optimizing their AI budgets. 
                        Read what they have to say, or share your own experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    <div className="order-2 lg:order-1">
                        <ReviewForm />
                    </div>
                    
                    <div className="order-1 lg:order-2 space-y-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Recent Feedback</h3>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e5ff]"></span>
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#00e5ff]">Live Feed</span>
                            </div>
                        </div>
                        <CommunityWall />
                    </div>
                </div>
            </div>
        </section>
    );
}