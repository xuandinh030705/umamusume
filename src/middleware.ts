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

  const nonceArray = new Uint8Array(16);
  globalThis.crypto.getRandomValues(nonceArray);
  const nonce = btoa(String.fromCharCode(...nonceArray));
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'nonce-" + nonce + "' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://avatars.githubusercontent.com https://lh3.googleusercontent.com https://images.unsplash.com",
    "font-src 'self'",
    "connect-src 'self' https://res.cloudinary.com https://api.cloudinary.com",
    "frame-src 'self' https://js.stripe.com",
  ].join("; ");

  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (pathname.startsWith("/api/")) {
    const clientIp = getClientIp(request);
    const rateLimitKey = `${clientIp}:${pathname}`;
    const { allowed } = checkApiRateLimit(rateLimitKey, 60000, 100);

    if (!allowed) {
      const response = NextResponse.json(
        { success: false, message: "Too many requests" },
        { status: 429 }
      );
      response.headers.set("Content-Security-Policy", csp);
      response.headers.set("x-nonce", nonce);
      return response;
    }

    const response = NextResponse.next();
    response.headers.set("Content-Security-Policy", csp);
    response.headers.set("x-nonce", nonce);
    return response;
  }

  if (pathname.startsWith("/admin")) {
    if (!sessionToken) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.headers.set("Content-Security-Policy", csp);
      response.headers.set("x-nonce", nonce);
      return response;
    }
    const response = NextResponse.next();
    response.headers.set("Content-Security-Policy", csp);
    response.headers.set("x-nonce", nonce);
    return response;
  }

  if (pathname.startsWith("/profile")) {
    if (!sessionToken) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.headers.set("Content-Security-Policy", csp);
      response.headers.set("x-nonce", nonce);
      return response;
    }
    const response = NextResponse.next();
    response.headers.set("Content-Security-Policy", csp);
    response.headers.set("x-nonce", nonce);
    return response;
  }

  if (pathname.startsWith("/collections")) {
    if (!sessionToken) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.headers.set("Content-Security-Policy", csp);
      response.headers.set("x-nonce", nonce);
      return response;
    }
    const response = NextResponse.next();
    response.headers.set("Content-Security-Policy", csp);
    response.headers.set("x-nonce", nonce);
    return response;
  }

  if (pathname.startsWith("/notifications")) {
    if (!sessionToken) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.headers.set("Content-Security-Policy", csp);
      response.headers.set("x-nonce", nonce);
      return response;
    }
    const response = NextResponse.next();
    response.headers.set("Content-Security-Policy", csp);
    response.headers.set("x-nonce", nonce);
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-nonce", nonce);
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/collections/:path*",
    "/notifications/:path*",
    "/api/:path*",
  ],
};
