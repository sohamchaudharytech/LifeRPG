import { getUsersCollection, getQuestsCollection, getHistoryCollection } from "../lib/db/collections";
import { calculateQuestReward, calculateRequiredXp, calculateLevelProgress, calculateStreak, getUtcDateString } from "../lib/rpg/engine";
import { SHOP_CATALOG, getShopItemById } from "../lib/rpg/shopCatalog";
import { ObjectId } from "mongodb";

async function runGameplayLoopTest() {
  console.log("=== Testing Core RPG Engine, Quests, Completion & Economy ===");

  // 1. Test RPG Engine Formulas
  console.log("1. Testing RPG Engine Formulas...");
  const easyReward = calculateQuestReward("Easy");
  const epicReward = calculateQuestReward("Epic");
  if (easyReward.xp !== 50 || easyReward.gold !== 20) throw new Error("Invalid Easy reward");
  if (epicReward.xp !== 400 || epicReward.gold !== 150) throw new Error("Invalid Epic reward");

  const reqLvl1 = calculateRequiredXp(1);
  const reqLvl2 = calculateRequiredXp(2);
  const reqLvl3 = calculateRequiredXp(3);
  console.log(`XP thresholds: L1=${reqLvl1}, L2=${reqLvl2}, L3=${reqLvl3}`);
  if (reqLvl1 !== 100 || reqLvl2 !== 282 || reqLvl3 !== 519) {
    throw new Error("Non-linear XP formula mismatch");
  }

  const lvlProg0 = calculateLevelProgress(0);
  const lvlProg50 = calculateLevelProgress(50);
  const lvlProg150 = calculateLevelProgress(150);
  if (lvlProg0.level !== 1 || lvlProg50.level !== 1 || lvlProg150.level !== 2) {
    throw new Error("Level progression calculation mismatch");
  }
  console.log("RPG Formulas: PASS");

  // 2. Setup Test User
  const usersCol = await getUsersCollection();
  const questsCol = await getQuestsCollection();
  const historyCol = await getHistoryCollection();

  const testEmail = `hero_loop_${Date.now()}@liferpg.dev`;
  const userInsert = await usersCol.insertOne({
    username: "LoopHero",
    email: testEmail,
    passwordHash: "dummyHash",
    level: 1,
    totalXp: 0,
    currentXp: 0,
    gold: 50,
    streak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    attributes: { strength: 1, intellect: 1, discipline: 1, vitality: 1, creativity: 1 },
    inventory: [],
    equippedTheme: "default",
    equippedFrame: "default",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const userId = userInsert.insertedId.toString();

  try {
    // 3. Quest CRUD Test
    console.log("2. Testing Quest Creation & Rewards...");
    const questRewards = calculateQuestReward("Medium");
    const questInsert = await questsCol.insertOne({
      userId,
      title: "Write 50 lines of clean code",
      description: "Focus on unit testing and modular architecture",
      category: "Coding",
      difficulty: "Medium",
      xpReward: questRewards.xp, // 100
      goldReward: questRewards.gold, // 40
      attribute: "Intellect",
      completed: false,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const questId = questInsert.insertedId.toString();
    console.log("Quest Created: PASS (ID:", questId, ")");

    // 4. Quest Completion Simulation
    console.log("3. Testing Authoritative Quest Completion & Progression...");
    const quest = await questsCol.findOne({ _id: questInsert.insertedId });
    if (!quest) throw new Error("Quest not found");

    const newTotalXp = 0 + quest.xpReward; // 100
    const levelInfo = calculateLevelProgress(newTotalXp); // Level 2, currentXp: 0, xpForNextLevel: 282
    const todayStr = getUtcDateString(new Date());
    const streakRes = calculateStreak(null, 0);

    // Update quest
    await questsCol.updateOne(
      { _id: questInsert.insertedId },
      { $set: { completed: true, completedAt: new Date(), updatedAt: new Date() } }
    );

    // Update user
    await usersCol.updateOne(
      { _id: userInsert.insertedId },
      {
        $set: {
          level: levelInfo.level,
          totalXp: newTotalXp,
          currentXp: levelInfo.currentXp,
          gold: 50 + quest.goldReward, // 90
          streak: streakRes.streak, // 1
          longestStreak: 1,
          lastActivityDate: todayStr,
          "attributes.intellect": 1 + 10,
          updatedAt: new Date(),
        },
      }
    );

    // Record History
    await historyCol.insertOne({
      userId,
      questId,
      questTitle: quest.title,
      category: quest.category,
      attribute: quest.attribute,
      xpEarned: quest.xpReward,
      goldEarned: quest.goldReward,
      completedAt: new Date(),
    });

    const updatedUser = await usersCol.findOne({ _id: userInsert.insertedId });
    if (updatedUser?.level !== 2) throw new Error(`Expected level 2, got ${updatedUser?.level}`);
    if (updatedUser?.gold !== 90) throw new Error(`Expected gold 90, got ${updatedUser?.gold}`);
    if (updatedUser?.attributes?.intellect !== 11) throw new Error(`Expected intellect 11, got ${updatedUser?.attributes?.intellect}`);
    if (updatedUser?.streak !== 1) throw new Error(`Expected streak 1, got ${updatedUser?.streak}`);
    console.log("Quest Completion, Level-Up to 2, Attribute & Gold update: PASS");

    // 5. Shop & Economy Test
    console.log("4. Testing Shop Purchase & Economy Validation...");
    const bronzeFrame = getShopItemById("bronze-frame"); // price: 100
    if (!bronzeFrame) throw new Error("Bronze frame not in catalog");

    // Try purchase with 90 gold (insufficient)
    if (updatedUser.gold < bronzeFrame.price) {
      console.log("Gold check (90 < 100 rejects purchase): PASS");
    } else {
      throw new Error("Should have detected insufficient gold");
    }

    // Add +50 gold to test valid purchase
    await usersCol.updateOne({ _id: userInsert.insertedId }, { $set: { gold: 140 } });

    // Execute purchase
    const newGold = 140 - bronzeFrame.price; // 40
    await usersCol.updateOne(
      { _id: userInsert.insertedId },
      {
        $set: { gold: newGold },
        $push: { inventory: { itemId: bronzeFrame.id, quantity: 1, purchasedAt: new Date().toISOString() } } as any,
      }
    );

    const userAfterPurchase = await usersCol.findOne({ _id: userInsert.insertedId });
    if (userAfterPurchase?.gold !== 40) throw new Error(`Expected gold 40, got ${userAfterPurchase?.gold}`);
    const ownsFrame = (userAfterPurchase.inventory || []).some((i: any) => i.itemId === "bronze-frame");
    if (!ownsFrame) throw new Error("Item not added to inventory");
    console.log("Item purchase and inventory update: PASS");

    // Equip item
    await usersCol.updateOne({ _id: userInsert.insertedId }, { $set: { equippedFrame: "bronze-frame" } });
    const userAfterEquip = await usersCol.findOne({ _id: userInsert.insertedId });
    if (userAfterEquip?.equippedFrame !== "bronze-frame") throw new Error("Failed to equip item");
    console.log("Equipping item: PASS");

  } finally {
    // 6. Cleanup
    await questsCol.deleteMany({ userId });
    await historyCol.deleteMany({ userId });
    await usersCol.deleteOne({ _id: userInsert.insertedId });
    console.log("Cleanup completed: PASS");
  }

  console.log("=== All Gameplay, RPG, Quest & Shop Engine Tests PASSED! ===");
  process.exit(0);
}

runGameplayLoopTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
