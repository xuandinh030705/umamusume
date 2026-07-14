import Link from "next/link"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"

interface CharacterCardProps {
  id: string
  name: string
  imageUrl?: string
  bloodline?: string
  wallpaperCount: number
  className?: string
}

function CharacterCard({ id, name, imageUrl, bloodline, wallpaperCount, className }: CharacterCardProps) {
  return (
    <Link
      href={`/characters/${id}`}
      className={cn(
        "group flex items-center gap-4 rounded-xl border border-[#222] bg-[#161616] p-4",
        "hover:border-[#333] hover:bg-[#1a1a2e] transition-all duration-300",
        className
      )}
    >
      <Avatar
        src={imageUrl}
        fallback={name.charAt(0)}
        className="h-14 w-14 shrink-0 ring-2 ring-[#222] group-hover:ring-[#D4A843]/50 transition-all"
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium text-white group-hover:text-[#D4A843] transition-colors truncate">
          {name}
        </h3>
        {bloodline && (
          <p className="text-xs text-[#666] mt-0.5">{bloodline}</p>
        )}
        <p className="text-xs text-[#999] mt-1">
          {wallpaperCount} {wallpaperCount === 1 ? "wallpaper" : "wallpapers"}
        </p>
      </div>
    </Link>
  )
}

export { CharacterCard }
