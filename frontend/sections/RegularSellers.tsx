import Link from 'next/link'
import React from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { products } from '@/lib/constants';
import ProductCard from '@/components/client/ProductCard';
import { aire } from '@/lib/fonts';

const RegularSellers = () => {
  return (
    <section className='max-w-8xl mx-auto px-3 my-12 sm:my-18 xl:my-24'>
        <div className='flex justify-between items-center mb-10 sm:mb-12 gap-3 px-1'>
            <div>
                <h3 className={`${aire.className} text-[28px] sm:text-5xl tracking-wide`}>Shop Regular Seller</h3>
            </div>
            <div>
                <Link className='flex items-center gap-1.5 border border-black/50 rounded-full px-4 text-black/90 hover:bg-black hover:text-white transition-colors duration-300 text-sm py-1.5' href={"/collections/all"}>View More <ArrowUpRight size={16} /></Link>
            </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 sm:gap-2 md:gap-4'>
            {products.slice(0,8).map(item => (
                <ProductCard key={item.id} {...item} />
            ))}
        </div>
    </section>
  )
}

export default RegularSellers