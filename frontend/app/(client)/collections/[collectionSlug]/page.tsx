
import React, { Suspense } from 'react'
import PageSkeleton from '@/components/client/LoadingSkeletonGlobal'
import CollectionComp from '@/components/client/CollectionComp'
import { Metadata } from 'next'
import { getAllProducts } from '@/server/product'
import { collections } from '@/lib/constants'


export const generateStaticParams = async () => {
  const { products } = await getAllProducts()

  const categories = [...new Set(
    products.map(p => p.category)
  )]

  return categories.map(category => ({
    collectionSlug: category
  }))
}

const allCollection = {
  title: 'All Products',
  description:
    'Browse every pre-loved product at Lifestyle Shopping UK: authentic, quality-checked finds imported from the UK, USA and UAE, delivered across Pakistan.',
  image: '/images/og-default.jpg', // replace with your real default share image
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { collectionSlug } = await params

  // Normalize slug
  const slug = collectionSlug.toLowerCase()

  const path = `/collections/${slug}`
  const currentCollection =
    slug === 'all'
      ? allCollection
      : collections.find((c) => c.link === path)

   if (!currentCollection) {
    return {
      title: 'Collection Not Found',
      robots: { index: false, follow: false },
    }
  }

  return {
    title: currentCollection.title,
    description: currentCollection.description,
    keywords: ["uk imports", "usa imports", "clothing", "women footwear", "men watches", "women watches", "man and women watches import uk"],

    openGraph: {
      title: currentCollection.title,
      description: currentCollection.description,
      type: "website",
      locale: "en_PK",
      siteName: "Lifestyle Shopping UK",
      url: `https://www.lifestyleshoppinguk.com/collections/${slug}`,
      images: [
        {
          url: currentCollection.image as string,
          width: 1200,
          height: 630,
          alt: currentCollection.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: currentCollection.title,
      description: currentCollection.description,
      images: [currentCollection.image as string],
    },

    alternates: {
      canonical: `https://www.lifestyleshoppinguk.com/collections/${slug}`,
    },
  }
}

type Params = Promise<{ collectionSlug: string }>
type SearchParams = Promise<{ sort?: string }>

const CollectionPage = async ({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) => {
  const [{collectionSlug}, {sort}] = await Promise.all([params, searchParams])

  return (
    <CollectionComp
      sort={sort}
      collectionSlug={collectionSlug}
    />
  )
}

const Page = (props: {
  params: Params
  searchParams: SearchParams
}) => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CollectionPage {...props} />
    </Suspense>
  )
}

export default Page
