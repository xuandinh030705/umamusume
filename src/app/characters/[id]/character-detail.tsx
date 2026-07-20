"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowLeft, Bell, BellOff, Users, Image, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WallpaperCard } from "@/components/wallpaper/wallpaper-card"
import { WallpaperGrid } from "@/components/wallpaper/wallpaper-grid"
import { EmptyState } from "@/components/shared/empty-state"
import { useToast } from "@/components/ui/toast"

interface Character {
  id: string
  name: string
  nameJp: string | null
  bloodline: string | null
  description: string | null
  avatarUrl: string | null
  coverUrl: string | null
  slug: string
  _count: {
    wallpapers: number
    followers: number
  }
}

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
  _count: {
    comments: number
    likes: number
  }
}

export default function CharacterDetail({ slug }: { slug: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { addToast } = useToast()
  const [character, setCharacter] = useState<Character | null>(null)
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  const userId = (session?.user as { id?: string })?.id

  async function fetchCharacter() {
    try {
      const res = await fetch(`/api/characters/${slug}`)
      const data = await res.json()
      if (data.success) {
        setCharacter(data.data)
        setWallpapers(data.data.wallpapers || [])
      }
    } catch {
      console.error("Failed to fetch character")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCharacter()
  }, [slug])

  useEffect(() => {
    if (userId && character) {
      fetch(`/api/characters/${character.id}/follow`, { method: "POST" })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            setFollowing(data.data.following)
            // Toggle back since we just wanted to check status
            if (data.data.following) {
              return fetch(`/api/characters/${character.id}/follow`, { method: "POST" })
            }
          }
        })
        .catch(() => {})
    }
  }, [userId, character?.id])

  async function handleFollow() {
    if (!userId) {
      router.push(`/auth/login?callbackUrl=/characters/${slug}`)
      return
    }
    if (!character) return

    setFollowLoading(true)
    try {
      const res = await fetch(`/api/characters/${character.id}/follow`, {
        method: "POST",
      })
      const data = await res.json()
      if (data.success) {
        setFollowing(data.data.following)
        addToast({
          type: "success",
          title: data.data.following ? `Following ${character.name}` : `Unfollowed ${character.name}`,
        })
      }
    } catch {
      addToast({ type: "error", title: "Failed to update follow status" })
    } finally {
      setFollowLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-[#222] rounded" />
            <div className="h-48 bg-[#222] rounded-xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[9/16] bg-[#222] rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="Character not found"
          description="The character you're looking for doesn't exist."
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Cover / Header */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        {character.coverUrl ? (
          <img
            src={character.coverUrl}
            alt={character.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0a0a0a] to-[#1a1a2e]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-8">
          <Link
            href="/characters"
            className="absolute top-8 left-4 sm:left-6 lg:left-8 inline-flex items-center gap-2 text-sm text-[#999] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Characters
          </Link>

          <div className="flex items-end gap-6">
            {character.avatarUrl && (
              <div className="hidden sm:block w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#D4A843]/50 shrink-0">
                <img src={character.avatarUrl} alt={character.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">{character.name}</h1>
              {character.nameJp && (
                <p className="text-lg text-[#999]">{character.nameJp}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-[#666]">
                {character.bloodline && (
                  <span className="flex items-center gap-1">
                    <span className="text-[#D4A843]">Bloodline:</span> {character.bloodline}
                  </span>
                )}
                <span>{character._count.wallpapers} wallpapers</span>
                <span>{character._count.followers} followers</span>
              </div>
            </div>
            <Button
              variant={following ? "outline" : "default"}
              onClick={handleFollow}
              disabled={followLoading}
              className="shrink-0"
            >
              {followLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : following ? (
                <BellOff className="h-4 w-4 mr-2" />
              ) : (
                <Bell className="h-4 w-4 mr-2" />
              )}
              {following ? "Unfollow" : "Follow"}
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      {character.description && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-[#999] leading-relaxed">{character.description}</p>
        </div>
      )}

      {/* Wallpapers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold mb-6">
          <span className="gold-text">{character.name}</span> Wallpapers
        </h2>

        {wallpapers.length > 0 ? (
          <WallpaperGrid columns={4}>
            {wallpapers.map((wp, i) => (
              <WallpaperCard
                key={wp.id}
                wallpaper={{
                  id: wp.id,
                  title: wp.title,
                  thumbnailUrl: wp.thumbnailUrl || "/placeholder.png",
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
          </WallpaperGrid>
        ) : (
          <EmptyState
          icon={<Image className="h-12 w-12" />}
          title="No wallpapers yet"
            description="Wallpapers for this character will appear here."
          />
        )}
      </div>
    </div>
  )
}
