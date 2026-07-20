"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, Loader2, TrendingUp, Users, Image, Download, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Analytics {
  totalUsers: number
  totalWallpapers: number
  totalDownloads: number
  totalViews: number
  usersThisMonth: number
  wallpapersThisMonth: number
  downloadsThisMonth: number
  topWallpapers: { id: string; title: string; downloadCount: number; viewCount: number; createdAt: string }[]
  recentUsers: { id: string; name: string; createdAt: string }[]
  wallpapersByDevice: { deviceType: string; _count: number }[]
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setAnalytics(data.data)
      })
      .catch(() => console.error("Failed"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#666]">Failed to load analytics</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[#999] hover:text-white transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="h-8 w-8 text-[#D4A843]" />
          <h1 className="text-3xl font-bold">Analytics</h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: analytics.totalUsers, icon: Users, color: "text-blue-400" },
            { label: "Total Wallpapers", value: analytics.totalWallpapers, icon: Image, color: "text-green-400" },
            { label: "Total Downloads", value: analytics.totalDownloads, icon: Download, color: "text-[#D4A843]" },
            { label: "Total Views", value: analytics.totalViews, icon: Eye, color: "text-purple-400" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <stat.icon className={`h-5 w-5 ${stat.color} mb-2 opacity-50`} />
                <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                <p className="text-xs text-[#666]">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Users this month", value: analytics.usersThisMonth },
            { label: "Wallpapers this month", value: analytics.wallpapersThisMonth },
            { label: "Downloads this month", value: analytics.downloadsThisMonth },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <TrendingUp className="h-4 w-4 text-green-400 mb-2" />
                <p className="text-xl font-bold">{stat.value.toLocaleString()}</p>
                <p className="text-xs text-[#666]">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-[#666] mb-2">By Device</p>
              {analytics.wallpapersByDevice.map((d) => (
                <div key={d.deviceType} className="flex items-center justify-between text-sm">
                  <span>{d.deviceType}</span>
                  <span className="font-medium">{d._count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Wallpapers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topWallpapers.map((wp, i) => (
                <div key={wp.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#111] transition-colors">
                  <span className="text-sm font-bold text-[#D4A843] w-6">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{wp.title}</p>
                    <div className="flex items-center gap-3 text-xs text-[#666]">
                      <span className="flex items-center gap-1"><Download className="h-3 w-3" /> {wp.downloadCount}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {wp.viewCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
