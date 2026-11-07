import React from 'react'
import HotSellersCorousal from './HotSellersCorousal'
import { products } from '@/lib/constants'
import { serif } from '@/lib/fonts'

const BestSellers = () => {
  return (
    <section className='max-w-8xl mx-auto px-3 py-12 sm:py-18 xl:my-22'>
        <div className='flex items-center flex-col mb-10 sm:mb-12 gap-3'>
            <h3 className={`${serif.className} text-3xl sm:text-4xl tracking-wide`}>Shop Best Seller</h3>
            <p className='text-black/50 max-w-md px-2 text-center leading-5 text-sm'>Browse, select and order your perfect taste oin just a few steps with our smooth and user-friednly experience</p>
        </div>
        <div>
            <HotSellersCorousal products={products} />
        </div>
    </section>
  )
}

export default BestSellers