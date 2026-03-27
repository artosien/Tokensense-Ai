"use client";

import React from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import { User, Mail, LogOut, ArrowLeft, Shield, Clock, HardDrive, BarChart3, Briefcase, Globe, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SiteHeader from "@/components/SiteHeader";

export default function AccountPage() {
    const { data: session, status } = useSession();
    const [bioData, setBioData] = React.useState({
        role: "",
        company: "",
        location: "",
        bio: ""
    });

    // Load bio from localStorage
    const loadBio = React.useCallback(() => {
        const userId = (session?.user as any)?.id || session?.user?.email;
        if (userId) {
            const savedBio = localStorage.getItem(`user_bio_${userId}`);
            if (savedBio) {
                try {
                    setBioData(JSON.parse(savedBio));
                } catch (e) {
                    console.error("Failed to parse saved bio", e);
                }
            }
        }
    }, [session?.user]);

    React.useEffect(() => {
        loadBio();
        // Listen for storage events (from modal)
        window.addEventListener('storage', loadBio);
        return () => window.removeEventListener('storage', loadBio);
    }, [loadBio]);

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
                        Please sign in with your Google account to access your personalized dashboard.
                    </p>
                    <Button 
                        onClick={() => signIn("google")}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-bold shadow-lg shadow-indigo-500/20"
                    >
                        Sign in with Google
                    </Button>
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
                                You are now signed in. In future updates, you'll be able to save your token calculation history and custom model presets here.
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
                            <div className="bg-card border border-border/40 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors group">
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                                    <Clock className="w-6 h-6 text-indigo-400" />
                                </div>
                                <h3 className="font-bold text-foreground mb-1 text-lg">Calculation History</h3>
                                <p className="text-sm text-muted-foreground">
                                    Coming Soon: Access your past token cost estimations across all devices.
                                </p>
                            </div>
                            
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
                                            <p className="text-sm font-bold text-foreground">Email Provider</p>
                                            <p className="text-xs text-muted-foreground">Authenticated via Google OAuth 2.0</p>
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
