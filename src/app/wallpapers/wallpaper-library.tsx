"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { WallpaperCard } from "@/components/wallpaper/wallpaper-card";
import { WallpaperFilters } from "@/components/wallpaper/wallpaper-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { Image, Loader2, AlertCircle } from "lucide-react";
import { InfiniteScroll } from "@/components/shared/infinite-scroll";
import { Button } from "@/components/ui/button";

interface WallpaperData {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  resolution: string | null;
  deviceType: string;
  format: string;
  wallpaperStatus: string;
  downloadCount: number;
  viewCount: number;
  isPremium: boolean;
  createdAt: string;
  character?: { id: string; name: string; slug: string } | null;
  wallpaperTags?: { tag: { id: string; name: string; slug: string } }[];
  _count?: { comments: number; likes: number; downloads: number };
}

interface Filters {
  character: string;
  deviceType: string;
  format: string;
  resolution: string;
  sort: string;
  search: string;
}

export default function WallpaperLibrary() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [wallpapers, setWallpapers] = useState<WallpaperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    character: "",
    deviceType: "",
    format: "",
    resolution: "",
    sort: "newest",
    search: initialSearch,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchWallpapers = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      try {
        const params = new URLSearchParams();
        if (filters.character) params.set("character", filters.character);
        if (filters.deviceType) params.set("deviceType", filters.deviceType);
        if (filters.format) params.set("format", filters.format);
        if (filters.resolution) params.set("resolution", filters.resolution);
        if (filters.sort) params.set("sort", filters.sort);
        if (filters.search) params.set("search", filters.search);
        params.set("page", pageNum.toString());
        params.set("limit", "20");

        const response = await fetch(`/api/wallpapers?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          if (reset) {
            setWallpapers(data.data.wallpapers);
          } else {
            setWallpapers((prev) => [...prev, ...data.data.wallpapers]);
          }
          setTotalPages(data.data.pagination.totalPages);
          setError(null);
        } else {
          setError("Failed to load wallpapers");
        }
      } catch (error) {
        setError("Failed to load wallpapers. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    setPage(1);
    setLoading(true);
    fetchWallpapers(1, true);
  }, [filters, fetchWallpapers]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const loadMore = () => {
    if (page < totalPages && !loadingMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchWallpapers(nextPage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && wallpapers.length === 0) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-[#999] mb-4">{error}</p>
        <Button variant="outline" onClick={() => { setError(null); setLoading(true); fetchWallpapers(1, true); }}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <div className="lg:w-64 shrink-0">
        <WallpaperFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Wallpaper Grid */}
      <div className="flex-1">
        {wallpapers.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">{wallpapers.length} wallpapers found</p>
            </div>
            <InfiniteScroll onLoadMore={loadMore} hasMore={page < totalPages} loading={loadingMore}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {wallpapers.map((wp, index) => (
                  <WallpaperCard
                    key={wp.id}
                    wallpaper={{
                      ...wp,
                      characterName: wp.character?.name,
                      likeCount: wp._count?.likes || 0,
                    }}
                    index={index}
                  />
                ))}
              </div>
            </InfiniteScroll>
          </>
        ) : (
          <EmptyState
            icon={<Image className="h-12 w-12" />}
            title="No wallpapers found"
            description="Try adjusting your filters or check back later for new uploads."
          />
        )}
      </div>
    </div>
  );
}
