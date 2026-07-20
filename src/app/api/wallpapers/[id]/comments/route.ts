import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, resolveUser } from "@/lib/api-auth";
import { commentSchema } from "@/lib/validations";
import { commentLimiter, createRateLimitResponse } from "@/lib/rate-limit";

function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

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
          include: {
            user: { select: { id: true, name: true, image: true, role: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error("Comments GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = commentLimiter(request);
  if (!rl.allowed) return createRateLimitResponse(rl.resetTime);

  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  try {
    const user = await resolveUser(authResult.session);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { content, parentCommentId } = parsed.data;

    const wallpaper = await prisma.wallpaper.findUnique({ where: { id } });
    if (!wallpaper) {
      return NextResponse.json({ success: false, message: "Wallpaper not found" }, { status: 404 });
    }

    if (parentCommentId) {
      const parentComment = await prisma.comment.findUnique({ where: { id: parentCommentId } });
      if (!parentComment || parentComment.wallpaperId !== id) {
        return NextResponse.json({ success: false, message: "Invalid parent comment" }, { status: 400 });
      }
    }

    const sanitizedContent = sanitizeHtml(content.trim());

    const comment = await prisma.comment.create({
      data: {
        content: sanitizedContent,
        userId: user.id,
        wallpaperId: id,
        parentCommentId: parentCommentId || null,
      },
      include: {
        user: { select: { id: true, name: true, image: true, role: true } },
      },
    });

    return NextResponse.json({ success: true, message: "Comment posted", data: comment }, { status: 201 });
  } catch (error) {
    console.error("Comment POST error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
