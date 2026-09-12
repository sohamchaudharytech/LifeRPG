import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth/session";

export async function POST() {
  try {
    await clearAuthCookie();
    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
