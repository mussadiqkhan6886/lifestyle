import React from 'react'
import HotSellersCorousal from '../components/client/HotSellersCorousal'
import { products } from '@/lib/constants'
import { aire } from '@/lib/fonts'

const BestSellers = () => {
  return (
    <section className='max-w-8xl mx-auto px-3 my-12 sm:my-18 xl:my-24'>
        <div className='flex items-center flex-col mb-10 sm:mb-12 gap-3'>
            <h3 className={`${aire.className} text-3xl sm:text-5xl tracking-wide`}>Shop Best Seller</h3>
            <p className='text-black/50 max-w-md px-2 text-center leading-5 text-sm'>Browse, select and order your perfect taste oin just a few steps with our smooth and user-friednly experience</p>
        </div>
        <div>
            <HotSellersCorousal products={products} />
        </div>
    </section>
  )
}

export default BestSellers