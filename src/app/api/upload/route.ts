import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { uploadImage, generateThumbnailUrl, generatePreviewUrl } from "@/lib/cloudinary";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/gif"];

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string; // "thumbnail" | "wallpaper" | "avatar"

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File too large. Maximum size is 50MB" },
        { status: 400 }
      );
    }

    // Validate file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type) || file.type === "image/gif";

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, GIF, WebP, MP4, WEBM`,
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine folder and options based on type
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

    // Upload to Cloudinary
    const result = await uploadImage(buffer, {
      folder,
      max_width,
      max_height,
      resource_type: isVideo ? "video" : "image",
    });

    // Generate thumbnail and preview URLs
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
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
