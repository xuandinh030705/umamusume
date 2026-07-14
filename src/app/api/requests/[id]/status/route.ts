import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ success: false, message: "Status is required" }, { status: 400 });
    }

    const validStatuses = ["PENDING", "IN_PROGRESS", "DONE", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const req = await prisma.characterRequest.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ success: true, message: "Status updated", data: req });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
