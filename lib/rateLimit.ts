import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type LimiterKey = "api" | "auth" | "upload";

export const rateLimiters = {
  api: true,
  auth: true,
  upload: true,
} as const;

function getRateLimiter(kind: LimiterKey) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return null;
  }

  const redis = new Redis({ url, token });

  if (kind === "auth") {
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      analytics: true,
      prefix: "ratelimit:auth",
    });
  }

  if (kind === "upload") {
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "1 h"),
      analytics: true,
      prefix: "ratelimit:upload",
    });
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    analytics: true,
    prefix: "ratelimit:api",
  });
}

export async function checkRateLimit(
  limiter: keyof typeof rateLimiters,
  identifier: string
) {
  const selectedLimiter = getRateLimiter(limiter);
  if (!selectedLimiter) {
    // Allow requests when Redis credentials are not available (e.g., CI build-time analysis).
    return {
      success: true,
      limit: Number.POSITIVE_INFINITY,
      remaining: Number.POSITIVE_INFINITY,
      reset: Date.now() + 60_000,
    };
  }

  const result = await selectedLimiter.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}