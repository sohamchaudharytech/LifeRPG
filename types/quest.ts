export type QuestCategory =
  | "Study"
  | "Fitness"
  | "Coding"
  | "Health"
  | "Creativity"
  | "Personal"
  | "Other";

export type QuestDifficulty = "Easy" | "Medium" | "Hard" | "Epic";

export type QuestAttribute =
  | "Strength"
  | "Intellect"
  | "Discipline"
  | "Vitality"
  | "Creativity";

export interface Quest {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xpReward: number;
  goldReward: number;
  attribute: QuestAttribute;
  completed: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestCompletionResult {
  questId: string;
  xpEarned: number;
  goldEarned: number;
  attributeEarned: {
    attribute: QuestAttribute;
    points: number;
  };
  streakUpdated: boolean;
  currentStreak: number;
  levelUpOccurred: boolean;
  oldLevel: number;
  newLevel: number;
  newTotalXp: number;
  newCurrentXp: number;
  xpForNextLevel: number;
  newGold: number;
  attributes: Record<string, number>;
}
