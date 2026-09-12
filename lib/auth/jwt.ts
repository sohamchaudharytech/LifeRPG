import { SignJWT, jwtVerify } from "jose";
import { JWTPayload } from "@/types/user";

const JWT_SECRET = process.env.JWT_SECRET || "liferpg_super_secure_jwt_token_secret_key_2026_hackathon_zephyr";
const key = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: { sub: string; email: string; username?: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      username: payload.username as string | undefined,
    };
  } catch (error) {
    return null;
  }
}
