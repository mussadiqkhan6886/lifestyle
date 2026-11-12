
import React, { Suspense } from 'react'
import PageSkeleton from '@/components/client/LoadingSkeletonGlobal'
import CollectionComp from '@/components/client/CollectionComp'
import { Metadata } from 'next'


export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { collectionSlug } = await params

  // Normalize slug
  const slug = collectionSlug.toLowerCase()

  // Smart title & description based on category
  const categoryMap: Record<
    string,
    { title: string; description: string; keywords: string[] }
  > = {
    watches: {
      title: "Men's & Women's Watches | Luxury UK Imports",
      description:
        "Shop premium men's and women's watches imported from the UK. Authentic brands, elegant designs, and free shipping across Pakistan at Lifestyle Shopping UK.",
      keywords: [
        "men watches pakistan",
        "women watches pakistan",
        "luxury watches uk",
        "imported watches pakistan",
      ],
    },
    footwear: {
      title: "Women's Footwear | Premium UK Imported Shoes",
      description:
        "Discover stylish women's footwear imported from the UK. From heels to casual shoes — quality, comfort and latest trends delivered across Pakistan.",
      keywords: [
        "women footwear pakistan",
        "imported shoes pakistan",
        "uk shoes online",
        "women shoes pakistan",
      ],
    },
    bags: {
      title: "Women's Bags | Designer Handbags from UK",
      description:
        "Explore premium women's bags and handbags imported from the UK. Elegant designs, high quality materials, and nationwide delivery in Pakistan.",
      keywords: [
        "women bags pakistan",
        "handbags pakistan",
        "uk imported bags",
        "designer bags pakistan",
      ],
    },
    clothing: {
      title: "Women's Clothing | UK Imported Fashion",
      description:
        "Shop the latest women's clothing imported from the UK. Premium quality dresses, tops, and apparel with fast delivery across Pakistan.",
      keywords: [
        "women clothing pakistan",
        "uk fashion pakistan",
        "imported clothes pakistan",
        "women fashion online",
      ],
    },
  }

  const category = categoryMap[slug] || {
    title: `${collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1)}`,
    description: `Shop premium ${collectionSlug} imported from the UK. Authentic quality products with fast delivery across Pakistan.`,
    keywords: [collectionSlug, "uk imported", "pakistan"],
  }

  const title = `${category.title}`
  const description = category.description

  return {
    title,
    description,
    keywords: category.keywords,

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_PK",
      siteName: "Lifestyle Shopping UK",
      url: `https://www.lifestyleshoppinguk.com/collection/${slug}`,
      images: [
        {
          url: `/og/${slug}.jpg`, // optional: create category-specific OG images
          width: 1200,
          height: 630,
          alt: category.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/og/${slug}.jpg`],
    },

    alternates: {
      canonical: `https://www.lifestyleshoppinguk.com/collection/${slug}`,
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
