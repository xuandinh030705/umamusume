import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    if (!wallpaper)
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    await prisma.wallpaper.update({ where: { id }, data: { viewCount: { increment: 1 } } });
    return NextResponse.json({ success: true, data: wallpaper });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const wallpaper = await prisma.wallpaper.update({
      where: { id },
      data: body,
      include: { character: true, wallpaperTags: { include: { tag: true } } },
    });
    return NextResponse.json({ success: true, message: "Wallpaper updated", data: wallpaper });
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
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    await prisma.wallpaper.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Wallpaper deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
