"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bookmark, Plus, Trash2, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { EmptyState } from "@/components/shared/empty-state"
import { useToast } from "@/components/ui/toast"
import { formatDate } from "@/lib/utils"

interface Collection {
  id: string
  name: string
  description: string | null
  isPublic: boolean
  createdAt: string
  _count: { items: number }
}

export default function CollectionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addToast } = useToast()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDesc, setNewDesc] = useState("")

  const userId = (session?.user as { id?: string })?.id

  async function fetchCollections() {
    try {
      const res = await fetch(`/api/collections?userId=${userId}`)
      const data = await res.json()
      if (data.success) {
        setCollections(data.data)
      }
    } catch {
      console.error("Failed to fetch collections")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
      return
    }
    if (userId) fetchCollections()
  }, [userId, status])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDesc, userId }),
      })
      const data = await res.json()
      if (data.success) {
        setCollections((prev) => [data.data, ...prev])
        setDialogOpen(false)
        setNewName("")
        setNewDesc("")
        addToast({ type: "success", title: "Collection created!" })
      }
    } catch {
      addToast({ type: "error", title: "Failed to create collection" })
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/collections/${id}`, { method: "DELETE" })
      setCollections((prev) => prev.filter((c) => c.id !== id))
      addToast({ type: "success", title: "Collection deleted" })
    } catch {
      addToast({ type: "error", title: "Failed to delete collection" })
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              My <span className="gold-text">Collections</span>
            </h1>
            <p className="text-muted-foreground">Organize your favorite wallpapers</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Collection</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <Input
                    placeholder="My Favorites"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Description (optional)</label>
                  <Textarea
                    placeholder="A collection of my favorite wallpapers..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={creating}>
                  {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {collections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <Card key={collection.id} className="group rounded-2xl border-border bg-card hover:bg-card-hover transition-all duration-300">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div className="min-w-0 flex-1">
                    <Link href={`/collections/${collection.id}`}>
                      <CardTitle className="text-lg hover:text-primary transition-colors truncate">
                        {collection.name}
                      </CardTitle>
                    </Link>
                    {collection.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{collection.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{collection._count.items} wallpapers</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        {collection.isPublic ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        {collection.isPublic ? "Public" : "Private"}
                      </span>
                      <span>{formatDate(collection.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Bookmark className="h-12 w-12" />}
            title="No collections yet"
            description="Create your first collection to start saving wallpapers."
          />
        )}
      </div>
    </div>
  )
}
