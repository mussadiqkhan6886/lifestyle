import BreadCrump from '@/components/client/BreadCrump'
import ProductCard from '@/components/client/ProductCard'
import { collections, products } from '@/lib/constants'
import { aire } from '@/lib/fonts'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import React, { Suspense } from 'react'
import { productType } from '@/types'
import PageSkeleton from '@/components/client/LoadingSkeletonGlobal'
import CustomSortDropdown from '@/components/client/CustomSortDropdown'

type Params = Promise<{ collectionSlug: string }>
type SearchParams = Promise<{ sort?: string }>

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'hot-sellers', label: 'Hot Sellers' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A–Z' },
]

const findCollection = (slug: string) => collections.find((c) => c.link === `/collections/${slug}`)

const CollectionComp = async ({ params, searchParams }: { params: Params; searchParams: SearchParams }) => {
  const { collectionSlug } = await params
  const { sort } = await searchParams

  const isAll = collectionSlug === 'all'
  const collectionData = isAll ? null : findCollection(collectionSlug)

  if (!isAll && !collectionData) notFound()

  const title = isAll ? 'All Collections' : collectionData!.title
  const description =
    (collectionData as { description?: string } | null)?.description ??
    (isAll
      ? 'Explore every timepiece, fashion piece and everyday luxury in one place.'
      : `Discover our ${title.toLowerCase()} — chosen with an eye for detail and delivered across the UK.`)

  const filteredProducts = products.filter((p) => (isAll ? true : p.category === collectionSlug))

    const getProductPrice = (product: productType) => {
        const variant = product.variants[0];

        if (variant.onSale && variant.salePrice != null) {
            return variant.salePrice;
        }

        return variant.price;
    };

    const productsToSort =
    sort === "hot-sellers"
        ? filteredProducts.filter((p) => p.hotSeller === true)
        : filteredProducts;
    const sortedProducts = [...productsToSort].sort((a, b) => {
        switch (sort) {
            case "price-asc":
                return getProductPrice(a) - getProductPrice(b);

            case "price-desc":
                return getProductPrice(b) - getProductPrice(a);

            case "name":
                return a.name.localeCompare(b.name);

            default:
                return 0;
        }
    });

  return (
    <main className="bg-light-beige/90 text-neutral-900 min-h-screen pt-28 sm:pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-10">
        <section>
          <BreadCrump collection={title} />
        </section>

        <section className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-end border-b border-black/10 pb-10 sm:pb-10">
          <div className="lg:col-span-8 space-y-4">
            <h1 className={`${aire.className} text-4xl md:text-6xl leading-[1.02] tracking-tight`}>
              {title}
            </h1>
          </div>
          <p className="lg:col-span-4 text-sm text-neutral-600 leading-relaxed max-w-md">{description}</p>
        </section>

        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
          </p>

          <CustomSortDropdown sort={sort} sortOptions={sortOptions} />
        </section>

        {/* Products */}
        {sortedProducts.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 ">
            {sortedProducts.map((item) => (
              <ProductCard key={item.id} tag="row" {...item} />
            ))}
          </section>
        ) : (
          <section className="py-24 text-center space-y-6 border border-dashed border-black/15 rounded-2xl">
            <h2 className={`${aire.className} text-2xl sm:text-3xl tracking-tight`}>New pieces arriving soon</h2>
            <p className="text-sm text-neutral-600 max-w-sm mx-auto">
              We&apos;re curating this collection right now. Take a look at what else is in store.
            </p>
            <Link
              href="/collections/all"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 text-light-beige px-7 py-3.5 text-xs uppercase tracking-[0.25em] font-medium hover:bg-contrast-beige hover:text-neutral-900 transition-colors"
            >
              Browse everything
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        )}
      </div>
    </main>
  )
}

const Page = async ({ params, searchParams }: { params: Params; searchParams: SearchParams }) => {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <CollectionComp params={params} searchParams={searchParams} />
        </Suspense>
    )
} 

export default Page