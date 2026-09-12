import { QuestDifficulty, QuestAttribute } from "@/types/quest";

export interface QuestRewards {
  xp: number;
  gold: number;
  attributePoints: number;
}

export interface LevelInfo {
  level: number;
  currentXp: number;
  xpForNextLevel: number;
  progressPercentage: number;
}

/**
 * Calculates XP, Gold, and Attribute points for a quest difficulty
 */
export function calculateQuestReward(difficulty: QuestDifficulty): QuestRewards {
  switch (difficulty) {
    case "Easy":
      return { xp: 50, gold: 20, attributePoints: 5 };
    case "Medium":
      return { xp: 100, gold: 40, attributePoints: 10 };
    case "Hard":
      return { xp: 200, gold: 80, attributePoints: 20 };
    case "Epic":
      return { xp: 400, gold: 150, attributePoints: 35 };
    default:
      return { xp: 50, gold: 20, attributePoints: 5 };
  }
}

/**
 * Non-linear XP requirement for a given level
 * Formula: Math.floor(100 * Math.pow(level, 1.5))
 */
export function calculateRequiredXp(level: number): number {
  if (level < 1) return 100;
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculates user's level, current XP into level, and XP needed for next level
 * from total cumulative XP.
 */
export function calculateLevelProgress(totalXp: number): LevelInfo {
  let level = 1;
  let remainingXp = Math.max(0, totalXp);

  while (true) {
    const xpNeeded = calculateRequiredXp(level);
    if (remainingXp < xpNeeded) {
      const progressPercentage = Math.min(100, Math.round((remainingXp / xpNeeded) * 100));
      return {
        level,
        currentXp: remainingXp,
        xpForNextLevel: xpNeeded,
        progressPercentage,
      };
    }
    remainingXp -= xpNeeded;
    level += 1;
  }
}

/**
 * Normalizes a date into YYYY-MM-DD UTC string for consistent calendar comparison
 */
export function getUtcDateString(date: Date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Calculates updated streak given the user's last activity date string (YYYY-MM-DD)
 * and their current streak counter.
 */
export function calculateStreak(
  lastActivityDate: string | null,
  currentStreak: number,
  now: Date = new Date()
): { streak: number; streakUpdated: boolean } {
  const todayStr = getUtcDateString(now);

  if (!lastActivityDate) {
    return { streak: 1, streakUpdated: true };
  }

  if (lastActivityDate === todayStr) {
    // Activity already performed today; maintain streak
    return { streak: Math.max(1, currentStreak), streakUpdated: false };
  }

  // Calculate day difference between today and lastActivityDate in UTC
  const [lastYear, lastMonth, lastDay] = lastActivityDate.split("-").map(Number);
  const lastDateUtc = Date.UTC(lastYear, lastMonth - 1, lastDay);
  const [todayYear, todayMonth, todayDay] = todayStr.split("-").map(Number);
  const todayUtc = Date.UTC(todayYear, todayMonth - 1, todayDay);

  const diffDays = Math.round((todayUtc - lastDateUtc) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day
    return { streak: currentStreak + 1, streakUpdated: true };
  }

  // Missed a day or more -> reset to 1
  return { streak: 1, streakUpdated: true };
}
