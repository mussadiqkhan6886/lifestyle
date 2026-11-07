import ProductsCorousal from '@/components/client/ProductsCorousal'
import { products } from '@/lib/constants'
import { aire } from '@/lib/fonts'
import { connection } from 'next/server'
import React from 'react'

const NewArrivals = async () => {
    await connection()
     const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const newArrivals = products.filter(item => item.createdAt > Number(sevenDaysAgo))

    if(newArrivals.length < 1){
        return null
    }

  return (
     <section className='my-12 px-3'>
        <div className=' py-8 flex gap-1 flex-col'>
            <h2 className={`${aire.className} text-[28px] sm:text-5xl tracking-wide `}>
                New Arrivals
            </h2>
            <p className='text-sm text-black/60'>Discover our latest arrivals, featuring fresh styles and carefully selected pieces to elevate your everyday look.</p>
        </div>
        <ProductsCorousal tag={"row"} products={products} />
    </section>
  )
}

export default NewArrivals