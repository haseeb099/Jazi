import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { NextRequest, NextResponse } from "next/server"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const limiters = {
  default: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(200, "1m"),
  }),
  strict: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1m"),
  }),
  webhook: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(500, "1m"),
  }),
}

export async function rateLimit(
  request: NextRequest,
  options: { tier?: keyof typeof limiters } = {}
): Promise<NextResponse | null> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous"
  const limiter = limiters[options.tier ?? "default"]
  const { success, reset, remaining } = await limiter.limit(ip)

  if (!success) {
    return new NextResponse(
      JSON.stringify({
        error: "Too many requests",
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(reset),
        },
      }
    )
  }
  return null
}
