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

const HomePage = () => {
  return (
    <main>
      <Hero />
      <LoopBelowHero />
      <Collections />
      <BestSellers />
      <CollectionsTwo />
      <Suspense fallback={<div>Loading....</div>}>
        <NewArrivals />
      </Suspense>
      <WhyUs />
      <RegularSellers />
    </main>
  )
}

export default HomePage