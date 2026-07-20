"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, AlertTriangle, Loader2, Clock, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast"
import { formatDate } from "@/lib/utils"

interface Report {
  id: string
  reason: string
  targetType: string
  targetId: string
  status: string
  createdAt: string
  user: { id: string; name: string; image: string | null }
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "text-yellow-400" },
  REVIEWED: { label: "Reviewed", color: "text-blue-400" },
  RESOLVED: { label: "Resolved", color: "text-success" },
  DISMISSED: { label: "Dismissed", color: "text-gray-400" },
}

export default function AdminReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addToast } = useToast()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
      return
    }
    fetchReports()
  }, [status])

  async function fetchReports() {
    try {
      const res = await fetch("/api/admin/reports")
      const data = await res.json()
      if (data.success) {
        setReports(data.data)
      }
    } catch {
      console.error("Failed to fetch reports")
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

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            Manage <span className="gold-text">Reports</span>
          </h1>
          <p className="text-muted-foreground">{reports.length} reports</p>
        </div>

        {reports.length > 0 ? (
          <div className="space-y-3">
            {reports.map((report) => {
              const statusInfo = statusConfig[report.status] || statusConfig.PENDING
              return (
                <Card key={report.id} className="rounded-2xl border-border bg-card hover:bg-card-hover transition-all duration-300">
                  <CardContent className="p-4 flex items-start gap-4">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {report.targetType}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${statusInfo.color}`}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.reason}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        by {report.user.name} &middot; {formatDate(report.createdAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <AlertTriangle className="h-12 w-12 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground">No reports yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
