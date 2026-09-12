import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "gold" | "success" | "danger" | "neutral";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral: "bg-slate-800 text-slate-300 border-slate-700/60",
    primary: "bg-purple-950/80 text-purple-300 border-purple-800/60 shadow-[0_0_10px_rgba(168,85,247,0.2)]",
    secondary: "bg-cyan-950/80 text-cyan-300 border-cyan-800/60 shadow-[0_0_10px_rgba(6,182,212,0.2)]",
    gold: "bg-amber-950/80 text-amber-300 border-amber-800/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
    success: "bg-emerald-950/80 text-emerald-300 border-emerald-800/60 shadow-[0_0_10px_rgba(34,197,94,0.2)]",
    danger: "bg-rose-950/80 text-rose-300 border-rose-800/60 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase",
    md: "px-2.5 py-1 text-xs font-semibold tracking-wide uppercase",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-mono transition-colors",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
