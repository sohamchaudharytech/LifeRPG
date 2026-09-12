import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getQuestsCollection } from "@/lib/db/collections";
import { createQuestSchema } from "@/lib/validation/quest";
import { calculateQuestReward } from "@/lib/rpg/engine";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active"; // "active", "completed", "all"
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");

    const query: any = { userId: session.sub };

    if (status === "active") {
      query.completed = false;
    } else if (status === "completed") {
      query.completed = true;
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (difficulty && difficulty !== "All") {
      query.difficulty = difficulty;
    }

    const questsCollection = await getQuestsCollection();
    const quests = await questsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const formattedQuests = quests.map((q) => ({
      _id: q._id.toString(),
      userId: q.userId,
      title: q.title,
      description: q.description || "",
      category: q.category,
      difficulty: q.difficulty,
      xpReward: q.xpReward,
      goldReward: q.goldReward,
      attribute: q.attribute,
      completed: Boolean(q.completed),
      completedAt: q.completedAt,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
    }));

    return NextResponse.json({ tasks: formattedQuests });
  } catch (error: any) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to fetch quests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = createQuestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { title, description, category, difficulty, attribute } = parseResult.data;

    // Backend-authoritative reward calculation (anti-cheat!)
    const rewards = calculateQuestReward(difficulty);
    const now = new Date();

    const newQuestDoc = {
      userId: session.sub,
      title: title.trim(),
      description: description?.trim() || "",
      category,
      difficulty,
      xpReward: rewards.xp,
      goldReward: rewards.gold,
      attribute,
      completed: false,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    const questsCollection = await getQuestsCollection();
    const result = await questsCollection.insertOne(newQuestDoc);

    const createdQuest = {
      _id: result.insertedId.toString(),
      ...newQuestDoc,
    };

    return NextResponse.json({ success: true, task: createdQuest }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to create quest" }, { status: 500 });
  }
}
