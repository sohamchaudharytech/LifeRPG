import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUsersCollection } from "@/lib/db/collections";
import { getShopItemById } from "@/lib/rpg/shopCatalog";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await request.json();
    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
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

    // Default unequips
    if (itemId === "default-frame") {
      await usersCollection.updateOne({ _id: queryId }, { $set: { equippedFrame: "default" } });
      return NextResponse.json({ success: true, equippedFrame: "default" });
    }
    if (itemId === "default-theme") {
      await usersCollection.updateOne({ _id: queryId }, { $set: { equippedTheme: "default" } });
      return NextResponse.json({ success: true, equippedTheme: "default" });
    }
    if (itemId === "default-aura") {
      await usersCollection.updateOne({ _id: queryId }, { $set: { equippedAura: "" } });
      return NextResponse.json({ success: true, equippedAura: "" });
    }

    const catalogItem = getShopItemById(itemId);
    if (!catalogItem) {
      return NextResponse.json({ error: "Unknown item" }, { status: 404 });
    }

    // Verify ownership in user.inventory
    const isOwned = (user.inventory || []).some((inv: any) => inv.itemId === itemId);
    if (!isOwned) {
      return NextResponse.json({ error: "You do not own this item" }, { status: 403 });
    }

    const updateField: any = {};
    if (catalogItem.type === "frame") {
      updateField.equippedFrame = itemId;
    } else if (catalogItem.type === "theme") {
      updateField.equippedTheme = itemId;
    } else if (catalogItem.type === "aura") {
      updateField.equippedAura = itemId;
    }

    await usersCollection.updateOne({ _id: queryId }, { $set: updateField });

    return NextResponse.json({ success: true, equipped: updateField });
  } catch (error: any) {
    console.error("POST /api/character/equip error:", error);
    return NextResponse.json({ error: "Failed to equip item" }, { status: 500 });
  }
}
