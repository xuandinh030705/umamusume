import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  try {
    const reports = await prisma.report.findMany({
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
