import PageSkeleton from '@/components/client/LoadingSkeletonGlobal'
import ProductCard from '@/components/client/ProductCard'
import ProductDetail from '@/components/client/ProductDetail'
import { collections, products } from '@/lib/constants'
import { aire } from '@/lib/fonts'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'

type Params = Promise<{ productSlug: string }>

const ProductPage = async ({ params }: { params: Params }) => {
  const { productSlug } = await params

  const product = products.find((p) => p.slug === productSlug)

  if (!product || product.variants.length === 0) notFound()

  const collection = collections.find((c) => c.link === `/collections/${product.category}`)
  const collectionTitle = collection?.title ?? 'All Collections'

  const sameCategory = products.filter((p) => p.id !== product.id && p.category === product.category)
  const others = products.filter((p) => p.id !== product.id && p.category !== product.category)
  const recommended = [...sameCategory, ...others].slice(0, 4)

  return (
    <main className="bg-light-beige text-neutral-900">
      {/* Main product */}
      <ProductDetail product={product} collectionTitle={collectionTitle} />

      {/* Recommended products */}
      {recommended.length > 0 && (
        <section className="border-t border-black/10 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 space-y-10">
            <div className="flex items-end justify-between gap-6">
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.4em] text-contrast-beige">You may also like</p>
                <h2 className={`${aire.className} text-3xl sm:text-5xl tracking-tight italic`}>Recommended for you</h2>
              </div>
              <Link
                href="/collections/all"
                className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] hover:gap-3 transition-all"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 sm:gap-x-4 sm:gap-y-10">
              {recommended.map((item) => (
                <ProductCard key={item.id} tag="col" {...item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

const Page = async ({ params }: { params: Params }) => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProductPage params={params} />
    </Suspense>
  )
}

export default Page