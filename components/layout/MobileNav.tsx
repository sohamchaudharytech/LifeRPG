"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Scroll,
  User,
  ShoppingBag,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/quests", label: "Quests", icon: Scroll },
  { href: "/character", label: "Hero", icon: User },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/history", label: "Logs", icon: History },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-white/10 px-3 py-2 flex items-center justify-around shadow-2xl shadow-black/80"
      aria-label="Mobile Navigation"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
              isActive ? "text-cyan-400 font-bold" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Icon
              className={cn(
                "w-5 h-5 mb-1 transition-transform",
                isActive ? "scale-115 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" : "text-slate-400"
              )}
            />
            <span className="text-[10px] font-mono tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
