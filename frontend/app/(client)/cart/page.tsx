
'use client'

import { aire } from '@/lib/fonts'
import { useCart } from '@/hooks/useCart'
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {useHasMounted} from "@/hooks/useHasMounted"

const CartPage = () => {
  const {
    cart,
    totalPrice,
    totalItems,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-light-beige text-neutral-900 flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="mx-auto h-20 w-20 rounded-full border border-black/15 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-neutral-400" />
          </div>

          <div className="space-y-2">
            <h1 className={`${aire.className} text-3xl`}>
              Your cart is empty
            </h1>
            <p className="text-sm text-neutral-500">
              Discover timepieces, fashion and everyday luxuries
              chosen with an eye for detail.
            </p>
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center gap-3 rounded-lg bg-neutral-900 text-light-beige px-7 py-4 text-xs uppercase tracking-[0.2em] hover:bg-neutral-700 transition-colors"
          >
            Explore collections
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-light-beige text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 lg:py-20 mt-14 sm:mt-10">

        {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/10 pb-8 mb-10">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
              Your selection
            </p>
            <h1 className={`${aire.className} text-4xl sm:text-5xl`}>
              Shopping Cart
            </h1>
            <p className="text-sm text-neutral-500">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] hover:opacity-60 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">

          {/* Cart items */}
          <section className="lg:col-span-8">
            <div className="flex items-center justify-between pb-4 border-b border-black/10">
              <h2 className={`${aire.className} text-xl`}>
                Your items
              </h2>

              <button
                onClick={clearCart}
                className="text-[10px] uppercase tracking-[0.2em] text-red-600"
              >
                Clear cart
              </button>
            </div>

            <div className="divide-y divide-black/10">
              {cart.map((item) => {
                const price = item.variant.onSale
                  ? item.variant.salePrice ?? item.variant.price
                  : item.variant.price

                return (
                  <article
                    key={`${item.productId}-${item.variant.variantId}`}
                    className="flex flex-row gap-5 py-7"
                  >
                    {/* Product image */}
                    <Link
                      href={`/products/${item.slug}`}
                      className="relative h-36 w-32 sm:h-40 shrink-0 overflow-hidden rounded-md bg-contrast-beige"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 128px"
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Product information */}
                    <div className="flex flex-1 flex-col justify-between gap-5 min-w-0">
                      <div className="flex justify-between gap-4">
                        <div className="space-y-2 min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            className={`${aire.className} text-xl hover:opacity-60 transition-opacity`}
                          >
                            {item.name}
                          </Link>

                          <p className="text-xs text-neutral-500">
                            Variant: {item.variant.label}
                          </p>

                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(
                              item.productId,
                              item.variant.variantId
                            )
                          }
                          aria-label={`Remove ${item.name}`}
                          className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full hover:bg-red-50 text-red-600 "
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Quantity */}
                        <div className="inline-flex items-center rounded-lg border border-black/15">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variant.variantId,
                                'decrement'
                              )
                            }
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                            className="h-9 w-9 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="w-10 text-center text-sm tabular-nums">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variant.variantId,
                                'increment'
                              )
                            }
                            disabled={item.quantity >= item.variant.stock}
                            aria-label="Increase quantity"
                            className="h-9 w-9 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Item total */}
                        <div className="text-right">
                          <p className="text-sm font-semibold tabular-nums">
                            PKR {(price * item.quantity).toLocaleString()}
                          </p>

                          {item.quantity > 1 && (
                            <p className="text-xs text-neutral-400 mt-1">
                              PKR {price.toLocaleString()} each
                            </p>
                          )}
                        </div>
                      </div>

                      {item.variant.stock <= 3 && (
                        <p className="text-xs text-amber-700">
                          Only {item.variant.stock} left in stock
                        </p>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          {/* Order summary */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 border border-black/10 rounded-xl p-6 sm:p-8 space-y-6">
              <h2 className={`${aire.className} text-2xl`}>
                Order Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="tabular-nums">
                    PKR {totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-500">
                    Shipping
                  </span>
                  <span className="text-xs text-neutral-500">
                    Calculated at checkout
                  </span>
                </div>

                <div className="border-t border-black/10 pt-5 flex justify-between items-center">
                  <span className="text-xs uppercase tracking-[0.2em]">
                    Total
                  </span>
                  <span className={`${aire.className} text-2xl tabular-nums`}>
                    PKR {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="group w-full flex items-center justify-between rounded-lg bg-neutral-900 text-light-beige px-5 py-2 hover:bg-neutral-800 transition-colors"
              >
                <span className="text-xs uppercase tracking-[0.2em]">
                  Proceed to checkout
                </span>

                <span className="h-10 w-10 flex items-center justify-center rounded-md bg-light-beige text-neutral-900 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>

              <p className="text-xs text-center text-neutral-400 leading-relaxed">
                Shipping costs and final order total will be confirmed
                at checkout.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default CartPage
