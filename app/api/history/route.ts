import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getHistoryCollection } from "@/lib/db/collections";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const historyCollection = await getHistoryCollection();
    const records = await historyCollection
      .find({ userId: session.sub })
      .sort({ completedAt: -1 })
      .limit(50)
      .toArray();

    const formatted = records.map((r: any) => ({
      _id: r._id.toString(),
      questId: r.questId,
      questTitle: r.questTitle,
      category: r.category,
      attribute: r.attribute,
      xpEarned: r.xpEarned,
      goldEarned: r.goldEarned,
      completedAt: r.completedAt,
    }));

    return NextResponse.json({ history: formatted });
  } catch (error: any) {
    console.error("GET /api/history error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
