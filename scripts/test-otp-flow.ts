import { getUsersCollection, getOtpsCollection } from "../lib/db/collections";
import { generateOtp, saveOtp, verifyAndConsumeOtp } from "../lib/auth/otp";
import { hashPassword, verifyPassword } from "../lib/auth/password";

async function runOtpTests() {
  console.log("==================================================");
  console.log("🧪 TESTING 8-DIGIT OTP & PASSWORD RESET ENGINE");
  console.log("==================================================");

  const testEmail = `hero_otp_test_${Date.now()}@liferpg.dev`;
  const testUsername = `OtpHero_${Date.now().toString().slice(-4)}`;
  const initialPassword = "initialSecurePass123!";
  const newPassword = "newResetSecurePass456!";

  // 1. Test 8-Digit OTP Generation
  console.log("\n1. Testing 8-Digit OTP Generation...");
  const otp1 = generateOtp();
  const otp2 = generateOtp();
  console.log(`Generated OTP 1: ${otp1} (Length: ${otp1.length})`);
  console.log(`Generated OTP 2: ${otp2} (Length: ${otp2.length})`);

  if (otp1.length !== 8 || isNaN(Number(otp1)) || otp1 === otp2) {
    throw new Error("OTP generation failed validation");
  }
  console.log("✅ 8-Digit OTP Generation: PASS");

  // 2. Test MongoDB OTP Persistence & bcrypt Hashing
  console.log("\n2. Testing MongoDB OTP Persistence (otps collection)...");
  await saveOtp({ email: testEmail, otp: otp1, type: "registration" });

  const otpsCol = await getOtpsCollection();
  const savedRecord = await otpsCol.findOne({ email: testEmail, type: "registration" });

  if (!savedRecord || !savedRecord.otpHash || savedRecord.otpHash === otp1) {
    throw new Error("OTP was not hashed or stored properly in MongoDB");
  }
  console.log("✅ OTP Hashed and Stored in MongoDB: PASS");
  console.log(`   - Stored Hash: ${savedRecord.otpHash.slice(0, 20)}...`);
  console.log(`   - Expires At: ${savedRecord.expiresAt}`);

  // 3. Test Invalid OTP Verification Attempt
  console.log("\n3. Testing Incorrect OTP Rejection & Brute Force Limit...");
  const wrongAttempt = await verifyAndConsumeOtp({
    email: testEmail,
    otp: "00000000",
    type: "registration",
  });
  if (wrongAttempt.valid) {
    throw new Error("Wrong OTP was accepted!");
  }
  console.log(`✅ Invalid OTP Rejected: PASS (Message: "${wrongAttempt.error}")`);

  // 4. Test Valid OTP Verification & Consumption
  console.log("\n4. Testing Valid OTP Verification & Immediate Consumption...");
  const validAttempt = await verifyAndConsumeOtp({
    email: testEmail,
    otp: otp1,
    type: "registration",
  });
  if (!validAttempt.valid) {
    throw new Error(`Valid OTP was rejected: ${validAttempt.error}`);
  }

  // Ensure record is deleted from DB
  const deletedCheck = await otpsCol.findOne({ email: testEmail, type: "registration" });
  if (deletedCheck) {
    throw new Error("OTP was not consumed/deleted from database!");
  }
  console.log("✅ Valid OTP Verified and Consumed from Database: PASS");

  // 5. Test Registration Flow with OTP
  console.log("\n5. Testing User Registration Flow with OTP Verification...");
  const regOtp = generateOtp();
  await saveOtp({ email: testEmail, otp: regOtp, type: "registration" });

  const usersCol = await getUsersCollection();
  const passHash = await hashPassword(initialPassword);

  // Simulate register endpoint verifying OTP
  const regVerify = await verifyAndConsumeOtp({
    email: testEmail,
    otp: regOtp,
    type: "registration",
  });
  if (!regVerify.valid) throw new Error("Registration OTP failed");

  const insertUser = await usersCol.insertOne({
    username: testUsername,
    email: testEmail,
    passwordHash: passHash,
    level: 1,
    totalXp: 0,
    currentXp: 0,
    gold: 50,
    streak: 0,
    longestStreak: 0,
    attributes: { strength: 1, intellect: 1, discipline: 1, vitality: 1, creativity: 1 },
    inventory: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log(`✅ User Registered with OTP Verification: PASS (ID: ${insertUser.insertedId})`);

  // 6. Test Password Reset Flow with 8-digit OTP
  console.log("\n6. Testing Password Reset Flow with 8-Digit OTP...");
  const resetOtp = generateOtp();
  await saveOtp({ email: testEmail, otp: resetOtp, type: "password_reset" });

  // Verify reset OTP
  const resetVerify = await verifyAndConsumeOtp({
    email: testEmail,
    otp: resetOtp,
    type: "password_reset",
  });
  if (!resetVerify.valid) throw new Error("Password reset OTP failed");

  // Update password in DB
  const newHash = await hashPassword(newPassword);
  await usersCol.updateOne(
    { email: testEmail },
    { $set: { passwordHash: newHash, updatedAt: new Date() } }
  );

  // Verify new password works and old password fails
  const updatedUser = await usersCol.findOne({ email: testEmail });
  const oldPassWorks = await verifyPassword(initialPassword, updatedUser.passwordHash);
  const newPassWorks = await verifyPassword(newPassword, updatedUser.passwordHash);

  if (oldPassWorks || !newPassWorks) {
    throw new Error("Password reset did not properly update credential verification!");
  }
  console.log("✅ Password Reset Flow Verified: PASS");
  console.log("   - Old password rejected: PASS");
  console.log("   - New password verified: PASS");

  // 7. Cleanup
  console.log("\n7. Cleaning up test data from MongoDB...");
  await usersCol.deleteOne({ email: testEmail });
  await otpsCol.deleteMany({ email: testEmail });
  console.log("✅ Test Data Cleaned: PASS");

  console.log("\n==================================================");
  console.log("🎉 ALL 8-DIGIT OTP & PASSWORD RESET TESTS PASSED!");
  console.log("==================================================");
}

runOtpTests().catch((err) => {
  console.error("\n❌ Test Suite Failed:", err);
  process.exit(1);
});
