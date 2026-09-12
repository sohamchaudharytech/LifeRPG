"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ShoppingBag,
  Coins,
  Sparkles,
  CheckCircle,
  Shield,
  Palette,
  Flame,
  Award,
  CircleDot,
  Hexagon,
  Zap,
} from "lucide-react";
import { ShopItem } from "@/types/shop";

export default function ShopPage() {
  const [items, setItems] = useState<any[]>([]);
  const [userGold, setUserGold] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchShop = async () => {
    try {
      const res = await fetch("/api/shop");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setUserGold(data.userGold || 0);
      }
    } catch (err) {
      console.error("Fetch shop error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShop();
  }, []);

  const handlePurchase = async (itemId: string) => {
    setPurchasingId(itemId);
    setFeedback(null);

    try {
      const res = await fetch(`/api/shop/${itemId}/purchase`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Purchase failed");
      }

      setFeedback({ type: "success", message: data.message });
      setUserGold(data.newGold);
      fetchShop();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setPurchasingId(null);
    }
  };

  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case "Shield": return <Shield className="w-6 h-6" />;
      case "Award": return <Award className="w-6 h-6" />;
      case "CircleDot": return <CircleDot className="w-6 h-6" />;
      case "Palette": return <Palette className="w-6 h-6" />;
      case "Sparkles": return <Sparkles className="w-6 h-6" />;
      case "Hexagon": return <Hexagon className="w-6 h-6" />;
      case "Flame": return <Flame className="w-6 h-6" />;
      case "Zap": return <Zap className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return <Badge variant="neutral" size="sm">COMMON</Badge>;
      case "Rare":
        return <Badge variant="secondary" size="sm">RARE</Badge>;
      case "Epic":
        return <Badge variant="primary" size="sm">EPIC</Badge>;
      case "Legendary":
        return <Badge variant="gold" size="sm">LEGENDARY</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{rarity}</Badge>;
    }
  };

  return (
    <AppShell>
      {/* Header with Live Treasury */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black font-sans tracking-tight text-white flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-amber-400" />
            REALM BAZAAR & ARMORY
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Exchange your quest-earned gold for cosmetic gear, theme customizations, and mythical relics
          </p>
        </div>

        {/* Treasury Card */}
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-surface-elevated border border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Coins className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="text-xl font-black font-mono text-amber-300">
              {userGold.toLocaleString()}
            </div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Available Gold
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 mb-6 rounded-2xl border font-mono text-xs ${
            feedback.type === "success"
              ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
              : "bg-rose-950/80 border-rose-500/40 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.2)]"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Shop Items Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-72 rounded-3xl bg-surface/60 border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const canAfford = userGold >= item.price;

            return (
              <Card
                key={item.id}
                className="flex flex-col justify-between p-6 bg-surface/90 border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div>
                  {/* Top: Rarity + Type */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {getRarityBadge(item.rarity)}
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      {item.type}
                    </span>
                  </div>

                  {/* Visual Icon Showcase */}
                  <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-white/10 mx-auto flex items-center justify-center mb-4 text-cyan-300 shadow-inner">
                    {getItemIcon(item.icon)}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold font-sans text-white text-center mb-1.5">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 text-center font-sans line-clamp-2 mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Bottom: Price + Purchase Action */}
                <div className="pt-4 border-t border-white/10 mt-2">
                  <div className="flex items-center justify-between mb-4 font-mono">
                    <span className="text-xs text-slate-400">Price:</span>
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-300">
                      <Coins className="w-4 h-4 text-amber-400" />
                      <span>{item.price} Gold</span>
                    </div>
                  </div>

                  {item.isOwned ? (
                    <div className="w-full py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 shadow-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>OWNED</span>
                    </div>
                  ) : (
                    <Button
                      variant={canAfford ? "gold" : "outline"}
                      size="sm"
                      disabled={!canAfford}
                      isLoading={purchasingId === item.id}
                      onClick={() => handlePurchase(item.id)}
                      className="w-full text-xs font-mono uppercase tracking-wider"
                    >
                      {canAfford ? `PURCHASE (${item.price} G)` : "INSUFFICIENT GOLD"}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
