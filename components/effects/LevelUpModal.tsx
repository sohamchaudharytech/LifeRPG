"use client";

import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LevelUpModalProps {
  isOpen: boolean;
  oldLevel: number;
  newLevel: number;
  onClose: () => void;
}

export function LevelUpModal({
  isOpen,
  oldLevel,
  newLevel,
  onClose,
}: LevelUpModalProps) {
  const continueBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Trigger double particle blast
    try {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#F59E0B", "#8B5CF6", "#06B6D4", "#EC4899"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);
    } catch (e) {}

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    continueBtnRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="levelup-title"
    >
      <div className="relative w-full max-w-md bg-gradient-to-b from-surface-elevated via-surface to-background border border-amber-500/40 rounded-3xl p-8 text-center shadow-[0_0_60px_rgba(245,158,11,0.4)] animate-scale-up">
        {/* Glow Halo */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-violet-600 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.7)] ring-4 ring-black">
          <Trophy className="w-12 h-12 text-black" />
        </div>

        <div className="mt-8 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-xs uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            ASCENSION ACHIEVED
          </span>
        </div>

        <h2
          id="levelup-title"
          className="text-4xl font-black font-sans tracking-tight text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 bg-clip-text mb-2 text-glow-gold"
        >
          LEVEL UP!
        </h2>

        {/* Level Transition Pill */}
        <div className="my-6 inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-surface/90 border border-white/10 shadow-inner">
          <span className="text-3xl font-mono font-bold text-slate-400">
            LVL {oldLevel}
          </span>
          <ArrowRight className="w-6 h-6 text-amber-400 animate-pulse" />
          <span className="text-4xl font-mono font-black text-amber-400 text-glow-gold">
            LVL {newLevel}
          </span>
        </div>

        <p className="text-sm text-slate-300 font-sans mb-6">
          Your power and discipline grow stronger. New horizons and quest rewards have been unlocked!
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-xs">
          <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 text-violet-300">
            +1 CHARACTER LEVEL
          </div>
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300">
            +STAT ATTRIBUTE BOOST
          </div>
        </div>

        <Button
          ref={continueBtnRef}
          variant="gold"
          size="lg"
          onClick={onClose}
          className="w-full"
          autoFocus
        >
          CLAIM REWARDS & CONTINUE
        </Button>
        <p className="text-[11px] text-slate-500 mt-2 font-mono">Press Space, Enter, or Esc to dismiss</p>
      </div>
    </div>
  );
}
