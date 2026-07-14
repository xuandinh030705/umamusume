"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Download, Eye, Star, Image } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface Wallpaper {
  id: string
  title: string
  thumbnailUrl: string | null
  characterName?: string
  deviceType: string
  resolution?: string | null
  isPremium: boolean
  likeCount: number
  downloadCount: number
  viewCount?: number
}

interface WallpaperCardProps {
  wallpaper: Wallpaper
  index?: number
}

function WallpaperCard({ wallpaper, index = 0 }: WallpaperCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [liked] = useState(false)

  const deviceLabel =
    wallpaper.deviceType === "PHONE"
      ? "Phone"
      : wallpaper.deviceType === "TABLET"
        ? "Tablet"
        : "PC"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/wallpapers/${wallpaper.id}`}
        className="group block relative overflow-hidden rounded-xl bg-[#161616] border border-[#222] hover:border-[#333] transition-all duration-300"
      >
        <div className="relative aspect-[9/16] overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#222] animate-pulse" />
          )}
          {wallpaper.thumbnailUrl ? (
            <img
              src={wallpaper.thumbnailUrl}
              alt={wallpaper.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={cn(
                "h-full w-full object-cover transition-all duration-500 group-hover:scale-110",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
            />
          ) : (
            <div className="h-full w-full bg-[#222] flex items-center justify-center">
              <Image className="h-12 w-12 text-[#444]" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Badge variant={wallpaper.deviceType === "PHONE" ? "default" : "secondary"}>
              {deviceLabel}
            </Badge>
            {wallpaper.isPremium && (
              <Badge variant="premium">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Premium
              </Badge>
            )}
          </div>

          {wallpaper.resolution && (
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Badge variant="outline" className="text-xs">
                {wallpaper.resolution}
              </Badge>
            </div>
          )}
        </div>

        <div className="p-3 space-y-2">
          <h3 className="text-sm font-medium text-white truncate group-hover:text-[#D4A843] transition-colors">
            {wallpaper.title}
          </h3>
          {wallpaper.characterName && (
            <p className="text-xs text-[#666]">{wallpaper.characterName}</p>
          )}
          <div className="flex items-center justify-between text-xs text-[#666]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                {liked ? (
                  <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                ) : (
                  <Heart className="h-3.5 w-3.5" />
                )}
                {wallpaper.likeCount}
              </span>
              <span className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                {wallpaper.downloadCount}
              </span>
            </div>
            {wallpaper.viewCount !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {wallpaper.viewCount}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export { WallpaperCard }
export type { Wallpaper }
