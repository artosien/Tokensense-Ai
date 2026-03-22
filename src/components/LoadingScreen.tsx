'use client';

import { useEffect, useState } from 'react';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we are on mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Hide loading screen after page loads
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500); // Slightly longer for mobile delight

    // Also hide when page is fully loaded
    if (document.readyState === 'complete') {
      setIsVisible(false);
    }

    const handleLoad = () => {
      setIsVisible(false);
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#09090b]">
      <div className="flex flex-col items-center gap-8">
        {/* Discord-like Logo Animation (M15) */}
        <div className="relative group">
          {/* Outer glow */}
          <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-2xl animate-pulse scale-150" />
          
          {/* Logo Container with Discord-style twisting/pulsing */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl flex items-center justify-center animate-discord-twist overflow-hidden">
            {/* Glossy overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
            
            <Bot className="w-12 h-12 text-white drop-shadow-lg" />
          </div>

          {/* Orbiting ring */}
          <div className="absolute -inset-4 border-2 border-dashed border-indigo-500/30 rounded-full animate-spin-slow" />
        </div>

        {/* Brand Text */}
        <div className="flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
          <span className="text-xl font-bold tracking-tight text-white uppercase tracking-[0.2em] ml-1">
            TokenSense
          </span>
          <div className="flex gap-1.5 h-1 items-center">
            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes discord-twist {
          0% {
            transform: rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(-10deg) scale(1.1);
          }
          50% {
            transform: rotate(0deg) scale(1);
          }
          75% {
            transform: rotate(10deg) scale(1.1);
          }
          100% {
            transform: rotate(0deg) scale(1);
          }
        }

        .animate-discord-twist {
          animation: discord-twist 2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}