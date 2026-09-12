import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  className?: string;
  variant?: "xp" | "gold" | "health" | "mana" | "cyan";
  showLabel?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  max = 100,
  className,
  variant = "xp",
  showLabel = false,
  label,
  size = "md",
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantStyles = {
    xp: "from-violet-500 via-purple-500 to-indigo-400 shadow-[0_0_12px_rgba(168,85,247,0.5)]",
    gold: "from-amber-500 via-yellow-400 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]",
    cyan: "from-cyan-500 via-teal-400 to-sky-300 shadow-[0_0_12px_rgba(6,182,212,0.5)]",
    health: "from-rose-600 via-red-500 to-orange-400 shadow-[0_0_12px_rgba(239,68,68,0.5)]",
    mana: "from-blue-600 via-sky-500 to-indigo-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]",
  };

  const sizeStyles = {
    sm: "h-2",
    md: "h-3.5",
    lg: "h-5",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-mono mb-1.5 text-slate-300">
          <span>{label || "Progress"}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner",
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out",
            variantStyles[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
