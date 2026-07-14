import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkApiRateLimit(
  key: string,
  windowMs: number,
  maxRequests: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/static")) {
    return NextResponse.next();
  }

  const ip = getClientIp(request);

  if (pathname.startsWith("/api/")) {
    if (pathname.startsWith("/api/auth/")) {
      const { allowed } = checkApiRateLimit(`auth:${ip}`, 15 * 60 * 1000, 10);
      if (!allowed) {
        return new NextResponse(
          JSON.stringify({ success: false, message: "Too many authentication attempts" }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (pathname.startsWith("/api/upload")) {
      const { allowed } = checkApiRateLimit(`upload:${ip}`, 60 * 1000, 10);
      if (!allowed) {
        return new NextResponse(
          JSON.stringify({ success: false, message: "Too many upload attempts" }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (pathname.includes("/download")) {
      const { allowed } = checkApiRateLimit(`download:${ip}`, 60 * 1000, 30);
      if (!allowed) {
        return new NextResponse(
          JSON.stringify({ success: false, message: "Too many download attempts" }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (pathname.includes("/comments")) {
      const { allowed } = checkApiRateLimit(`comment:${ip}`, 60 * 1000, 20);
      if (!allowed) {
        return new NextResponse(
          JSON.stringify({ success: false, message: "Too many comment attempts" }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const { allowed } = checkApiRateLimit(`api:${ip}`, 60 * 1000, 60);
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Too many requests" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  const protectedRoutes = ["/profile", "/collections"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const sessionToken =
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/collections/:path*",
  ],
};
