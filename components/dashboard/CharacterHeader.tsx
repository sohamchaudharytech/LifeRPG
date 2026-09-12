"use client";

import React from "react";
import { Shield, Sparkles, Flame, Coins, Zap } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SafeUser } from "@/types/user";
import { calculateLevelProgress } from "@/lib/rpg/engine";

interface CharacterHeaderProps {
  user: SafeUser;
}

export function CharacterHeader({ user }: CharacterHeaderProps) {
  const levelInfo = calculateLevelProgress(user.totalXp || 0);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-surface-elevated via-surface to-surface-elevated border border-white/10 p-6 md:p-8 shadow-2xl mb-8">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Hero Identity */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-1 shadow-[0_0_25px_rgba(124,58,237,0.4)]">
              <div className="w-full h-full bg-background rounded-2xl flex flex-col items-center justify-center">
                <Shield className="w-8 h-8 text-cyan-400 mb-1" />
                <span className="text-[10px] font-mono font-bold text-slate-400">LVL</span>
                <span className="text-lg font-black font-mono text-cyan-300 -mt-1">
                  {levelInfo.level}
                </span>
              </div>
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-background flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                PROTAGONIST
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                {user.equippedTheme !== "default" ? user.equippedTheme.toUpperCase() : "STANDARD THEME"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black font-sans tracking-tight text-white">
              {user.username}
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Cumulative XP: <span className="text-violet-400 font-bold">{user.totalXp.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Day Streak */}
          <div className="flex-1 sm:flex-none flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface/90 border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
            </div>
            <div>
              <div className="text-xl font-black font-mono text-orange-400">
                {user.streak || 0}
              </div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Day Streak
              </div>
            </div>
          </div>

          {/* Gold Treasury */}
          <div className="flex-1 sm:flex-none flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface/90 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-xl font-black font-mono text-amber-400">
                {(user.gold || 0).toLocaleString()}
              </div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Gold
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Non-Linear Level XP Progress Bar */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <div className="flex items-center gap-2 text-violet-300">
            <Zap className="w-4 h-4 text-violet-400" />
            <span>LEVEL {levelInfo.level} PROGRESSION</span>
          </div>
          <div className="text-slate-300 font-bold">
            <span className="text-white">{levelInfo.currentXp.toLocaleString()}</span> /{" "}
            <span className="text-slate-400">{levelInfo.xpForNextLevel.toLocaleString()} XP</span>
            <span className="text-cyan-400 ml-2">({levelInfo.progressPercentage}%)</span>
          </div>
        </div>
        <ProgressBar
          value={levelInfo.currentXp}
          max={levelInfo.xpForNextLevel}
          variant="xp"
          size="md"
        />
      </div>
    </div>
  );
}
