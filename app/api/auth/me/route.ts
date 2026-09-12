import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUsersCollection } from "@/lib/db/collections";
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

    const safeUser = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      level: user.level,
      totalXp: user.totalXp,
      currentXp: user.currentXp,
      gold: user.gold,
      streak: user.streak,
      longestStreak: user.longestStreak,
      lastActivityDate: user.lastActivityDate,
      attributes: user.attributes,
      inventory: user.inventory || [],
      equippedTheme: user.equippedTheme || "default",
      equippedFrame: user.equippedFrame || "default",
      equippedAura: user.equippedAura,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({ user: safeUser });
  } catch (error: any) {
    console.error("Auth /me error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
