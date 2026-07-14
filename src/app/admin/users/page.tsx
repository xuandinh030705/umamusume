"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users, Loader2, Crown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast"
import { formatDate } from "@/lib/utils"

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
  isPremium: boolean
  createdAt: string
  _count: { downloads: number }
}

const roles = ["MEMBER", "PREMIUM", "MODERATOR", "ADMIN"]

const roleColors: Record<string, string> = {
  MEMBER: "text-gray-400",
  PREMIUM: "text-yellow-400",
  MODERATOR: "text-blue-400",
  ADMIN: "text-[#D4A843]",
}

export default function AdminUsersPage() {
  const { status } = useSession()
  const router = useRouter()
  const { addToast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      if (data.success) {
        setUsers(data.data.users)
      }
    } catch {
      console.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
      return
    }
    fetchUsers()
  }, [status])

  async function handleRoleChange(userId: string, newRole: string) {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        )
        addToast({ type: "success", title: "Role updated" })
      }
    } catch {
      addToast({ type: "error", title: "Failed to update role" })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[#999] hover:text-white transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            Manage <span className="gold-text">Users</span>
          </h1>
          <p className="text-[#666]">{users.length} users</p>
        </div>

        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-sm font-medium shrink-0">
                  {user.image ? (
                    <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.name?.charAt(0) || "U"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{user.name}</p>
                    <Badge variant="outline" className={`text-xs ${roleColors[user.role]}`}>
                      {user.role}
                    </Badge>
                    {user.isPremium && (
                      <Badge variant="premium" className="text-xs">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-[#666] truncate">{user.email}</p>
                </div>
                <div className="hidden sm:block text-xs text-[#666]">
                  {user._count.downloads} downloads
                </div>
                <div className="hidden md:block text-xs text-[#666]">
                  {formatDate(user.createdAt)}
                </div>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="h-8 rounded-lg border border-[#333] bg-[#111] px-2 text-sm text-[#e0e0e0]"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
