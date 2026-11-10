import React from 'react'

/* ── Primitive: use for any custom loading shape ── */
export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div aria-hidden className={`animate-pulse rounded-md bg-black/10 ${className}`} />
)

/* ── Product card placeholder ── */
export const ProductCardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="aspect-[4/5] w-full rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
)

/* ── Product grid only (use inside a page that already has its own header) ── */
export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
)

/* ── Full page skeleton: default export, drop in as any Suspense fallback ── */
const PageSkeleton = ({ cards = 6 }: { cards?: number }) => (
  <main
    role="status"
    aria-busy="true"
    aria-label="Loading"
    className="bg-light-beige/90 min-h-screen pt-28 pb-24"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-48" />

      {/* Title + description */}
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-end border-b border-black/10 pb-10">
        <div className="lg:col-span-8">
          <Skeleton className="h-12 sm:h-16 w-3/4 max-w-xl" />
        </div>
        <div className="lg:col-span-4 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>

      <ProductGridSkeleton count={cards} />
    </div>
    <span className="sr-only">Loading…</span>
  </main>
)

export default PageSkeleton