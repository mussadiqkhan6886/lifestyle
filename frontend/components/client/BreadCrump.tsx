import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
    collection: string
    product?: string
}

const BreadCrump = ({collection, product}: Props) => {
  return (
    <div className='flex gap-1 capitalize text-[10px] sm:text-xs items-center mb-4 tracking-wider'>
      <Link href="/">Home</Link> <ChevronRight size={14} /> <Link href={`/collections/${collection.replaceAll(" ", "-").toLowerCase()}`}>{collection}</Link> {product && <ChevronRight size={14} />} {product}
    </div>
  )
}

export default BreadCrump