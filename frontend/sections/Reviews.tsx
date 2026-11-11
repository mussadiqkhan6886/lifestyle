
'use client'

import { aire } from '@/lib/fonts'
import { Star, Quote, ArrowRight, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getAllReviews } from '@/server/review'

const AUTOPLAY_MS = 5000

const Reviews = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['reviews'],
    queryFn: getAllReviews,
  })

  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const total = data?.length ?? 0

  // Keep active index valid when reviews are updated.
  useEffect(() => {
    setActive((current) => total > 0 ? current % total : 0)
  }, [total])

  const next = useCallback(() => {
    if (total <= 1) return
    setActive((current) => (current + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    if (total <= 1) return
    setActive((current) => (current - 1 + total) % total)
  }, [total])

  // Autoplay
  useEffect(() => {
    if (paused || total <= 1) return

    const interval = setInterval(next, AUTOPLAY_MS)

    return () => clearInterval(interval)
  }, [paused, next, total])

  // Calculate circular card position.
  const getOffset = (index: number) => {
    let distance = index - active

    if (distance > total / 2) distance -= total
    if (distance < -total / 2) distance += total

    return distance
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
    setPaused(true)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const endX = e.changedTouches[0]?.clientX

      if (endX !== undefined) {
        const diff = endX - touchStartX.current

        if (Math.abs(diff) > 50) {
          diff < 0 ? next() : prev()
        }
      }
    }

    touchStartX.current = null
    setPaused(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 text-center">
        <h2>Loading reviews...</h2>
      </section>
    )
  }

  // Error state
  if (isError) {
    return (
      <section className="py-16 text-center">
        <h2>Unable to load reviews</h2>
        <p>{error.message}</p>
      </section>
    )
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <section className="py-16 text-center">
        <h2>No reviews available yet.</h2>
      </section>
    )
  }

  const averageRating = total > 0
  ? data.reduce((sum, review) => sum + review.rating, 0) / total
  : 0

  return (
    <section className="bg-light-beige border-y border-black/10 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">

      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#00000004_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">

        {/* Header */}
        <div className="flex flex-col items-center md:items-start md:flex-row justify-between gap-6 border-b border-black/10 pb-8">
          <div className="flex flex-col items-center md:items-start gap-2 w-full lg:w-fit">
            <div className="space-y-2">
              <h2 className={`${aire.className} text-2xl text-center sm:text-4xl text-neutral-900 tracking-wide`}>
                Loved by Connoisseurs Across Pakistan
              </h2>
            </div>

            {/* Aggregate Rating */}
            <div className="flex gap-4 sm:gap-10 items-center justify-between w-full">
              <div className="bg-contrast-beige/60 border border-black/5 rounded-lg px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-3 shrink-0">
                <div className="text-right">
                  <span className={`${aire.className} text-base sm:text-lg lg:text-xl font-semibold text-neutral-900 block leading-none`}>
                    {averageRating.toFixed(1)} / 5.0
                  </span>
                </div>

                <div className="flex text-amber-500 gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>
              </div>
              <Link
                href="/add-review"
                className="inline-flex lg:hidden items-center gap-1 sm:gap-2 bg-contrast-beige text-black px-5 py-3 rounded-lg text-[11px] sm:text-xs uppercase tracking-widest font-medium">
                <span>Write a Review</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <Link
              href="/add-review"
              className="hidden lg:inline-flex items-center gap-2 bg-contrast-beige text-black px-5 py-3 rounded-lg text-xs uppercase tracking-widest font-medium"
          >
              <span>Write a Review</span>
              <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Reviews Carousel */}
        <div
          className="relative"
          role="region"
          aria-label="Customer reviews carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={() => {
            touchStartX.current = null
            setPaused(false)
          }}
        >
          <div className="relative h-[360px] md:h-[400px]">

            {data.map((review, index) => {
              const distance = getOffset(index)
              const isCenter = distance === 0
              const isSide = Math.abs(distance) === 1
              const clamped = Math.max(-2, Math.min(2, distance))

              const scale = isCenter ? 1.04 : isSide ? 0.86 : 0.7
              const rotate = isCenter ? 0 : clamped * 6
              const translateY = isCenter ? 0 : 18
              const opacity = isCenter ? 1 : isSide ? 0.75 : 0

              const rating = Math.max(
                0,
                Math.min(5, Math.floor(Number(review.rating) || 0))
              )

              return (
                <div
                  key={review.id}
                  aria-hidden={!isCenter}
                  className={`absolute top-0 left-1/2 h-[90%] w-[78%] sm:w-[52%] md:w-[34%] transition-all duration-500 ease-out ${
                    isCenter ? 'z-20' : isSide ? 'z-10' : 'z-0 pointer-events-none'
                  }`}
                  style={{
                    transform: `translateX(calc(-50% + ${clamped * 92}%)) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                    opacity,
                  }}
                >
                  <div
                    className={`bg-contrast-beige border p-6 sm:p-8 rounded-lg flex flex-col justify-between relative h-full overflow-hidden transition-shadow duration-500 ${
                      isCenter
                        ? 'border-black/20 shadow-2xl'
                        : 'border-black/5 shadow-md'
                    }`}
                  >
                    <Quote className="absolute top-6 right-6 w-10 h-10 text-black/5 pointer-events-none" />

                    <div className="space-y-4 relative z-10">

                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 fill-amber-500 text-amber-500"
                          />
                        ))}
                      </div>

                      {/* Review */}
                      <h3 className={`${aire.className} text-lg text-black font-semibold tracking-wide leading-snug`}>
                        &quot;{review.title}&quot;
                      </h3>

                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-6">
                        {review.comment}
                      </p>
                    </div>

                    {/* Reviewer */}
                    <div className="mt-6 pt-4 border-t border-black/10 relative z-10">
                      <span className="font-semibold text-neutral-900 text-xs">
                        {review.name}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Carousel Controls */}
          {total > 1 && (
            <div className="mt-8 flex items-center justify-center gap-6">

              <button
                type="button"
                onClick={prev}
                aria-label="Previous review"
                className="p-2 rounded-full border border-contrast-beige text-contrast-beige hover:bg-contrast-beige hover:text-light-beige transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {data.map((review, i) => (
                  <button
                    key={review.id}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Go to review ${i + 1}`}
                    aria-current={i === active ? 'true' : undefined}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === active
                        ? 'w-6 bg-contrast-beige'
                        : 'w-2 bg-black/20 hover:bg-black/40'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                aria-label="Next review"
                className="p-2 rounded-full border border-contrast-beige text-contrast-beige hover:bg-contrast-beige hover:text-light-beige transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="bg-contrast-beige border border-black/10 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className={`${aire.className} font-semibold text-xl text-neutral-900`}>
              Experience the Lifestyle Standard for Yourself
            </h4>
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-light-beige px-6 py-3 rounded-lg text-xs uppercase tracking-widest font-medium transition-all shrink-0 hover:gap-3 shadow-sm"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}

export default Reviews
