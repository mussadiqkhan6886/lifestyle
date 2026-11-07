'use client'

import { orders } from '@/lib/constants'
import { aire } from '@/lib/fonts'
import { ArrowRight, Minus, Plus, ShoppingBag, Truck, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

type CartItem = (typeof orders)[number] & { qty: number }

const SideBarCart = ({ open, onClose }: Props) => {
  // Fake cart: starts with the 3 demo orders. Replace with your real cart state/store.
  const [items, setItems] = useState<CartItem[]>(() => orders.slice(0, 5).map((p) => ({ ...p, qty: 1 })))

  const updateQty = (id: number, delta: number) =>
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
    )

  const removeItem = (id: number) => setItems((prev) => prev.filter((item) => item.id !== id))

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)

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
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
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

        {items.length > 0 ? (
          <>
            {/* Items */}
            <ul className="relative flex-1 overflow-y-auto px-6 divide-y divide-black/10">
              {items.map((item, i) => (
                <li
                  key={item.id}
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
                          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">{item.category}</p>
                          <h3 className={`${aire.className} text-base leading-snug tracking-wide truncate`}>
                            {item.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="shrink-0 p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500">{item.variant}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity stepper */}
                      <div className="inline-flex items-center rounded-full border border-black/15">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          aria-label="Decrease quantity"
                          disabled={item.qty === 1}
                          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-neutral-900 hover:text-light-beige transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          aria-label="Increase quantity"
                          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-neutral-900 hover:text-light-beige transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-sm font-semibold tabular-nums">PKR {item.price * item.qty}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="relative border-t border-black/10 bg-contrast-beige/60 px-6 py-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">Subtotal</span>
                <span className={`${aire.className} text-2xl tabular-nums`}>PKR {subtotal}</span>
              </div>
              <p className="text-xs text-neutral-500">Taxes and shipping are calculated at checkout.</p>

              <Link
                href="/checkout"
                onClick={onClose}
                className="group flex items-center justify-between rounded-full bg-neutral-900 text-light-beige pl-7 pr-1.5 py-1.5 text-xs uppercase tracking-[0.25em] font-medium transition-colors hover:bg-neutral-800"
              >
                Checkout
                <span className="h-11 w-11 rounded-full bg-light-beige text-neutral-900 flex items-center justify-center transition-all duration-300 group-hover:bg-amber-500 group-hover:translate-x-0.5">
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