import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const userId = authResult.session.user?.id;
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const existing = await prisma.follow.findUnique({
      where: { userId_characterId: { userId, characterId: id } },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return NextResponse.json({
        success: true,
        message: "Unfollowed",
        data: { following: false },
      });
    }

    await prisma.follow.create({ data: { userId, characterId: id } });
    return NextResponse.json({
      success: true,
      message: "Following",
      data: { following: true },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
