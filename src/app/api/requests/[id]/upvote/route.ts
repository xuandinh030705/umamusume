import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, resolveUser } from "@/lib/api-auth";

export async function POST(
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

    const existingUpvote = await prisma.upvote.findFirst({
      where: { userId: user.id, requestId: id },
    });

    if (existingUpvote) {
      return NextResponse.json({ success: false, message: "You already upvoted this request" }, { status: 409 });
    }

    await prisma.upvote.create({
      data: { userId: user.id, requestId: id },
    });

    await prisma.characterRequest.update({
      where: { id },
      data: { upvoteCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, message: "Upvoted" });
  } catch (error) {
    console.error("Upvote error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
