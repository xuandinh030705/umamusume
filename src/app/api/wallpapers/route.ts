import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, requireAdmin } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const character = searchParams.get("character");
    const tag = searchParams.get("tag");
    const deviceType = searchParams.get("deviceType");
    const format = searchParams.get("format");
    const resolution = searchParams.get("resolution");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { wallpaperStatus: "PUBLISHED" };
    if (character) where.character = { slug: character };
    if (tag) where.wallpaperTags = { some: { tag: { slug: tag } } };
    if (deviceType) where.deviceType = deviceType;
    if (format) where.format = format;
    if (resolution) where.resolution = resolution;
    if (search) where.OR = [{ title: { contains: search } }, { description: { contains: search } }];

    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };
    else if (sort === "popular") orderBy = { viewCount: "desc" };
    else if (sort === "downloads") orderBy = { downloadCount: "desc" };

    const [wallpapers, total] = await Promise.all([
      prisma.wallpaper.findMany({
        where,
        include: {
          character: true,
          wallpaperTags: { include: { tag: true } },
          _count: { select: { comments: true, likes: true, downloads: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.wallpaper.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: { wallpapers, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  try {
    const body = await request.json();
    const { title, description, characterId, fileUrl, thumbnailUrl, previewUrl, resolution, deviceType, format, isPremium, tags } = body;
    if (!title || !fileUrl || !deviceType || !format) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    const wallpaper = await prisma.wallpaper.create({
      data: {
        title, description, characterId, fileUrl, thumbnailUrl, previewUrl, resolution,
        deviceType, format, isPremium: isPremium || false, wallpaperStatus: "PENDING",
        uploaderId: authResult.session.user?.id,
        wallpaperTags: tags ? { create: tags.map((tagId: string) => ({ tagId })) } : undefined,
      },
      include: { character: true, wallpaperTags: { include: { tag: true } } },
    });
    return NextResponse.json({ success: true, message: "Wallpaper uploaded", data: wallpaper }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
