import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface UploadOptions {
  folder?: string;
  transformation?: string;
  resource_type?: "image" | "video" | "auto";
  format?: string;
  max_width?: number;
  max_height?: number;
}

export async function uploadImage(
  file: Buffer | string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const {
    folder = "umawall",
    transformation,
    resource_type = "image",
    max_width,
    max_height,
  } = options;

  const result = await new Promise<UploadResult>((resolve, reject) => {
    const uploadOptions: Record<string, unknown> = {
      folder,
      resource_type,
      quality: "auto",
      fetch_format: "auto",
    };

    if (transformation) {
      uploadOptions.transformation = transformation;
    } else if (max_width || max_height) {
      uploadOptions.transformation = [
        {
          width: max_width,
          height: max_height,
          crop: "limit",
          quality: "auto",
          fetch_format: "auto",
        },
      ];
    }

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) reject(error);
        else
          resolve({
            public_id: result!.public_id,
            secure_url: result!.secure_url,
            width: result!.width,
            height: result!.height,
            format: result!.format,
            bytes: result!.bytes,
          });
      })
      .end(file);
  });

  return result;
}

export async function uploadVideo(
  file: Buffer,
  options: UploadOptions = {}
): Promise<UploadResult> {
  return uploadImage(file, { ...options, resource_type: "video" });
}

export async function deleteFile(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function generateThumbnailUrl(
  imageUrl: string,
  width: number = 400,
  height: number = 600
): string {
  return imageUrl.replace(
    "/upload/",
    `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`
  );
}

export function generatePreviewUrl(
  imageUrl: string,
  width: number = 800,
  height: number = 1200
): string {
  return imageUrl.replace(
    "/upload/",
    `/upload/w_${width},h_${height},c_limit,q_auto,f_auto/`
  );
}

export default cloudinary;
