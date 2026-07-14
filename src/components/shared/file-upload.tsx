"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image, Video, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadResult {
  url: string;
  thumbnailUrl: string;
  previewUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

interface FileUploadProps {
  type?: "wallpaper" | "thumbnail" | "avatar";
  accept?: string;
  maxSize?: number;
  onUploadComplete?: (result: UploadResult) => void;
  onUploadError?: (error: string) => void;
  className?: string;
}

export function FileUpload({
  type = "wallpaper",
  accept = "image/*,video/*",
  maxSize = 50,
  onUploadComplete,
  onUploadError,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedResult, setUploadedResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }, []);

  const uploadFile = async (file: File) => {
    // Validate size
    if (file.size > maxSize * 1024 * 1024) {
      onUploadError?.(`File too large. Maximum size is ${maxSize}MB`);
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }

      setUploadProgress(100);
      setUploadedResult(data.data);
      onUploadComplete?.(data.data);
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : "Upload failed");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setUploadedResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative rounded-xl border border-[#2a2a2a] bg-[#161616] overflow-hidden">
          {/* Preview */}
          <div className="relative aspect-video">
            {uploadedResult?.format === "gif" ||
            uploadedResult?.format === "mp4" ||
            uploadedResult?.format === "webm" ? (
              <video
                src={preview}
                className="w-full h-full object-contain"
                controls
              />
            ) : (
              <img
                src={uploadedResult?.url || preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            )}

            {/* Upload progress overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#D4A843] mx-auto mb-2" />
                  <p className="text-sm text-[#999]">{uploadProgress}%</p>
                </div>
              </div>
            )}

            {/* Success overlay */}
            {uploadedResult && !isUploading && (
              <div className="absolute top-3 right-3">
                <div className="bg-green-500/20 border border-green-500/50 rounded-full p-2">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              </div>
            )}
          </div>

          {/* File info */}
          <div className="p-3 border-t border-[#2a2a2a]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[#666]">
                {uploadedResult?.format === "gif" ||
                uploadedResult?.format === "mp4" ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <Image className="h-4 w-4" />
                )}
                <span>
                  {uploadedResult?.width}x{uploadedResult?.height}
                </span>
                <span>•</span>
                <span>{formatBytes(uploadedResult?.bytes || 0)}</span>
              </div>
              <button
                onClick={reset}
                className="p-1 hover:bg-[#222] rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-[#666]" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300",
            isDragging
              ? "border-[#D4A843] bg-[#D4A843]/5"
              : "border-[#2a2a2a] bg-[#161616] hover:border-[#D4A843]/50 hover:bg-[#1a1a1a]"
          )}
        >
          <Upload
            className={cn(
              "h-10 w-10 mx-auto mb-4 transition-colors",
              isDragging ? "text-[#D4A843]" : "text-[#444]"
            )}
          />
          <p className="text-sm text-[#666] mb-1">
            Drag & drop your file here, or{" "}
            <span className="text-[#D4A843]">browse</span>
          </p>
          <p className="text-xs text-[#444]">
            Supports: JPEG, PNG, GIF, WebP, MP4, WEBM (Max {maxSize}MB)
          </p>
        </div>
      )}
    </div>
  );
}
