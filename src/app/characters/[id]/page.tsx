import { Metadata } from "next"
import CharacterDetail from "./character-detail"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `${id.replace(/-/g, " ")} - UmaWall`,
    description: `Browse ${id.replace(/-/g, " ")} wallpapers on UmaWall`,
  }
}

export default async function CharacterPage({ params }: PageProps) {
  const { id } = await params
  return <CharacterDetail slug={id} />
}
