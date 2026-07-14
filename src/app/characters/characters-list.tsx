"use client"

import { useState, useEffect } from "react"
import { Search, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CharacterCard } from "@/components/character/character-card"
import { EmptyState } from "@/components/shared/empty-state"

interface Character {
  id: string
  name: string
  nameJp: string | null
  bloodline: string | null
  avatarUrl: string | null
  slug: string
  _count: {
    wallpapers: number
    followers: number
  }
}

export default function CharactersList() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  async function fetchCharacters() {
    try {
      const res = await fetch("/api/characters")
      const data = await res.json()
      if (data.success) {
        setCharacters(data.data)
      }
    } catch {
      console.error("Failed to fetch characters")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCharacters()
  }, [])

  const filtered = characters.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.nameJp?.toLowerCase().includes(search.toLowerCase()) ||
    c.bloodline?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-[#161616] border border-[#222] animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666]" />
        <Input
          type="search"
          placeholder="Search characters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((character) => (
            <CharacterCard
              key={character.id}
              id={character.slug}
              name={character.name}
              imageUrl={character.avatarUrl ?? undefined}
              bloodline={character.bloodline ?? undefined}
              wallpaperCount={character._count.wallpapers}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="No characters found"
          description={search ? "Try a different search term" : "Characters will appear here once added"}
        />
      )}
    </div>
  )
}
