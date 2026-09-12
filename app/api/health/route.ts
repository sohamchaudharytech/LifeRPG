import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, any> = {
    server: {
      status: "healthy",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV || "development",
    },
    database: {
      status: "unknown",
      latencyMs: 0,
      type: "mongodb",
    },
    emailService: {
      provider: "emailjs",
      configured: Boolean(
        process.env.EMAILJS_SERVICE_ID &&
        process.env.EMAILJS_TEMPLATE_ID &&
        process.env.EMAILJS_PUBLIC_KEY
      ),
    },
    memory: {
      heapUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      rssMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
  };

  let isHealthy = true;

  // 1. Check MongoDB Database Ping
  try {
    const dbStartTime = Date.now();
    const db = await getDatabase();
    const pingResult = await db.command({ ping: 1 });
    const latency = Date.now() - dbStartTime;

    checks.database = {
      status: pingResult.ok === 1 ? "connected" : "degraded",
      latencyMs: latency,
      databaseName: db.databaseName,
      type: "mongodb_atlas",
    };
  } catch (dbError: any) {
    checks.database = {
      status: "degraded_fallback",
      error: dbError.message,
      type: "local_json_fallback",
    };
    // If Mongo is down, the system still operates using local fallback store
  }

  const totalDurationMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "unhealthy",
      service: "life-rpg-engine",
      version: "1.0.0",
      totalDurationMs,
      checks,
    },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
