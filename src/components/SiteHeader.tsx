"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bot, Menu, X, Sun, Moon, ChevronDown, Github, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useSession, signIn, signOut } from "next-auth/react";
import { BioUpdateModal } from "@/components/BioUpdateModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SiteHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { data: session, status } = useSession();
    const [isBioModalOpen, setIsBioModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent body scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    const closeMenu = () => {
        setIsMobileMenuOpen(false);
        setMobileToolsOpen(false);
        setMobileAboutOpen(false);
    };

    return (
    <>
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between">
                    {/* Logo Segment */}
                    <Link href="/" onClick={closeMenu} className="flex items-center gap-3 hover:opacity-80 transition-opacity z-50">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md text-white text-sm font-bold">
                            <Bot className="w-5 h-5 text-indigo-50" />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold tracking-tight text-foreground">Tokensense-Ai</h1>
                            <p className="text-[10px] text-muted-foreground leading-none -mt-0.5">
                                Pre-Flight Cost Calculator
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-2">
                        <Button variant="ghost" className="text-muted-foreground hover:text-indigo-400 border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all font-medium" asChild>
                            <Link href="/">Home</Link>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="text-muted-foreground hover:text-indigo-400 border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all font-medium gap-1">
                                    Tools <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="min-w-[12rem] p-2 space-y-1">
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-indigo-500/10 focus:text-indigo-400 transition-colors">
                                    <Link href="/#calculate-section" className="flex items-center gap-2 py-2">
                                        <div className="w-8 h-8 rounded-md bg-indigo-500/10 flex items-center justify-center">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">Token Counter</span>
                                            <span className="text-[10px] text-muted-foreground">Instant estimation</span>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-indigo-500/10 focus:text-indigo-400 transition-colors">
                                    <Link href="/workflow" className="flex items-center gap-2 py-2">
                                        <div className="w-8 h-8 rounded-md bg-purple-500/10 flex items-center justify-center">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">Workflow Estimator</span>
                                            <span className="text-[10px] text-muted-foreground">Multi-step simulator</span>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-indigo-500/10 focus:text-indigo-400 transition-colors">
                                    <Link href="/comparison" className="flex items-center gap-2 py-2">
                                        <div className="w-8 h-8 rounded-md bg-plasma-500/10 flex items-center justify-center">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">Comparison Table</span>
                                            <span className="text-[10px] text-muted-foreground">Compare LLM costs</span>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                                <div className="h-px bg-border/40 my-1" />
                                <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                                    <Link href="/pricing-history" className="text-xs px-2 py-1.5">Pricing History</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                                    <Link href="/multimodal" className="text-xs px-2 py-1.5">Image Estimator</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                                    <Link href="/caching" className="text-xs px-2 py-1.5">Context Caching</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                                    <Link href="/tools/compression" className="text-xs px-2 py-1.5">Prompt Compression</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                                    <Link href="/tools/batch" className="text-xs px-2 py-1.5">Batch Cost Planner</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                                    <Link href="/tools/context" className="text-xs px-2 py-1.5">Context Visualizer</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" className="text-muted-foreground hover:text-indigo-400 border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all font-medium" asChild>
                            <Link href="/blog">Blog</Link>
                        </Button>
                        <Button variant="ghost" className="text-muted-foreground hover:text-indigo-400 border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all font-medium" asChild>
                            <Link href="/faq">FAQ</Link>
                        </Button>

                        <div className="w-px h-6 bg-border/40 mx-2" />

                        {status === "authenticated" ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-indigo-500/30 hover:border-indigo-500/60 p-0 overflow-hidden bg-indigo-500/10 focus-visible:ring-1 focus-visible:ring-indigo-500">
                                        {session.user?.image ? (
                                            <img 
                                                src={session.user.image} 
                                                alt={session.user.name || "User"} 
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-5 w-5 text-indigo-400" />
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 p-2 space-y-1 bg-card/95 backdrop-blur-xl border-border/40 shadow-2xl">
                                    <div className="flex flex-col px-3 py-2 mb-1">
                                        <span className="text-sm font-bold truncate text-foreground">{session.user?.name}</span>
                                        <span className="text-[10px] text-muted-foreground truncate font-medium">{session.user?.email}</span>
                                    </div>
                                    <div className="h-px bg-border/40 my-1" />
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-indigo-500/10 focus:text-indigo-400 transition-colors py-2.5">
                                        <Link href="/account" className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-md bg-indigo-500/10 flex items-center justify-center">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold">Account Dashboard</span>
                                                <span className="text-[9px] text-muted-foreground">Manage your profile</span>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => setIsBioModalOpen(true)}
                                        className="rounded-lg cursor-pointer focus:bg-indigo-500/10 focus:text-indigo-400 transition-colors py-2.5"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-md bg-purple-500/10 flex items-center justify-center">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold">Update Bio</span>
                                                <span className="text-[9px] text-muted-foreground">Add personal details</span>
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => signOut()} className="rounded-lg cursor-pointer focus:bg-red-500/10 focus:text-red-400 transition-colors py-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-md bg-red-500/10 flex items-center justify-center">
                                                <LogOut className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold">Sign Out</span>
                                                <span className="text-[9px] text-muted-foreground">End your session</span>
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button 
                                variant="ghost" 
                                asChild
                                className="text-muted-foreground hover:text-indigo-400 border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all font-medium gap-2 px-4"
                            >
                                <Link href="/login">
                                    <User className="h-4 w-4" />
                                    Login
                                </Link>
                            </Button>
                        )}

                        <div className="w-px h-6 bg-border/40 mx-2" />

                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="text-muted-foreground hover:text-indigo-400 border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all"
                        >
                            <a
                                href="https://github.com/artosien/Tokensense-Ai.git"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View TokenSense AI on GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="text-muted-foreground hover:text-indigo-400 border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all"
                            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        >
                            {mounted ? (
                                theme === "dark" ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Moon className="h-5 w-5" />
                                )
                            ) : (
                                <div className="h-5 w-5" />
                            )}
                            <span className="sr-only">Toggle theme</span>
                        </Button>

                        <Button 
                            className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 px-6 font-bold"
                            asChild
                        >
                            <Link href="/#calculate-section">Try Calculator</Link>
                        </Button>
                    </nav>

                    {/* Mobile Hamburger Toggle */}
                    <div className="flex items-center md:hidden z-50">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-foreground hover:bg-muted/30"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer Overlay */}
            <div
                className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={closeMenu}
            />

            {/* Mobile Navigation Drawer */}
            <div
                className={`fixed top-0 right-0 h-[100dvh] w-[80%] max-w-sm bg-card border-l border-border/40 z-50 shadow-2xl transition-transform duration-500 ease-out md:hidden flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="h-14 flex items-center px-4 border-b border-border/40 justify-between">
                    <span className="font-semibold text-lg text-foreground tracking-tight ml-2">Menu</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        onClick={closeMenu}
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close Menu</span>
                    </Button>
                </div>

                <nav className="flex flex-col p-4 gap-2 overflow-y-auto">
                    <Link
                        href="/"
                        onClick={closeMenu}
                        className="flex items-center py-3 px-4 rounded-md text-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors font-medium border border-transparent hover:border-indigo-500/20"
                    >
                        Home
                    </Link>
                    <Link
                        href="/comparison"
                        onClick={closeMenu}
                        className="flex items-center py-3 px-4 rounded-md text-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors font-medium border border-transparent hover:border-indigo-500/20"
                    >
                        Comparison Table
                    </Link>
                    <Link
                        href="/workflow"
                        onClick={closeMenu}
                        className="flex items-center py-3 px-4 rounded-md text-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors font-medium border border-transparent hover:border-indigo-500/20"
                    >
                        Workflow Estimator
                    </Link>
                    <Link
                        href="/blog"
                        onClick={closeMenu}
                        className="flex items-center py-3 px-4 rounded-md text-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors font-medium border border-transparent hover:border-indigo-500/20"
                    >
                        Blog
                    </Link>

                    {status === "authenticated" ? (
                        <Link
                            href="/account"
                            onClick={closeMenu}
                            className="flex items-center py-3 px-4 rounded-md text-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors font-medium border border-transparent hover:border-indigo-500/20"
                        >
                            Account Dashboard
                        </Link>
                    ) : (
                        <button
                            onClick={() => {
                                signIn("google");
                                closeMenu();
                            }}
                            className="flex items-center py-3 px-4 rounded-md text-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors font-medium border border-transparent hover:border-indigo-500/20 w-full text-left"
                        >
                            Login with Google
                        </button>
                    )}

                    <div>
                        <button
                            type="button"
                            onClick={() => setMobileToolsOpen((o) => !o)}
                            className="flex items-center justify-between w-full py-3 px-4 rounded-md text-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors font-medium border border-transparent hover:border-indigo-500/20"
                        >
                            Tools
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${mobileToolsOpen ? "rotate-180" : ""}`} />
                        </button>
                        <div 
                            className={`grid transition-all duration-300 ease-in-out ${
                                mobileToolsOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                            }`}
                        >
                            <div className="overflow-hidden pl-4 flex flex-col gap-1">
                                <Link href="/multimodal" onClick={closeMenu} className="py-2.5 px-4 rounded-md text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors text-sm border border-transparent hover:border-indigo-500/20">
                                    Image Estimator
                                </Link>
                                <Link href="/caching" onClick={closeMenu} className="py-2.5 px-4 rounded-md text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors text-sm border border-transparent hover:border-indigo-500/20">
                                    Context Caching
                                </Link>
                                <Link href="/tools/compression" onClick={closeMenu} className="py-2.5 px-4 rounded-md text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors text-sm border border-transparent hover:border-indigo-500/20">
                                    Prompt Compression
                                </Link>
                                <Link href="/tools/batch" onClick={closeMenu} className="py-2.5 px-4 rounded-md text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors text-sm border border-transparent hover:border-indigo-500/20">
                                    Batch Cost Planner
                                </Link>
                                <Link href="/tools/context" onClick={closeMenu} className="py-2.5 px-4 rounded-md text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors text-sm border border-transparent hover:border-indigo-500/20">
                                    Context Visualizer
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={() => setMobileAboutOpen((o) => !o)}
                            className="flex items-center justify-between w-full py-3 px-4 rounded-md text-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors font-medium border border-transparent hover:border-indigo-500/20"
                        >
                            About
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${mobileAboutOpen ? "rotate-180" : ""}`} />
                        </button>
                        <div 
                            className={`grid transition-all duration-300 ease-in-out ${
                                mobileAboutOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                            }`}
                        >
                            <div className="overflow-hidden pl-4 flex flex-col gap-1">
                                <Link href="/about" onClick={closeMenu} className="py-2.5 px-4 rounded-md text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors text-sm border border-transparent hover:border-indigo-500/20">
                                    About
                                </Link>
                                <Link href="/faq" onClick={closeMenu} className="py-2.5 px-4 rounded-md text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors text-sm border border-transparent hover:border-indigo-500/20">
                                    FAQ
                                </Link>
                                <Link href="/pricing-history" onClick={closeMenu} className="py-2.5 px-4 rounded-md text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors text-sm border border-transparent hover:border-indigo-500/20">
                                    Pricing History
                                </Link>
                                <Link href="/contact" onClick={closeMenu} className="py-2.5 px-4 rounded-md text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors text-sm border border-transparent hover:border-indigo-500/20">
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border/40 flex flex-col gap-4">
                        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                            <Link href="/terms" onClick={closeMenu} className="hover:text-foreground">Terms</Link>
                            <span>|</span>
                            <Link href="/privacy" onClick={closeMenu} className="hover:text-foreground">Privacy</Link>
                            <span>|</span>
                            <button
                                onClick={() => {
                                    toggleTheme();
                                    closeMenu();
                                }}
                                className="hover:text-foreground transition-colors flex items-center gap-1"
                                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                            >
                                {mounted ? (
                                    theme === "dark" ? (
                                        <><Sun className="h-4 w-4" /> Light</>
                                    ) : (
                                        <><Moon className="h-4 w-4" /> Dark</>
                                    )
                                ) : (
                                    "Theme"
                                )}
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
        {session?.user && (
            <BioUpdateModal 
                userId={(session.user as any).id || session.user.email || "default"}
                isOpen={isBioModalOpen}
                onClose={() => setIsBioModalOpen(false)}
            />
        )}
    </>
    );
}

