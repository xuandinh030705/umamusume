import { Metadata } from "next"
import WallpaperDetail from "./wallpaper-detail"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Wallpaper - UmaWall`,
    description: `View and download this Umamusume Pretty Derby wallpaper`,
  }
}

export default async function WallpaperPage({ params }: PageProps) {
  const { id } = await params
  return <WallpaperDetail wallpaperId={id} />
}
