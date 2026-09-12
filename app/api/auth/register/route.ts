import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation/auth";
import { getUsersCollection } from "@/lib/db/collections";
import { hashPassword } from "@/lib/auth/password";
import { setAuthCookie } from "@/lib/auth/session";
import { seedStarterQuests } from "@/lib/db/seedStarterQuests";
import { verifyAndConsumeOtp } from "@/lib/auth/otp";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = registerSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { username, email, password, otp } = parseResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Verify and consume 8-digit OTP
    const otpResult = await verifyAndConsumeOtp({
      email: normalizedEmail,
      otp,
      type: "registration",
    });

    if (!otpResult.valid) {
      return NextResponse.json(
        { error: otpResult.error || "Invalid verification code." },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();


    // Check duplicate email
    const existingEmail = await usersCollection.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    // Check duplicate username
    const existingUser = await usersCollection.findOne({ username: username.trim() });
    if (existingUser) {
      return NextResponse.json(
        { error: "This username is already taken." },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    const now = new Date();

    const newUserDoc = {
      username: username.trim(),
      email: normalizedEmail,
      passwordHash,
      level: 1,
      totalXp: 0,
      currentXp: 0,
      gold: 50, // Starter bonus
      streak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      attributes: {
        strength: 1,
        intellect: 1,
        discipline: 1,
        vitality: 1,
        creativity: 1,
      },
      inventory: [],
      equippedTheme: "default",
      equippedFrame: "default",
      createdAt: now,
      updatedAt: now,
    };

    const insertResult = await usersCollection.insertOne(newUserDoc);
    const userId = insertResult.insertedId.toString();

    // Seed starter quests
    await seedStarterQuests(userId);

    // Set HTTP-only auth cookie
    await setAuthCookie({
      sub: userId,
      email: normalizedEmail,
      username: username.trim(),
    });

    const safeUser = {
      _id: userId,
      username: username.trim(),
      email: normalizedEmail,
      level: 1,
      totalXp: 0,
      currentXp: 0,
      gold: 50,
      streak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      attributes: newUserDoc.attributes,
      inventory: [],
      equippedTheme: "default",
      equippedFrame: "default",
      createdAt: now,
      updatedAt: now,
    };

    return NextResponse.json({ success: true, user: safeUser }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register account. Please try again." },
      { status: 500 }
    );
  }
}
