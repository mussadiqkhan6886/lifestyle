import React from 'react'


export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col w-full mb-6 animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square sm:aspect-[3/4] w-full bg-neutral-200/70 rounded-sm" />

      {/* Product Details Skeleton */}
      <div className="mt-3 flex flex-col px-1 space-y-2">
        {/* Title Line Skeleton */}
        <div className="h-4 sm:h-4.5 bg-neutral-200/70 rounded w-3/4" />

        {/* Price & Variant Row Skeleton */}
        <div
          className={`flex flex-row justify-between sm:items-center mt-1`}
        >
          {/* Price Skeleton */}
          <div className="h-3.5 sm:h-4 bg-neutral-200/70 rounded w-1/3" />

          {/* Variant Badge Skeleton */}
          <div className="h-3 bg-neutral-200/70 rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}

{/* Grid Wrapper component for multi-card loading state */}
export const ProductCardSkeletonGrid = ({ count = 8 }: { count?: number; }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default ProductCardSkeleton