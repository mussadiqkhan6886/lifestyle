import { collections } from '@/lib/constants'
import { aire } from '@/lib/fonts'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

const CollectionsTwo = () => {
  return (
    <section className='min-h-screen w-full mt-3 overflow-hidden max-w-8xl mx-auto'>
        <h3 className={`${aire.className} mb-5 text-2xl uppercase text-black/80 tracking-widest px-3 sm:px-10`}>Collections</h3>
        <div className='grid grid-cols-1 md:grid-cols-2'>

      {collections.slice(4, 6).map((item) => (
          <Link href={item.link} key={item.link} className='relative h-screen w-full'>
          <Image 
            src={item.image} 
            alt={item.title} 
            fill 
            className='object-cover' 
            />
          <h2 className={`${aire.className} absolute bottom-6 left-6 z-10 text-white px-4 py-2 capitalize text-base sm:text-2xl tracking-widest`}>
                      {item.title}
                    </h2>
        </Link>
      ))}
      </div>
    </section>
  )
}

export default CollectionsTwo