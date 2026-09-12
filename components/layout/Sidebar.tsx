"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Scroll,
  User,
  ShoppingBag,
  History,
  LogOut,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quests", label: "Quests", icon: Scroll },
  { href: "/character", label: "Character", icon: User },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/history", label: "History", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      router.push("/login");
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-surface/90 backdrop-blur-xl h-screen sticky top-0 z-30 p-5">
      {/* Brand */}
      <div className="flex items-center gap-3 px-3 py-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/30">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-black tracking-widest bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400 bg-clip-text text-transparent">
            LIFE RPG
          </span>
          <p className="text-[10px] text-slate-400 font-mono tracking-wider">LEVEL UP YOUR REAL LIFE</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5" aria-label="Main Navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
                isActive
                  ? "bg-gradient-to-r from-cyan-500/15 to-violet-600/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-bold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform",
                  isActive ? "text-cyan-400 scale-110" : "text-slate-400 group-hover:text-slate-200"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-white/10 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors focus-visible:ring-2 focus-visible:ring-rose-400 outline-none"
        >
          <LogOut className="w-5 h-5 text-rose-400" />
          <span>Exit Realm (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
