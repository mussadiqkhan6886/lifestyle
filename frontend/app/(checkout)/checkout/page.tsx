
'use client'

import React, { useRef, useState, useEffect } from 'react'
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

  const [paymentProof, setPaymentProof] = useState<File | null>(null);
const [previewUrl, setPreviewUrl] = useState<string | null>(null);

const handlePaymentProof = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    toast.error("Please upload a JPG, PNG or WEBP image");
    event.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image size must be below 5MB");
    event.target.value = "";
    return;
  }

  setPaymentProof(file);

  setPreviewUrl(URL.createObjectURL(file));
};

useEffect(() => {
  return () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };
}, [previewUrl]);
  const {
    cart,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart()

  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string
    discount: number
  } | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoMessage, setPromoMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Keep the same token if the user retries the same checkout.
  const checkoutToken = useRef<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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

  const selectedPaymentMethod = watch("paymentMethod");

  const city = watch('city')
  const shippingFee = city.trim().toLowerCase() === 'lahore' ? 400 : 450
  const discountAmount = appliedPromo
    ? Math.round((totalPrice * appliedPromo.discount) / 100)
    : 0
  const grandTotal = Math.max(0, totalPrice - discountAmount + shippingFee)
  const requiresOnlinePayment = grandTotal  > 30000

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) {
      setPromoMessage({ type: 'error', text: 'Please enter a promo code' })
      return
    }

    try {
      setPromoLoading(true)
      setPromoMessage(null)

      const res = await fetch('/api/promos/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoInput.trim() }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid promo code')
      }

      setAppliedPromo({
        code: data.promo.code,
        discount: data.promo.discount,
      })
      setPromoMessage({
        type: 'success',
        text: `Promo code "${data.promo.code}" applied! (${data.promo.discount}% off)`,
      })
      toast.success(`Promo code applied: ${data.promo.discount}% off!`)
    } catch (err: any) {
      setPromoMessage({
        type: 'error',
        text: err.message || 'Failed to apply promo code',
      })
      toast.error(err.message || 'Invalid promo code')
    } finally {
      setPromoLoading(false)
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoInput('')
    setPromoMessage(null)
    toast.info('Promo code removed')
  }
  
  useEffect(() => {
    if (requiresOnlinePayment && selectedPaymentMethod === "CASH_ON_DELIVERY") {
      setValue("paymentMethod", "BANK_TRANSFER", {
        shouldValidate: true,
      });
    }
  }, [requiresOnlinePayment, selectedPaymentMethod, setValue]);
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
            promoCode: appliedPromo?.code,

            items: cart.map((item) => ({
              sku: item.variant.variantId,
              quantity: item.quantity,
            })),

            paymentProof: values.paymentMethod === "CASH_ON_DELIVERY"
              ? undefined
              : paymentProof ?? undefined,
          };

          if (
            values.paymentMethod !== "CASH_ON_DELIVERY" &&
            !paymentProof
          ) {
            throw new Error("Please upload your payment screenshot");
          }

          return createNewOrder(payload);

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

  {requiresOnlinePayment && (
    <div className="mb-5 border border-amber-300 bg-amber-50 p-4 text-sm">
      Orders above PKR 30,000 require online payment.
      Cash on Delivery is unavailable.
    </div>
  )}

  <div className="space-y-3">

    {[
      {
        value: "CASH_ON_DELIVERY",
        label: "Cash on Delivery",
      },
      {
        value: "BANK_TRANSFER",
        label: "Bank Transfer",
      },
    ].map((method) => {
      const disabled =
        requiresOnlinePayment &&
        method.value === "CASH_ON_DELIVERY";

      return (
        <label
          key={method.value}
          className={`flex items-center gap-3 border p-4 ${
            selectedPaymentMethod === method.value
              ? "border-black"
              : "border-neutral-300"
          } ${disabled ? "opacity-40" : "cursor-pointer"}`}
        >
          <input
            type="radio"
            value={method.value}
            disabled={disabled}
            {...register("paymentMethod")}
          />

          <span className="text-sm font-medium">
            {method.label}
          </span>
        </label>
      );
    })}

  </div>
</div>

{selectedPaymentMethod === "BANK_TRANSFER" && (
  <div className="mt-6 space-y-5 border border-neutral-200 p-5">

    <h3 className="font-semibold">
      Payment Instructions
    </h3>

    {selectedPaymentMethod === "BANK_TRANSFER" && (
      <>
      <div className="space-y-2 text-sm">
        <p className="font-semibold">Bank: Allied Bank</p>
        <p>Account Title: Lifestyleshopping.uk</p>
        <p>Account Number: 51550020159905650025</p>
        <p>IBAN: PK64ABPA0020159905650025</p>
      </div>
      <div className="space-y-2 text-sm">
        <p className="font-semibold">Bank: United Bank</p>
        <p>Account Title: Lifestyleshopping.uk</p>
        <p>Account Number: 2134393755279</p>
        <p>IBAN: PK72UNIL0109000393755279</p>
      </div>
      </>
    )}

    <div>
      <label className="mb-2 block text-sm font-medium">
        Upload Payment Screenshot *
      </label>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handlePaymentProof}
        className="w-full border border-neutral-300 p-3 text-sm"
      />

      {previewUrl && (
        <div className="mt-4">
          <Image
            src={previewUrl}
            alt="Payment screenshot preview"
            width={400}
            height={300}
            unoptimized
            className="max-h-64 w-auto object-contain border"
          />

          <button
            type="button"
            onClick={() => {
              setPaymentProof(null);
              setPreviewUrl(null);
            }}
            className="mt-2 text-sm text-red-600"
          >
            Remove screenshot
          </button>
        </div>
      )}

      <p className="mt-2 text-xs text-neutral-500">
        JPG, PNG or WEBP. Maximum size 5MB.
      </p>
    </div>

  </div>
)}

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

            {/* Promo Code */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Promo Code
              </label>
              {appliedPromo ? (
                <div className="flex items-center justify-between rounded border border-green-200 bg-green-50 p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-900 tracking-wide">
                      {appliedPromo.code}
                    </span>
                    <span className="text-xs text-green-700">
                      ({appliedPromo.discount}% OFF)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-xs font-medium text-red-600 hover:text-red-800 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleApplyPromo()
                      }
                    }}
                    className="flex-1 border border-neutral-300 px-3 py-2 text-sm uppercase placeholder:normal-case focus:border-neutral-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoInput.trim()}
                    className="bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 disabled:opacity-50"
                  >
                    {promoLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
              {promoMessage && (
                <p
                  className={`text-xs ${
                    promoMessage.type === 'success'
                      ? 'text-green-700'
                      : 'text-red-600'
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}
            </div>

            <div className="my-6 border-t border-neutral-200" />

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-neutral-500">Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>PKR {totalPrice.toLocaleString()}</span>
              </div>

              {appliedPromo && discountAmount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Discount ({appliedPromo.discount}%)</span>
                  <span>-PKR {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span className="text-green-700 font-medium">PKR {shippingFee.toLocaleString()}</span>
              </div>

            </div>

            <div className="my-6 border-t border-neutral-200" />

            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>

              <span className="text-xl font-bold">
                PKR {grandTotal.toLocaleString()}
              </span>
            </div>

          </aside>

        </div>
      </div>
    </main>
  )
}

export default CheckoutPage
