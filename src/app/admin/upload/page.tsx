"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Upload, ArrowLeft, Loader2, Check, X } from "lucide-react";
import Link from "next/link";
import { FileUpload } from "@/components/shared/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Character {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

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

export default function AdminUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [characterId, setCharacterId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [deviceType, setDeviceType] = useState("PHONE");
  const [resolution, setResolution] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  // Check admin access
  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  // Fetch characters and tags
  useEffect(() => {
    Promise.all([
      fetch("/api/characters").then((r) => r.json()),
      fetch("/api/tags").then((r) => r.json()),
    ]).then(([charsData, tagsData]) => {
      if (charsData.success) setCharacters(charsData.data);
      if (tagsData.success) setTags(tagsData.data);
    });
  }, []);

  const handleUploadComplete = (result: UploadResult) => {
    setUploadResult(result);
    setResolution(`${result.width}x${result.height}`);

    // Auto-detect device type based on aspect ratio
    const aspectRatio = result.width / result.height;
    if (aspectRatio > 1.2) {
      setDeviceType("PC");
    } else if (aspectRatio < 0.8) {
      setDeviceType("PHONE");
    } else {
      setDeviceType("TABLET");
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!uploadResult) {
      setError("Please upload a file first");
      return;
    }
    if (!characterId) {
      setError("Please select a character");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/wallpapers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          characterId,
          fileUrl: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnailUrl,
          previewUrl: uploadResult.previewUrl,
          resolution,
          deviceType,
          format: uploadResult.format.toUpperCase().replace("JPEG", "IMAGE").replace("PNG", "IMAGE").replace("WEBP", "IMAGE"),
          isPremium,
          tags: selectedTags,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Reset form
        setTitle("");
        setDescription("");
        setCharacterId("");
        setSelectedTags([]);
        setResolution("");
        setIsPremium(false);
        setUploadResult(null);
      } else {
        setError(data.message || "Failed to upload wallpaper");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-2 hover:bg-[#222] rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              <span className="gold-text">Upload Wallpaper</span>
            </h1>
            <p className="text-sm text-[#666] mt-1">Add new wallpaper to the library</p>
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-3">
            <Check className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-green-400 font-medium">Wallpaper uploaded successfully!</p>
              <p className="text-sm text-green-400/70 mt-1">
                It will be reviewed and published shortly.
              </p>
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="ml-auto p-1 hover:bg-green-500/20 rounded"
            >
              <X className="h-4 w-4 text-green-400" />
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
            <X className="h-5 w-5 text-red-500" />
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto p-1 hover:bg-red-500/20 rounded"
            >
              <X className="h-4 w-4 text-red-400" />
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Upload & Preview */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-[#161616] border border-[#2a2a2a]">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-[#D4A843]" />
                Upload File
              </h2>
              <FileUpload
                type="wallpaper"
                onUploadComplete={handleUploadComplete}
                onUploadError={setError}
              />
            </div>

            {/* Upload result info */}
            {uploadResult && (
              <div className="p-4 rounded-xl bg-[#161616] border border-[#2a2a2a]">
                <h3 className="text-sm font-medium mb-3 text-[#666]">Upload Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-[#444]">Resolution:</span>
                    <span className="ml-2 text-white">
                      {uploadResult.width}x{uploadResult.height}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#444]">Format:</span>
                    <span className="ml-2 text-white uppercase">{uploadResult.format}</span>
                  </div>
                  <div>
                    <span className="text-[#444]">Size:</span>
                    <span className="ml-2 text-white">
                      {(uploadResult.bytes / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div>
                    <span className="text-[#444]">Detected:</span>
                    <Badge variant="default" className="ml-2">
                      {deviceType}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Form */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-[#161616] border border-[#2a2a2a] space-y-4">
              <h2 className="text-lg font-semibold mb-4">Wallpaper Details</h2>

              {/* Title */}
              <div>
                <label className="block text-sm text-[#666] mb-2">Title *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Special Week - Victory Run"
                  className="bg-[#0a0a0a] border-[#2a2a2a]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-[#666] mb-2">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the wallpaper..."
                  rows={3}
                  className="bg-[#0a0a0a] border-[#2a2a2a]"
                />
              </div>

              {/* Character */}
              <div>
                <label className="block text-sm text-[#666] mb-2">Character *</label>
                <select
                  value={characterId}
                  onChange={(e) => setCharacterId(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#D4A843]"
                >
                  <option value="">Select character...</option>
                  {characters.map((char) => (
                    <option key={char.id} value={char.id}>
                      {char.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Device Type */}
              <div>
                <label className="block text-sm text-[#666] mb-2">Device Type</label>
                <div className="flex gap-3">
                  {["PHONE", "TABLET", "PC"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setDeviceType(type)}
                      className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                        deviceType === type
                          ? "bg-[#D4A843]/10 border-[#D4A843] text-[#D4A843]"
                          : "bg-[#0a0a0a] border-[#2a2a2a] text-[#666] hover:border-[#444]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution */}
              <div>
                <label className="block text-sm text-[#666] mb-2">Resolution</label>
                <Input
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Auto-detected from upload"
                  className="bg-[#0a0a0a] border-[#2a2a2a]"
                  readOnly={!!uploadResult}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm text-[#666] mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedTags.includes(tag.id)
                          ? "bg-[#D4A843]/20 border border-[#D4A843] text-[#D4A843]"
                          : "bg-[#0a0a0a] border border-[#2a2a2a] text-[#666] hover:border-[#444]"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Premium toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a]">
                <div>
                  <p className="text-sm font-medium">Premium Content</p>
                  <p className="text-xs text-[#666]">
                    Only premium users can download this wallpaper
                  </p>
                </div>
                <button
                  onClick={() => setIsPremium(!isPremium)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isPremium ? "bg-[#D4A843]" : "bg-[#333]"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      isPremium ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              onClick={handleSubmit}
              disabled={loading || !uploadResult || !title.trim() || !characterId}
              className="w-full"
              variant="premium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Wallpaper
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
