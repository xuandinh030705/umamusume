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
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const existing = await prisma.upvote.findUnique({
      where: { userId_requestId: { userId, requestId: id } },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Already upvoted" },
        { status: 409 }
      );
    }

    await prisma.upvote.create({ data: { userId, requestId: id } });
    await prisma.characterRequest.update({
      where: { id },
      data: { upvoteCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, message: "Upvoted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
