import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "./rateLimit";
import type { rateLimiters } from "./rateLimit";

export async function withRateLimit(
  request: NextRequest,
  limiter: keyof typeof rateLimiters
) {
    
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    request.headers.get("x-real-ip") ??
    "anonymous";

  const result = await checkRateLimit(limiter, ip);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Too many requests",
        limit: result.limit,
        remaining: result.remaining,
        reset: new Date(result.reset).toISOString(),
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": String(result.remaining),
          "X-RateLimit-Reset": String(result.reset),
          "Retry-After": String(Math.ceil((result.reset - Date.now()) / 1000)),
        },
      }
    );
  }

  return null; 
}