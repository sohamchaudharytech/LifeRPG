"use client";

import React from "react";
import { Dumbbell, Brain, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { UserAttributes } from "@/types/user";

interface AttributeGridProps {
  attributes: UserAttributes;
}

const ATTRIBUTES_CONFIG = [
  {
    key: "strength" as const,
    label: "STRENGTH",
    description: "Physical fitness, resistance & endurance",
    icon: Dumbbell,
    color: "text-rose-400",
    glow: "hover:border-rose-500/40 hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]",
    progressVariant: "health" as const,
  },
  {
    key: "intellect" as const,
    label: "INTELLECT",
    description: "Coding, deep work & analytical learning",
    icon: Brain,
    color: "text-cyan-400",
    glow: "hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]",
    progressVariant: "cyan" as const,
  },
  {
    key: "discipline" as const,
    label: "DISCIPLINE",
    description: "Routines, consistency & mental willpower",
    icon: ShieldCheck,
    color: "text-purple-400",
    glow: "hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]",
    progressVariant: "xp" as const,
  },
  {
    key: "vitality" as const,
    label: "VITALITY",
    description: "Sleep, hydration, nutrition & wellness",
    icon: Heart,
    color: "text-emerald-400",
    glow: "hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]",
    progressVariant: "gold" as const,
  },
  {
    key: "creativity" as const,
    label: "CREATIVITY",
    description: "Art, writing, music & novel problem solving",
    icon: Sparkles,
    color: "text-amber-400",
    glow: "hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]",
    progressVariant: "gold" as const,
  },
];

export function AttributeGrid({ attributes }: AttributeGridProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold font-sans tracking-wide text-white">
            CHARACTER ATTRIBUTES
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Directly empowered by your completed real-world quests
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {ATTRIBUTES_CONFIG.map((attr) => {
          const Icon = attr.icon;
          const value = attributes[attr.key] || 1;
          const attributeLevel = Math.floor(value / 10) + 1;
          const progressToNext = (value % 10) * 10;

          return (
            <Card
              key={attr.key}
              className={`p-4 bg-surface/80 border-white/10 transition-all duration-300 ${attr.glow}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${attr.color}`} />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-200">
                    {attr.label}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-slate-400">
                  LVL {attributeLevel}
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-black font-mono text-white">
                  {value}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {value % 10}/10 to next
                </span>
              </div>

              <ProgressBar
                value={progressToNext}
                variant={attr.progressVariant}
                size="sm"
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
