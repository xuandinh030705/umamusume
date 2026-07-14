"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageSquare, Loader2, ChevronUp, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { formatDate } from "@/lib/utils"

interface Request {
  id: string
  characterName: string
  note: string | null
  upvoteCount: number
  status: string
  createdAt: string
  user: { id: string; name: string; image: string | null }
}

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  PENDING: { label: "Pending", icon: Clock, color: "text-yellow-400" },
  IN_PROGRESS: { label: "In Progress", icon: AlertCircle, color: "text-blue-400" },
  DONE: { label: "Done", icon: CheckCircle, color: "text-green-400" },
  REJECTED: { label: "Rejected", icon: XCircle, color: "text-red-400" },
}

export default function AdminRequestsPage() {
  const { status } = useSession()
  const router = useRouter()
  const { addToast } = useToast()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
      return
    }
    fetchRequests()
  }, [status])

  async function fetchRequests() {
    try {
      const res = await fetch("/api/requests")
      const data = await res.json()
      if (data.success) {
        setRequests(data.data)
      }
    } catch {
      console.error("Failed to fetch requests")
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const res = await fetch(`/api/requests/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        )
        addToast({ type: "success", title: "Status updated" })
      }
    } catch {
      addToast({ type: "error", title: "Failed to update status" })
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[#999] hover:text-white transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            Manage <span className="gold-text">Requests</span>
          </h1>
          <p className="text-[#666]">{requests.length} requests</p>
        </div>

        <div className="space-y-3">
          {requests.map((request) => {
            const statusInfo = statusConfig[request.status] || statusConfig.PENDING
            const StatusIcon = statusInfo.icon
            return (
              <Card key={request.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex items-center gap-1 text-[#D4A843] min-w-[60px]">
                    <ChevronUp className="h-4 w-4" />
                    <span className="font-bold">{request.upvoteCount}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{request.characterName}</h3>
                      <Badge variant="outline" className={`text-xs ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                    {request.note && (
                      <p className="text-sm text-[#999] line-clamp-1">{request.note}</p>
                    )}
                    <p className="text-xs text-[#666] mt-1">
                      by {request.user.name} &middot; {formatDate(request.createdAt)}
                    </p>
                  </div>
                  <select
                    value={request.status}
                    onChange={(e) => handleStatusChange(request.id, e.target.value)}
                    className="h-8 rounded-lg border border-[#333] bg-[#111] px-2 text-sm text-[#e0e0e0]"
                  >
                    {Object.keys(statusConfig).map((status) => (
                      <option key={status} value={status}>
                        {statusConfig[status].label}
                      </option>
                    ))}
                  </select>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
