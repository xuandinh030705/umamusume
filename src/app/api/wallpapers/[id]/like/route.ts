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

    const existing = await prisma.like.findUnique({
      where: { userId_wallpaperId: { userId, wallpaperId: id } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return NextResponse.json({
        success: true,
        message: "Like removed",
        data: { liked: false },
      });
    }

    await prisma.like.create({ data: { userId, wallpaperId: id } });
    return NextResponse.json({ success: true, message: "Liked", data: { liked: true } });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
