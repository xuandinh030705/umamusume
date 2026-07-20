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

    const existingLike = await prisma.like.findFirst({
      where: { userId: user.id, wallpaperId: id },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return NextResponse.json({ success: true, data: { liked: false } });
    }

    await prisma.like.create({
      data: { userId: user.id, wallpaperId: id },
    });

    return NextResponse.json({ success: true, data: { liked: true } });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
