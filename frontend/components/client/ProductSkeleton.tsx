
const ProductDetailSkeleton = () => {
  return (
    <section className="lg:grid lg:grid-cols-12 bg-light-beige animate-pulse">
      {/* Image Gallery */}
      <div className="lg:col-span-6">
        <div className="flex lg:flex-col overflow-hidden">
          <div className="relative w-full shrink-0 aspect-[4/5] sm:aspect-[5/6] lg:aspect-auto lg:h-screen max-h-screen bg-neutral-200" />
        </div>
      </div>

      {/* Product Information */}
      <div className="lg:col-span-6 lg:sticky lg:top-0 lg:self-start lg:h-screen lg:overflow-y-auto">
        <div className="px-4 sm:px-8 lg:px-8 xl:px-12 pt-8 lg:pt-24 pb-12 space-y-6">

          {/* Breadcrumb */}
          <div className="flex gap-2 items-center">
            <div className="h-3 w-16 bg-neutral-200 rounded" />
            <div className="h-3 w-3 bg-neutral-200 rounded" />
            <div className="h-3 w-24 bg-neutral-200 rounded" />
          </div>

          {/* Product Name & Price */}
          <div className="space-y-4">
            <div className="h-7 sm:h-9 w-3/4 bg-neutral-200 rounded" />

            <div className="flex items-center gap-3">
              <div className="h-6 w-28 bg-neutral-200 rounded" />
              <div className="h-4 w-20 bg-neutral-200 rounded" />
            </div>
          </div>

          {/* Variants & Stock */}
          <div className="space-y-4 border-y border-black/10 py-4">

            <div className="space-y-3">
              <div className="h-3 w-32 bg-neutral-200 rounded" />

              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-10 w-20 bg-neutral-200 rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-neutral-200" />
              <div className="h-3 w-20 bg-neutral-200 rounded" />
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-stretch gap-3">
              <div className="h-10 sm:h-12 w-28 bg-neutral-200 rounded-lg" />
              <div className="h-10 sm:h-12 flex-1 bg-neutral-200 rounded-lg" />
            </div>
          </div>

          {/* Accordions */}
          <div className="divide-y divide-black/10 border-b border-black/10">
            {[1, 2].map((item) => (
              <div key={item} className="py-5 flex justify-between">
                <div className="h-3 w-36 bg-neutral-200 rounded" />
                <div className="h-4 w-4 bg-neutral-200 rounded" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default ProductDetailSkeleton
