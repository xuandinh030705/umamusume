"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Bookmark, Eye, EyeOff } from "lucide-react"
import { WallpaperCard } from "@/components/wallpaper/wallpaper-card"
import { WallpaperGrid } from "@/components/wallpaper/wallpaper-grid"
import { EmptyState } from "@/components/shared/empty-state"
import { formatDate } from "@/lib/utils"

interface CollectionData {
  id: string
  name: string
  description: string | null
  isPublic: boolean
  createdAt: string
  user: { id: string; name: string; image: string | null }
  items: {
    wallpaper: {
      id: string
      title: string
      thumbnailUrl: string | null
      resolution: string | null
      deviceType: string
      format: string
      downloadCount: number
      viewCount: number
      isPremium: boolean
      character: { name: string } | null
      _count: { likes: number; comments: number }
    }
  }[]
}

export default function CollectionDetailPage() {
  const params = useParams()
  const [collection, setCollection] = useState<CollectionData | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchCollection() {
    try {
      const res = await fetch(`/api/collections/${params.id}`)
      const data = await res.json()
      if (data.success) {
        setCollection(data.data)
      }
    } catch {
      console.error("Failed to fetch collection")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCollection()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#666]">Loading collection...</div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          icon={<Bookmark className="h-12 w-12" />}
          title="Collection not found"
          description="This collection doesn't exist or has been deleted."
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-sm text-[#999] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collections
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{collection.name}</h1>
            <span className="flex items-center gap-1 text-sm text-[#666]">
              {collection.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {collection.isPublic ? "Public" : "Private"}
            </span>
          </div>
          {collection.description && (
            <p className="text-[#999]">{collection.description}</p>
          )}
          <p className="text-sm text-[#666] mt-2">
            By {collection.user.name} &middot; {formatDate(collection.createdAt)}
          </p>
        </div>

        {collection.items.length > 0 ? (
          <WallpaperGrid columns={4}>
            {collection.items.map(({ wallpaper }, i) => (
              <WallpaperCard
                key={wallpaper.id}
                wallpaper={{
                  id: wallpaper.id,
                  title: wallpaper.title,
                  thumbnailUrl: wallpaper.thumbnailUrl || "/placeholder.png",
                  characterName: wallpaper.character?.name,
                  deviceType: wallpaper.deviceType,
                  resolution: wallpaper.resolution ?? undefined,
                  isPremium: wallpaper.isPremium,
                  likeCount: wallpaper._count.likes,
                  downloadCount: wallpaper.downloadCount,
                  viewCount: wallpaper.viewCount,
                }}
                index={i}
              />
            ))}
          </WallpaperGrid>
        ) : (
          <EmptyState
            icon={<Bookmark className="h-12 w-12" />}
            title="No wallpapers in this collection"
            description="Start adding wallpapers from the library."
          />
        )}
      </div>
    </div>
  )
}
