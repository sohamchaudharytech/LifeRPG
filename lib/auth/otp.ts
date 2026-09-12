import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getOtpsCollection } from "@/lib/db/collections";

const OTP_EXPIRY_MINUTES = 10;
const MAX_VERIFICATION_ATTEMPTS = 5;

/**
 * Generate a cryptographically secure 8-digit OTP string (10000000 to 99999999).
 */
export function generateOtp(): string {
  return crypto.randomInt(10000000, 100000000).toString();
}

/**
 * Save an 8-digit OTP to the MongoDB collection with expiration and bcrypt hashing.
 */
export async function saveOtp({
  email,
  otp,
  type,
}: {
  email: string;
  otp: string;
  type: "registration" | "password_reset";
}): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  const otpsCollection = await getOtpsCollection();

  // Remove any previous active OTPs for this email and purpose
  await otpsCollection.deleteMany({ email: normalizedEmail, type });

  const salt = await bcrypt.genSalt(10);
  const otpHash = await bcrypt.hash(otp, salt);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await otpsCollection.insertOne({
    email: normalizedEmail,
    otpHash,
    type,
    attempts: 0,
    expiresAt,
    createdAt: now,
  });
}

/**
 * Verify an 8-digit OTP and consume it immediately upon successful match.
 */
export async function verifyAndConsumeOtp({
  email,
  otp,
  type,
}: {
  email: string;
  otp: string;
  type: "registration" | "password_reset";
}): Promise<{ valid: boolean; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  const cleanOtp = otp.trim();

  if (!cleanOtp || cleanOtp.length !== 8) {
    return { valid: false, error: "Verification code must be an 8-digit number." };
  }

  const otpsCollection = await getOtpsCollection();
  const record = await otpsCollection.findOne({
    email: normalizedEmail,
    type,
  });

  if (!record) {
    return { valid: false, error: "Verification code not found or already used. Please request a new code." };
  }

  // Check expiration
  const now = new Date();
  const expiresAt = new Date(record.expiresAt);
  if (now > expiresAt) {
    await otpsCollection.deleteOne({ _id: record._id });
    return { valid: false, error: "Verification code has expired. Please request a new code." };
  }

  // Check brute force attempt limit
  if (record.attempts >= MAX_VERIFICATION_ATTEMPTS) {
    await otpsCollection.deleteOne({ _id: record._id });
    return { valid: false, error: "Too many incorrect attempts. Please request a new verification code." };
  }

  // Verify bcrypt hash
  const isMatch = await bcrypt.compare(cleanOtp, record.otpHash);
  if (!isMatch) {
    await otpsCollection.updateOne(
      { _id: record._id },
      { $set: { attempts: (record.attempts || 0) + 1 } }
    );
    const remaining = MAX_VERIFICATION_ATTEMPTS - (record.attempts || 0) - 1;
    return {
      valid: false,
      error: `Incorrect verification code. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : "Please request a new code."}`,
    };
  }

  // OTP is valid! Consume it so it cannot be re-used
  await otpsCollection.deleteOne({ _id: record._id });
  return { valid: true };
}
