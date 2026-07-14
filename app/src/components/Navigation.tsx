"use client";

import Image from "next/image";
import { Info } from "lucide-react";

interface NavigationProps {
  onNavigate: (step: 'form' | 'about') => void;
  currentStep: 'form' | 'loading' | 'results' | 'about';
}

export default function Navigation({ onNavigate, currentStep }: NavigationProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#090909]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo and Branding (Left Side) */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => onNavigate('form')}
          >
            {/* White rounded square container for Logo - zoomed in by reducing padding & increasing size */}
            <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-white/15 shadow-sm">
              <Image 
                src="/Logo.png" 
                alt="Rank Entha Bro Logo" 
                width={36} 
                height={36}
                className="object-contain"
              />
            </div>
            
            {/* Brand Title and Subtitle */}
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white leading-tight">
                Rank Entha Bro
              </span>
              <span className="text-[10px] text-gray-400 font-semibold leading-none mt-0.5">
                EAPCET counselling assistant
              </span>
            </div>
          </div>

          {/* Navigation Links (Right Side) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('about')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all cursor-pointer border ${
                currentStep === 'about'
                  ? "bg-white/15 text-white border-white/20"
                  : "bg-transparent text-white border-white/10 hover:bg-white/5"
              }`}
            >
              <Info className="h-3.5 w-3.5" />
              <span>About</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
