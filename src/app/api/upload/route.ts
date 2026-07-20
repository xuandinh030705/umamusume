import { NextRequest, NextResponse } from "next/server";
import { requireAuth, resolveUser } from "@/lib/api-auth";
import { uploadImage, generateThumbnailUrl, generatePreviewUrl } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { uploadLimiter, createRateLimitResponse } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const DAILY_UPLOAD_LIMIT = 10;

export async function POST(request: NextRequest) {
  const rl = uploadLimiter(request);
  if (!rl.allowed) return createRateLimitResponse(rl.resetTime);

  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  try {
    const user = await resolveUser(authResult.session);
    if (!user) {
      console.error("Upload auth failed: user not found", { id: authResult.session.user?.id, email: authResult.session.user?.email });
      return NextResponse.json({ success: false, message: "User not found. Please log out and log back in." }, { status: 401 });
    }

    if (user.role !== "ADMIN" && user.role !== "MODERATOR") {
      return NextResponse.json({ success: false, message: "Only admins and moderators can upload" }, { status: 403 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const userUploadsToday = await prisma.wallpaper.count({
      where: { uploaderId: user.id, createdAt: { gte: todayStart } },
    });

    if (userUploadsToday >= DAILY_UPLOAD_LIMIT) {
      return NextResponse.json(
        { success: false, message: `Daily upload limit reached (${DAILY_UPLOAD_LIMIT}/day)` },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, message: "File too large. Maximum size is 50MB" }, { status: 400 });
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, message: `Invalid file type: ${file.type || "unknown"}. Allowed: JPEG, PNG, GIF, WebP, MP4, WEBM` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let folder = "umawall/wallpapers";
    let max_width = 2160;
    let max_height = 3840;

    if (type === "thumbnail") {
      folder = "umawall/thumbnails";
      max_width = 600;
      max_height = 900;
    } else if (type === "avatar") {
      folder = "umawall/avatars";
      max_width = 400;
      max_height = 400;
    }

    const result = await uploadImage(buffer, {
      folder,
      max_width,
      max_height,
      resource_type: isVideo ? "video" : "image",
    });

    const thumbnailUrl = generateThumbnailUrl(result.secure_url, 400, 600);
    const previewUrl = generatePreviewUrl(result.secure_url, 800, 1200);

    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        thumbnailUrl,
        previewUrl,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error: unknown) {
    console.error("Upload error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, message: "Upload failed. Please try again." }, { status: 500 });
  }
}
