"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, MessageSquare, Loader2, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { formatDate } from "@/lib/utils"

interface Comment {
  id: string
  content: string
  createdAt: string
  user: { id: string; name: string; image: string | null }
  wallpaper: { id: string; title: string }
}

export default function AdminCommentsPage() {
  const { addToast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchComments() {
    try {
      const res = await fetch("/api/admin/comments")
      const data = await res.json()
      if (data.success) setComments(data.data)
    } catch {
      console.error("Failed to fetch comments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm("Delete this comment?")) return
    try {
      await fetch(`/api/comments/${id}`, { method: "DELETE" })
      setComments((prev) => prev.filter((c) => c.id !== id))
      addToast({ type: "success", title: "Comment deleted" })
    } catch {
      addToast({ type: "error", title: "Failed" })
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
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Manage <span className="gold-text">Comments</span></h1>
          <p className="text-[#666]">{comments.length} comments</p>
        </div>

        <div className="space-y-3">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-sm shrink-0">
                    {comment.user.image ? (
                      <img src={comment.user.image} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      comment.user.name?.charAt(0) || "U"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{comment.user.name}</span>
                      <span className="text-xs text-[#666]">on</span>
                      <Link href={`/wallpapers/${comment.wallpaper.id}`} className="text-xs text-[#D4A843] hover:underline truncate">
                        {comment.wallpaper.title}
                      </Link>
                    </div>
                    <p className="text-sm text-[#999]">{comment.content}</p>
                    <p className="text-xs text-[#444] mt-1">{formatDate(comment.createdAt)}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(comment.id)} className="text-red-400 hover:text-red-300 shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {comments.length === 0 && (
            <div className="text-center py-20">
              <MessageSquare className="h-12 w-12 text-[#333] mx-auto mb-4" />
              <p className="text-[#666]">No comments yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
