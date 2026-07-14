import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

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

export function getUserId(session: { user?: { id?: string } }): string | null {
  return session?.user?.id || null;
}
