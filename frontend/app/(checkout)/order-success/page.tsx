import Link from "next/link"
import { CheckCircle2, Package, Truck } from "lucide-react"
import { Suspense } from "react"

// Define searchParams as a Promise to match Next.js page expectations
type OrderSuccessPageProps = {
  searchParams: Promise<{
    orderNumber?: string
  }>
}

export const metadata = {
  title: "Order Success | Lifestyle shopping uk",
  description: "Thankyou for shopping from lifestyle shopping uk", 
  robots: {
    index: false,  
    follow: false,
  },
};

const OrderSuccessPage = async ({ searchParams }: OrderSuccessPageProps) => {
  return (
    <Suspense
      fallback={
        <main className="min-h-[75vh] flex items-center justify-center">
          <p className="text-gray-500">Loading order confirmation...</p>
        </main>
      }
    >
      <OrderSuccessContent searchParams={searchParams} />
    </Suspense>
  )
}

export default OrderSuccessPage

// Move the async logic into the inner component
const OrderSuccessContent = async ({
  searchParams,
}: OrderSuccessPageProps) => {
  // Await the searchParams promise first
  const resolvedSearchParams = await searchParams
  const orderNumber = resolvedSearchParams?.orderNumber

  if (!orderNumber) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            Order information not found
          </h1>

          <Link
            href="/collections"
            className="inline-block mt-5 underline"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 text-center shadow-sm">

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2
              size={48}
              className="text-green-600"
            />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-500 mt-3 leading-relaxed">
          Thank you for shopping with us. Your order has been received
          successfully. We will contact you to confirm your order.
        </p>

        {/* Order Number */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mt-8">
          <p className="text-sm text-gray-500">
            Your Order Number
          </p>

          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2 break-all">
            {orderNumber}
          </p>
        </div>

        {/* Order Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-left">

          <div className="flex gap-3 border border-gray-200 rounded-xl p-4">
            <Package className="text-gray-700 shrink-0" size={24} />

            <div>
              <h3 className="font-semibold text-gray-900">
                Order Processing
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                We will process your order shortly.
              </p>
            </div>
          </div>

          <div className="flex gap-3 border border-gray-200 rounded-xl p-4">
            <Truck className="text-gray-700 shrink-0" size={24} />

            <div>
              <h3 className="font-semibold text-gray-900">
                Free Delivery
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Delivery charges are on us.
              </p>
            </div>
          </div>

        </div>

        {/* Payment Information */}
        <div className="bg-gray-50 rounded-xl p-4 mt-6 text-left">
          <p className="font-semibold text-gray-900">
            Payment Method
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Cash on Delivery (COD) — Pay when your order arrives.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            href="/collections"
            className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition text-center"
          >
            Continue Shopping
          </Link>

          <Link
            href="/"
            className="flex-1 border border-gray-300 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition text-center"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </main>
  )
}