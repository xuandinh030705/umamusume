const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (request: Request) => string;
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const { windowMs, maxRequests } = config;
  const now = Date.now();
  const resetTime = now + windowMs;

  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

export function createRateLimitResponse(resetTime: number): Response {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
  return new Response(
    JSON.stringify({
      success: false,
      message: "Too many requests. Please try again later.",
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Reset": resetTime.toString(),
      },
    }
  );
}

// Pre-configured rate limiters
export const apiLimiter = (request: Request) => {
  const ip = getClientIp(request);
  return checkRateLimit(`api:${ip}`, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  });
};

export const authLimiter = (request: Request) => {
  const ip = getClientIp(request);
  return checkRateLimit(`auth:${ip}`, {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // 10 attempts per 15 minutes
  });
};

export const uploadLimiter = (request: Request) => {
  const ip = getClientIp(request);
  return checkRateLimit(`upload:${ip}`, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 uploads per minute
  });
};

export const commentLimiter = (request: Request) => {
  const ip = getClientIp(request);
  return checkRateLimit(`comment:${ip}`, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20, // 20 comments per minute
  });
};

export const downloadLimiter = (request: Request) => {
  const ip = getClientIp(request);
  return checkRateLimit(`download:${ip}`, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 downloads per minute
  });
};

// Cleanup old entries periodically (call this in a background job)
export function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitMap, 5 * 60 * 1000);
}
