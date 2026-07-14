import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, requireAdmin } from "@/lib/api-auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const userId = authResult.session.user?.id;
  const userRole = (authResult.session.user as { role?: string })?.role;

  try {
    const { id } = await params;

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    // Only comment owner or admin/moderator can delete
    if (comment.userId !== userId && userRole !== "ADMIN" && userRole !== "MODERATOR") {
      return NextResponse.json(
        { success: false, message: "Forbidden: You can only delete your own comments" },
        { status: 403 }
      );
    }

    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
