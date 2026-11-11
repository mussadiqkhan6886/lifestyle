'use client'

import { aire } from '@/lib/fonts'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import {useCart} from "@/hooks/useCart"
import { useHasMounted } from '@/hooks/useHasMounted';

interface Props {
  open: boolean
  onClose: () => void
}


const SideBarCart = ({ open, onClose }: Props) => {
  const {cart, updateQuantity, removeFromCart, totalPrice, totalItems} = useCart()

  const hasMounted = useHasMounted()

  const safeCart = hasMounted  ? cart : []
  const safeTotalPrice = hasMounted  ? totalPrice : 0
  const safeTotalItems = hasMounted  ? totalItems : []

  // Scroll lock + Escape
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
      aria-hidden={!open}
      className={`fixed inset-0 z-[60] transition-[visibility] ${open ? 'visible' : 'invisible delay-500'}`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-light-beige text-neutral-900 shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(#00000006_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-5 border-b border-black/10">
          <div className="flex items-baseline gap-3">
            <h2 className={`${aire.className} text-2xl tracking-tight`}>Your Cart</h2>
            <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
              {safeTotalItems} {safeTotalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="h-10 w-10 rounded-full border border-black/15 flex items-center justify-center transition-all duration-300 hover:bg-neutral-900 hover:text-light-beige hover:rotate-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {safeCart.length > 0 ? (
          <>
            {/* Items */}
            <ul className="relative flex-1 overflow-y-auto px-6 divide-y divide-black/10">
              {safeCart.map((item, i) => (
                <li
                  key={item.variant.variantId}
                  style={{ transitionDelay: open ? `${200 + i * 80}ms` : '0ms' }}
                  className={`flex gap-4 py-5 transition-all duration-700 ${
                    open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}
                >
                  <div
                    className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md bg-contrast-beige"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className={`${aire.className} text-base leading-snug tracking-wide truncate`}>
                            {item.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variant.variantId)}
                          aria-label={`Remove ${item.name}`}
                          className="shrink-0 p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                          <Trash className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500">Variant: {item.variant.label}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity stepper */}
                      <div className="inline-flex items-center rounded-lg border border-black/15">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variant.variantId, "decrement")}
                          aria-label="Decrease quantity"
                          disabled={item.quantity === 1}
                          className="h-8 w-8 flex items-center justify-center rounded-l-md hover:bg-neutral-900 hover:text-light-beige transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variant.variantId, "increment")}
                          aria-label="Increase quantity"
                          className="h-8 w-8 flex items-center justify-center rounded-r-md hover:bg-neutral-900 hover:text-light-beige transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                     <div className="flex items-center gap-2">
                      {item.variant.onSale && item.variant.salePrice != null ? (
                        <>
                          <p className="text-sm font-semibold tabular-nums text-neutral-400 line-through">
                            PKR {item.variant.price.toLocaleString()}
                          </p>
                          <p className="text-sm font-semibold tabular-nums text-red-600">
                            PKR {item.variant.salePrice.toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-semibold tabular-nums">
                          PKR {item.variant.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="relative border-t border-black/10 bg-contrast-beige/60 px-6 py-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">Subtotal</span>
                <span className={`${aire.className} text-2xl tabular-nums`}>PKR {safeTotalPrice}</span>
              </div>
              <p className="text-xs text-neutral-500">Taxes and shipping are calculated at checkout.</p>

              <Link
                href="/checkout"
                onClick={onClose}
                className="group flex items-center justify-between rounded-xl bg-neutral-900 text-light-beige pl-7 pr-1.5 py-1.5 text-xs uppercase tracking-[0.25em] font-medium transition-colors hover:bg-neutral-800"
              >
                Checkout
                <span className="h-11 w-11 rounded-lg bg-light-beige text-neutral-900 flex items-center justify-center transition-all duration-300 group-hover:bg-contrast-beige group-hover:translate-x-0.5">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>

              <div className="flex items-center justify-center gap-6 text-xs">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="underline underline-offset-4 decoration-black/30 hover:decoration-neutral-900 transition-colors"
                >
                  View full cart
                </Link>
                <button
                  onClick={onClose}
                  className="underline underline-offset-4 decoration-black/30 hover:decoration-neutral-900 transition-colors"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="relative flex-1 flex flex-col items-center justify-center text-center px-8 space-y-6">
            <div className="h-20 w-20 rounded-full border border-black/15 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-neutral-400" />
            </div>
            <div className="space-y-2">
              <h3 className={`${aire.className} text-2xl tracking-tight`}>Your cart is empty</h3>
              <p className="text-sm text-neutral-600 max-w-xs">
                Discover timepieces, fashion and everyday luxuries chosen with an eye for detail.
              </p>
            </div>
            <Link
              href="/collections"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 text-light-beige px-7 py-3.5 text-xs uppercase tracking-[0.25em] font-medium hover:bg-amber-500 hover:text-neutral-900 transition-colors"
            >
              Explore collections
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </aside>
    </div>
  )
}

export default SideBarCart