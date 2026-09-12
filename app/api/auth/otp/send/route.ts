import { NextResponse } from "next/server";
import { z } from "zod";
import { getUsersCollection, getOtpsCollection } from "@/lib/db/collections";
import { generateOtp, saveOtp } from "@/lib/auth/otp";
import { sendOtpEmail } from "@/lib/email/emailjs";

const sendOtpSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  type: z.enum(["registration", "password_reset"]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = sendOtpSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, username, type } = parseResult.data;
    const normalizedEmail = email.toLowerCase().trim();
    const usersCollection = await getUsersCollection();

    // 1. Business logic check depending on type
    if (type === "registration") {
      const existingEmail = await usersCollection.findOne({ email: normalizedEmail });
      if (existingEmail) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 400 }
        );
      }

      if (username) {
        const existingUsername = await usersCollection.findOne({
          username: username.trim(),
        });
        if (existingUsername) {
          return NextResponse.json(
            { error: "This username is already taken." },
            { status: 400 }
          );
        }
      }
    } else if (type === "password_reset") {
      const existingUser = await usersCollection.findOne({ email: normalizedEmail });
      if (!existingUser) {
        return NextResponse.json(
          { error: "No account found with this email address." },
          { status: 404 }
        );
      }
    }

    // 2. Rate-limit check (prevent OTP flooding within 45 seconds)
    const otpsCollection = await getOtpsCollection();
    const recentOtp = await otpsCollection.findOne({
      email: normalizedEmail,
      type,
    });

    if (recentOtp && recentOtp.createdAt) {
      const timeSinceCreated = Date.now() - new Date(recentOtp.createdAt).getTime();
      const waitSecondsRemaining = Math.ceil((45000 - timeSinceCreated) / 1000);
      if (waitSecondsRemaining > 0) {
        return NextResponse.json(
          { error: `Please wait ${waitSecondsRemaining}s before requesting a new code.` },
          { status: 429 }
        );
      }
    }

    // 3. Generate secure 8-digit OTP and persist
    const otp = generateOtp();
    await saveOtp({ email: normalizedEmail, otp, type });

    // 4. Send email via EmailJS (or dev fallback logger)
    await sendOtpEmail({
      toEmail: normalizedEmail,
      toName: username,
      otp,
      type,
    });

    return NextResponse.json({
      success: true,
      message: `An 8-digit verification code has been sent to ${normalizedEmail}.`,
    });
  } catch (error: any) {
    console.error("POST /api/auth/otp/send error:", error);
    return NextResponse.json(
      { error: "Failed to send verification code. Please try again." },
      { status: 500 }
    );
  }
}
