import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  try {
    const requests = await prisma.characterRequest.findMany({
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { upvotes: true } },
      },
      orderBy: { upvoteCount: "desc" },
    });
    return NextResponse.json({ success: true, data: requests });
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
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { characterName, note } = await request.json();
    if (!characterName) {
      return NextResponse.json(
        { success: false, message: "Character name is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.characterRequest.findFirst({
      where: { characterName, userId },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "You already requested this character" },
        { status: 409 }
      );
    }

    const req = await prisma.characterRequest.create({
      data: { characterName, note, userId },
      include: { user: { select: { id: true, name: true, image: true } } },
    });
    return NextResponse.json(
      { success: true, message: "Request submitted", data: req },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
