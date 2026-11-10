
import React, { Suspense } from 'react'
import PageSkeleton from '@/components/client/LoadingSkeletonGlobal'
import CollectionComp from '@/components/client/CollectionComp'

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
