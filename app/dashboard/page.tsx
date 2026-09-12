"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CharacterHeader } from "@/components/dashboard/CharacterHeader";
import { AttributeGrid } from "@/components/dashboard/AttributeGrid";
import { ActiveQuests } from "@/components/dashboard/ActiveQuests";
import { CreateQuestModal } from "@/components/dashboard/CreateQuestModal";
import { QuestCompletionOverlay, QuestCompletionDetails } from "@/components/effects/QuestCompletionOverlay";
import { LevelUpModal } from "@/components/effects/LevelUpModal";
import { SafeUser } from "@/types/user";
import { Quest } from "@/types/quest";

export default function DashboardPage() {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Animations & Modals
  const [completionDetails, setCompletionDetails] = useState<QuestCompletionDetails | null>(null);
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: number; newLevel: number } | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [userRes, questsRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/tasks?status=active"),
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }
      if (questsRes.ok) {
        const questsData = await questsRes.json();
        setQuests(questsData.tasks || []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCompleteQuest = async (questId: string) => {
    try {
      const res = await fetch(`/api/tasks/${questId}/complete`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to complete quest");
      }

      // Update User State
      if (data.character) {
        setUser(data.character);
      }

      // Trigger Celebration Overlay
      setCompletionDetails({
        xp: data.rewards.xp,
        gold: data.rewards.gold,
        attribute: data.rewards.attribute,
        attributePoints: data.rewards.attributePoints,
      });

      // Check for Level Up!
      if (data.levelUpOccurred) {
        setTimeout(() => {
          setLevelUpData({
            oldLevel: data.oldLevel,
            newLevel: data.newLevel,
          });
        }, 1200);
      }

      return data;
    } catch (err) {
      console.error("Error completing quest:", err);
      throw err;
    }
  };

  const handleQuestCreated = (newQuest: Quest) => {
    setQuests((prev) => [newQuest, ...prev]);
  };

  if (isLoading || !user) {
    return (
      <AppShell initialUser={user}>
        {/* Loading Skeleton */}
        <div className="space-y-6 animate-pulse" aria-label="Loading dashboard">
          <div className="h-44 rounded-3xl bg-surface-elevated/60 border border-white/5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-surface/60 border border-white/5" />
            ))}
          </div>
          <div className="h-64 rounded-3xl bg-surface/60 border border-white/5" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell initialUser={user}>
      {/* 1. Character Header with Non-Linear XP & Stats */}
      <CharacterHeader user={user} />

      {/* 2. Attributes Grid (STR, INT, DIS, VIT, CRE) */}
      <AttributeGrid attributes={user.attributes} />

      {/* 3. Active Quest Board */}
      <ActiveQuests
        initialQuests={quests}
        onCompleteQuest={handleCompleteQuest}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* 4. Modal: Forge New Quest */}
      <CreateQuestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onQuestCreated={handleQuestCreated}
      />

      {/* 5. Signature Animations: Floating Rewards & Particle Celebration */}
      <QuestCompletionOverlay
        details={completionDetails}
        onDone={() => setCompletionDetails(null)}
      />

      {/* 6. Level Up Celebration Overlay */}
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
