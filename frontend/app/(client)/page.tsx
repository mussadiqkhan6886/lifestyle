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
    </main>
  )
}

export default HomePage