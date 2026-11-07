'use client'

import { aire } from '@/lib/fonts'
import { Star, Quote, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { reviewsData } from '@/lib/constants'
import Link from 'next/link'

const AUTOPLAY_MS = 5000

const Reviews = () => {
  const total = reviewsData.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const next = useCallback(() => setActive((a) => (a + 1) % total), [total])
  const prev = useCallback(() => setActive((a) => (a - 1 + total) % total), [total])

  // Autoplay (pauses on hover / touch)
  useEffect(() => {
    if (paused || total <= 1) return
    const id = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [paused, next, total])

  // Shortest circular distance from the active card (-1 = left, 0 = center, 1 = right)
  const getOffset = (index: number) => {
    let d = index - active
    if (d > total / 2) d -= total
    if (d < -total / 2) d += total
    return d
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    setPaused(true)
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const diff = e.changedTouches[0].clientX - touchStartX.current
      if (Math.abs(diff) > 50) diff < 0 ? next() : prev()
    }
    touchStartX.current = null
    setPaused(false)
  }

  return (
    <section className="bg-light-beige border-y border-black/10 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Background Decorative Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#00000004_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        {/* Header and Overall Rating Metric */}
        <div className="flex flex-col items-center md:flex-row md:items-end justify-between gap-6 border-b border-black/10 pb-8">
          <div className="space-y-2">
            <h2 className={`${aire.className} text-2xl text-center sm:text-4xl text-neutral-900 tracking-wide`}>
              Loved by Connoisseurs Across Pakistan
            </h2>
          </div>

          {/* Aggregate Score Badge */}
          <div className="bg-contrast-beige/60 border border-black/5 rounded-lg px-6 py-4 flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className={`${aire.className} text-lg sm:text-2xl font-semibold text-neutral-900 block leading-none`}>
                4.9 / 5.0
              </span>
            </div>
            <div className="h-8 w-[1px] bg-black/10" />
            <div className="flex text-amber-500 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Stage: fixed height so absolutely-positioned cards have room */}
          <div className="relative h-[360px] md:h-[400px]">
            {reviewsData.map((review, index) => {
              const d = getOffset(index)
              const isCenter = d === 0
              const isSide = Math.abs(d) === 1
              const clamped = Math.max(-2, Math.min(2, d))

              // Center pops (bigger), sides are smaller + tilted to hint "next/prev"
              const scale = isCenter ? 1.04 : isSide ? 0.86 : 0.7
              const rotate = isCenter ? 0 : clamped * 6 // degrees
              const translateY = isCenter ? 0 : 18
              const opacity = isCenter ? 1 : isSide ? 0.75 : 0

              return (
                <div
                  key={review.id}
                  onClick={() => !isCenter && isSide && setActive(index)}
                  aria-hidden={!isCenter}
                  className={`absolute top-0 left-1/2 h-[90%] w-[78%] sm:w-[52%] md:w-[34%] transition-all duration-500 ease-out ${
                    isCenter ? 'z-20' : isSide ? 'z-10 cursor-pointer' : 'z-0 pointer-events-none'
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
                        : 'border-black/5 shadow-md hover:opacity-100'
                    }`}
                  >
                    {/* Subtle Quote Icon Background */}
                    <Quote className="absolute top-6 right-6 w-10 h-10 text-black/5 pointer-events-none" />

                    <div className="space-y-4 relative z-10">
                      {/* Rating Stars */}
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        ))}
                      </div>

                      {/* Title & Comment */}
                      <h3 className={`${aire.className} text-lg text-black font-semibold tracking-wide leading-snug`}>
                        &quot;{review.title}&quot;
                      </h3>

                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-6">
                        {review.comment}
                      </p>
                    </div>

                    {/* Reviewer Details */}
                    <div className="mt-6 pt-4 border-t border-black/10 relative z-10">
                      <span className="font-semibold text-neutral-900 text-xs">{review.name}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Controls */}
          {total > 1 && (
            <div className="mt-8 flex items-center justify-center gap-6">
              <button
                onClick={prev}
                aria-label="Previous review"
                className="p-2 rounded-full border border-contrast-beige text-contrast-beige hover:bg-contrast-beige hover:text-light-beige transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {reviewsData.map((review, i) => (
                  <button
                    key={review.id}
                    onClick={() => setActive(i)}
                    aria-label={`Go to review ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === active ? 'w-6 bg-contrast-beige' : 'w-2 bg-black/20 hover:bg-black/40'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                aria-label="Next review"
                className="p-2 rounded-full border border-contrast-beige text-contrast-beige hover:bg-contrast-beige hover:text-light-beige transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Trust CTA */}
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