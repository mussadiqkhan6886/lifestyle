import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
    collection: string
    product?: string
}

const BreadCrump = ({collection, product}: Props) => {
  return (
    <div className='flex gap-1 uppercase text-[10px] sm:text-xs items-center my-4 tracking-wider'>
      <Link href="/">Home</Link> <ChevronRight size={14} /> <Link href={`/collections/${collection}`}>{collection}</Link> {product && <ChevronRight size={14} />} {product}
    </div>
  )
}

export default BreadCrump