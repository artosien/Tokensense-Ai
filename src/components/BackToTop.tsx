"use client";

import { useEffect, useState } from "react";
import { Bot, ArrowUp } from "lucide-react";

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top scroll
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className={`fixed bottom-6 right-6 z-50 flex h-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-all duration-500 hover:bg-indigo-700 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 overflow-hidden group ${isVisible ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-12 opacity-0 pointer-events-none"
                }`}
        >
            <div className={`flex items-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isVisible ? "px-4" : "px-3"}`}>
                <Bot className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <div
                    className={`flex items-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isVisible ? "w-5 ml-2.5 opacity-100 delay-300" : "w-0 ml-0 opacity-0"
                        }`}
                >
                    <div className={`transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isVisible ? "translate-x-0 delay-300" : "-translate-x-4"}`}>
                        <ArrowUp className="h-5 w-5 shrink-0 text-indigo-100 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-white" />
                    </div>
                </div>
            </div>
        </button>
    );
}
