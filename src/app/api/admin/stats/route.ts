import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  try {
    const [totalUsers, totalWallpapers, totalDownloads, totalViews, recentUsers, topWallpapers] =
      await Promise.all([
        prisma.user.count(),
        prisma.wallpaper.count(),
        prisma.download.count(),
        prisma.wallpaper.aggregate({ _sum: { viewCount: true } }),
        prisma.user.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, name: true, image: true, role: true, createdAt: true },
        }),
        prisma.wallpaper.findMany({
          orderBy: { downloadCount: "desc" },
          take: 5,
          select: { id: true, title: true, downloadCount: true, viewCount: true },
        }),
      ]);
    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalWallpapers,
        totalDownloads,
        totalViews: totalViews._sum.viewCount || 0,
        recentUsers,
        topWallpapers,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
