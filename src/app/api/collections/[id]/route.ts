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
        user: { select: { id: true, name: true, image: true } },
        items: {
          include: {
            wallpaper: {
              include: {
                character: true,
                _count: { select: { likes: true, comments: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!collection) {
      return NextResponse.json(
        { success: false, message: "Collection not found" },
        { status: 404 }
      );
    }

    if (!collection.isPublic) {
      const authResult = await requireAuth();
      if ("error" in authResult) return authResult.error;
      const userId = authResult.session.user?.id;
      if (userId !== collection.userId) {
        return NextResponse.json(
          { success: false, message: "This collection is private" },
          { status: 403 }
        );
      }
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

  try {
    const { id } = await params;
    const collection = await prisma.collection.findUnique({ where: { id } });

    if (!collection) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }

    if (collection.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.collection.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Collection deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
