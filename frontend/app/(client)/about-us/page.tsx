import { aire } from '@/lib/fonts'
import { Plane, ShieldCheck, ShoppingBag, Truck, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Lifestyle Shopping UK imports original clothes, watches, footwear and bags from the UK, USA and UAE and delivers them across Pakistan.',
  alternates: {
    canonical: '/about-us',
  },
  openGraph: {
    title: 'About Us | Lifestyle Shopping UK',
    description:
      'Original clothes, watches, footwear and bags imported from the UK, USA and UAE, delivered across Pakistan.',
    url: '/about-us',
    siteName: 'Lifestyle Shopping UK',
    type: 'website',
    locale: 'en_PK',
  },
  twitter: {
    card: 'summary',
    title: 'About Us | Lifestyle Shopping UK',
    description:
      'Original imported clothes, watches, footwear and bags from the UK, USA and UAE.',
  },
}

const brandPillars = [
  {
    title: 'Imported From 3 Countries',
    description:
      'We source our products from the United Kingdom, the United States and the UAE, so you get international brands without travelling abroad.',
    icon: Plane,
  },
  {
    title: 'Original Products',
    description:
      'We sell original clothes, watches, footwear and bags. Every item is checked before it is dispatched to you.',
    icon: ShieldCheck,
  },
  {
    title: 'In-Stock & Pre-Order',
    description:
      'Ready items are delivered in 4–5 days. Not in stock? Pre-order it and we import it for you in 3–4 weeks.',
    icon: ShoppingBag,
  },
  {
    title: 'Delivery With TCS',
    description:
      'Orders are shipped across Pakistan with TCS. Watches come with a 1-year guarantee.',
    icon: Truck,
  },
]

const productCategories = [
  'Clothing',
  'Watches',
  'Footwear',
  'Bags',
  'wallets & Belts',
]

const AboutUs = () => {
  return (
    <main className="bg-light-beige text-neutral-900 py-16 pt-28 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#00000004_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-20">

        {/* Hero Banner Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-8 bg-neutral-900" />
            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-neutral-600">
              UK · USA · UAE
            </span>
            <span className="h-[1px] w-8 bg-neutral-900" />
          </div>

          <h1 className={`${aire.className} text-4xl sm:text-5xl lg:text-6xl text-neutral-900 tracking-wide leading-tight`}>
            Original Brands, <br /> Imported to Your Doorstep.
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl mx-auto pt-2">
            Lifestyle Shopping UK brings original clothes, watches, footwear and bags from the UK, USA and UAE to customers across Pakistan.
          </p>
        </div>

        {/* Story Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-y border-black/10 py-12">

          {/* Left Column */}
          <div className="lg:col-span-5 bg-contrast-beige/60 border border-black/10 rounded-2xl p-8 sm:p-10 relative overflow-hidden space-y-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold block">
              What We Import
            </span>

            <h2 className={`${aire.className} text-2xl sm:text-3xl text-neutral-900 leading-snug`}>
              Fashion and Accessories From Trusted International Markets.
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              We import clothing, watches, footwear and bags straight from the UK, USA and UAE, so you can shop original international products without the hassle of overseas shipping or forwarding.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              {productCategories.map((cat) => (
                <span
                  key={cat}
                  className="bg-light-beige text-neutral-800 border border-black/10 text-[11px] px-3 py-1 rounded-full font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-neutral-600">
              Our Story
            </span>

            <h2 className={`${aire.className} text-3xl sm:text-4xl text-neutral-900 tracking-wide`}>
              Global Brands, Made Easy
            </h2>

            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              At <strong>Lifestyle Shopping UK</strong>, we believe getting original international products shouldn’t mean travelling abroad. We select clothing, watches, footwear and bags from the UK, USA and UAE and deliver them to your door in Pakistan.
            </p>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Whether you want a watch for everyday wear, a pair of shoes, a new bag or a fresh outfit, you can order what is already in stock or pre-order the piece you want and we will import it for you.
            </p>

            {/* Metric Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-black/10">
              <div>
                <span className={`${aire.className} text-2xl sm:text-3xl font-semibold text-neutral-900 block`}>
                  3
                </span>
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
                  Import Countries
                </span>
              </div>
              <div>
                <span className={`${aire.className} text-2xl sm:text-3xl font-semibold text-neutral-900 block`}>
                  4–5 Days
                </span>
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
                  In-Stock Delivery
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className={`${aire.className} text-2xl sm:text-3xl font-semibold text-neutral-900 block`}>
                  1 Year
                </span>
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
                  Watch Guarantee
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Pillars Grid */}
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-neutral-600">
              Why Lifestyle Shopping UK
            </span>
            <h2 className={`${aire.className} text-2xl sm:text-3xl text-neutral-900 tracking-wide`}>
              What You Can Expect From Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandPillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="bg-contrast-beige/50 hover:bg-contrast-beige border border-black/10 p-6 rounded-xl transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="p-3 bg-light-beige text-neutral-900 rounded-lg border border-black/5 w-fit shadow-sm">
                      <Icon className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <h3 className={`${aire.className} text-lg text-neutral-900 tracking-wide`}>
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-contrast-beige border border-black/10 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6">
          <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-600 font-semibold">
            Shop the Collection
          </span>

          <h2 className={`${aire.className} text-2xl sm:text-3xl text-neutral-900 max-w-2xl leading-relaxed`}>
            Ready to upgrade your wardrobe with original watches, footwear, bags and clothing?
          </h2>

          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-light-beige px-8 py-3.5 rounded-lg text-xs uppercase tracking-widest font-medium transition-all hover:gap-4 shadow-sm"
          >
            <span>Browse All Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </main>
  )
}

export default AboutUs