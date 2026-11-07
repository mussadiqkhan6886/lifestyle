import React from 'react'
import ProductsCorousal from '../components/client/ProductsCorousal'
import { products } from '@/lib/constants'
import { aire } from '@/lib/fonts'

const BestSellers = () => {
      const hotSellersProducts = products.filter(product => product.hotSeller);
  return (
    <section className='max-w-8xl mx-auto px-3 my-12 sm:my-18 xl:my-24'>
        <div className='flex items-center flex-col mb-10 sm:mb-12 gap-3'>
            <h3 className={`${aire.className} text-3xl sm:text-5xl tracking-wide`}>Shop Best Seller</h3>
            <p className='text-black/50 max-w-md px-2 text-center leading-5 text-sm'>Browse, select and order your perfect taste oin just a few steps with our smooth and user-friednly experience</p>
        </div>
        <div>
            <ProductsCorousal tag={"row"} products={hotSellersProducts} />
        </div>
    </section>
  )
}

export default BestSellers