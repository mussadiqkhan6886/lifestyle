
import type { MetadataRoute } from 'next'
import { getAllProducts } from '@/server/product'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all products using pagination
  let page = 1
  let allProducts: Awaited<ReturnType<typeof getAllProducts>>['products'] = []
  let hasMore = true

  while (hasMore) {
    const response = await getAllProducts(48,undefined, undefined, page)

    allProducts.push(...response.products)

    hasMore = response.hasMore
    page++
  }

  // Get unique collections
  const categories = [
    ...new Set(allProducts.map((product) => product.category)),
  ]

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}collections`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}about-us`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}contact-us`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}policies`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Collection pages
  const collectionPages: MetadataRoute.Sitemap = categories.map(
    (category) => ({
      url: `${BASE_URL}collections/${category}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  )

  // Product detail pages
  const productPages: MetadataRoute.Sitemap = allProducts.map(
    (product) => ({
      url: `${BASE_URL}collections/${product.category}/${product.slug}`,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  )

  return [
    ...staticPages,
    ...collectionPages,
    ...productPages,
  ]
}
