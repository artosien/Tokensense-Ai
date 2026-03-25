"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bot, Menu, X, Sun, Moon, ChevronDown, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
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
                        <Button variant="ghost" className="text-muted-foreground hover:text-indigo-400 border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all font-medium" asChild>
                            <Link href="/comparison">Comparison Table</Link>
                        </Button>
                        <Button variant="ghost" className="text-muted-foreground hover:text-indigo-400 border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all font-medium" asChild>
                            <Link href="/workflow">Workflow Estimator</Link>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="text-muted-foreground hover:text-indigo-400 border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all font-medium gap-1">
                                    Tools <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="min-w-[10rem]">
                                <DropdownMenuItem asChild>
                                    <Link href="/multimodal">Image Estimator</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/caching">Context Caching</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/tools/compression">Prompt Compression</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/tools/batch">Batch Cost Planner</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/tools/context">Context Window Visualizer</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="text-muted-foreground hover:text-indigo-400 border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all font-medium gap-1">
                                    About <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="min-w-[10rem]">
                                <DropdownMenuItem asChild>
                                    <Link href="/about">About</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/faq">FAQ</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/pricing-history">Pricing History</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/contact">Contact Us</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

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
    );
}
