import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, nameJp, bloodline, description, avatarUrl, coverUrl, slug } = body;

    const existing = await prisma.character.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    const character = await prisma.character.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(nameJp !== undefined && { nameJp }),
        ...(bloodline !== undefined && { bloodline }),
        ...(description !== undefined && { description }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(coverUrl !== undefined && { coverUrl }),
        ...(slug !== undefined && { slug }),
      },
    });

    return NextResponse.json({ success: true, message: "Character updated", data: character });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const existing = await prisma.character.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    await prisma.character.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Character deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
