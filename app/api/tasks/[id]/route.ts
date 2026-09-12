import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getQuestsCollection } from "@/lib/db/collections";
import { updateQuestSchema } from "@/lib/validation/quest";
import { calculateQuestReward } from "@/lib/rpg/engine";
import { ObjectId } from "mongodb";

export async function PATCH(
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
    const existing = await questsCollection.findOne({
      _id: queryId,
      userId: session.sub,
    });

    if (!existing) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    if (existing.completed) {
      return NextResponse.json(
        { error: "Cannot modify an already completed quest" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parseResult = updateQuestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const updates: any = { updatedAt: new Date() };
    const { title, description, category, difficulty, attribute } = parseResult.data;

    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (category !== undefined) updates.category = category;
    if (attribute !== undefined) updates.attribute = attribute;

    if (difficulty !== undefined) {
      updates.difficulty = difficulty;
      const rewards = calculateQuestReward(difficulty);
      updates.xpReward = rewards.xp;
      updates.goldReward = rewards.gold;
    }

    await questsCollection.updateOne(
      { _id: queryId, userId: session.sub },
      { $set: updates }
    );

    const updated = await questsCollection.findOne({ _id: queryId });

    return NextResponse.json({
      success: true,
      task: {
        _id: updated!._id.toString(),
        userId: updated!.userId,
        title: updated!.title,
        description: updated!.description,
        category: updated!.category,
        difficulty: updated!.difficulty,
        xpReward: updated!.xpReward,
        goldReward: updated!.goldReward,
        attribute: updated!.attribute,
        completed: updated!.completed,
        completedAt: updated!.completedAt,
        createdAt: updated!.createdAt,
        updatedAt: updated!.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("PATCH /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Failed to update quest" }, { status: 500 });
  }
}

export async function DELETE(
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
    const result = await questsCollection.deleteOne({
      _id: queryId,
      userId: session.sub,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Quest deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete quest" }, { status: 500 });
  }
}
