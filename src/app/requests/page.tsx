"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
  MessageSquare, Plus, ChevronUp, Loader2, Clock, CheckCircle,
  XCircle, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
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
  _count: { upvotes: number }
}

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  PENDING: { label: "Pending", icon: Clock, color: "text-yellow-400" },
  IN_PROGRESS: { label: "In Progress", icon: AlertCircle, color: "text-blue-400" },
  DONE: { label: "Done", icon: CheckCircle, color: "text-green-400" },
  REJECTED: { label: "Rejected", icon: XCircle, color: "text-red-400" },
}

export default function RequestsPage() {
  const { data: session, status } = useSession()
  const { addToast } = useToast()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [charName, setCharName] = useState("")
  const [note, setNote] = useState("")

  const userId = (session?.user as { id?: string })?.id

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

  useEffect(() => {
    fetchRequests()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) {
      addToast({ type: "warning", title: "Please sign in to submit a request" })
      return
    }
    if (!charName.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterName: charName, note, userId }),
      })
      const data = await res.json()
      if (data.success) {
        setRequests((prev) => [data.data, ...prev])
        setDialogOpen(false)
        setCharName("")
        setNote("")
        addToast({ type: "success", title: "Request submitted!" })
      } else {
        addToast({ type: "error", title: data.message || "Failed to submit request" })
      }
    } catch {
      addToast({ type: "error", title: "Failed to submit request" })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpvote(id: string) {
    if (!userId) {
      addToast({ type: "warning", title: "Please sign in to upvote" })
      return
    }
    try {
      const res = await fetch(`/api/requests/${id}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (data.success) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, upvoteCount: r.upvoteCount + 1 } : r
          )
        )
        addToast({ type: "success", title: "Upvoted!" })
      } else {
        addToast({ type: "error", title: data.message || "Failed to upvote" })
      }
    } catch {
      addToast({ type: "error", title: "Failed to upvote" })
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Character <span className="gold-text">Requests</span>
            </h1>
            <p className="text-[#666]">Vote for the characters you want to see next!</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request a Character</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#999]">Character Name</label>
                  <Input
                    placeholder="e.g. Symboli Rudolf"
                    value={charName}
                    onChange={(e) => setCharName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#999]">Note (optional)</label>
                  <Textarea
                    placeholder="Why do you want this character? Any specific scene or outfit?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Submit Request
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {requests.length > 0 ? (
          <div className="space-y-3">
            {requests.map((request) => {
              const statusInfo = statusConfig[request.status] || statusConfig.PENDING
              const StatusIcon = statusInfo.icon
              return (
                <Card key={request.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <button
                      onClick={() => handleUpvote(request.id)}
                      className="flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-lg hover:bg-[#1a1a2e] transition-colors"
                    >
                      <ChevronUp className="h-5 w-5 text-[#D4A843]" />
                      <span className="text-lg font-bold text-[#D4A843]">{request.upvoteCount}</span>
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{request.characterName}</h3>
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
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <EmptyState
            icon={<MessageSquare className="h-12 w-12" />}
            title="No requests yet"
            description="Be the first to request a character!"
          />
        )}
      </div>
    </div>
  )
}
