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
        className="group block relative rounded-2xl bg-card border border-card-border overflow-hidden transition-all duration-300 hover:bg-card-hover hover:border-border-strong hover-lift"
      >
        <div className="relative aspect-[9/16] overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-surface shimmer" />
          )}
          {wallpaper.thumbnailUrl ? (
            <img
              src={wallpaper.thumbnailUrl}
              alt={wallpaper.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={cn(
                "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
            />
          ) : (
            <div className="h-full w-full bg-surface flex items-center justify-center">
              <Image className="h-12 w-12 text-muted" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
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
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
              <Badge variant="outline" className="text-xs glass-subtle">
                {wallpaper.resolution}
              </Badge>
            </div>
          )}
        </div>

        <div className="p-3.5 space-y-2">
          <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors duration-300">
            {wallpaper.title}
          </h3>
          {wallpaper.characterName && (
            <p className="text-xs text-muted-foreground">{wallpaper.characterName}</p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 transition-colors duration-200 hover:text-foreground cursor-default">
                {liked ? (
                  <Heart className="h-3.5 w-3.5 fill-destructive text-destructive" />
                ) : (
                  <Heart className="h-3.5 w-3.5" />
                )}
                {wallpaper.likeCount}
              </span>
              <span className="flex items-center gap-1 transition-colors duration-200 hover:text-foreground cursor-default">
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
