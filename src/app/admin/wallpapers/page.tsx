"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Image, Loader2, Eye, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast"
import { formatDate } from "@/lib/utils"

interface Wallpaper {
  id: string
  title: string
  deviceType: string
  format: string
  wallpaperStatus: string
  downloadCount: number
  viewCount: number
  isPremium: boolean
  createdAt: string
  character: { name: string } | null
}

export default function AdminWallpapersPage() {
  const { status } = useSession()
  const router = useRouter()
  const { addToast } = useToast()
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchWallpapers() {
    try {
      const res = await fetch("/api/wallpapers?limit=100")
      const data = await res.json()
      if (data.success) {
        setWallpapers(data.data.wallpapers)
      }
    } catch {
      console.error("Failed to fetch wallpapers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
      return
    }
    fetchWallpapers()
  }, [status])

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this wallpaper?")) return
    try {
      await fetch(`/api/wallpapers/${id}`, { method: "DELETE" })
      setWallpapers((prev) => prev.filter((w) => w.id !== id))
      addToast({ type: "success", title: "Wallpaper deleted" })
    } catch {
      addToast({ type: "error", title: "Failed to delete wallpaper" })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[#999] hover:text-white transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            Manage <span className="gold-text">Wallpapers</span>
          </h1>
          <p className="text-[#666]">{wallpapers.length} wallpapers</p>
        </div>

        <div className="space-y-3">
          {wallpapers.map((wp) => (
            <Card key={wp.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-16 rounded bg-[#222] flex items-center justify-center shrink-0">
                  <Image className="h-6 w-6 text-[#666]" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/wallpapers/${wp.id}`} className="font-medium hover:text-[#D4A843] transition-colors">
                    {wp.title}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-[#666] mt-1">
                    {wp.character && <span>{wp.character.name}</span>}
                    <span>{wp.deviceType}</span>
                    <span>{wp.format}</span>
                    <Badge variant="outline" className="text-xs">
                      {wp.wallpaperStatus}
                    </Badge>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-[#666]">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {wp.viewCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {wp.downloadCount}
                  </span>
                </div>
                <div className="text-xs text-[#666] hidden md:block">
                  {formatDate(wp.createdAt)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(wp.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
