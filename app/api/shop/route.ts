import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUsersCollection } from "@/lib/db/collections";
import { SHOP_CATALOG } from "@/lib/rpg/shopCatalog";
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

    const ownedItemIds = new Set((user.inventory || []).map((i: any) => i.itemId));

    const catalogWithOwnership = SHOP_CATALOG.map((item) => ({
      ...item,
      isOwned: ownedItemIds.has(item.id),
      isEquipped:
        user.equippedFrame === item.id ||
        user.equippedTheme === item.id ||
        user.equippedAura === item.id,
    }));

    return NextResponse.json({
      userGold: user.gold || 0,
      equippedTheme: user.equippedTheme || "default",
      equippedFrame: user.equippedFrame || "default",
      equippedAura: user.equippedAura || "",
      items: catalogWithOwnership,
    });
  } catch (error: any) {
    console.error("GET /api/shop error:", error);
    return NextResponse.json({ error: "Failed to fetch shop" }, { status: 500 });
  }
}
