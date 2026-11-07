'use client'

import { aire } from '@/lib/fonts'
import { productType } from '@/types'
import { Check, ChevronDown, Minus, Plus, ShoppingBag, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import BreadCrump from './BreadCrump'

interface Props {
  product: productType
  collectionTitle: string
}

const ProductDetail = ({ product, collectionTitle }: Props) => {
  const [variantIndex, setVariantIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const variant = product.variants[variantIndex]
  const inStock = variant.stock > 0
  const price = variant.onSale && variant.salePrice != null ? variant.salePrice : variant.price
  const hasDiscount = price < variant.price
  const discount = hasDiscount ? Math.round(((variant.price - price) / variant.price) * 100) : 0

  // New variant → back to its first image + quantity 1
  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0 })
    setActiveImage(0)
    setQuantity(1)
    setAdded(false)
  }, [variantIndex])

  // Mobile swipe: work out which slide is in view
  const onScroll = () => {
    const el = scrollerRef.current
    if (!el || window.innerWidth >= 1024) return
    setActiveImage(Math.round(el.scrollLeft / el.clientWidth))
  }

  const goTo = (i: number) => {
    const el = scrollerRef.current
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  const handleAddToCart = () => {
    if (!inStock) return
    // TODO: connect to your cart state/store with { productId: product.id, sku: variant.sku, quantity }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <section className="lg:grid lg:grid-cols-12 bg-light-beige text-neutral-900">
      {/* ── Images: vertical full-screen stack on desktop, swipe carousel on mobile ── */}
      <div className="lg:col-span-7 relative">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="flex lg:flex-col overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {variant.images.map((img, i) => (
            <div
              key={`${variant.sku}-${i}`}
              className="relative w-full shrink-0 snap-center aspect-[4/5] sm:aspect-[5/6] lg:aspect-auto lg:h-screen max-h-screen bg-contrast-beige"
            >
              <Image
                src={img}
                alt={`${product.name} – ${variant.label} (${i + 1} of ${variant.images.length})`}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Mobile: counter + dots */}
        {variant.images.length > 1 && (
          <div className="lg:hidden absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
            {variant.images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Show image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeImage ? 'w-6 bg-neutral-900' : 'w-1.5 bg-neutral-900/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-5 lg:sticky lg:top-0 lg:self-start lg:h-screen lg:overflow-y-auto">
        <div className="px-4 sm:px-8 lg:px-8 xl:px-12 pt-8 lg:pt-24 pb-12 space-y-6">
          <BreadCrump collection={collectionTitle} product={product.name} />

          <div className="space-y-3">
            {product.hotSeller && (
              <span className="inline-block rounded-full bg-amber-500 text-neutral-950 px-3 py-1 text-[10px] uppercase tracking-[0.25em] font-semibold">
                Hot seller
              </span>
            )}
            <h1 className={`${aire.className} text-[25px] sm:text-4xl mt-5 leading-tight tracking-tight`}>{product.name}</h1>

            <div className="flex items-baseline gap-3">
              <span className={`${aire.className} text-[20px] sm:text-2xl tabular-nums`}>PKR {price.toLocaleString()}</span>
              {hasDiscount && (
                <>
                  <span className="text-xs sm:text-sm text-neutral-400 line-through tabular-nums">
                    PKR {variant.price.toLocaleString()}
                  </span>
                  <span className="rounded-full border border-amber-600/40 text-amber-700 px-2.5 py-0.5 text-[11px] font-medium">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4 border-y border-black/10 py-6">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
                Variant: <span className="text-neutral-900">{variant.label}</span>
              </p>
              <ul className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <li key={v.sku}>
                    <button
                      onClick={() => setVariantIndex(i)}
                      aria-pressed={i === variantIndex}
                      className={`relative rounded-lg border px-5 py-2 text-xs sm:text-sm transition-colors ${
                        i === variantIndex
                          ? 'bg-neutral-900 text-light-beige border-neutral-900'
                          : 'border-black/15 hover:border-neutral-900'
                      } ${v.stock === 0 ? 'text-neutral-400' : ''}`}
                    >
                      <span className={v.stock === 0 && i !== variantIndex ? 'line-through' : ''}>{v.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stock status */}
            <p className="flex items-center gap-2 text-xs">
              <span
                className={`h-2 w-2 rounded-full ${
                  !inStock ? 'bg-red-500' : variant.stock <= 3 ? 'bg-amber-500' : 'bg-green-600'
                }`}
              />
              {!inStock
                ? 'Sold out'
                : variant.stock <= 3
                  ? `Only ${variant.stock} left`
                  : 'In stock'}
            </p>

            <div className="flex items-stretch gap-3">
              {/* Quantity */}
              <div className="inline-flex items-center rounded-lg border border-black/15">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || !inStock}
                  aria-label="Decrease quantity"
                  className="h-9 w-8 sm:h-12 sm:w-12 flex items-center justify-center rounded-md hover:bg-neutral-900 hover:text-light-beige transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(variant.stock, q + 1))}
                  disabled={quantity >= variant.stock || !inStock}
                  aria-label="Increase quantity"
                  className="h-9 w-8 sm:h-12 sm:w-12 flex items-center justify-center rounded-md hover:bg-neutral-900 hover:text-light-beige transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="group flex-1 flex items-center justify-center gap-3 rounded-lg bg-neutral-900 text-light-beige px-5 sm:px-6 text-[11px] sm:text-xs uppercase tracking-[0.25em] font-medium transition-colors hover:bg-neutral-800 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:pointer-events-none"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added
                  </>
                ) : inStock ? (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to cart
                  </>
                ) : (
                  'Sold out'
                )}
              </button>
            </div>
          </div>

          <div className="divide-y divide-black/10 border-b border-black/10">
            <Accordion title="Description" defaultOpen>
              <p className="text-sm text-neutral-600 leading-relaxed">{product.description}</p>
            </Accordion>

            <Accordion title="Shipping & returns">
              <p className="text-sm text-neutral-600 leading-relaxed">
                Delivered across the Pakistan. Read our{' '}
                <Link href="/policies#shipping" className="underline underline-offset-4">
                  shipping
                </Link>{' '}
                and{' '}
                <Link href="/policies#returns" className="underline underline-offset-4">
                  returns
                </Link>{' '}
                policies for full details.
              </p>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}

const Accordion = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) => (
  <details className="group py-1" open={defaultOpen}>
    <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[11px] uppercase tracking-[0.3em] [&::-webkit-details-marker]:hidden">
      {title}
      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open:rotate-180" />
    </summary>
    <div className="pb-5">{children}</div>
  </details>
)

export default ProductDetail