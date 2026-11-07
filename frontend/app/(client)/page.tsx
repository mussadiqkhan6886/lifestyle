import BestSellers from '@/sections/BestSellers'
import Collections from '@/sections/Collections'
import CollectionsTwo from '@/sections/CollectionsTwo'
import Hero from '@/sections/Hero'
import LoopBelowHero from '@/components/ui/LoopBelowHero'
import React, { Suspense } from 'react'
import WhyUs from '@/sections/WhyUs'
import RegularSellers from '@/sections/RegularSellers'
import NewArrivals from '@/sections/NewArrivals'
import { loopData } from '@/lib/constants';
import Reviews from '@/sections/Reviews'
import ProductCardSkeleton from '@/components/client/LoadingSkeleton'

const HomePage = () => {
  return (
    <main>
      <Hero />
      <LoopBelowHero />
      <Collections />
      <BestSellers />
      <CollectionsTwo />
      <Suspense fallback={<ProductCardSkeleton />}>
        <NewArrivals />
      </Suspense>
      <WhyUs />
      <RegularSellers />
      <Reviews />
    </main>
  )
}

export default HomePage