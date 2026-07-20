import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, resolveUser } from "@/lib/api-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  try {
    const user = await resolveUser(authResult.session);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    }

    const { id } = await params;
    const character = await prisma.character.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!character) {
      return NextResponse.json({ success: false, message: "Character not found" }, { status: 404 });
    }

    const existing = await prisma.follow.findFirst({
      where: { userId: user.id, characterId: character.id },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, data: { following: false } });
    }

    await prisma.follow.create({
      data: { userId: user.id, characterId: character.id },
    });

    return NextResponse.json({ success: true, data: { following: true } });
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
