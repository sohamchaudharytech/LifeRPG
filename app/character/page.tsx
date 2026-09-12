"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Shield,
  Award,
  Flame,
  Coins,
  Brain,
  Dumbbell,
  Heart,
  Sparkles,
  Zap,
  CheckCircle,
  Package,
} from "lucide-react";
import { SHOP_CATALOG, getShopItemById } from "@/lib/rpg/shopCatalog";

export default function CharacterPage() {
  const [character, setCharacter] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [equippingId, setEquippingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const fetchCharacter = async () => {
    try {
      const res = await fetch("/api/character");
      if (res.ok) {
        const data = await res.json();
        setCharacter(data.character);
      }
    } catch (err) {
      console.error("Error fetching character:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacter();
  }, []);

  const handleEquip = async (itemId: string) => {
    setEquippingId(itemId);
    setFeedbackMsg(null);
    try {
      const res = await fetch("/api/character/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to equip item");
      }
      setFeedbackMsg("Item equipped successfully!");
      fetchCharacter();
    } catch (err: any) {
      setFeedbackMsg(err.message);
    } finally {
      setEquippingId(null);
    }
  };

  if (isLoading || !character) {
    return (
      <AppShell>
        <div className="space-y-6 animate-pulse" aria-label="Loading character sheet">
          <div className="h-64 rounded-3xl bg-surface-elevated/60 border border-white/5" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80 rounded-3xl bg-surface/60 border border-white/5" />
            <div className="h-80 rounded-3xl bg-surface/60 border border-white/5" />
          </div>
        </div>
      </AppShell>
    );
  }

  const attributesList = [
    { key: "strength", label: "Strength", icon: Dumbbell, color: "text-rose-400", variant: "health" as const },
    { key: "intellect", label: "Intellect", icon: Brain, color: "text-cyan-400", variant: "cyan" as const },
    { key: "discipline", label: "Discipline", icon: Shield, color: "text-purple-400", variant: "xp" as const },
    { key: "vitality", label: "Vitality", icon: Heart, color: "text-emerald-400", variant: "gold" as const },
    { key: "creativity", label: "Creativity", icon: Sparkles, color: "text-amber-400", variant: "gold" as const },
  ];

  const equippedFrameItem = getShopItemById(character.equippedFrame);
  const equippedThemeItem = getShopItemById(character.equippedTheme);

  return (
    <AppShell initialUser={character}>
      {/* Character Sheet Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-surface-elevated border border-white/10 p-6 md:p-8 mb-8">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Hologram Display with Frame */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-32 h-32 md:w-36 md:h-36 rounded-3xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-violet-600 p-1 flex items-center justify-center ${
                equippedFrameItem?.previewClass || "border-2 border-white/20"
              }`}
            >
              <div className="w-full h-full bg-background rounded-3xl flex flex-col items-center justify-center p-3">
                <Shield className="w-12 h-12 text-cyan-400 mb-1" />
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                  HERO
                </span>
                <span className="text-xl font-black font-mono text-cyan-300">
                  LVL {character.level}
                </span>
              </div>
            </div>

            {/* Aura indicator if equipped */}
            {character.equippedAura && (
              <div className="absolute -inset-3 rounded-3xl ring-4 ring-amber-400/50 blur-sm animate-pulse-glow pointer-events-none" />
            )}
          </div>

          {/* Hero Credentials */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <Badge variant="secondary" size="md">
                LEVEL {character.level} HERO
              </Badge>
              {character.equippedTheme !== "default" && (
                <Badge variant="gold" size="md">
                  {equippedThemeItem?.name || character.equippedTheme}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-sans text-white mb-2">
              {character.username}
            </h1>
            <p className="text-sm text-slate-400 font-mono mb-4">
              Registered Adventurer &bull; Total Career XP:{" "}
              <span className="text-violet-400 font-bold">
                {character.totalXp.toLocaleString()}
              </span>
            </p>

            {/* Level Progress */}
            <div className="max-w-md">
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                <span>Next Milestone: Level {character.level + 1}</span>
                <span>
                  {character.currentXp} / {character.xpForNextLevel} XP ({character.progressPercentage}%)
                </span>
              </div>
              <ProgressBar
                value={character.currentXp}
                max={character.xpForNextLevel}
                variant="xp"
                size="md"
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto font-mono text-center">
            <div className="p-4 rounded-2xl bg-surface border border-orange-500/30">
              <div className="flex items-center justify-center gap-1.5 text-orange-400 font-bold mb-1">
                <Flame className="w-4 h-4" />
                <span>{character.streak} DAYS</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase">Current Streak</div>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-amber-500/30">
              <div className="flex items-center justify-center gap-1.5 text-amber-300 font-bold mb-1">
                <Coins className="w-4 h-4" />
                <span>{character.gold}</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase">Gold Pouch</div>
            </div>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 mb-6 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-mono text-xs">
          {feedbackMsg}
        </div>
      )}

      {/* Attributes & Inventory Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Attributes Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold font-sans text-white">ATTRIBUTE METRICS</h2>
              <p className="text-xs text-slate-400 font-mono">
                Stat points earned via real-life discipline
              </p>
            </div>
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>

          <div className="space-y-4">
            {attributesList.map((attr) => {
              const Icon = attr.icon;
              const val = character.attributes[attr.key] || 1;
              const lvl = Math.floor(val / 10) + 1;
              const prog = (val % 10) * 10;

              return (
                <div key={attr.key} className="p-3.5 rounded-2xl bg-surface-elevated/70 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${attr.color}`} />
                      <span className="font-mono text-sm font-bold text-white">
                        {attr.label}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-slate-300">
                      <span className="text-white font-bold text-sm">{val}</span> pts &bull; LVL {lvl}
                    </div>
                  </div>
                  <ProgressBar value={prog} variant={attr.variant} size="sm" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Inventory & Equipped Gear */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold font-sans text-white">INVENTORY & COSMETICS</h2>
              <p className="text-xs text-slate-400 font-mono">
                Items acquired from the Realm Shop
              </p>
            </div>
            <Package className="w-5 h-5 text-amber-400" />
          </div>

          {character.inventory?.length === 0 ? (
            <div className="text-center py-10 px-4 border border-dashed border-white/10 rounded-2xl">
              <Package className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-mono text-slate-300 mb-1">INVENTORY EMPTY</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                Earn Gold by completing quests, then visit the Shop to unlock frames, themes, and auras.
              </p>
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/shop"}>
                VISIT REALM SHOP
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {character.inventory.map((inv: any) => {
                const item = getShopItemById(inv.itemId);
                if (!item) return null;
                const isEquipped =
                  character.equippedFrame === item.id ||
                  character.equippedTheme === item.id ||
                  character.equippedAura === item.id;

                return (
                  <div
                    key={inv.itemId}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-elevated/70 border border-white/5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">
                          {item.name}
                        </span>
                        <Badge variant="primary" size="sm">
                          {item.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <Button
                      variant={isEquipped ? "secondary" : "outline"}
                      size="sm"
                      isLoading={equippingId === item.id}
                      onClick={() => handleEquip(item.id)}
                      className="px-3 py-1 text-xs font-mono uppercase"
                    >
                      {isEquipped ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 mr-1 text-cyan-300" />
                          EQUIPPED
                        </>
                      ) : (
                        "EQUIP"
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Achievement Badges Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold font-sans text-white">ACHIEVEMENTS & BADGES</h2>
            <p className="text-xs text-slate-400 font-mono">
              Milestones recognized across your life transformation
            </p>
          </div>
          <Award className="w-5 h-5 text-violet-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {character.badges?.map((badge: any) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all ${
                badge.unlocked
                  ? "bg-surface-elevated/90 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  : "bg-surface/40 border-white/5 opacity-40 grayscale"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    badge.unlocked
                      ? "bg-cyan-500/20 text-cyan-300 shadow-sm"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-bold text-white">
                    {badge.name}
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">
                    {badge.unlocked ? "UNLOCKED" : "LOCKED"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
