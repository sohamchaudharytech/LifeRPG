import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUsersCollection } from "@/lib/db/collections";
import { calculateLevelProgress } from "@/lib/rpg/engine";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usersCollection = await getUsersCollection();
    let queryId: any;
    try {
      queryId = new ObjectId(session.sub);
    } catch {
      queryId = session.sub;
    }

    const user = await usersCollection.findOne({ _id: queryId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const levelInfo = calculateLevelProgress(user.totalXp || 0);

    const attributes = {
      strength: 1,
      intellect: 1,
      discipline: 1,
      vitality: 1,
      creativity: 1,
      ...(user.attributes || {}),
    };

    // Calculate badges based on real stats
    const badges = [
      {
        id: "first-step",
        name: "First Step",
        description: "Began the journey of leveling up real life",
        icon: "Footprints",
        unlocked: (user.totalXp || 0) > 0,
      },
      {
        id: "discipline-novice",
        name: "Steadfast Will",
        description: "Maintained a streak of 3+ consecutive days",
        icon: "Flame",
        unlocked: (user.streak || 0) >= 3,
      },
      {
        id: "scholar",
        name: "Grand Polymath",
        description: "Attained 25+ Intellect attribute points",
        icon: "Brain",
        unlocked: attributes.intellect >= 25,
      },
      {
        id: "titan",
        name: "Iron Physique",
        description: "Attained 25+ Strength attribute points",
        icon: "Dumbbell",
        unlocked: attributes.strength >= 25,
      },
      {
        id: "wealthy",
        name: "Treasury Keeper",
        description: "Accumulated 250+ Gold",
        icon: "Coins",
        unlocked: (user.gold || 0) >= 250,
      },
      {
        id: "veteran",
        name: "Ascended Hero",
        description: "Reached character level 5 or higher",
        icon: "Crown",
        unlocked: levelInfo.level >= 5,
      },
    ];

    const safeCharacter = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      level: levelInfo.level,
      totalXp: user.totalXp || 0,
      currentXp: levelInfo.currentXp,
      xpForNextLevel: levelInfo.xpForNextLevel,
      progressPercentage: levelInfo.progressPercentage,
      gold: user.gold || 0,
      streak: user.streak || 0,
      longestStreak: user.longestStreak || 0,
      lastActivityDate: user.lastActivityDate,
      attributes,
      inventory: user.inventory || [],
      equippedTheme: user.equippedTheme || "default",
      equippedFrame: user.equippedFrame || "default",
      equippedAura: user.equippedAura,
      badges,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({ character: safeCharacter });
  } catch (error: any) {
    console.error("GET /api/character error:", error);
    return NextResponse.json({ error: "Failed to fetch character details" }, { status: 500 });
  }
}
