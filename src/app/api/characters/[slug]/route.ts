import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const character = await prisma.character.findUnique({
      where: { slug },
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
