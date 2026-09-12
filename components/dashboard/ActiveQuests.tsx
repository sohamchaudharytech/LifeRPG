"use client";

import React, { useState } from "react";
import { Quest, QuestCategory } from "@/types/quest";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Zap, Coins, Sparkles, Plus, Filter } from "lucide-react";

interface ActiveQuestsProps {
  initialQuests: Quest[];
  onCompleteQuest: (questId: string) => Promise<any>;
  onOpenCreateModal: () => void;
}

export function ActiveQuests({
  initialQuests,
  onCompleteQuest,
  onOpenCreateModal,
}: ActiveQuestsProps) {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [completingId, setCompletingId] = useState<string | null>(null);

  // Update internal quests state when initialQuests prop changes
  React.useEffect(() => {
    setQuests(initialQuests);
  }, [initialQuests]);

  const categories = ["All", "Coding", "Study", "Fitness", "Health", "Personal"];

  const filteredQuests = quests.filter((q) => {
    if (selectedCategory === "All") return true;
    return q.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleComplete = async (questId: string) => {
    setCompletingId(questId);
    try {
      await onCompleteQuest(questId);
      // Remove completed quest from active list
      setQuests((prev) => prev.filter((q) => q._id !== questId));
    } catch (error) {
      console.error("Completion error:", error);
    } finally {
      setCompletingId(null);
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return <Badge variant="success" size="sm">EASY</Badge>;
      case "Medium":
        return <Badge variant="secondary" size="sm">MEDIUM</Badge>;
      case "Hard":
        return <Badge variant="gold" size="sm">HARD</Badge>;
      case "Epic":
        return <Badge variant="danger" size="sm">EPIC</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{difficulty}</Badge>;
    }
  };

  return (
    <div>
      {/* Header & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            ACTIVE QUEST BOARD
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Execute objectives to gain XP, Gold, and attribute progression
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>FORGE QUEST</span>
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none" role="tablist">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            role="tab"
            aria-selected={selectedCategory === cat}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              selectedCategory === cat
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold"
                : "bg-surface text-slate-400 border border-white/5 hover:text-white hover:bg-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quest Cards Grid */}
      {filteredQuests.length === 0 ? (
        <Card className="text-center py-12 px-6 border-dashed border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-surface-elevated mx-auto flex items-center justify-center mb-3">
            <Sparkles className="w-7 h-7 text-slate-500" />
          </div>
          <h3 className="text-base font-bold font-mono text-white mb-1">
            QUEST BOARD IS CLEAR
          </h3>
          <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto mb-5">
            Every legend starts with a single quest. Forge a new quest to commence your journey.
          </p>
          <Button variant="secondary" size="sm" onClick={onOpenCreateModal}>
            FORGE YOUR FIRST QUEST
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuests.map((quest) => (
            <Card
              key={quest._id}
              className="flex flex-col justify-between p-5 bg-surface/90 border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] group"
            >
              <div>
                {/* Header: Difficulty + Category */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {getDifficultyBadge(quest.difficulty)}
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
                      {quest.category}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                    {quest.attribute.toUpperCase()}
                  </span>
                </div>

                {/* Quest Title */}
                <h3 className="text-base font-bold font-sans text-white mb-1.5 group-hover:text-cyan-200 transition-colors">
                  {quest.title}
                </h3>

                {/* Description */}
                {quest.description && (
                  <p className="text-xs text-slate-400 font-sans line-clamp-2 mb-4">
                    {quest.description}
                  </p>
                )}
              </div>

              {/* Footer: Rewards + Complete CTA */}
              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between gap-2">
                {/* Reward Chips */}
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="flex items-center gap-1 text-violet-300" title="XP Reward">
                    <Zap className="w-3.5 h-3.5 text-violet-400" />
                    +{quest.xpReward}
                  </span>
                  <span className="flex items-center gap-1 text-amber-300" title="Gold Reward">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    +{quest.goldReward}
                  </span>
                </div>

                {/* Complete Button */}
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={completingId === quest._id}
                  onClick={() => handleComplete(quest._id)}
                  className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider"
                  aria-label={`Complete quest: ${quest.title}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  COMPLETE
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
