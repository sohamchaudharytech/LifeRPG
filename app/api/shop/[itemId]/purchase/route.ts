import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUsersCollection } from "@/lib/db/collections";
import { getShopItemById } from "@/lib/rpg/shopCatalog";
import { ObjectId } from "mongodb";

export async function POST(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getSession();
    if (!session || !session.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = params;
    const item = getShopItemById(itemId);

    if (!item) {
      return NextResponse.json({ error: "Item not found in catalog" }, { status: 404 });
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

    // Check if item already owned
    const inventory = user.inventory || [];
    const alreadyOwned = inventory.some((inv: any) => inv.itemId === itemId);

    if (alreadyOwned) {
      return NextResponse.json(
        { error: "You already own this item." },
        { status: 400 }
      );
    }

    // Check gold balance
    const currentGold = user.gold || 0;
    if (currentGold < item.price) {
      return NextResponse.json(
        { error: `Insufficient gold. You have ${currentGold} Gold, but this item costs ${item.price} Gold.` },
        { status: 400 }
      );
    }

    const newGold = currentGold - item.price;
    const newInventoryItem = {
      itemId: item.id,
      quantity: 1,
      purchasedAt: new Date().toISOString(),
    };
    const updatedInventory = [...inventory, newInventoryItem];

    await usersCollection.updateOne(
      { _id: queryId },
      {
        $set: {
          gold: newGold,
          inventory: updatedInventory,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully purchased ${item.name}!`,
      newGold,
      inventory: updatedInventory,
      item,
    });
  } catch (error: any) {
    console.error("POST /api/shop/[itemId]/purchase error:", error);
    return NextResponse.json(
      { error: "Failed to process purchase. Your gold is safe — please try again." },
      { status: 500 }
    );
  }
}
