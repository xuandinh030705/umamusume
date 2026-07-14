"use client"

import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface WallpaperGridProps {
  children: ReactNode
  className?: string
  columns?: 2 | 3 | 4 | 5
}

const columnMap = {
  2: "grid-cols-2 sm:grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
}

function WallpaperGrid({ children, className, columns = 4 }: WallpaperGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columnMap[columns],
        className
      )}
    >
      {children}
    </div>
  )
}

export { WallpaperGrid }
