export const SITE_NAME = "UmaWall"
export const SITE_DESCRIPTION = "Your ultimate Umamusume Pretty Derby wallpaper gallery"
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const ROLES = {
  GUEST: "GUEST",
  MEMBER: "MEMBER",
  PREMIUM: "PREMIUM",
  MODERATOR: "MODERATOR",
  ADMIN: "ADMIN",
} as const

export const WALLPAPER_STATUS = {
  PENDING: "PENDING",
  PUBLISHED: "PUBLISHED",
  HIDDEN: "HIDDEN",
} as const

export const DEVICE_TYPES = [
  { value: "PHONE", label: "Phone" },
  { value: "TABLET", label: "Tablet" },
  { value: "PC", label: "PC" },
] as const

export const RESOLUTIONS = [
  "1080x1920",
  "1440x2560",
  "2160x3840",
  "1920x1080",
  "2560x1440",
  "3840x2160",
] as const

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Most Popular" },
  { value: "downloads", label: "Most Downloads" },
] as const
