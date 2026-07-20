"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Download, Bookmark, Calendar, Crown, Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface UserProfile {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
  isPremium: boolean
  bio: string | null
  createdAt: string
  _count: {
    downloads: number
    collections: number
    comments: number
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = (session?.user as { id?: string })?.id

  async function fetchProfile() {
    try {
      const res = await fetch(`/api/users/${userId}`)
      const data = await res.json()
      if (data.success) {
        setProfile(data.data)
      } else {
        setError("Failed to load profile")
      }
    } catch {
      setError("Failed to load profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
      return
    }
    if (userId) fetchProfile()
  }, [userId, status])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error ? (
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-[#999] mb-4">{error}</p>
            <Button variant="outline" onClick={() => { setError(null); setLoading(true); fetchProfile() }}>
              Try Again
            </Button>
          </div>
        ) : (
          <p className="text-muted">Profile not found</p>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-surface border border-border-strong flex items-center justify-center text-2xl font-bold text-primary shrink-0 overflow-hidden">
            {profile.image ? (
              <img src={profile.image} alt="" className="w-full h-full object-cover" />
            ) : (
              profile.name?.charAt(0) || "U"
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
              <Badge variant="outline" className="text-xs border-border-strong">
                {profile.role}
              </Badge>
              {profile.isPremium && (
                <Badge variant="premium" className="text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{profile.email}</p>
            {profile.bio && (
              <p className="text-muted-foreground mt-2">{profile.bio}</p>
            )}
            <p className="text-xs text-muted mt-2 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Joined {formatDate(profile.createdAt)}
            </p>
          </div>
          <Link href="/profile/settings">
            <Button variant="outline" size="sm" className="border-border-strong hover:bg-surface-hover">Edit Profile</Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="rounded-2xl glass border-border-strong">
            <CardContent className="p-4 text-center">
              <Download className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{profile._count.downloads}</p>
              <p className="text-xs text-muted">Downloads</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl glass border-border-strong">
            <CardContent className="p-4 text-center">
              <Bookmark className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{profile._count.collections}</p>
              <p className="text-xs text-muted">Collections</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl glass border-border-strong">
            <CardContent className="p-4 text-center">
              <User className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{profile._count.comments}</p>
              <p className="text-xs text-muted">Comments</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/collections">
            <Card className="rounded-2xl glass border-border-strong hover:border-primary/30 hover:bg-card-hover transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Bookmark className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">My Collections</p>
                  <p className="text-xs text-muted">View your saved wallpapers</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/requests">
            <Card className="rounded-2xl glass border-border-strong hover:border-primary/30 hover:bg-card-hover transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">My Requests</p>
                  <p className="text-xs text-muted">View your character requests</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
