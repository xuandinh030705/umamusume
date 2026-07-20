import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
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
    const collections = await prisma.collection.findMany({
      where: { userId },
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: collections });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const { name, description, isPublic } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Collection name is required" },
        { status: 400 }
      );
    }

    const collection = await prisma.collection.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        isPublic: isPublic || false,
        userId,
      },
      include: { _count: { select: { items: true } } },
    });

    return NextResponse.json(
      { success: true, message: "Collection created", data: collection },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
