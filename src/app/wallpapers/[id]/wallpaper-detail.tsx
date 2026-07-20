"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowLeft, Download, Heart, Eye, Star, Loader2, Bookmark, Plus, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CommentSection } from "@/components/comments/comment-section"
import { EmptyState } from "@/components/shared/empty-state"
import { useToast } from "@/components/ui/toast"

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
  likeCount?: number
  likedByMe?: boolean
  replies?: CommentData[]
}

interface Collection {
  id: string
  name: string
  _count: { items: number }
}

export default function WallpaperDetail({ wallpaperId }: { wallpaperId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { addToast } = useToast()
  const [wallpaper, setWallpaper] = useState<WallpaperData | null>(null)
  const [comments, setComments] = useState<CommentData[]>([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [showCollections, setShowCollections] = useState(false)

  const userId = (session?.user as { id?: string })?.id
  const userRole = (session?.user as { role?: string })?.role
  const isPremiumUser = (session?.user as { isPremium?: boolean })?.isPremium

  useEffect(() => {
    fetchWallpaper()
    fetchComments()
  }, [wallpaperId])

  useEffect(() => {
    if (userId) {
      fetchCollections()
      checkLiked()
    }
  }, [userId])

  async function fetchWallpaper() {
    try {
      const res = await fetch(`/api/wallpapers/${wallpaperId}`)
      const data = await res.json()
      if (data.success) {
        setWallpaper(data.data)
        setLikeCount(data.data._count?.likes || 0)
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
        const mapped = data.data.map((c: CommentData & { _count?: { commentLikes?: number } }) => ({
          ...c,
          likeCount: c._count?.commentLikes ?? 0,
          replies: c.replies?.map((r: CommentData & { _count?: { commentLikes?: number } }) => ({
            ...r,
            likeCount: r._count?.commentLikes ?? 0,
          })),
        }))
        setComments(mapped)
      }
    } catch {
      console.error("Failed to fetch comments")
    }
  }

  async function fetchCollections() {
    try {
      const res = await fetch("/api/collections")
      const data = await res.json()
      if (data.success) {
        setCollections(data.data)
      }
    } catch {
      console.error("Failed to fetch collections")
    }
  }

  async function checkLiked() {
    try {
      const res = await fetch(`/api/wallpapers/${wallpaperId}/like`, {
        method: "POST",
      })
      const data = await res.json()
      if (data.success) {
        setLiked(data.data.liked)
        if (data.data.liked) setLikeCount((c) => c + 1)
      }
    } catch {
      // ignore
    }
  }

  async function handleDownload() {
    if (!userId) {
      router.push(`/auth/login?callbackUrl=/wallpapers/${wallpaperId}`)
      return
    }
    setDownloading(true)
    try {
      const res = await fetch(`/api/wallpapers/${wallpaperId}/download`, {
        method: "POST",
      })
      const data = await res.json()
      if (data.success && data.data?.fileUrl) {
        window.open(data.data.fileUrl, "_blank")
        addToast({ type: "success", title: "Download started!" })
      } else {
        addToast({ type: "error", title: data.message || "Download failed" })
      }
    } catch {
      addToast({ type: "error", title: "Download failed" })
    } finally {
      setDownloading(false)
    }
  }

  async function handleLike() {
    if (!userId) {
      router.push(`/auth/login?callbackUrl=/wallpapers/${wallpaperId}`)
      return
    }
    try {
      const res = await fetch(`/api/wallpapers/${wallpaperId}/like`, {
        method: "POST",
      })
      const data = await res.json()
      if (data.success) {
        setLiked(data.data.liked)
        setLikeCount((c) => (data.data.liked ? c + 1 : c - 1))
      }
    } catch {
      console.error("Like failed")
    }
  }

  async function handleAddToCollection(collectionId: string) {
    if (!userId) {
      router.push(`/auth/login?callbackUrl=/wallpapers/${wallpaperId}`)
      return
    }
    try {
      const res = await fetch(`/api/collections/${collectionId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallpaperId }),
      })
      const data = await res.json()
      if (data.success) {
        addToast({ type: "success", title: "Added to collection!" })
        setShowCollections(false)
      } else {
        addToast({ type: "warning", title: data.message || "Already in collection" })
      }
    } catch {
      addToast({ type: "error", title: "Failed to add to collection" })
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this wallpaper?")) return
    try {
      const res = await fetch(`/api/wallpapers/${wallpaperId}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        addToast({ type: "success", title: "Wallpaper deleted" })
        router.push("/wallpapers")
      }
    } catch {
      addToast({ type: "error", title: "Failed to delete" })
    }
  }

  async function handleSubmitComment(content: string, parentId?: string) {
    if (!userId) {
      router.push(`/auth/login?callbackUrl=/wallpapers/${wallpaperId}`)
      return
    }
    try {
      const res = await fetch(`/api/wallpapers/${wallpaperId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, parentCommentId: parentId }),
      })
      const data = await res.json()
      if (data.success) {
        fetchComments()
        addToast({ type: "success", title: "Comment posted!" })
      }
    } catch {
      addToast({ type: "error", title: "Failed to post comment" })
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" })
      if (res.ok) {
        fetchComments()
      }
    } catch {
      addToast({ type: "error", title: "Failed to delete comment" })
    }
  }

  async function handleLikeComment(commentId: string) {
    if (!userId) {
      router.push(`/auth/login?callbackUrl=/wallpapers/${wallpaperId}`)
      return
    }
    try {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: "POST",
      })
      const data = await res.json()
      if (data.success) {
        fetchComments()
      }
    } catch {
      addToast({ type: "error", title: "Failed to like comment" })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-surface rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 aspect-[9/16] bg-surface rounded-2xl" />
              <div className="space-y-4">
                <div className="h-8 bg-surface rounded-xl" />
                <div className="h-4 bg-surface rounded-xl w-2/3" />
                <div className="h-4 bg-surface rounded-xl w-1/2" />
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

  const isOwner = userId === wallpaper.uploader?.id
  const canDelete = isOwner || userRole === "ADMIN" || userRole === "MODERATOR"

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/wallpapers"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden bg-card border border-border">
              <img
                src={wallpaper.thumbnailUrl || wallpaper.fileUrl}
                alt={wallpaper.title}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{wallpaper.title}</h1>
              {wallpaper.description && (
                <p className="text-muted-foreground text-sm">{wallpaper.description}</p>
              )}
            </div>

            {wallpaper.character && (
              <div className="text-sm">
                <span className="text-muted-foreground">Character: </span>
                <Link href={`/characters/${wallpaper.character.slug}`} className="text-primary hover:underline">
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

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {wallpaper.viewCount}</span>
              <span className="flex items-center gap-1">
                <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} /> {likeCount}
              </span>
              <span className="flex items-center gap-1"><Download className="h-4 w-4" /> {wallpaper.downloadCount}</span>
            </div>

            {wallpaper.uploader && (
              <div className="text-sm text-muted-foreground">
                Uploaded by <span className="text-foreground">{wallpaper.uploader.name}</span>
              </div>
            )}

            <div className="flex gap-3">
              {wallpaper.isPremium && !isPremiumUser ? (
                <Button onClick={() => router.push("/premium")} className="flex-1 bg-[#D4A843] hover:bg-[#b8922e] text-black">
                  <Lock className="h-4 w-4 mr-2" />
                  Upgrade to Download
                </Button>
              ) : (
                <Button onClick={handleDownload} disabled={downloading} className="flex-1">
                  {downloading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                  Download
                </Button>
              )}
              <Button variant="outline" onClick={handleLike}>
                <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <div className="relative">
                <Button variant="outline" onClick={() => setShowCollections(!showCollections)}>
                  <Bookmark className="h-4 w-4" />
                </Button>
                {showCollections && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowCollections(false)} />
                    <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-border bg-card p-2 shadow-xl">
                      <p className="text-xs text-muted-foreground px-2 py-1">Add to collection</p>
                      {collections.length === 0 ? (
                        <p className="text-xs text-muted px-2 py-2">No collections yet</p>
                      ) : (
                        collections.map((col) => (
                          <button
                            key={col.id}
                            onClick={() => handleAddToCollection(col.id)}
                            className="w-full text-left flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-foreground hover:bg-surface-hover transition-colors"
                          >
                            <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
                            {col.name}
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {canDelete && (
              <div className="pt-4 border-t border-border">
                <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive/80">
                  Delete Wallpaper
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12">
          <CommentSection
            comments={comments}
            currentUserId={userId}
            onSubmit={handleSubmitComment}
            onDelete={handleDeleteComment}
            onLike={handleLikeComment}
          />
        </div>
      </div>
    </div>
  )
}
