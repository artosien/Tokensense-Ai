"use client";

import React, { useState, useEffect } from 'react';

export default function CalculatorStepTracker() {
  const [activeStep, setActiveStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const calculateSection = document.getElementById('calculate-section');
      if (calculateSection) {
        const rect = calculateSection.getBoundingClientRect();
        setIsVisible(rect.top < 100 && rect.bottom > 200);
      }

      // Detect active step
      const steps = [1, 2, 3];
      for (const step of steps) {
        const element = document.getElementById(`step-${step}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < 300 && rect.bottom > 300) {
            setActiveStep(step);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const steps = [
    { id: 1, label: "Count tokens" },
    { id: 2, label: "Compare models" },
    { id: 3, label: "Simulate agent cost" }
  ];

  return (
    <div className="fixed top-[64px] left-0 right-0 z-50 flex items-center justify-center bg-[#0d1117]/90 backdrop-blur-md border-b border-white/5 py-3 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar px-4">
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            <a 
              href={`#step-${step.id}`}
              className={`flex items-center gap-2 whitespace-nowrap text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeStep === step.id ? 'text-indigo-400' : 'text-white/40 hover:text-white/60'}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(`step-${step.id}`)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${activeStep === step.id ? 'border-indigo-400 bg-indigo-400/10' : 'border-white/20'}`}>
                {step.id}
              </span>
              {step.label}
            </a>
            {i < steps.length - 1 && <div className="w-4 md:w-8 h-px bg-white/10 shrink-0" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
