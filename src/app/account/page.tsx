"use client";

import React from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import { User, Mail, LogOut, ArrowLeft, Shield, Clock, HardDrive, BarChart3, Briefcase, Globe, Info, MessageSquare, Save, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SiteHeader from "@/components/SiteHeader";
import AccountHistory from "@/components/AccountHistory";

export default function AccountPage() {
    const { data: session, status } = useSession();
    const [bioData, setBioData] = React.useState({
        role: "",
        company: "",
        location: "",
        bio: ""
    });
    const [slackWebhook, setSlackWebhook] = React.useState("");
    const [isSavingSlack, setIsSavingSlack] = React.useState(false);

    // Load bio and slack webhook from localStorage
    const loadUserData = React.useCallback(() => {
        const userId = (session?.user as any)?.id || session?.user?.email;
        if (userId) {
            // Load Bio
            const savedBio = localStorage.getItem(`user_bio_${userId}`);
            if (savedBio) {
                try {
                    setBioData(JSON.parse(savedBio));
                } catch (e) {
                    console.error("Failed to parse saved bio", e);
                }
            }

            // Load Slack Webhook
            const savedWebhook = localStorage.getItem(`user_slack_webhook_${userId}`);
            if (savedWebhook) {
                setSlackWebhook(savedWebhook);
            }
        }
    }, [session?.user]);

    React.useEffect(() => {
        loadUserData();
        // Listen for storage events
        window.addEventListener('storage', loadUserData);
        return () => window.removeEventListener('storage', loadUserData);
    }, [loadUserData]);

    const handleSaveSlack = () => {
        const userId = (session?.user as any)?.id || session?.user?.email;
        if (userId) {
            setIsSavingSlack(true);
            localStorage.setItem(`user_slack_webhook_${userId}`, slackWebhook);
            setTimeout(() => {
                setIsSavingSlack(false);
            }, 500);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen bg-background">
                <SiteHeader />
                <main className="max-w-md mx-auto px-4 py-24 text-center">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-4">Access Denied</h1>
                    <p className="text-muted-foreground mb-8">
                        Please sign in with your account to access your personalized dashboard.
                    </p>
                    <div className="space-y-4">
                        <Button 
                            onClick={() => signIn("google")}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-bold shadow-lg shadow-indigo-500/20"
                        >
                            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 mr-3" alt="Google" />
                            Sign in with Google
                        </Button>
                        <Button 
                            onClick={() => signIn("slack")}
                            className="w-full bg-[#4A154B] hover:bg-[#3b113c] text-white py-6 text-lg font-bold shadow-lg shadow-[#4A154B]/20"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52h6.313a2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 15.147 24a2.528 2.528 0 0 1-2.52-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.523 2.52A2.528 2.528 0 0 1 3.79 5.042a2.528 2.528 0 0 1 2.52-2.522h2.523v2.522zM8.834 6.313a2.527 2.527 0 0 1-2.52 2.521V15.147A2.528 2.528 0 0 1 3.792 17.668a2.528 2.528 0 0 1-2.522-2.521V8.834zM18.958 8.834a2.528 2.528 0 0 1 2.522-2.52A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.52h-2.52v-2.52zM17.688 8.834a2.527 2.527 0 0 1-2.521 2.52H8.854a2.527 2.527 0 0 1-2.521-2.52V2.522A2.528 2.528 0 0 1 8.854 0a2.528 2.528 0 0 1 2.521 2.522v6.312zM15.165 18.958a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522a2.528 2.528 0 0 1-2.522 2.52h-2.52v-2.52zM15.165 17.688a2.527 2.527 0 0 1 2.52-2.521h6.313A2.528 2.528 0 0 1 24 15.167a2.528 2.528 0 0 1-2.522 2.521h-6.313z"/>
                            </svg>
                            Sign in with Slack
                        </Button>
                    </div>
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-indigo-400 mt-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />
            
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">Account</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar / Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-card border border-border/40 rounded-3xl p-8 sticky top-24 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 p-1">
                                        {session?.user?.image ? (
                                            <img 
                                                src={session.user.image} 
                                                alt={session.user.name || "User"} 
                                                className="w-full h-full rounded-full object-cover shadow-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-indigo-500/10 flex items-center justify-center">
                                                <User className="w-10 h-10 text-indigo-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-card rounded-full flex items-center justify-center" title="Active Session">
                                        <Shield className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                
                                <h2 className="text-2xl font-bold text-foreground mb-1">{session?.user?.name}</h2>
                                <p className="text-sm text-muted-foreground mb-4">{session?.user?.email}</p>
                                
                                {bioData.role && (
                                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
                                        <Briefcase className="w-3 h-3" />
                                        <span>{bioData.role}</span>
                                    </div>
                                )}
                                {bioData.company && (
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-6">
                                        <Globe className="w-3 h-3" />
                                        <span>{bioData.company}</span>
                                    </div>
                                )}

                                <div className="w-full space-y-3">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all font-semibold"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Sign Out
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Welcome Banner */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/10">
                            <h1 className="text-3xl font-bold mb-2">Welcome back, {session?.user?.name?.split(' ')[0]}!</h1>
                            <p className="text-indigo-100 opacity-90 max-w-md">
                                You are now signed in. Access your calculation history and connect your workspace to receive real-time budget alerts.
                            </p>
                        </div>

                        {/* Feature Teasers / Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {bioData.bio && (
                                <div className="md:col-span-2 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Info className="w-4 h-4 text-indigo-400" />
                                        <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">About You</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                                        "{bioData.bio}"
                                    </p>
                                    {bioData.location && (
                                        <p className="text-[10px] text-muted-foreground mt-4 flex items-center gap-1">
                                            <Globe className="w-3 h-3" /> Based in {bioData.location}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Calculation History Section */}
                        <AccountHistory />
                        
                        {/* Integrations Section */}
                        <div className="bg-card border border-border/40 rounded-3xl overflow-hidden shadow-sm">
                            <div className="px-8 py-6 border-b border-border/40 bg-muted/30">
                                <h3 className="font-bold text-foreground flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                                    Slack Integration
                                </h3>
                            </div>
                            <div className="p-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-foreground mb-2">Incoming Webhook URL</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={slackWebhook}
                                                onChange={(e) => setSlackWebhook(e.target.value)}
                                                placeholder="https://hooks.slack.com/services/..."
                                                className="flex-1 bg-background border border-border/60 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                            <Button 
                                                onClick={handleSaveSlack}
                                                disabled={isSavingSlack}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 font-bold rounded-xl"
                                            >
                                                {isSavingSlack ? "Saving..." : <Save className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
                                            <Info className="w-3 h-3" />
                                            Don't have a URL? <a href="https://api.slack.com/messaging/webhooks" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline flex items-center gap-0.5">Create one here <ExternalLink className="w-2 h-2" /></a>
                                        </p>
                                    </div>
                                    
                                    <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4">
                                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Slack Features</h4>
                                        <ul className="space-y-2">
                                            <li className="text-xs text-muted-foreground flex items-center gap-2">
                                                <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                                                Send history summaries directly to any Slack channel.
                                            </li>
                                            <li className="text-xs text-muted-foreground flex items-center gap-2">
                                                <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                                                Receive instant notifications when you exceed token budget thresholds.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-card border border-border/40 rounded-2xl p-6 hover:border-purple-500/30 transition-colors group">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                                    <HardDrive className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="font-bold text-foreground mb-1 text-lg">Custom Presets</h3>
                                <p className="text-sm text-muted-foreground">
                                    Coming Soon: Save your specific workflow parameters and model tiers for instant access.
                                </p>
                            </div>
                        </div>

                        {/* Account Details Section */}
                        <div className="bg-card border border-border/40 rounded-3xl overflow-hidden">
                            <div className="px-8 py-6 border-b border-border/40 bg-muted/30">
                                <h3 className="font-bold text-foreground flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-indigo-400" />
                                    Security & Data
                                </h3>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">Auth Method</p>
                                            <p className="text-xs text-muted-foreground">Authenticated via Google or Slack OAuth</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                        Verified
                                    </div>
                                </div>

                                <div className="h-px bg-border/40" />

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <BarChart3 className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Analytics Tier</p>
                                        <p className="text-xs text-muted-foreground">Free Community Plan</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
