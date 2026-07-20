"use client"

import { useRef, useCallback, type ReactNode } from "react"

interface InfiniteScrollProps {
  children: ReactNode
  onLoadMore: () => void
  hasMore: boolean
  loading?: boolean
  loadingComponent?: ReactNode
  threshold?: number
  className?: string
}

function InfiniteScroll({
  children,
  onLoadMore,
  hasMore,
  loading = false,
  loadingComponent,
  threshold = 200,
  className,
}: InfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect()
      if (!node || !hasMore) return

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loading) {
            onLoadMore()
          }
        },
        { rootMargin: `${threshold}px` }
      )

      observerRef.current.observe(node)
    },
    [hasMore, loading, onLoadMore, threshold]
  )

  return (
    <div className={className}>
      {children}
      {hasMore && (
        <div ref={sentinelRef} className="py-8 flex justify-center">
          {loading
            ? loadingComponent || (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-border-strong border-t-primary" />
                  Loading more...
                </div>
              )
            : null}
        </div>
      )}
    </div>
  )
}

export { InfiniteScroll }
