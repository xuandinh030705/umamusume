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
        "group flex items-center gap-4 rounded-2xl border border-border bg-card p-4",
        "hover:border-border-strong hover:bg-card-hover transition-all duration-300",
        className
      )}
    >
      <Avatar
        src={imageUrl}
        fallback={name.charAt(0)}
        className="h-14 w-14 shrink-0 ring-2 ring-border group-hover:ring-primary/50 transition-all"
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
          {name}
        </h3>
        {bloodline && (
          <p className="text-xs text-muted-foreground mt-0.5">{bloodline}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {wallpaperCount} {wallpaperCount === 1 ? "wallpaper" : "wallpapers"}
        </p>
      </div>
    </Link>
  )
}

export { CharacterCard }
