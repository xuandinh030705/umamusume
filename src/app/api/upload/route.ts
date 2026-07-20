import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { uploadImage, generateThumbnailUrl, generatePreviewUrl } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "video/mp4", "video/webm",
];
const DAILY_UPLOAD_LIMIT = 10;

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const userId = (authResult.session.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const userUploadsToday = await prisma.wallpaper.count({
      where: { uploaderId: userId, createdAt: { gte: todayStart } },
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
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File too large. Maximum size is 50MB" },
        { status: 400 }
      );
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
    console.error("Upload error full:", JSON.stringify(error, Object.getOwnPropertyNames(error as object)));
    let detail = "Unknown error";
    if (error instanceof Error) {
      detail = error.message;
      if ((error as any).http_code) detail += ` (HTTP ${(error as any).http_code})`;
      if ((error as any).message?.includes("Must supply")) detail = "Cloudinary credentials missing or invalid. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env";
    } else if (typeof error === "string") {
      detail = error;
    }
    return NextResponse.json(
      { success: false, message: detail },
      { status: 500 }
    );
  }
}
