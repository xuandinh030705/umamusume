"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  LayoutDashboard, Image, Users, MessageSquare, AlertTriangle,
  Download, Eye, Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Stats {
  totalUsers: number
  totalWallpapers: number
  totalDownloads: number
  totalViews: number
  recentUsers: { id: string; name: string; image: string | null; role: string; createdAt: string }[]
  topWallpapers: { id: string; title: string; downloadCount: number; viewCount: number }[]
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats")
      const data = await res.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch {
      console.error("Failed to fetch stats")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load dashboard</p>
      </div>
    )
  }

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400" },
    { label: "Total Wallpapers", value: stats.totalWallpapers, icon: Image, color: "text-success" },
    { label: "Total Downloads", value: stats.totalDownloads, icon: Download, color: "text-primary" },
    { label: "Total Views", value: stats.totalViews, icon: Eye, color: "text-purple-400" },
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.label} className="rounded-2xl border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value.toLocaleString()}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color} opacity-50`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Users</span>
                <Link href="/admin/users" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-hover transition-colors">
                    <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-sm font-medium">
                      {user.image ? (
                        <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.name?.charAt(0) || "U"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Wallpapers */}
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Top Wallpapers</span>
                <Link href="/admin/wallpapers" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topWallpapers.map((wp, i) => (
                  <div key={wp.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-hover transition-colors">
                    <span className="text-sm font-bold text-primary w-6">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{wp.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {wp.downloadCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {wp.viewCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link href="/admin/wallpapers">
                <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-surface-hover transition-all text-center">
                  <Image className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Wallpapers</p>
                </div>
              </Link>
              <Link href="/admin/users">
                <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-surface-hover transition-all text-center">
                  <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Users</p>
                </div>
              </Link>
              <Link href="/admin/requests">
                <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-surface-hover transition-all text-center">
                  <MessageSquare className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Requests</p>
                </div>
              </Link>
              <Link href="/admin/reports">
                <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-surface-hover transition-all text-center">
                  <AlertTriangle className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Reports</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
