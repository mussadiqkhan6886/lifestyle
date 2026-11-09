import BestSellers from '@/sections/BestSellers'
import Collections from '@/sections/Collections'
import CollectionsTwo from '@/sections/CollectionsTwo'
import Hero from '@/sections/Hero'
import LoopBelowHero from '@/components/ui/LoopBelowHero'
import WhyUs from '@/sections/WhyUs'
import RegularSellers from '@/sections/RegularSellers'
import NewArrivals from '@/sections/NewArrivals'
import Reviews from '@/sections/Reviews'

const HomePage = () => {
  return (
    <main>
      <Hero />
      <LoopBelowHero />
      <Collections />
      <BestSellers />
      <CollectionsTwo />
      <NewArrivals />
      <WhyUs />
      <RegularSellers />
      <Reviews />
    </main>
  )
}

export default HomePage