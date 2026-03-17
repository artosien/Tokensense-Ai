'use client';

import { useEffect, useState } from 'react';
import { Cpu } from 'lucide-react';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide loading screen after page loads
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    // Also hide when page is fully loaded
    if (document.readyState === 'complete') {
      setIsVisible(false);
    }

    const handleLoad = () => {
      setIsVisible(false);
    };

    window.addEventListener('load', handleLoad);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Main animated icon */}
        <div className="relative w-20 h-20">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary animate-spin" />

          {/* Middle counter-rotating ring */}
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-accent border-l-accent animate-spin-reverse" />

          {/* Icon center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="w-10 h-10 text-primary animate-pulse" />
          </div>
        </div>

        {/* Loading text */}
        <div className="mt-4 flex items-center gap-1">
          <span className="text-sm font-medium text-foreground">Loading</span>
          <span className="flex gap-1">
            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
