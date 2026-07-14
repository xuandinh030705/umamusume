import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ success: true, data: tags });
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
    const { name, slug } = await request.json();
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: "Name and slug are required" },
        { status: 400 }
      );
    }
    const tag = await prisma.tag.create({ data: { name, slug } });
    return NextResponse.json(
      { success: true, message: "Tag created", data: tag },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
