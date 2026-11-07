import BestSellers from '@/components/client/BestSellers'
import Collections from '@/components/client/Collections'
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
    </main>
  )
}

export default HomePage