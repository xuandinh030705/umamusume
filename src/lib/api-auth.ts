import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "./prisma";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) };
  }
  if ((session.user as { role?: string }).role !== "ADMIN") {
    return { error: NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 }) };
  }
  return { session };
}

export async function requireModerator() {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) };
  }
  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN" && role !== "MODERATOR") {
    return { error: NextResponse.json({ success: false, message: "Forbidden: Moderator access required" }, { status: 403 }) };
  }
  return { session };
}

/**
 * Resolve a DB user from the session, using id first then email fallback.
 * This fixes the issue where session.user.id may be empty/incorrect.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function resolveUser(session: any) {
  const sessionUserId = session?.user?.id as string | undefined;
  const userEmail = session?.user?.email as string | undefined;

  let user = sessionUserId
    ? await prisma.user.findUnique({ where: { id: sessionUserId } })
    : null;
  if (!user && userEmail) {
    user = await prisma.user.findUnique({ where: { email: userEmail } });
  }
  return user;
}
