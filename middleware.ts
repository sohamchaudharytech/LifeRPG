import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "liferpg_super_secure_jwt_token_secret_key_2026_hackathon_zephyr";
const key = new TextEncoder().encode(JWT_SECRET);

const protectedRoutes = ["/dashboard", "/quests", "/character", "/shop", "/history"];
const authRoutes = ["/login", "/register", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("liferpg_token")?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, key, { algorithms: ["HS256"] });
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/quests/:path*",
    "/character/:path*",
    "/shop/:path*",
    "/history/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};

