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

    const wallpaper = await prisma.wallpaper.findUnique({ where: { id } });
    if (!wallpaper) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    // Check if premium content
    if (wallpaper.isPremium) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user?.isPremium) {
        return NextResponse.json(
          { success: false, message: "Premium content. Upgrade to access!" },
          { status: 403 }
        );
      }
    }

    // Check daily download limit for non-premium users
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && !user.isPremium) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const count = await prisma.download.count({
        where: { userId, createdAt: { gte: today } },
      });
      if (count >= 10) {
        return NextResponse.json(
          { success: false, message: "Daily limit reached. Upgrade to Premium!" },
          { status: 429 }
        );
      }
    }

    await prisma.download.create({ data: { userId, wallpaperId: id } });
    await prisma.wallpaper.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      message: "Download started",
      data: { fileUrl: wallpaper.fileUrl },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
