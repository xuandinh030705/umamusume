import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const userId = authResult.session.user?.id;
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const where: Record<string, unknown> = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const userId = authResult.session.user?.id;
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { notificationIds, markAll } = await request.json();

    if (markAll) {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    if (notificationIds && Array.isArray(notificationIds)) {
      await prisma.notification.updateMany({
        where: { id: { in: notificationIds }, userId },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, message: "Notifications marked as read" });
    }

    return NextResponse.json(
      { success: false, message: "notificationIds or markAll required" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
