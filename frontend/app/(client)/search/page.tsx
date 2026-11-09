import { ProductCardSkeletonGrid } from '@/components/client/LoadingSkeleton'
import {Suspense} from "react"
import ShowSearch from "@/components/client/SearchResult"

const SearchPage = () => {
  return (
    <main className="bg-light-beige min-h-screen py-12 px-1 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#00000004_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <Suspense fallback={<ProductCardSkeletonGrid count={8}  />}>
          <ShowSearch />
        </Suspense>
      </div>
    </main>
  )
}

export default SearchPage