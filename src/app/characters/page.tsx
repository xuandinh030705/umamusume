import { Suspense } from "react"
import { Metadata } from "next"
import CharactersList from "./characters-list"

export const metadata: Metadata = {
  title: "Characters - UmaWall",
  description: "Browse Umamusume Pretty Derby characters and their wallpapers",
}

export default function CharactersPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gold-text">Characters</span>
          </h1>
          <p className="text-[#666]">Explore your favorite Uma Musume characters</p>
        </div>
        <Suspense fallback={<div className="text-center py-20 text-[#666]">Loading characters...</div>}>
          <CharactersList />
        </Suspense>
      </div>
    </div>
  )
}
