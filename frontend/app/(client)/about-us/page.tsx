'tsx'
import { aire } from '@/lib/fonts'
import { Plane, Award, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const AboutUs = () => {
  const brandPillars = [
    {
      title: 'Directly UK Imported',
      description:
        'Every piece in our curation—from refined apparel to luxury timepieces—is sourced directly from authorized brand houses across the United Kingdom.',
      icon: Plane,
    },
    {
      title: 'Curated Excellence',
      description:
        'We hand-select premium clothing, handcrafted women’s footwear, and genuine leather wallets & belts engineered for longevity.',
      icon: Award,
    },
    {
      title: 'Guaranteed Authenticity',
      description:
        'Zero compromise. We eliminate intermediary markups and deliver certified UK fashion at honest, direct-to-consumer prices.',
      icon: ShieldCheck,
    },
    {
      title: 'Sustainably Driven',
      description:
        'Luxury with purpose. Every order placed with Lifestyle Shopping UK automatically plants a tree in your name, tracked live in your account.',
      icon: HeartHandshake,
    },
  ]

  const productCategories = [
    'Men’s & Women’s Watches',
    'Curated Apparel',
    'Women’s Footwear',
    'Wallets & Belts',
    'Fine Leather Accessories',
  ]

  return (
    <section className="bg-light-beige text-neutral-900 py-16 pt-28 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#00000004_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-20">
        
        {/* Hero Banner Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-8 bg-neutral-900" />
            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-neutral-600">
              The Standard of Authentic Luxury
            </span>
            <span className="h-[1px] w-8 bg-neutral-900" />
          </div>

          <h1 className={`${aire.className} text-4xl sm:text-5xl lg:text-6xl text-neutral-900 tracking-wide leading-tight`}>
            British Elegance, <br /> Delivered Straight to Your Doorstep.
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl mx-auto pt-2">
            Lifestyle Shopping UK was founded on a singular vision: to bridge the gap between high-street British fashion and discerning shoppers seeking original, uncompromised quality.
          </p>
        </div>

        {/* Story Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-y border-black/10 py-12">
          
          {/* Left Column: Visual Highlight Card */}
          <div className="lg:col-span-5 bg-contrast-beige/60 border border-black/10 rounded-2xl p-8 sm:p-10 relative overflow-hidden space-y-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold block">
              Direct UK Import Guarantee
            </span>

            <h3 className={`${aire.className} text-2xl sm:text-3xl text-neutral-900 leading-snug`}>
              No Customs Stress. No Import Markups. Just Pure Luxury.
            </h3>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              From precision-engineered men’s and women’s watches to tailored apparel, elegant footwear, and pristine leather wallets and belts—all our import taxes, duties, and transit logistics are fully managed by us. The price you see is the final price you pay.
            </p>

            {/* Category Tags */}
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

          {/* Right Column: Mission Narrative */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-neutral-600">
              Our Journey
            </span>

            <h2 className={`${aire.className} text-3xl sm:text-4xl text-neutral-900 tracking-wide`}>
              Redefining Lifestyle & Convenience
            </h2>

            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              At <strong>Lifestyle Shopping UK</strong>, we believe authentic style shouldn’t require international travel or complicated forwarding services. We meticulously select and import high-caliber apparel, footwear, and accessories directly from the UK, ensuring every customer receives genuine products backed by full transit insurance.
            </p>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Whether you are looking for a statement timepiece to complement formal attire, durable genuine leather belts and wallets, or the latest women’s footwear trends, our collection represents the perfect synthesis of British craftsmanship and modern luxury.
            </p>

            {/* Metric Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-black/10">
              <div>
                <span className={`${aire.className} text-2xl sm:text-3xl font-semibold text-neutral-900 block`}>
                  100%
                </span>
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
                  UK Sourced Originals
                </span>
              </div>
              <div>
                <span className={`${aire.className} text-2xl sm:text-3xl font-semibold text-neutral-900 block`}>
                  Zero
                </span>
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
                  Hidden Tax Fees
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className={`${aire.className} text-2xl sm:text-3xl font-semibold text-neutral-900 block`}>
                  Quick Delivery
                </span>
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
                  faster delivery system
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Pillars Grid */}
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-neutral-600">
              Why Lifestyle Shopping UK
            </span>
            <h3 className={`${aire.className} text-2xl sm:text-3xl text-neutral-900 tracking-wide`}>
              The Pillars of Our Commitment
            </h3>
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
                    <h4 className={`${aire.className} text-lg text-neutral-900 tracking-wide`}>
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="bg-contrast-beige border border-black/10 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6">
          <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-600 font-semibold">
            Explore the Direct-from-UK Lineup
          </span>

          <h3 className={`${aire.className} text-2xl sm:text-3xl text-neutral-900 max-w-2xl leading-relaxed`}>
            Ready to upgrade your wardrobe with authentic British timepieces, footwear & apparel?
          </h3>

          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-light-beige px-8 py-3.5 rounded-lg text-xs uppercase tracking-widest font-medium transition-all hover:gap-4 shadow-sm"
          >
            <span>Browse All Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}

export default AboutUs