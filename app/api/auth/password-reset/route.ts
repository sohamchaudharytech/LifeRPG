import { NextResponse } from "next/server";
import { passwordResetSchema } from "@/lib/validation/auth";
import { getUsersCollection } from "@/lib/db/collections";
import { hashPassword } from "@/lib/auth/password";
import { verifyAndConsumeOtp } from "@/lib/auth/otp";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = passwordResetSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, otp, newPassword } = parseResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Verify and consume 8-digit OTP
    const otpResult = await verifyAndConsumeOtp({
      email: normalizedEmail,
      otp,
      type: "password_reset",
    });

    if (!otpResult.valid) {
      return NextResponse.json(
        { error: otpResult.error || "Invalid or expired verification code." },
        { status: 400 }
      );
    }

    // 2. Locate user
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { error: "Account not found." },
        { status: 404 }
      );
    }

    // 3. Hash new password
    const passwordHash = await hashPassword(newPassword);
    const now = new Date();

    // 4. Update password in database
    await usersCollection.updateOne(
      { email: normalizedEmail },
      {
        $set: {
          passwordHash,
          updatedAt: now,
        },
      }
    );

    console.log(`✅ [Password Reset]: Successfully updated password for ${normalizedEmail}`);

    return NextResponse.json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error: any) {
    console.error("POST /api/auth/password-reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}
