import { aire } from '@/lib/fonts'
import React from 'react'
import { trustBadges } from '@/lib/constants';

const WhyUs = () => {

  return (
    <section className="border-y border-black/10 py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Video Container */}
      <div className="w-full overflow-hidden rounded-xl border border-black/5 shadow-sm">
        <video 
          src="/why-us.mp4" 
          autoPlay 
          muted 
          playsInline 
          loop 
          className="h-[65vh] sm:h-[77vh] w-full object-cover object-center" 
        />
      </div>

      {/* Trust Badges Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-black/10">
        {trustBadges.map((badge, idx) => {
          const Icon = badge.icon
          return (
            <div
              key={badge.heading}
              className={`flex items-start gap-4 ${
                idx !== 0 ? 'pt-6 md:pt-0 md:pl-6' : ''
              }`}
            >
              <div className="p-2.5 bg-light-beige text-neutral-900 rounded-lg border border-black/5 shrink-0 shadow-sm">
                <Icon className="w-5 h-5 stroke-[1.5]" />
              </div>

              <div className="space-y-1">
                <h4 className={`${aire.className} text-base font-semibold text-neutral-900 tracking-wide`}>
                  {badge.heading}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed max-w-xs">
                  {badge.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default WhyUs