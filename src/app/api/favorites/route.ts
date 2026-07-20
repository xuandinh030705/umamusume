import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const userId = authResult.session.user?.id;
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const likes = await prisma.like.findMany({
      where: { userId },
      include: {
        wallpaper: {
          include: {
            character: true,
            _count: { select: { comments: true, likes: true, downloads: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const wallpapers = likes.map((like) => like.wallpaper);

    return NextResponse.json({ success: true, data: wallpapers });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
