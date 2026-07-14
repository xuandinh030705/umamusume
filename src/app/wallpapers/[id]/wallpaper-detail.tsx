"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Heart, Eye, Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CommentSection } from "@/components/comments/comment-section"
import { EmptyState } from "@/components/shared/empty-state"

interface WallpaperData {
  id: string
  title: string
  description: string | null
  fileUrl: string
  thumbnailUrl: string | null
  previewUrl: string | null
  resolution: string | null
  deviceType: string
  format: string
  wallpaperStatus: string
  downloadCount: number
  viewCount: number
  isPremium: boolean
  createdAt: string
  character?: { id: string; name: string; slug: string } | null
  uploader?: { id: string; name: string; image: string | null } | null
  wallpaperTags?: { tag: { id: string; name: string; slug: string } }[]
  _count?: { comments: number; likes: number; downloads: number }
}

interface CommentData {
  id: string
  content: string
  createdAt: string
  user: { id: string; name: string; image?: string; role: string }
  replies?: CommentData[]
}

export default function WallpaperDetail({ wallpaperId }: { wallpaperId: string }) {
  const [wallpaper, setWallpaper] = useState<WallpaperData | null>(null)
  const [comments, setComments] = useState<CommentData[]>([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchWallpaper()
    fetchComments()
  }, [wallpaperId])

  async function fetchWallpaper() {
    try {
      const res = await fetch(`/api/wallpapers/${wallpaperId}`)
      const data = await res.json()
      if (data.success) {
        setWallpaper(data.data)
      }
    } catch {
      console.error("Failed to fetch wallpaper")
    } finally {
      setLoading(false)
    }
  }

  async function fetchComments() {
    try {
      const res = await fetch(`/api/wallpapers/${wallpaperId}/comments`)
      const data = await res.json()
      if (data.success) {
        setComments(data.data)
      }
    } catch {
      console.error("Failed to fetch comments")
    }
  }

  async function handleDownload() {
    setDownloading(true)
    try {
      const res = await fetch(`/api/wallpapers/${wallpaperId}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "current-user" }),
      })
      const data = await res.json()
      if (data.success && data.data?.fileUrl) {
        window.open(data.data.fileUrl, "_blank")
      }
    } catch {
      console.error("Download failed")
    } finally {
      setDownloading(false)
    }
  }

  async function handleLike() {
    try {
      const res = await fetch(`/api/wallpapers/${wallpaperId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "current-user" }),
      })
      const data = await res.json()
      if (data.success) {
        setLiked(data.data.liked)
      }
    } catch {
      console.error("Like failed")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-[#222] rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 aspect-[9/16] bg-[#222] rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 bg-[#222] rounded" />
                <div className="h-4 bg-[#222] rounded w-2/3" />
                <div className="h-4 bg-[#222] rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!wallpaper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          icon={<span className="text-5xl">🖼️</span>}
          title="Wallpaper not found"
          description="The wallpaper you're looking for doesn't exist or has been removed."
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/wallpapers"
          className="inline-flex items-center gap-2 text-sm text-[#999] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden bg-[#161616] border border-[#222]">
              <img
                src={wallpaper.thumbnailUrl || wallpaper.fileUrl}
                alt={wallpaper.title}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{wallpaper.title}</h1>
              {wallpaper.description && (
                <p className="text-[#999] text-sm">{wallpaper.description}</p>
              )}
            </div>

            {wallpaper.character && (
              <div className="text-sm">
                <span className="text-[#666]">Character: </span>
                <Link href={`/characters/${wallpaper.character.slug}`} className="text-[#D4A843] hover:underline">
                  {wallpaper.character.name}
                </Link>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{wallpaper.deviceType}</Badge>
              <Badge variant="secondary">{wallpaper.format}</Badge>
              {wallpaper.resolution && <Badge variant="outline">{wallpaper.resolution}</Badge>}
              {wallpaper.isPremium && <Badge variant="premium"><Star className="h-3 w-3 mr-1 fill-current" /> Premium</Badge>}
            </div>

            {wallpaper.wallpaperTags && wallpaper.wallpaperTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {wallpaper.wallpaperTags.map((wt) => (
                  <Badge key={wt.tag.id} variant="outline" className="text-xs">#{wt.tag.name}</Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-6 text-sm text-[#666]">
              <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {wallpaper.viewCount}</span>
              <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {wallpaper._count?.likes || 0}</span>
              <span className="flex items-center gap-1"><Download className="h-4 w-4" /> {wallpaper.downloadCount}</span>
            </div>

            {wallpaper.uploader && (
              <div className="text-sm text-[#666]">
                Uploaded by <span className="text-white">{wallpaper.uploader.name}</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleDownload} disabled={downloading} className="flex-1">
                {downloading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                Download
              </Button>
              <Button variant="outline" onClick={handleLike}>
                <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <CommentSection
            comments={comments}
            onSubmit={(content, parentId) => {
              fetch("/api/auth/session").then(() => {
                fetch(`/api/wallpapers/${wallpaperId}/comments`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ content, parentCommentId: parentId, userId: "current-user" }),
                }).then(() => fetchComments())
              })
            }}
            onDelete={(commentId) => {
              fetch(`/api/comments/${commentId}`, { method: "DELETE" }).then(() => fetchComments())
            }}
            onLike={() => {}}
          />
        </div>
      </div>
    </div>
  )
}
