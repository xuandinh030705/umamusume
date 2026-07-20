"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Loader2, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast"

interface Character {
  id: string
  name: string
  nameJp: string | null
  bloodline: string | null
  slug: string
  _count: { wallpapers: number; followers: number }
}

export default function AdminCharactersPage() {
  const { addToast } = useToast()
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [nameJp, setNameJp] = useState("")
  const [bloodline, setBloodline] = useState("")
  const [description, setDescription] = useState("")
  const [slug, setSlug] = useState("")
  const [saving, setSaving] = useState(false)

  async function fetchCharacters() {
    try {
      const res = await fetch("/api/characters")
      const data = await res.json()
      if (data.success) setCharacters(data.data)
    } catch {
      console.error("Failed to fetch characters")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCharacters()
  }, [])

  function openCreate() {
    setEditingId(null)
    setName("")
    setNameJp("")
    setBloodline("")
    setDescription("")
    setSlug("")
    setDialogOpen(true)
  }

  function openEdit(c: Character) {
    setEditingId(c.id)
    setName(c.name)
    setNameJp(c.nameJp || "")
    setBloodline(c.bloodline || "")
    setSlug(c.slug)
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editingId ? `/api/characters/${editingId}` : "/api/characters"
      const method = editingId ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, nameJp, bloodline, description, slug: slug || name.toLowerCase().replace(/\s+/g, "-") }),
      })
      const data = await res.json()
      if (data.success) {
        addToast({ type: "success", title: editingId ? "Character updated" : "Character created" })
        setDialogOpen(false)
        fetchCharacters()
      } else {
        addToast({ type: "error", title: data.message || "Failed" })
      }
    } catch {
      addToast({ type: "error", title: "Failed" })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this character?")) return
    try {
      await fetch(`/api/characters/${id}`, { method: "DELETE" })
      setCharacters((prev) => prev.filter((c) => c.id !== id))
      addToast({ type: "success", title: "Character deleted" })
    } catch {
      addToast({ type: "error", title: "Failed to delete" })
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[#999] hover:text-white transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Manage <span className="gold-text">Characters</span></h1>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" /> Add Character
          </Button>
        </div>

        <div className="space-y-3">
          {characters.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/characters/${c.slug}`} className="font-medium hover:text-[#D4A843] transition-colors">
                      {c.name}
                    </Link>
                    {c.nameJp && <span className="text-sm text-[#666]">{c.nameJp}</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#666] mt-1">
                    {c.bloodline && <span>{c.bloodline}</span>}
                    <span>{c._count.wallpapers} wallpapers</span>
                    <span>{c._count.followers} followers</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Character" : "Add Character"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm text-[#666] mb-1">Name *</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Special Week" required />
              </div>
              <div>
                <label className="block text-sm text-[#666] mb-1">Japanese Name</label>
                <Input value={nameJp} onChange={(e) => setNameJp(e.target.value)} placeholder="スペシャルウィーク" />
              </div>
              <div>
                <label className="block text-sm text-[#666] mb-1">Bloodline</label>
                <Input value={bloodline} onChange={(e) => setBloodline(e.target.value)} placeholder="Sunday Silence" />
              </div>
              <div>
                <label className="block text-sm text-[#666] mb-1">Description</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
              <div>
                <label className="block text-sm text-[#666] mb-1">Slug (auto-generated)</label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="special-week" />
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editingId ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
