import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const character = await prisma.character.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        wallpapers: { where: { wallpaperStatus: "PUBLISHED" }, include: { _count: { select: { comments: true, likes: true } } }, orderBy: { createdAt: "desc" } },
        _count: { select: { wallpapers: true, follows: true } },
      },
    });
    if (!character) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: character });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
