"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  onComplete: () => void;
}

const MESSAGES = [
  "Reading cutoff database...",
  "Analysing your rank...",
  "Comparing category wise cutoffs...",
  "Curating the best colleges for you...",
  "Optimizing your counselling list...",
  "Almost there..."
];

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const duration = 5000; // exactly 5 seconds
    const intervalTime = 50; 
    const totalSteps = duration / intervalTime;
    const progressPerStep = 100 / totalSteps;
    
    let currentStep = 0;
    
    const progressTimer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(progressPerStep * currentStep, 100);
      setProgress(nextProgress);
      
      const nextMessageIdx = Math.min(Math.floor(nextProgress / 16.67), MESSAGES.length - 1);
      setMessageIndex(nextMessageIdx);
      
      if (currentStep >= totalSteps) {
        clearInterval(progressTimer);
        setTimeout(() => {
          onComplete();
        }, 100); 
      }
    }, intervalTime);

    return () => clearInterval(progressTimer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-card rounded-2xl p-8 text-center border border-white/8 shadow-2xl relative overflow-hidden"
      >
        {/* Soft background light */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Processing Icon (Muted grey rotate) */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative h-12 w-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/80">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-white mb-2">
          Generating Options
        </h3>
        <p className="text-xs text-subtext mb-8 h-5 flex items-center justify-center font-semibold">
          <span className="text-white/60 mr-1.5 font-mono">✓</span> {MESSAGES[messageIndex]}
        </p>

        {/* Premium Matte Progress Bar */}
        <div className="w-full bg-white/5 border border-white/8 rounded-full h-3 overflow-hidden p-0.5 mb-3">
          <motion.div 
            className="h-full bg-gradient-to-r from-white/90 to-white/40 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.15)]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>

        {/* Progress Value */}
        <div className="flex justify-between items-center text-[10px] font-bold tracking-wider text-subtext/85 px-1">
          <span>OPTIMIZING SELECTIONS</span>
          <span className="font-mono text-white/90">{Math.round(progress)}%</span>
        </div>
      </motion.div>
    </div>
  );
}
