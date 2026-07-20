import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalWallpapers,
      totalDownloads,
      totalViewsAgg,
      usersThisMonth,
      wallpapersThisMonth,
      downloadsThisMonth,
      topWallpapers,
      recentUsers,
      wallpapersByDevice,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.wallpaper.count(),
      prisma.download.count(),
      prisma.wallpaper.aggregate({ _sum: { viewCount: true } }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.wallpaper.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.download.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.wallpaper.findMany({
        orderBy: { downloadCount: "desc" },
        take: 10,
        select: { id: true, title: true, downloadCount: true, viewCount: true, createdAt: true },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, name: true, createdAt: true },
      }),
      prisma.wallpaper.groupBy({
        by: ["deviceType"],
        _count: true,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalWallpapers,
        totalDownloads,
        totalViews: totalViewsAgg._sum.viewCount || 0,
        usersThisMonth,
        wallpapersThisMonth,
        downloadsThisMonth,
        topWallpapers,
        recentUsers,
        wallpapersByDevice: wallpapersByDevice.map((d) => ({
          deviceType: d.deviceType,
          _count: d._count,
        })),
      },
    });
  } catch (error) {
    console.error("Admin analytics GET error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
