import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  try {
    const characters = await prisma.character.findMany({
      include: { _count: { select: { wallpapers: true, follows: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, data: characters });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  try {
    const body = await request.json();
    const { name, nameJp, bloodline, description, avatarUrl, coverUrl, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: "Name and slug are required" },
        { status: 400 }
      );
    }

    const character = await prisma.character.create({
      data: { name, nameJp, bloodline, description, avatarUrl, coverUrl, slug },
    });

    return NextResponse.json(
      { success: true, message: "Character created", data: character },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
