import BestSellers from '@/sections/BestSellers'
import Collections from '@/sections/Collections'
import CollectionsTwo from '@/sections/CollectionsTwo'
import Hero from '@/sections/Hero'
import LoopBelowHero from '@/components/ui/LoopBelowHero'
import WhyUs from '@/sections/WhyUs'
import RegularSellers from '@/sections/RegularSellers'
import NewArrivals from '@/sections/NewArrivals'
import Reviews from '@/sections/Reviews'
import { Suspense } from 'react'

const HomePage = () => {
  return (
    <main>
      <Hero />
      <LoopBelowHero />
      <Collections />
      <Suspense fallback={null}>
        <BestSellers />
      </Suspense>
      <CollectionsTwo />
      <Suspense fallback={null}>
        <NewArrivals />
      </Suspense>
      <WhyUs />
      <Suspense fallback={null}>
        <RegularSellers />
      </Suspense>
      <Reviews />
    </main>
  )
}

export default HomePage