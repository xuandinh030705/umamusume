import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, resolveUser } from "@/lib/api-auth";

export async function GET() {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  try {
    const user = await resolveUser(authResult.session);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    }

    const likes = await prisma.like.findMany({
      where: { userId: user.id },
      include: {
        wallpaper: {
          include: {
            character: true,
            _count: { select: { comments: true, likes: true, downloads: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const wallpapers = likes.map((like) => like.wallpaper);
    return NextResponse.json({ success: true, data: wallpapers });
  } catch (error) {
    console.error("Favorites GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
