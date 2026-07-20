import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const wallpaper = await prisma.wallpaper.findUnique({
      where: { id },
      include: {
        character: true,
        uploader: { select: { id: true, name: true, image: true } },
        wallpaperTags: { include: { tag: true } },
        _count: { select: { comments: true, likes: true, downloads: true } },
      },
    });

    if (!wallpaper) {
      return NextResponse.json(
        { success: false, message: "Wallpaper not found" },
        { status: 404 }
      );
    }

    await prisma.wallpaper.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: wallpaper });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const userId = authResult.session.user?.id;
  const userRole = (authResult.session.user as { role?: string })?.role;

  try {
    const { id } = await params;
    const wallpaper = await prisma.wallpaper.findUnique({ where: { id } });

    if (!wallpaper) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }

    if (wallpaper.uploaderId !== userId && userRole !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.wallpaper.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Wallpaper deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const userRole = (authResult.session.user as { role?: string })?.role;
  if (userRole !== "ADMIN" && userRole !== "MODERATOR") {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const wallpaper = await prisma.wallpaper.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        wallpaperStatus: body.wallpaperStatus,
        isPremium: body.isPremium,
        characterId: body.characterId,
      },
    });
    return NextResponse.json({ success: true, data: wallpaper });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
