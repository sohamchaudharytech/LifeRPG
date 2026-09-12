import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation/auth";
import { getUsersCollection } from "@/lib/db/collections";
import { verifyPassword } from "@/lib/auth/password";
import { setAuthCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;
    const normalizedEmail = email.toLowerCase().trim();
    const usersCollection = await getUsersCollection();

    const user = await usersCollection.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const userId = user._id.toString();

    // Set HTTP-only auth cookie
    await setAuthCookie({
      sub: userId,
      email: normalizedEmail,
      username: user.username,
    });

    const safeUser = {
      _id: userId,
      username: user.username,
      email: user.email,
      level: user.level,
      totalXp: user.totalXp,
      currentXp: user.currentXp,
      gold: user.gold,
      streak: user.streak,
      longestStreak: user.longestStreak,
      lastActivityDate: user.lastActivityDate,
      attributes: user.attributes,
      inventory: user.inventory || [],
      equippedTheme: user.equippedTheme || "default",
      equippedFrame: user.equippedFrame || "default",
      equippedAura: user.equippedAura,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
