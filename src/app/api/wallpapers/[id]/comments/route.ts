import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await prisma.comment.findMany({
      where: { wallpaperId: id, parentCommentId: null },
      include: {
        user: { select: { id: true, name: true, image: true, role: true } },
        replies: {
          include: { user: { select: { id: true, name: true, image: true, role: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const { content, parentCommentId } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Content is required" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { success: false, message: "Comment too long (max 1000 characters)" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId,
        wallpaperId: id,
        parentCommentId,
      },
      include: { user: { select: { id: true, name: true, image: true, role: true } } },
    });
    return NextResponse.json(
      { success: true, message: "Comment posted", data: comment },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
