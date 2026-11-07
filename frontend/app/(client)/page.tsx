import BestSellers from '@/components/client/BestSellers'
import Collections from '@/components/client/Collections'
import CollectionsTwo from '@/components/client/CollectionsTwo'
import Hero from '@/components/client/Hero'
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