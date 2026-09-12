"use client";

import React from "react";
import Link from "next/link";
import { Flame, Coins, ShieldCheck, User } from "lucide-react";
import { SafeUser } from "@/types/user";

interface HeaderProps {
  user?: SafeUser | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl px-4 md:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
          REALM STATUS: <span className="text-emerald-400 font-bold">ONLINE</span>
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {/* Streak Counter */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-400 font-mono text-xs shadow-[0_0_12px_rgba(249,115,22,0.2)]"
          title={`Consecutive Day Streak: ${user?.streak || 0} days`}
        >
          <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
          <span className="font-bold">{user?.streak || 0}</span>
          <span className="hidden sm:inline text-[10px] text-orange-300 uppercase">DAY STREAK</span>
        </div>

        {/* Gold Counter */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 font-mono text-xs shadow-[0_0_12px_rgba(245,158,11,0.2)]"
          title={`Gold Treasury: ${user?.gold || 0}`}
        >
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="font-extrabold">{user?.gold || 0}</span>
          <span className="hidden sm:inline text-[10px] text-amber-400 uppercase">GOLD</span>
        </div>

        {/* Level Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 font-mono text-xs shadow-[0_0_12px_rgba(139,92,246,0.2)]">
          <ShieldCheck className="w-4 h-4 text-violet-400" />
          <span className="font-bold">LVL {user?.level || 1}</span>
        </div>

        {/* User Mini Avatar */}
        <Link
          href="/character"
          className="flex items-center gap-2 pl-2 border-l border-white/10 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg py-0.5"
          aria-label="View character sheet"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-violet-600 flex items-center justify-center ring-2 ring-white/20">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="hidden lg:inline text-xs font-semibold text-slate-200">
            {user?.username || "Hero"}
          </span>
        </Link>
      </div>
    </header>
  );
}
