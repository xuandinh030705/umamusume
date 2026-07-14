"use client"

import { useState } from "react"
import { Heart, Reply, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"

interface CommentUser {
  id: string
  name: string
  image?: string
}

interface Comment {
  id: string
  content: string
  createdAt: string | Date
  user: CommentUser
  parentCommentId?: string | null
  likeCount?: number
  replies?: Comment[]
}

interface CommentSectionProps {
  comments: Comment[]
  currentUserId?: string
  onSubmit: (content: string, parentCommentId?: string) => void
  onDelete: (commentId: string) => void
  onLike: (commentId: string) => void
  className?: string
}

function CommentSection({ comments, currentUserId, onSubmit, onDelete, onLike, className }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return
    onSubmit(newComment.trim())
    setNewComment("")
  }

  function handleReplySubmit(parentId: string) {
    if (!replyContent.trim()) return
    onSubmit(replyContent.trim(), parentId)
    setReplyContent("")
    setReplyTo(null)
  }

  function renderComment(comment: Comment, isReply = false) {
    const isOwner = currentUserId === comment.user.id

    return (
      <div key={comment.id} className={cn(isReply ? "ml-8 pl-4 border-l border-[#222]" : "")}>
        <div className="flex gap-3 py-3">
          <Avatar
            src={comment.user.image}
            fallback={comment.user.name.charAt(0)}
            className="h-8 w-8 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">{comment.user.name}</span>
              <span className="text-xs text-[#666]">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="text-sm text-[#ccc] mt-1">{comment.content}</p>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => onLike(comment.id)}
                className="flex items-center gap-1 text-xs text-[#666] hover:text-red-400 transition-colors"
              >
                <Heart className="h-3.5 w-3.5" />
                {comment.likeCount != null && comment.likeCount > 0 && comment.likeCount}
              </button>
              {!isReply && (
                <button
                  onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                  className="flex items-center gap-1 text-xs text-[#666] hover:text-[#D4A843] transition-colors"
                >
                  <Reply className="h-3.5 w-3.5" />
                  Reply
                </button>
              )}
              {isOwner && (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="flex items-center gap-1 text-xs text-[#666] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              )}
            </div>

            {replyTo === comment.id && (
              <form
                onSubmit={(e) => { e.preventDefault(); handleReplySubmit(comment.id) }}
                className="mt-3 space-y-2"
              >
                <Textarea
                  placeholder={`Reply to ${comment.user.name}...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[60px] text-sm"
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={!replyContent.trim()}>
                    Reply
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setReplyTo(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div>
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      <h3 className="text-lg font-semibold text-white">
        Comments ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </div>
      </form>

      <div className="divide-y divide-[#222]">
        {comments.length === 0 ? (
          <p className="text-center text-sm text-[#666] py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  )
}

export { CommentSection }
export type { Comment, CommentUser }
