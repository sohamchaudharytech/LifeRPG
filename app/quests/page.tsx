"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CreateQuestModal } from "@/components/dashboard/CreateQuestModal";
import { QuestCompletionOverlay, QuestCompletionDetails } from "@/components/effects/QuestCompletionOverlay";
import { LevelUpModal } from "@/components/effects/LevelUpModal";
import {
  Scroll,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Zap,
  Coins,
  Sparkles,
} from "lucide-react";
import { Quest } from "@/types/quest";

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Animations & Modals
  const [completionDetails, setCompletionDetails] = useState<QuestCompletionDetails | null>(null);
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: number; newLevel: number } | null>(null);

  const fetchQuests = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (categoryFilter !== "All") params.set("category", categoryFilter);
      if (difficultyFilter !== "All") params.set("difficulty", difficultyFilter);

      const res = await fetch(`/api/tasks?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setQuests(data.tasks || []);
      }
    } catch (err) {
      console.error("Error fetching quests:", err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, categoryFilter, difficultyFilter]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const handleCompleteQuest = async (questId: string) => {
    setCompletingId(questId);
    try {
      const res = await fetch(`/api/tasks/${questId}/complete`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to complete quest");

      setCompletionDetails({
        xp: data.rewards.xp,
        gold: data.rewards.gold,
        attribute: data.rewards.attribute,
        attributePoints: data.rewards.attributePoints,
      });

      if (data.levelUpOccurred) {
        setTimeout(() => {
          setLevelUpData({
            oldLevel: data.oldLevel,
            newLevel: data.newLevel,
          });
        }, 1200);
      }

      fetchQuests();
    } catch (err) {
      console.error("Complete error:", err);
    } finally {
      setCompletingId(null);
    }
  };

  const handleDeleteQuest = async (questId: string) => {
    if (!confirm("Are you certain you wish to abandon this quest?")) return;
    setDeletingId(questId);
    try {
      const res = await fetch(`/api/tasks/${questId}`, { method: "DELETE" });
      if (res.ok) {
        setQuests((prev) => prev.filter((q) => q._id !== questId));
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredQuests = quests.filter((q) =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ["All", "Coding", "Study", "Fitness", "Health", "Creativity", "Personal"];
  const difficulties = ["All", "Easy", "Medium", "Hard", "Epic"];

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black font-sans tracking-tight text-white flex items-center gap-3">
            <Scroll className="w-7 h-7 text-cyan-400" />
            QUEST LOG ARCHIVES
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Browse, manage, and execute all active and archived life objectives
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>FORGE NEW QUEST</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-5 rounded-2xl bg-surface/90 border border-white/10 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quest objectives..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-elevated border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-surface-elevated p-1 rounded-xl border border-white/10">
            {["active", "completed", "all"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                  statusFilter === status
                    ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Category & Difficulty Filters */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-surface-elevated border border-white/10 text-white text-xs"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-surface text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Difficulty:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-surface-elevated border border-white/10 text-white text-xs"
            >
              {difficulties.map((d) => (
                <option key={d} value={d} className="bg-surface text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quest Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-surface/60 border border-white/5" />
          ))}
        </div>
      ) : filteredQuests.length === 0 ? (
        <Card className="text-center py-16 px-6 border-dashed border-white/10">
          <Scroll className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold font-mono text-white mb-1">
            NO MATCHING QUESTS FOUND
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            Adjust your filters or forge a brand new quest to proceed.
          </p>
          <Button variant="secondary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
            FORGE QUEST
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuests.map((quest) => (
            <Card
              key={quest._id}
              className={`flex flex-col justify-between p-5 border-white/10 ${
                quest.completed ? "opacity-60 bg-surface/50" : "bg-surface/90 hover:border-cyan-500/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        quest.difficulty === "Easy"
                          ? "success"
                          : quest.difficulty === "Medium"
                          ? "secondary"
                          : quest.difficulty === "Hard"
                          ? "gold"
                          : "danger"
                      }
                      size="sm"
                    >
                      {quest.difficulty}
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-400">
                      {quest.category}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                    {quest.attribute}
                  </span>
                </div>

                <h3
                  className={`text-base font-bold font-sans mb-1.5 ${
                    quest.completed ? "line-through text-slate-400" : "text-white"
                  }`}
                >
                  {quest.title}
                </h3>

                {quest.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {quest.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="flex items-center gap-1 text-violet-300">
                    <Zap className="w-3.5 h-3.5 text-violet-400" />
                    +{quest.xpReward}
                  </span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    +{quest.goldReward}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!quest.completed && (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={completingId === quest._id}
                      onClick={() => handleCompleteQuest(quest._id)}
                      className="px-3 py-1.5 text-xs font-mono uppercase"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      COMPLETE
                    </Button>
                  )}
                  <button
                    onClick={() => handleDeleteQuest(quest._id)}
                    disabled={deletingId === quest._id}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors focus-visible:ring-2 focus-visible:ring-rose-400 outline-none"
                    aria-label="Delete quest"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Forge Quest Modal */}
      <CreateQuestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onQuestCreated={(newQuest) => {
          setQuests((prev) => [newQuest, ...prev]);
        }}
      />

      {/* Completion Overlay */}
      <QuestCompletionOverlay
        details={completionDetails}
        onDone={() => setCompletionDetails(null)}
      />

      {/* Level Up Modal */}
      {levelUpData && (
        <LevelUpModal
          isOpen={true}
          oldLevel={levelUpData.oldLevel}
          newLevel={levelUpData.newLevel}
          onClose={() => setLevelUpData(null)}
        />
      )}
    </AppShell>
  );
}
