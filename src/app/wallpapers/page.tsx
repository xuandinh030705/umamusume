import { Suspense } from "react";
import WallpaperLibrary from "./wallpaper-library";

export const metadata = {
  title: "Wallpaper Library - UmaWall",
  description: "Browse and download Umamusume Pretty Derby wallpapers",
};

export default function WallpapersPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Wallpaper <span className="gold-text">Library</span>
          </h1>
          <p className="text-muted-foreground">Browse our collection of Umamusume wallpapers</p>
        </div>
        <Suspense fallback={<div className="text-center py-20 text-muted-foreground">Loading wallpapers...</div>}>
          <WallpaperLibrary />
        </Suspense>
      </div>
    </div>
  );
}
