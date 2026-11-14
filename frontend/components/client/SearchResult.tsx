'use client';

import ProductCard from '@/components/client/ProductCard' // Adjust import path to your ProductCard component
import { aire } from '@/lib/fonts'
import { getAllProducts } from '@/server/product'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Search, PackageX, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import PageSkeleton from './LoadingSkeletonGlobal';

const ShowSearch = ({q}: {q:string}) => {

  const query = q?.trim()

  if (!query) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="p-4 bg-contrast-beige rounded-full border border-black/10 text-neutral-800 mb-6 shadow-sm">
          <Search className="w-8 h-8 stroke-[1.5]" />
        </div>
        <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-neutral-500 mb-2">
          Lifestyle Shopping UK
        </span>
        <h1 className={`${aire.className} text-3xl sm:text-4xl text-neutral-900 tracking-wide mb-4`}>
          Search Our UK Collections
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-md leading-relaxed mb-8">
          Explore authentic UK imported timepieces, luxury apparel, women's footwear, and genuine leather accessories.
        </p>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap justify-center items-center gap-2 max-w-lg">
          <span className="text-xs text-neutral-500 mr-2">Try searching for:</span>
          {['Watches', 'Footwear', 'Leather Belts', 'Wallets', 'Apparel'].map((suggestion) => (
            <Link
              key={suggestion}
              href={`/search?q=${encodeURIComponent(suggestion)}`}
              className="bg-contrast-beige/60 hover:bg-contrast-beige border border-black/15 text-neutral-900 px-4 py-1.5 rounded-full text-xs transition-colors"
            >
              {suggestion}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const {
      data,
      isLoading,
      isError,
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    } = useInfiniteQuery({
      queryKey: ["products", query],
      queryFn: ({ pageParam }) =>
        getAllProducts(
          20,
          query,
          undefined,
          pageParam,
        ),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
    });
  
    const products = data?.pages.flatMap((page) => page.products) ?? [];

    if(isLoading){
      return <PageSkeleton cards={8} />
    }

    if(isError){
      return (
      <div className="text-red-600 flex items-center justify-center min-h-screen">
        <h2>Failed to load: {error.message}
          </h2>
      </div>)
    }

  if (products.length < 1) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="p-4 bg-contrast-beige rounded-full border border-black/10 text-neutral-800 mb-6 shadow-sm">
          <PackageX className="w-8 h-8 stroke-[1.5]" />
        </div>
        <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-neutral-500 mb-2">
          No Matches Found
        </span>
        <h1 className={`${aire.className} text-3xl sm:text-4xl text-neutral-900 tracking-wide mb-3 px-3`}>
          No results for "{query}"
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-md leading-relaxed mb-8">
          We couldn't find any products matching your search term. Please double-check spelling or try searching for another keyword.
        </p>

        <Link
          href="/collections"
          className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-light-beige px-6 py-3 rounded-lg text-xs uppercase tracking-widest font-medium transition-all shadow-sm"
        >
          <span>Explore All Collections</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 mt-20">
      {/* Search Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/10 pb-6 px-1 sm:px-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-neutral-500 text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px] font-semibold">Search Results</span>
          </div>
          <h1 className={`${aire.className} text-2xl sm:text-3xl text-neutral-900 tracking-wide`}>
            Results for "{query}"
          </h1>
        </div>

        <span className="text-xs text-neutral-500 font-normal tracking-wide">
          Showing {products.length} {products.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      {/* Product Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 sm:gap-3 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id || product.slug} {...product} tag="col" />
        ))}
      </div>
      {hasNextPage && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="rounded-full bg-contrast-beige cursor-pointer text-light-beige px-8 py-3 text-xs uppercase tracking-[0.25em] font-medium disabled:opacity-60"
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
    </div>
  )
}

export default ShowSearch