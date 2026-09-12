import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "cyan" | "purple" | "gold" | "none";
  hoverable?: boolean;
}

export function Card({
  className,
  glow = "none",
  hoverable = false,
  children,
  ...props
}: CardProps) {
  const glowStyles = {
    none: "",
    cyan: "hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:border-cyan-500/40",
    purple: "hover:shadow-[0_0_25px_rgba(124,58,237,0.25)] hover:border-purple-500/40",
    gold: "hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:border-amber-500/40",
  };

  return (
    <div
      className={cn(
        "bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-slate-100 transition-all duration-300",
        hoverable && "hover:-translate-y-1 hover:border-white/20",
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
