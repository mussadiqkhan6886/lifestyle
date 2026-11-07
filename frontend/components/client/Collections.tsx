import { collections } from '@/lib/constants'
import { serif } from '@/lib/fonts'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

const Collections = () => {
  return (
    <section className='min-h-screen w-full overflow-hidden max-w-8xl mx-auto'>
        <h3 className={`${serif.className} mb-5 uppercase text-lg text-black/80 tracking-widest px-10`}>Collections</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 grid-rows-2'>

      {collections.slice(0, 4).map((item) => (
          <Link href={item.link} key={item.link} className='relative h-screen w-full'>
          <Image 
            src={item.image} 
            alt={item.title} 
            fill 
            className='object-cover' 
            />
          <h2 className={`${serif.className} absolute bottom-6 left-6 z-10 text-white px-4 py-2 font-semibold uppercase text-base sm:text-xl tracking-widest`}>
            {item.title}
          </h2>
        </Link>
      ))}
      </div>
    </section>
  )
}

export default Collections