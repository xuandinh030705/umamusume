export interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
  isPremium: boolean
  bio: string | null
  createdAt: Date
}

export interface Character {
  id: string
  name: string
  nameJp: string | null
  bloodline: string | null
  description: string | null
  avatarUrl: string | null
  coverUrl: string | null
  slug: string
  _count?: {
    wallpapers: number
    followers: number
  }
}

export interface Wallpaper {
  id: string
  title: string
  description: string | null
  fileUrl: string
  thumbnailUrl: string | null
  previewUrl: string | null
  resolution: string | null
  deviceType: string
  format: string
  wallpaperStatus: string
  downloadCount: number
  viewCount: number
  isPremium: boolean
  createdAt: Date
  character?: Character | null
  uploader?: User | null
  tags?: Tag[]
  _count?: {
    comments: number
    likes: number
  }
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Comment {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  user: User
  replies?: Comment[]
}

export interface Collection {
  id: string
  name: string
  description: string | null
  isPublic: boolean
  _count?: {
    items: number
  }
}

export interface CharacterRequest {
  id: string
  characterName: string
  note: string | null
  upvoteCount: number
  status: string
  createdAt: Date
  user: User
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: string
}
