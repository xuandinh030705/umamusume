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
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    const request_ = await prisma.characterRequest.update({
      where: { id },
      data: { status },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    if (status === "DONE") {
      await prisma.notification.create({
        data: {
          type: "REQUEST_DONE",
          content: `Your request for "${request_.characterName}" has been completed!`,
          userId: request_.userId,
          link: "/requests",
        },
      });
    }

    return NextResponse.json({ success: true, data: request_ });
  } catch (error) {
    console.error("Request status PATCH error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
