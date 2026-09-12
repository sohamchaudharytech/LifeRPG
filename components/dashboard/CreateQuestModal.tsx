"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { calculateQuestReward } from "@/lib/rpg/engine";
import { QuestDifficulty, QuestCategory, QuestAttribute } from "@/types/quest";
import { Sparkles, Coins, Zap } from "lucide-react";

interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestCreated: (newQuest: any) => void;
}

const CATEGORIES: QuestCategory[] = [
  "Study",
  "Fitness",
  "Coding",
  "Health",
  "Creativity",
  "Personal",
  "Other",
];

const DIFFICULTIES: QuestDifficulty[] = ["Easy", "Medium", "Hard", "Epic"];

const ATTRIBUTES: QuestAttribute[] = [
  "Strength",
  "Intellect",
  "Discipline",
  "Vitality",
  "Creativity",
];

export function CreateQuestModal({
  isOpen,
  onClose,
  onQuestCreated,
}: CreateQuestModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<QuestCategory>("Coding");
  const [difficulty, setDifficulty] = useState<QuestDifficulty>("Medium");
  const [attribute, setAttribute] = useState<QuestAttribute>("Intellect");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rewards = calculateQuestReward(difficulty);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          difficulty,
          attribute,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to forge quest");
      }

      onQuestCreated(data.task);
      setTitle("");
      setDescription("");
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="FORGE NEW QUEST"
      description="Design a real-world task. Completing it will empower your digital hero."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label
            htmlFor="quest-title"
            className="block text-xs font-mono uppercase text-slate-300 mb-1.5"
          >
            Quest Objective (Title) *
          </label>
          <input
            id="quest-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Code 45 minutes of Next.js architecture"
            className="w-full px-4 py-2.5 rounded-xl bg-surface border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="quest-desc"
            className="block text-xs font-mono uppercase text-slate-300 mb-1.5"
          >
            Tactical Briefing (Description)
          </label>
          <textarea
            id="quest-desc"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key milestones or conditions for quest completion..."
            className="w-full px-4 py-2 rounded-xl bg-surface border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans resize-none"
          />
        </div>

        {/* Category & Attribute */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="quest-category"
              className="block text-xs font-mono uppercase text-slate-300 mb-1.5"
            >
              Category
            </label>
            <select
              id="quest-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as QuestCategory)}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 font-sans"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-surface-elevated text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="quest-attribute"
              className="block text-xs font-mono uppercase text-slate-300 mb-1.5"
            >
              Target Attribute
            </label>
            <select
              id="quest-attribute"
              value={attribute}
              onChange={(e) => setAttribute(e.target.value as QuestAttribute)}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 font-sans"
            >
              {ATTRIBUTES.map((a) => (
                <option key={a} value={a} className="bg-surface-elevated text-white">
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
            Difficulty Tier
          </label>
          <div className="grid grid-cols-4 gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
                  difficulty === d
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                    : "bg-surface border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Reward Preview */}
        <div className="p-3.5 rounded-2xl bg-surface border border-white/10 flex items-center justify-around font-mono text-xs">
          <div className="flex items-center gap-1.5 text-violet-300">
            <Zap className="w-4 h-4 text-violet-400" />
            <span>+{rewards.xp} XP</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-300">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>+{rewards.gold} GOLD</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>+{rewards.attributePoints} {attribute.toUpperCase()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="secondary" isLoading={isSubmitting}>
            FORGE QUEST
          </Button>
        </div>
      </form>
    </Modal>
  );
}
