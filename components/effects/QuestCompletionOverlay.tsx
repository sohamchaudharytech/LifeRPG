"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";

export interface QuestCompletionDetails {
  xp: number;
  gold: number;
  attribute: string;
  attributePoints: number;
}

interface QuestCompletionOverlayProps {
  details: QuestCompletionDetails | null;
  onDone: () => void;
}

export function QuestCompletionOverlay({ details, onDone }: QuestCompletionOverlayProps) {
  useEffect(() => {
    if (!details) return;

    // Trigger celebratory particle explosion
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#06B6D4", "#7C3AED", "#F59E0B", "#22C55E"],
      });
    } catch (e) {
      // Fallback if canvas is unavailable
    }

    const timer = setTimeout(() => {
      onDone();
    }, 3200);

    return () => clearTimeout(timer);
  }, [details, onDone]);

  if (!details) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3 animate-float">
        {/* Main Banner */}
        <div className="px-6 py-3 rounded-2xl bg-surface-elevated/90 border border-cyan-400/40 shadow-[0_0_40px_rgba(6,182,212,0.6)] backdrop-blur-xl">
          <span className="text-xl font-black font-mono tracking-widest text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400 bg-clip-text">
            QUEST COMPLETE!
          </span>
        </div>

        {/* Floating Numbers */}
        <div className="flex items-center gap-4">
          <div className="px-3.5 py-1.5 rounded-xl bg-violet-950/90 border border-violet-500/50 text-violet-300 font-mono font-bold text-sm shadow-[0_0_20px_rgba(168,85,247,0.6)]">
            +{details.xp} XP
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-950/90 border border-amber-500/50 text-amber-300 font-mono font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.6)]">
            +{details.gold} GOLD
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 font-mono font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.6)]">
            {details.attribute.toUpperCase()} +{details.attributePoints}
          </div>
        </div>
      </div>
    </div>
  );
}
