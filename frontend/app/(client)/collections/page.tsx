import { collections } from '@/lib/constants'
import { ArrowBigLeft, ArrowUpRight } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { aire } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'All Collections',
}

const Page = () => {
  return (
      <main className='pt-35 max-w-6xl mx-auto mb-14'>
        <div className="mb-10 ml-10 md:ml-1">
          <h1 className={`${aire.className} text-5xl`}>
            Collections
          </h1>
          <p className='text-black/50 tracking-wide max-w-xl'>Explore our curated collections of timeless watches, elegant fashion, and everyday essentials, thoughtfully selected to bring style to every moment.</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-8'>
          {collections.map((item) => (
            <Link
              key={item.title}
              href={item.link}
              aria-label={`Shop ${item.title} collection`}
              className='rounded-lg'
            >
              <article className='flex flex-col items-center rounded-lg'>
                <Image
                  className='h-100 object-center object-cover rounded-lg'
                  src={item.image}
                  alt={`${item.title} collection`}
                  width={400}
                  height={400}
                  loading='lazy'
                />
                <h2
                  className={`${aire.className} tracking-widest flex items-center gap-2 mt-3 text-xl`}
                >
                  {item.title} <ArrowUpRight />
                </h2>
              </article>
            </Link>
          ))}
        </div>
      </main>
  )
}

export default Page