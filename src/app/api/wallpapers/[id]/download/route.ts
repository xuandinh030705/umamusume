import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { downloadLimiter, createRateLimitResponse } from "@/lib/rate-limit";

const DAILY_DOWNLOAD_LIMIT = 20;
const DAILY_DOWNLOAD_LIMIT_PREMIUM = 50;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = downloadLimiter(request);
  if (!rl.allowed) return createRateLimitResponse(rl.resetTime);

  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const sessionUserId = authResult.session.user?.id;
  const userEmail = authResult.session.user?.email;

  let user = sessionUserId
    ? await prisma.user.findUnique({ where: { id: sessionUserId } })
    : null;
  if (!user && userEmail) {
    user = await prisma.user.findUnique({ where: { email: userEmail } });
  }
  if (!user) {
    console.error("Download auth failed:", { sessionUserId, userEmail });
    return NextResponse.json(
      { success: false, message: "User not found. Please log out and log back in." },
      { status: 401 }
    );
  }

  const userId = user.id;

  try {
    const { id } = await params;
    const wallpaper = await prisma.wallpaper.findUnique({ where: { id } });

    if (!wallpaper) {
      return NextResponse.json(
        { success: false, message: "Wallpaper not found" },
        { status: 404 }
      );
    }

    if (wallpaper.wallpaperStatus !== "PUBLISHED") {
      return NextResponse.json(
        { success: false, message: "Wallpaper is not available" },
        { status: 404 }
      );
    }

    if (wallpaper.isPremium && !user.isPremium) {
      return NextResponse.json(
        { success: false, message: "Premium subscription required" },
        { status: 403 }
      );
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const downloadsToday = await prisma.download.count({
      where: {
        userId,
        createdAt: { gte: todayStart },
      },
    });

    const limit = user.isPremium ? DAILY_DOWNLOAD_LIMIT_PREMIUM : DAILY_DOWNLOAD_LIMIT;

    if (downloadsToday >= limit) {
      return NextResponse.json(
        { success: false, message: `Daily download limit reached (${limit}/day). Upgrade to premium for a higher limit.` },
        { status: 429 }
      );
    }

    const existingDownload = await prisma.download.findFirst({
      where: { userId, wallpaperId: id },
    });

    if (existingDownload) {
      await prisma.wallpaper.update({
        where: { id },
        data: { downloadCount: { increment: 1 } },
      });
    } else {
      await prisma.$transaction([
        prisma.download.create({
          data: { userId, wallpaperId: id },
        }),
        prisma.wallpaper.update({
          where: { id },
          data: { downloadCount: { increment: 1 } },
        }),
      ]);
    }

    return NextResponse.json({
      success: true,
      data: { fileUrl: wallpaper.fileUrl },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
