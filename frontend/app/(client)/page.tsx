import BestSellers from '@/sections/BestSellers'
import Collections from '@/sections/Collections'
import CollectionsTwo from '@/sections/CollectionsTwo'
import Hero from '@/sections/Hero'
import LoopBelowHero from '@/components/ui/LoopBelowHero'
import React from 'react'
import WhyUs from '@/sections/WhyUs'
import RegularSellers from '@/sections/RegularSellers'

const HomePage = () => {
  return (
    <main>
      <Hero />
      <LoopBelowHero />
      <Collections />
      <BestSellers />
      <CollectionsTwo />
      <WhyUs />
      <RegularSellers />
    </main>
  )
}

export default HomePage