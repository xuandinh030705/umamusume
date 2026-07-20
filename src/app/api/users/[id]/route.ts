import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, resolveUser } from "@/lib/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isPremium: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            downloads: true,
            collections: true,
            comments: true,
          },
        },
      },
    });
    if (!user) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("User GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  try {
    const user = await resolveUser(authResult.session);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    }

    const { id } = await params;

    if (user.id !== id) {
      return NextResponse.json({ success: false, message: "Forbidden: You can only update your own profile" }, { status: 403 });
    }

    const body = await request.json();
    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        bio: body.bio,
        image: body.image,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        bio: true,
      },
    });
    return NextResponse.json({ success: true, message: "Profile updated", data: updated });
  } catch (error) {
    console.error("User PUT error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
