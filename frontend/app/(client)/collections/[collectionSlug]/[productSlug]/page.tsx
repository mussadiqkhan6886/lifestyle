import ProductCard from '@/components/client/ProductCard'
import ProductDetail from '@/components/client/ProductDetail'
import { collections } from '@/lib/constants'
import { aire } from '@/lib/fonts'
import { getAllProducts, getProductBySlug } from '@/server/product'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import {Metadata} from "next"
import ProductDetailSkeleton from '@/components/client/ProductSkeleton'

export const generateStaticParams = async () => {
  const products = await getAllProducts()

  return products.products.map(p => ({
    productSlug: p.slug
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
    const { productSlug } = await params
    const product = await getProductBySlug(productSlug)

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The product you are looking for is not available.",
        robots: {
          index: false,
          follow: false
        }
      }
    }

    const title = `${product.name}`
    const description =
      product.description?.slice(0, 160) ||
      `Buy ${product.name} – premium UK-imported ${product.category} available in Pakistan. Authentic quality with fast nationwide delivery.`

    const image =
      product.variants?.[0]?.images?.[0] ||
      "/og-image.jfif"

    return {
      title,
      description,
      keywords: [
        product.name,
        product.category,
        "uk imported",
        "pakistan",
        "lifestyle shopping uk",
        `${product.category} pakistan`,
      ],

      openGraph: {
        title,
        description,
        type: "website",
        locale: "en_PK",
        siteName: "Lifestyle Shopping UK",
        url: `https://www.lifestyleshoppinguk.com/collections/${product.category}/${product.slug}`,
        images: [
          {
            url: image,
            width: 1200,
            height: 1200,
            alt: product.name,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },

      alternates: {
        canonical: `https://www.lifestyleshoppinguk.com/collections/${product.category}/${product.slug}`,
      },
    }
  }


type Params = Promise<{ productSlug: string }>

const ProductPage = async ({ params }: { params: Params }) => {
  const { productSlug } = await params
  const product = await getProductBySlug(productSlug)

  if (!product || !product.variants || product.variants.length === 0) notFound()

  const recommendation = await getAllProducts(4, undefined, product.category)

  const collection = collections.find((c) => c.link === `/collections/${product.category}`)
  const collectionTitle = collection?.title ?? 'All Collections'

  const recommended = recommendation.products.filter(i => i.slug !== productSlug)

  return (
    <main className="bg-light-beige text-neutral-900">
      {/* Main product */}
      <ProductDetail product={product} collectionTitle={collectionTitle} />

      {/* Recommended products */}
      {recommended.length > 0 && (
        <section className="border-t border-black/10 py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 space-y-10">
            <div className="flex items-center md:items-end justify-center md:justify-between gap-6">
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.4em] text-center md:text-left text-contrast-beige">You may also like</p>
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
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductPage params={params} />
    </Suspense>
  )
}

export default Page