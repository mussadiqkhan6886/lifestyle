
'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingBag, Loader2, ShieldCheck } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { aire } from '@/lib/fonts'
import { useCart } from '@/hooks/useCart'
import { createNewOrder } from '@/server/order'
import { checkoutSchema } from '@/lib/schemas/orderSchema'

type CheckoutFormValues = z.infer<typeof checkoutSchema>


const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null

  return (
    <p className="mt-1.5 text-xs text-red-600">
      {message}
    </p>
  )
}

const CheckoutPage = () => {
  const router = useRouter()

  const {
    cart,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart()

  // Keep the same token if the user retries the same checkout.
  const checkoutToken = useRef<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
    defaultValues: {
      customerName: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      province: '',
      postalCode: '',
      customerNotes: '',
    },
  })

  const placeOrder = useMutation({
    mutationFn: async (values: CheckoutFormValues) => {
      if (cart.length === 0) {
        throw new Error('Your cart is empty')
      }

      if (!checkoutToken.current) {
        checkoutToken.current = crypto.randomUUID()
      }

      const payload = {
        ...values,
        checkoutToken: checkoutToken.current,

        // Send only SKU and quantity.
        // Backend calculates prices and checks stock.
        items: cart.map((item) => ({
          sku: item.variant.variantId,
          quantity: item.quantity,
        })),
      }

      return createNewOrder(payload)
    },

    onSuccess: (order) => {
      clearCart()

      toast.success("Order placed successfully!")

      router.replace(
        `/order-success?orderNumber=${encodeURIComponent(order.orderNumber)}`
      )
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Unable to place your order')
    },
  })

  const onSubmit = (values: CheckoutFormValues) => {
    if (placeOrder.isPending) return

    placeOrder.mutate(values)
  }


  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
        <ShoppingBag size={45} className="mb-5 text-neutral-400" />

        <h1 className={`${aire.className} text-3xl`}>
          Your cart is empty
        </h1>

        <p className="mt-3 text-neutral-500">
          Add some products before proceeding to checkout.
        </p>

        <Link
          href="/collections"
          className="mt-7 bg-neutral-900 text-white px-7 py-3"
        >
          Continue Shopping
        </Link>
      </main>
    )
  }


  return (
    <main className="min-h-screen bg-light-beige px-5 py-16 md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">

        <Link
          href="/cart"
          className="mb-10 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>

        <h1 className={`${aire.className} text-4xl md:text-5xl mb-3`}>
          Checkout
        </h1>

        <p className="text-sm text-neutral-500 mb-12">
          Complete your details to place your order.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Checkout Form */}

          <section className="lg:col-span-2">

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-10"
            >

              {/* Customer Information */}

              <div>
                <h2 className={`${aire.className} text-2xl mb-6`}>
                  Customer Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label htmlFor="customerName" className="text-sm font-medium">
                      Full Name *
                    </label>

                    <input
                      id="customerName"
                      {...register('customerName')}
                      autoComplete="name"
                      placeholder="Your full name"
                      aria-invalid={!!errors.customerName}
                      className="mt-2 w-full border border-neutral-300 bg-transparent px-4 py-3 outline-none focus:border-black"
                    />

                    <FieldError message={errors.customerName?.message} />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </label>

                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      autoComplete="email"
                      placeholder="example@email.com"
                      aria-invalid={!!errors.email}
                      className="mt-2 w-full border border-neutral-300 bg-transparent px-4 py-3 outline-none focus:border-black"
                    />

                    <FieldError message={errors.email?.message} />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number *
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      autoComplete="tel"
                      placeholder="03001234567"
                      aria-invalid={!!errors.phone}
                      className="mt-2 w-full border border-neutral-300 bg-transparent px-4 py-3 outline-none focus:border-black"
                    />

                    <FieldError message={errors.phone?.message} />
                  </div>

                </div>
              </div>

              {/* Shipping Address */}

              <div>
                <h2 className={`${aire.className} text-2xl mb-6`}>
                  Shipping Address
                </h2>

                <div className="space-y-5">

                  <div>
                    <label htmlFor="addressLine1" className="text-sm font-medium">
                      Street Address *
                    </label>

                    <input
                      id="addressLine1"
                      {...register('addressLine1')}
                      autoComplete="address-line1"
                      placeholder="House number, street name, area"
                      aria-invalid={!!errors.addressLine1}
                      className="mt-2 w-full border border-neutral-300 bg-transparent px-4 py-3 outline-none focus:border-black"
                    />

                    <FieldError message={errors.addressLine1?.message} />
                  </div>

                  <div>
                    <label htmlFor="addressLine2" className="text-sm font-medium">
                      Apartment, suite, floor (Optional)
                    </label>

                    <input
                      id="addressLine2"
                      {...register('addressLine2')}
                      autoComplete="address-line2"
                      placeholder="Apartment, floor, etc."
                      className="mt-2 w-full border border-neutral-300 bg-transparent px-4 py-3 outline-none focus:border-black"
                    />

                    <FieldError message={errors.addressLine2?.message} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                      <label htmlFor="city" className="text-sm font-medium">
                        City *
                      </label>

                      <input
                        id="city"
                        {...register('city')}
                        autoComplete="address-level2"
                        placeholder="Islamabad"
                        aria-invalid={!!errors.city}
                        className="mt-2 w-full border border-neutral-300 bg-transparent px-4 py-3 outline-none focus:border-black"
                      />

                      <FieldError message={errors.city?.message} />
                    </div>

                    <div>
                      <label htmlFor="province" className="text-sm font-medium">
                        Province / Territory *
                      </label>

                      <select
                        id="province"
                        {...register('province')}
                        autoComplete="address-level1"
                        aria-invalid={!!errors.province}
                        className="mt-2 w-full border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-black"
                      >
                        <option value="">Select province</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                        <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                        <option value="Azad Jammu and Kashmir">Azad Jammu and Kashmir</option>
                      </select>

                      <FieldError message={errors.province?.message} />
                    </div>

                  </div>

                  <div>
                    <label htmlFor="postalCode" className="text-sm font-medium">
                      Postal Code (Optional)
                    </label>

                    <input
                      id="postalCode"
                      {...register('postalCode')}
                      autoComplete="postal-code"
                      placeholder="Postal code"
                      className="mt-2 w-full border border-neutral-300 bg-transparent px-4 py-3 outline-none focus:border-black"
                    />

                    <FieldError message={errors.postalCode?.message} />
                  </div>

                  <div>
                    <label htmlFor="customerNotes" className="text-sm font-medium">
                      Additional Notes (Optional)
                    </label>

                    <textarea
                      id="customerNotes"
                      {...register('customerNotes')}
                      rows={3}
                      placeholder="Any special delivery instructions?"
                      className="mt-2 w-full resize-none border border-neutral-300 bg-transparent px-4 py-3 outline-none focus:border-black"
                    />

                    <FieldError message={errors.customerNotes?.message} />
                  </div>

                </div>
              </div>

              {/* Payment Method */}

              <div>
                <h2 className={`${aire.className} text-2xl mb-6`}>
                  Payment Method
                </h2>

                <div className="border border-neutral-900 p-5 flex items-center gap-4">
                  <input
                    type="radio"
                    checked
                    readOnly
                    aria-label="Cash on Delivery"
                    className="accent-black"
                  />

                  <div>
                    <p className="font-semibold text-sm">
                      Cash on Delivery
                    </p>

                    <p className="text-xs text-neutral-500 mt-1">
                      Pay when your order arrives.
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-neutral-500">
                  Currently, we accept Cash on Delivery only.
                </p>
              </div>

              {/* Server Error */}

              {placeOrder.isError && (
                <div
                  role="alert"
                  className="border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  {placeOrder.error.message ||
                    'Something went wrong. Please try again.'}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={placeOrder.isPending || cart.length === 0}
                className="w-full bg-neutral-900 text-white py-4 text-sm font-semibold tracking-wide hover:bg-neutral-700 transition disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-3"
              >
                {placeOrder.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    PLACING YOUR ORDER...
                  </>
                ) : (
                  'PLACE ORDER'
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                <ShieldCheck size={16} />
                Your checkout information is securely submitted.
              </div>

            </form>
          </section>

          {/* Order Summary */}

          <aside className="h-fit border border-neutral-200 p-6 md:p-8">

            <h2 className={`${aire.className} text-2xl mb-7`}>
              Your Order
            </h2>

            <div className="space-y-6">

              {cart.map((item) => {
                const price = item.variant.onSale
                  ? item.variant.salePrice ?? item.variant.price
                  : item.variant.price

                return (
                  <div
                    key={`${item.productId}-${item.variant.variantId}`}
                    className="flex gap-4"
                  >

                    <div className="relative h-20 w-20 shrink-0 bg-neutral-100">

                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />

                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white">
                        {item.quantity}
                      </span>

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-sm font-semibold">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        Variant: {item.variant.label}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">

                        {item.variant.onSale &&
                        item.variant.salePrice != null ? (
                          <>
                            <p className="text-sm text-neutral-400 line-through">
                              PKR {item.variant.price.toLocaleString()}
                            </p>

                            <p className="text-sm font-semibold text-red-600">
                              PKR {item.variant.salePrice.toLocaleString()}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm font-semibold">
                            PKR {item.variant.price.toLocaleString()}
                          </p>
                        )}

                      </div>
                    </div>

                    <p className="text-sm font-semibold whitespace-nowrap">
                      PKR {(price * item.quantity).toLocaleString()}
                    </p>

                  </div>
                )
              })}

            </div>

            <div className="my-7 border-t border-neutral-200" />

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-neutral-500">Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>PKR {totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span className="text-green-700 font-medium">FREE</span>
              </div>

            </div>

            <div className="my-6 border-t border-neutral-200" />

            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>

              <span className="text-xl font-bold">
                PKR {totalPrice.toLocaleString()}
              </span>
            </div>

            <p className="mt-4 text-xs text-neutral-500">
              Free delivery on all orders.
            </p>

            <p className="mt-3 text-xs text-neutral-400">
              Final prices and stock availability are verified when your order is submitted.
            </p>

          </aside>

        </div>
      </div>
    </main>
  )
}

export default CheckoutPage
