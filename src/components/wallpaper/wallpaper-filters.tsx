"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"

const deviceTypes = [
  { value: "", label: "All Devices" },
  { value: "PHONE", label: "Phone" },
  { value: "TABLET", label: "Tablet" },
  { value: "PC", label: "PC" },
]

const resolutions = [
  { value: "", label: "All Resolutions" },
  { value: "1080x1920", label: "1080x1920" },
  { value: "1440x2560", label: "1440x2560" },
  { value: "2160x3840", label: "2160x3840" },
  { value: "1920x1080", label: "1920x1080" },
  { value: "2560x1440", label: "2560x1440" },
  { value: "3840x2160", label: "3840x2160" },
]

const formats = [
  { value: "", label: "All Formats" },
  { value: "IMAGE", label: "Image" },
  { value: "GIF", label: "GIF" },
  { value: "VIDEO", label: "Video" },
]

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Most Popular" },
  { value: "downloads", label: "Most Downloads" },
]

interface FilterValues {
  character: string
  deviceType: string
  resolution: string
  format: string
  sort: string
  search: string
}

interface WallpaperFiltersProps {
  onFilterChange: (filters: FilterValues) => void
  className?: string
  characters?: { value: string; label: string }[]
}

function WallpaperFilters({ onFilterChange, className, characters = [] }: WallpaperFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    character: "",
    deviceType: "",
    resolution: "",
    format: "",
    sort: "newest",
    search: "",
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  function updateFilter(key: keyof FilterValues, value: string) {
    const next = { ...filters, [key]: value }
    setFilters(next)
    onFilterChange(next)
  }

  function clearFilters() {
    const cleared = {
      character: "",
      deviceType: "",
      resolution: "",
      format: "",
      sort: "newest",
      search: "",
    }
    setFilters(cleared)
    onFilterChange(cleared)
  }

  const hasActiveFilters = Object.entries(filters).some(
    ([key, val]) => key !== "sort" && val !== ""
  )

  const filterContent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Character</label>
        <Select
          options={[
            { value: "", label: "All Characters" },
            ...characters,
          ]}
          value={filters.character}
          onChange={(e) => updateFilter("character", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Device Type</label>
        <Select
          options={deviceTypes}
          value={filters.deviceType}
          onChange={(e) => updateFilter("deviceType", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Resolution</label>
        <Select
          options={resolutions}
          value={filters.resolution}
          onChange={(e) => updateFilter("resolution", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Format</label>
        <Select
          options={formats}
          value={filters.format}
          onChange={(e) => updateFilter("format", e.target.value)}
        />
      </div>

      <div className="pt-3 border-t border-border">
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Sort By</label>
        <Select
          options={sortOptions}
          value={filters.sort}
          onChange={(e) => updateFilter("sort", e.target.value)}
        />
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="w-full text-xs text-muted-foreground hover:text-foreground hover:bg-surface-hover"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  )

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className={cn(
          "lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-background bg-primary",
          "shadow-lg hover:shadow-primary/20 hover:bg-primary-light transition-all duration-300 active:scale-95"
        )}
      >
        <Filter className="h-4 w-4" />
        Filters
      </button>

      <aside className={cn("hidden lg:block w-56 shrink-0", className)}>
        <div className="sticky top-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary hover:text-primary-light transition-colors duration-200"
              >
                Clear all
              </button>
            )}
          </div>
          {filterContent}
        </div>
      </aside>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-scrim backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-72 border-l border-border bg-card p-6 lg:hidden animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-foreground">Filters</h3>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </>
      )}
    </>
  )
}

export { WallpaperFilters }
export type { FilterValues }
