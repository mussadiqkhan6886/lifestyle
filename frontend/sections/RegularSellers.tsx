import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react';
import ProductCard from '@/components/client/ProductCard';
import { aire } from '@/lib/fonts';
import { getAllProducts } from '@/server/product';

const RegularSellers = async () => {

    const products = await getAllProducts(8)

    if(products.length <  1){
        return null
    }

  return (
    <section className='max-w-8xl mx-auto sm:px-3 my-12 sm:my-18 xl:my-24'>
        <div className='flex justify-between items-center mb-10 sm:mb-12 gap-3 px-1'>
            <div>
                <h3 className={`${aire.className} text-[28px] sm:text-5xl tracking-wide hidden sm:block`}>Shop Regular Seller</h3>
                <h3 className={`${aire.className} text-[28px] sm:text-5xl tracking-wide block sm:hidden`}>Regular Seller</h3>
            </div>
            <div>
                <Link className='hidden sm:flex items-center gap-1.5 border border-black/50 rounded-lg px-4 text-black/90 hover:bg-black hover:text-white transition-colors duration-300 text-sm py-1.5' href={"/collections/all"}>View More <ArrowUpRight size={16} /></Link>
                <Link className='flex sm:hidden items-center gap-1.5 border border-black/50 rounded-lg px-4 text-black/90 hover:bg-black hover:text-white transition-colors duration-300 text-sm py-1.5' href={"/collections/all"}>More <ArrowUpRight size={16} /></Link>
            </div>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 sm:gap-2 md:gap-4'>
            {products.map(item => (
                <ProductCard tag={"col"} key={item.id} {...item} />
            ))}
        </div>
    </section>
  )
}

export default RegularSellers