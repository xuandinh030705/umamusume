import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, resolveUser } from "@/lib/api-auth";

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
      return NextResponse.json({ success: false, message: "Collection not found" }, { status: 404 });
    }

    if (!collection.isPublic) {
      const authResult = await requireAuth();
      if ("error" in authResult) return authResult.error;
      const user = await resolveUser(authResult.session);
      if (!user || user.id !== collection.userId) {
        return NextResponse.json({ success: false, message: "This collection is private" }, { status: 403 });
      }
    }

    return NextResponse.json({ success: true, data: collection });
  } catch (error) {
    console.error("Collection GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  try {
    const user = await resolveUser(authResult.session);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    }

    const { id } = await params;
    const collection = await prisma.collection.findUnique({ where: { id } });

    if (!collection) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    if (collection.userId !== user.id) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await prisma.collection.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Collection deleted" });
  } catch (error) {
    console.error("Collection DELETE error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
