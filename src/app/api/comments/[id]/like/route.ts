import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, resolveUser } from "@/lib/api-auth";
import { commentLimiter, createRateLimitResponse } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateCheck = commentLimiter(request);
  if (!rateCheck.allowed) return createRateLimitResponse(rateCheck.resetTime);

  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  try {
    const user = await resolveUser(authResult.session);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    }

    const { id } = await params;

    const existingLike = await prisma.commentLike.findFirst({
      where: { userId: user.id, commentId: id },
    });

    if (existingLike) {
      await prisma.commentLike.delete({ where: { id: existingLike.id } });
      return NextResponse.json({ success: true, data: { liked: false } });
    }

    await prisma.commentLike.create({
      data: { userId: user.id, commentId: id },
    });

    return NextResponse.json({ success: true, data: { liked: true } });
  } catch (error) {
    console.error("Comment like error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
