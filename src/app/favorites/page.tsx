"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Heart, Loader2, AlertCircle } from "lucide-react"
import { WallpaperCard } from "@/components/wallpaper/wallpaper-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"

interface Wallpaper {
  id: string
  title: string
  thumbnailUrl: string | null
  resolution: string | null
  deviceType: string
  format: string
  downloadCount: number
  viewCount: number
  isPremium: boolean
  character?: { name: string } | null
  _count: { comments: number; likes: number; downloads: number }
}

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
      return
    }
    if (status === "authenticated") {
      fetchFavorites()
    }
  }, [status])

  async function fetchFavorites() {
    try {
      const res = await fetch("/api/favorites")
      const data = await res.json()
      if (data.success) {
        setWallpapers(data.data)
      } else {
        setError("Failed to load favorites")
      }
    } catch {
      setError("Failed to load favorites. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-[#999] mb-4">{error}</p>
          <Button variant="outline" onClick={() => { setError(null); setLoading(true); fetchFavorites() }}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            My <span className="gold-text">Favorites</span>
          </h1>
          <p className="text-[#666]">Wallpapers you&apos;ve liked</p>
        </div>

        {wallpapers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wallpapers.map((wp, i) => (
              <WallpaperCard
                key={wp.id}
                wallpaper={{
                  id: wp.id,
                  title: wp.title,
                  thumbnailUrl: wp.thumbnailUrl,
                  characterName: wp.character?.name,
                  deviceType: wp.deviceType,
                  resolution: wp.resolution ?? undefined,
                  isPremium: wp.isPremium,
                  likeCount: wp._count.likes,
                  downloadCount: wp.downloadCount,
                  viewCount: wp.viewCount,
                }}
                index={i}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Heart className="h-12 w-12" />}
            title="No favorites yet"
            description="Start liking wallpapers to see them here."
          />
        )}
      </div>
    </div>
  )
}
