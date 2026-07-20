import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const userId = authResult.session.user?.id;
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const { wallpaperId } = await request.json();

    const collection = await prisma.collection.findUnique({ where: { id } });
    if (!collection) {
      return NextResponse.json(
        { success: false, message: "Collection not found" },
        { status: 404 }
      );
    }

    if (collection.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const existing = await prisma.collectionItem.findFirst({
      where: { collectionId: id, wallpaperId },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Wallpaper already in collection" },
        { status: 409 }
      );
    }

    const item = await prisma.collectionItem.create({
      data: { collectionId: id, wallpaperId },
    });

    return NextResponse.json(
      { success: true, message: "Added to collection", data: item },
      { status: 201 }
    );
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

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const wallpaperId = searchParams.get("wallpaperId");

    if (!wallpaperId) {
      return NextResponse.json(
        { success: false, message: "wallpaperId is required" },
        { status: 400 }
      );
    }

    const collection = await prisma.collection.findUnique({ where: { id } });
    if (!collection) {
      return NextResponse.json(
        { success: false, message: "Collection not found" },
        { status: 404 }
      );
    }

    if (collection.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.collectionItem.deleteMany({
      where: { collectionId: id, wallpaperId },
    });

    return NextResponse.json({ success: true, message: "Removed from collection" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
