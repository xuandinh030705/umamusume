import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            wallpaper: {
              include: { character: true, _count: { select: { likes: true, comments: true } } },
            },
          },
        },
        user: { select: { id: true, name: true, image: true } },
      },
    });
    if (!collection) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: collection });
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
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Check if user owns this collection
    const collection = await prisma.collection.findUnique({ where: { id } });
    if (!collection) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }
    if (collection.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You can only delete your own collections" },
        { status: 403 }
      );
    }

    await prisma.collectionItem.deleteMany({ where: { collectionId: id } });
    await prisma.collection.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Collection deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
