import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, resolveUser } from "@/lib/api-auth";

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
    console.error("Requests GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  try {
    const user = await resolveUser(authResult.session);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    }

    const { characterName, note } = await request.json();
    if (!characterName || !characterName.trim()) {
      return NextResponse.json({ success: false, message: "Character name is required" }, { status: 400 });
    }

    const existing = await prisma.characterRequest.findFirst({
      where: { characterName: characterName.trim(), userId: user.id },
    });
    if (existing) {
      return NextResponse.json({ success: false, message: "You already requested this character" }, { status: 409 });
    }

    const req = await prisma.characterRequest.create({
      data: { characterName: characterName.trim(), note, userId: user.id },
      include: { user: { select: { id: true, name: true, image: true } } },
    });
    return NextResponse.json({ success: true, message: "Request submitted", data: req }, { status: 201 });
  } catch (error) {
    console.error("Request POST error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
