import { aire } from '@/lib/fonts'
import { ProductCardT } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

const ProductCard = ({
  name,
  slug,
  category,
  variants,
}: ProductCardT) => {
  const hasStock = variants.length > 1
    ? variants.some(v => v.stock > 0)
    : variants[0]?.stock > 0

  const isSoldOut = !hasStock
  const firstVariant = variants[0]
  const onSale = variants.some(v => v.onSale)
  
  const primaryImage = firstVariant?.images[0]
  const secondaryImage = firstVariant?.images[1] || primaryImage

  const priceFormatted = firstVariant?.price?.toLocaleString()
  const salePriceFormatted = firstVariant?.salePrice?.toLocaleString()

  const cardContent = (
    <div className={`group relative flex flex-col w-full mb-6 ${isSoldOut ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'} `}>
      {/* Image Container */}
      <div className="relative aspect-square sm:aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        <Image
          src={primaryImage}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover object-center transition-all duration-500 ease-out ${
            !isSoldOut && secondaryImage !== primaryImage ? 'group-hover:opacity-0' : ''
          } ${!isSoldOut ? 'group-hover:scale-105' : ''}`}
        />
        
        {/* Secondary Image Crossfade on Hover */}
        {!isSoldOut && secondaryImage !== primaryImage && (
          <Image
            src={secondaryImage}
            alt={`${name} hover view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
          />
        )}

        {/* Status Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          {isSoldOut ? (
            <span className="bg-black/80 backdrop-blur-md text-white text-[11px] uppercase tracking-wider font-medium px-3 py-1 rounded-full shadow-sm">
              Sold Out
            </span>
          ) : onSale ? (
            <span className="bg-red-600 text-white text-[11px] uppercase tracking-wider font-medium px-3 py-1 rounded-full shadow-sm">
              Sale
            </span>
          ) : null}
        </div>
      </div>

      {/* Product Information */}
      <div className="mt-3 flex flex-col px-1">
        <h2 className={`${aire.className} text-[17px] tracking-wider text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1`}>
            {name}
        </h2>

        <div className="flex justify-between items-center mt-1">
                {/* Price Container */}
                <div className="flex items-center gap-2">
                {onSale && firstVariant?.salePrice ? (
                    <>
                    <span className="text-xs font-light text-neutral-400 line-through">
                        PKR {priceFormatted}
                    </span>
                    <span className="text-sm font-light text-red-600 tracking-tight">
                        PKR {salePriceFormatted}
                    </span>
                    </>
                ) : (
                    <span className="text-sm font-light text-neutral-900 tracking-tight">
                    PKR {priceFormatted}
                    </span>
                )}
                </div>

                {/* Variants Count Badge / Indicator */}
                {variants.length > 1 && (
                <span className="text-xs text-neutral-500 font-normal tracking-wide">
                    +{variants.length} variants
                </span>
                )}
            </div>
        </div>
    </div>
  )

  if (isSoldOut) {
    return cardContent
  }

  return (
    <Link href={`/collections/${category}/${slug}`} className="block rounded-lg">
      {cardContent}
    </Link>
  )
}

export default ProductCard