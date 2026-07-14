"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Download, Bookmark, Calendar, Crown, Loader2 } from "lucide-react"
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

  const userId = (session?.user as { id?: string })?.id

  async function fetchProfile() {
    try {
      const res = await fetch(`/api/users/${userId}`)
      const data = await res.json()
      if (data.success) {
        setProfile(data.data)
      }
    } catch {
      console.error("Failed to fetch profile")
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
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#666]">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-[#222] flex items-center justify-center text-2xl font-bold text-[#D4A843] shrink-0 overflow-hidden">
            {profile.image ? (
              <img src={profile.image} alt="" className="w-full h-full object-cover" />
            ) : (
              profile.name?.charAt(0) || "U"
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <Badge variant="outline" className="text-xs">
                {profile.role}
              </Badge>
              {profile.isPremium && (
                <Badge variant="premium" className="text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <p className="text-[#666]">{profile.email}</p>
            {profile.bio && (
              <p className="text-[#999] mt-2">{profile.bio}</p>
            )}
            <p className="text-xs text-[#666] mt-2 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Joined {formatDate(profile.createdAt)}
            </p>
          </div>
          <Link href="/profile/settings">
            <Button variant="outline" size="sm">Edit Profile</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Download className="h-5 w-5 text-[#D4A843] mx-auto mb-1" />
              <p className="text-xl font-bold">{profile._count.downloads}</p>
              <p className="text-xs text-[#666]">Downloads</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Bookmark className="h-5 w-5 text-[#D4A843] mx-auto mb-1" />
              <p className="text-xl font-bold">{profile._count.collections}</p>
              <p className="text-xs text-[#666]">Collections</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <User className="h-5 w-5 text-[#D4A843] mx-auto mb-1" />
              <p className="text-xl font-bold">{profile._count.comments}</p>
              <p className="text-xs text-[#666]">Comments</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/collections">
            <Card className="hover:border-[#D4A843]/30 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Bookmark className="h-5 w-5 text-[#D4A843]" />
                <div>
                  <p className="font-medium">My Collections</p>
                  <p className="text-xs text-[#666]">View your saved wallpapers</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/requests">
            <Card className="hover:border-[#D4A843]/30 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <User className="h-5 w-5 text-[#D4A843]" />
                <div>
                  <p className="font-medium">My Requests</p>
                  <p className="text-xs text-[#666]">View your character requests</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
