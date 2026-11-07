import BestSellers from '@/sections/BestSellers'
import Collections from '@/sections/Collections'
import CollectionsTwo from '@/sections/CollectionsTwo'
import Hero from '@/sections/Hero'
import LoopBelowHero from '@/components/ui/LoopBelowHero'
import React from 'react'

const HomePage = () => {
  return (
    <main>
      <Hero />
      <LoopBelowHero />
      <Collections />
      <BestSellers />
      <CollectionsTwo />
    </main>
  )
}

export default HomePage