import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getQuestsCollection, getUsersCollection, getHistoryCollection } from "@/lib/db/collections";
import {
  calculateLevelProgress,
  calculateStreak,
  getUtcDateString,
} from "@/lib/rpg/engine";
import { ObjectId } from "mongodb";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || !session.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questId = params.id;
    let queryId: any;
    try {
      queryId = new ObjectId(questId);
    } catch {
      return NextResponse.json({ error: "Invalid quest ID" }, { status: 400 });
    }

    const questsCollection = await getQuestsCollection();
    const quest = await questsCollection.findOne({
      _id: queryId,
      userId: session.sub,
    });

    if (!quest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    if (quest.completed) {
      return NextResponse.json(
        { error: "Quest has already been completed" },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();
    let userQueryId: any;
    try {
      userQueryId = new ObjectId(session.sub);
    } catch {
      userQueryId = session.sub;
    }

    const user = await usersCollection.findOne({ _id: userQueryId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // RPG Calculations
    const xpReward = Number(quest.xpReward) || 50;
    const goldReward = Number(quest.goldReward) || 20;
    
    // Determine attribute points gained
    let attributePoints = 5;
    if (quest.difficulty === "Medium") attributePoints = 10;
    else if (quest.difficulty === "Hard") attributePoints = 20;
    else if (quest.difficulty === "Epic") attributePoints = 35;

    const attributeKey = (quest.attribute || "discipline").toLowerCase();

    const currentAttributes = {
      strength: 1,
      intellect: 1,
      discipline: 1,
      vitality: 1,
      creativity: 1,
      ...(user.attributes || {}),
    };

    if (currentAttributes[attributeKey] !== undefined) {
      currentAttributes[attributeKey] += attributePoints;
    } else {
      currentAttributes[attributeKey] = 1 + attributePoints;
    }

    const oldLevel = user.level || 1;
    const newTotalXp = (user.totalXp || 0) + xpReward;
    const levelInfo = calculateLevelProgress(newTotalXp);
    const newLevel = levelInfo.level;
    const levelUpOccurred = newLevel > oldLevel;

    const now = new Date();
    const todayStr = getUtcDateString(now);
    const streakResult = calculateStreak(user.lastActivityDate || null, user.streak || 0, now);
    const newStreak = streakResult.streak;
    const longestStreak = Math.max(user.longestStreak || 0, newStreak);
    const newGold = (user.gold || 0) + goldReward;

    // 1. Mark quest completed
    await questsCollection.updateOne(
      { _id: queryId, userId: session.sub },
      {
        $set: {
          completed: true,
          completedAt: now,
          updatedAt: now,
        },
      }
    );

    // 2. Update user state
    await usersCollection.updateOne(
      { _id: userQueryId },
      {
        $set: {
          level: newLevel,
          totalXp: newTotalXp,
          currentXp: levelInfo.currentXp,
          gold: newGold,
          streak: newStreak,
          longestStreak: longestStreak,
          lastActivityDate: todayStr,
          attributes: currentAttributes,
          updatedAt: now,
        },
      }
    );

    // 3. Insert history record
    const historyCollection = await getHistoryCollection();
    await historyCollection.insertOne({
      userId: session.sub,
      questId: questId,
      questTitle: quest.title,
      category: quest.category,
      attribute: quest.attribute,
      xpEarned: xpReward,
      goldEarned: goldReward,
      completedAt: now,
    });

    const updatedSafeUser = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      level: newLevel,
      totalXp: newTotalXp,
      currentXp: levelInfo.currentXp,
      xpForNextLevel: levelInfo.xpForNextLevel,
      progressPercentage: levelInfo.progressPercentage,
      gold: newGold,
      streak: newStreak,
      longestStreak: longestStreak,
      lastActivityDate: todayStr,
      attributes: currentAttributes,
      inventory: user.inventory || [],
      equippedTheme: user.equippedTheme || "default",
      equippedFrame: user.equippedFrame || "default",
      equippedAura: user.equippedAura,
      createdAt: user.createdAt,
      updatedAt: now,
    };

    return NextResponse.json({
      success: true,
      questId,
      rewards: {
        xp: xpReward,
        gold: goldReward,
        attribute: quest.attribute,
        attributePoints,
      },
      levelUpOccurred,
      oldLevel,
      newLevel,
      streakUpdated: streakResult.streakUpdated,
      character: updatedSafeUser,
    });
  } catch (error: any) {
    console.error("POST /api/tasks/[id]/complete error:", error);
    return NextResponse.json(
      { error: "Failed to complete quest. Your progress is safe — please try again." },
      { status: 500 }
    );
  }
}
