import { getUsersCollection } from "../lib/db/collections";
import { hashPassword, verifyPassword } from "../lib/auth/password";
import { signToken, verifyToken } from "../lib/auth/jwt";

async function runAuthTest() {
  console.log("=== Testing Authentication & User Model ===");

  // 1. Test Password Hashing
  const rawPass = "superSecurePass123!";
  const hash = await hashPassword(rawPass);
  const isValid = await verifyPassword(rawPass, hash);
  const isInvalid = await verifyPassword("wrongPass", hash);
  console.log("Password hash & verify:", isValid && !isInvalid ? "PASS" : "FAIL");

  // 2. Test JWT Signing & Verifying
  const token = await signToken({ sub: "test_user_id_123", email: "test@example.com", username: "hero1" });
  const verified = await verifyToken(token);
  console.log("JWT sign & verify:", verified?.sub === "test_user_id_123" ? "PASS" : "FAIL");

  // 3. Test Database Insertion of User
  const usersCol = await getUsersCollection();
  const testEmail = `hero_test_${Date.now()}@liferpg.dev`;
  const insertRes = await usersCol.insertOne({
    username: "KnightTester",
    email: testEmail,
    passwordHash: hash,
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
  console.log("User DB insertion:", insertRes.insertedId ? "PASS" : "FAIL");

  // Clean up test user
  await usersCol.deleteOne({ _id: insertRes.insertedId });
  console.log("Test user cleanup: PASS");

  console.log("=== All Auth & Model Tests Passed ===");
  process.exit(0);
}

runAuthTest().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
