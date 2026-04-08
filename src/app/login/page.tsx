"use client";

import React from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bot, Shield, Zap, History, LayoutPanelLeft, ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SiteHeader from "@/components/SiteHeader";

export default function LoginPage() {
    const { status } = useSession();
    const router = useRouter();

    // Redirect to account if already logged in
    React.useEffect(() => {
        if (status === "authenticated") {
            router.push("/account");
        }
    }, [status, router]);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SiteHeader />
            
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left Side: Value Proposition */}
                    <div className="hidden lg:flex flex-col space-y-8">
                        <div>
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6">
                                <Bot className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h1 className="text-4xl font-bold text-foreground leading-tight mb-4">
                                Supercharge your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">LLM Workflows</span>
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Join thousands of developers optimizing their AI costs with precision and ease.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                                    <History className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">Cloud Sync History</h3>
                                    <p className="text-sm text-muted-foreground">Access your past calculations and cost reports from any device, anywhere.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                                    <LayoutPanelLeft className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">Custom Model Presets</h3>
                                    <p className="text-sm text-muted-foreground">Save your specific API tiers and prompt parameters for instant re-use.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-plasma-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Zap className="w-5 h-5 text-plasma-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">Advanced Simulation</h3>
                                    <p className="text-sm text-muted-foreground">Unlock multi-step agentic loop simulators with persistent state saving.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Login Card */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="w-full max-w-md bg-card border border-border/40 rounded-[32px] p-8 shadow-2xl shadow-indigo-500/5 relative overflow-hidden group">
                            {/* Decorative background element */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-700" />
                            
                            <div className="relative z-10 text-center lg:text-left">
                                <div className="lg:hidden flex justify-center mb-6">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                                        <Bot className="w-6 h-6 text-indigo-400" />
                                    </div>
                                </div>
                                
                                <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
                                <p className="text-sm text-muted-foreground mb-8">
                                    Sign in to your account to continue using Tokensense.
                                </p>

                                <div className="space-y-4">
                                    <Button 
                                        type="button"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            console.log("SignIn button clicked - preventing default");
                                            try {
                                                const result = await signIn("google", { 
                                                    callbackUrl: "/account",
                                                    redirect: false 
                                                });
                                                console.log("signIn result:", result);
                                                if (result?.url) {
                                                    console.log("Redirecting to:", result.url);
                                                    window.location.href = result.url;
                                                } else if (result?.error) {
                                                    console.error("signIn error result:", result.error);
                                                    alert("Authentication Error: " + result.error);
                                                }
                                            } catch (e) {
                                                console.error("signIn function threw error:", e);
                                            }
                                        }}
                                        className="w-full h-14 bg-white hover:bg-gray-100 text-black font-bold flex items-center justify-center gap-3 rounded-2xl shadow-lg transition-all active:scale-[0.98]"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.76 1.85-1.61 2.42v2.84h2.6c1.52-1.41 2.4-3.48 2.4-5.91z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-2.6-2.04c-.72.48-1.64.77-2.68.77-2.84 0-5.25-1.92-6.11-4.5H5.18v2.34C7 20.33 9.32 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.89 14.57c-.22-.66-.35-1.36-.35-2.07s.13-1.41.35-2.07V8.09H5.18C4.42 9.64 4 11.38 4 13s.42 3.36 1.18 4.91l2.71-2.34z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 9.32 1 7 3.67 5.18 6.75l2.71 2.34c.86-2.58 3.27-4.5 6.11-4.5z"
                                            />
                                        </svg>
                                        Continue with Google
                                    </Button>

                                    <Button 
                                        type="button"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            try {
                                                const result = await signIn("github", { 
                                                    callbackUrl: "/account",
                                                    redirect: false 
                                                });
                                                if (result?.url) {
                                                    window.location.href = result.url;
                                                } else if (result?.error) {
                                                    alert("Authentication Error: " + result.error);
                                                }
                                            } catch (e) {
                                                console.error("signIn function threw error:", e);
                                            }
                                        }}
                                        className="w-full h-14 bg-[#24292F] hover:bg-[#24292F]/90 text-white font-bold flex items-center justify-center gap-3 rounded-2xl shadow-lg transition-all active:scale-[0.98]"
                                    >
                                        <Github className="w-5 h-5" />
                                        Continue with GitHub
                                    </Button>
                                    
                                    <div className="relative py-4">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-border/40"></div>
                                        </div>
                                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                                            <span className="bg-card px-3 text-muted-foreground">Secure Login</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-center text-[11px] text-muted-foreground leading-relaxed px-4">
                                        By signing in, you agree to our{" "}
                                        <Link href="/terms" className="text-indigo-400 hover:underline">Terms of Service</Link>{" "}
                                        and{" "}
                                        <Link href="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</Link>.
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-border/40 text-center">
                                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-indigo-400 transition-colors">
                                        <ArrowRight className="w-4 h-4 rotate-180" />
                                        Return to Home
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* Simple Footer for Auth Pages */}
            <footer className="py-8 text-center border-t border-border/40">
                <p className="text-xs text-muted-foreground opacity-60">
                    &copy; {new Date().getFullYear()} Tokensense-Ai. 100% Secure Authentication.
                </p>
            </footer>
        </div>
    );
}

