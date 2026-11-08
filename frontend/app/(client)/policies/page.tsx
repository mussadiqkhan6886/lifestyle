'use client'

import { aire } from '@/lib/fonts'
import { Truck, RotateCcw, HelpCircle, ShieldCheck, FileText, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

const PoliciesPage = () => {
  const [activeHash, setActiveHash] = useState('#shipping')

  const navLinks = [
    { label: 'Shipping & delivery', href: '#shipping', icon: Truck },
    { label: 'Returns & exchanges', href: '#returns', icon: RotateCcw },
    { label: 'FAQs', href: '#faq', icon: HelpCircle },
    { label: 'Privacy policy', href: '#privacy-policy', icon: ShieldCheck },
    { label: 'Terms of service', href: '#terms', icon: FileText },
  ]

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map((link) => document.querySelector(link.href))
      const scrollPosition = window.scrollY + 160

      sections.forEach((section) => {
        if (section) {
          const top = (section as HTMLElement).offsetTop
          const height = (section as HTMLElement).offsetHeight
          const id = `#${section.getAttribute('id')}`

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveHash(id)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="bg-light-beige text-neutral-900 min-h-screen py-16 pt-28 px-4 sm:px-6 lg:px-12 relative">
      {/* Background Subtle Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#00000004_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 border-b border-black/10 pb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-neutral-600">
            lifestyle shopping.uk Client Services
          </span>
          <h1 className={`${aire.className} text-4xl sm:text-5xl text-neutral-900 tracking-wide`}>
            Policies & Customer Information
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Transparency is the cornerstone of luxury. Explore our shipping standards, returns procedure, and terms governing your lifestyle shopping.uk experience.
          </p>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
          
          {/* STICKY SIDE NAVIGATION */}
          <aside className="lg:col-span-4 sticky top-28 z-20 self-start">
            <div className="bg-contrast-beige/80 backdrop-blur-sm border border-black/10 rounded-xl p-4 sm:p-6 shadow-sm">
              <h3 className={`${aire.className} text-lg text-neutral-900 mb-4 tracking-wide`}>
                Quick Navigation
              </h3>
              <nav className="flex flex-col space-y-1.5">
                {navLinks.map((item) => {
                  const Icon = item.icon
                  const isActive = activeHash === item.href

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setActiveHash(item.href)}
                      className={`group flex items-center justify-between p-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-neutral-900 text-light-beige shadow-sm'
                          : 'text-neutral-700 hover:bg-neutral-900/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-light-beige' : 'text-neutral-500 group-hover:text-neutral-900'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-all ${
                          isActive ? 'text-light-beige opacity-100 translate-x-0.5' : 'opacity-40 group-hover:opacity-100'
                        }`}
                      />
                    </a>
                  )
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-black/10 text-center space-y-2">
                <p className="text-[11px] text-neutral-500">Need immediate assistance?</p>
                <Link
                  href="/contact"
                  className="inline-block text-xs font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-700"
                >
                  Contact Concierge Support
                </Link>
              </div>
            </div>
          </aside>

          {/* POLICY CONTENT SECTIONS */}
          <main className="lg:col-span-8 space-y-16">
            
            {/* 1. Shipping & Delivery */}
            <section id="shipping" className="bg-contrast-beige/40 border border-black/10 rounded-xl p-6 sm:p-10 space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                <div className="p-2.5 bg-light-beige rounded-lg border border-black/5 text-neutral-900 shadow-sm">
                  <Truck className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h2 className={`${aire.className} text-2xl text-neutral-900 tracking-wide`}>
                  Shipping & Delivery
                </h2>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                <p>
                  At lifestyle shopping.uk, we curate luxury collections directly imported from the United Kingdom. Every order is meticulously inspected, securely packaged in our signature unboxing boxes, and shipped straight to your doorstep across Pakistan and worldwide.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                  <li><strong>Complimentary Delivery:</strong> Enjoy free express shipping on all orders above PKR 5,000.</li>
                  <li><strong>Duties & Taxes Included:</strong> The price you see is the absolute final price you pay. All customs duties, import tariffs, and taxes are fully covered by lifestyle shopping.uk.</li>
                  <li><strong>Nationwide Transit Time:</strong> Orders reaching Karachi, Lahore, Islamabad, and major cities typically arrive within 2–4 business days via insured courier partners.</li>
                  <li><strong>Eco-Curation:</strong> Every single order automatically plants a tree in your name, tracked live inside your personal account dashboard.</li>
                </ul>
              </div>
            </section>

            {/* 2. Returns & Exchanges */}
            <section id="returns" className="bg-contrast-beige/40 border border-black/10 rounded-xl p-6 sm:p-10 space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                <div className="p-2.5 bg-light-beige rounded-lg border border-black/5 text-neutral-900 shadow-sm">
                  <RotateCcw className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h2 className={`${aire.className} text-2xl text-neutral-900 tracking-wide`}>
                  Returns & Exchanges
                </h2>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                <p>
                  We want your lifestyle shopping.uk experience to be flawless. If you wish to exchange a timepiece, apparel size, or accessory, we offer a straightforward return and exchange window.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                  <li><strong>7-Day Window:</strong> You may request a return or exchange within 7 days of receiving your package.</li>
                  <li><strong>Item Condition:</strong> Items must be unblemished, unworn, and returned in their original luxury packaging with all tags and seals intact.</li>
                  <li><strong>Quick Processing:</strong> Once inspected at our Lahore distribution hub, exchanges are dispatched immediately or store credit/refunds are processed securely.</li>
                </ul>
              </div>
            </section>

            {/* 3. FAQs */}
            <section id="faq" className="bg-contrast-beige/40 border border-black/10 rounded-xl p-6 sm:p-10 space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                <div className="p-2.5 bg-light-beige rounded-lg border border-black/5 text-neutral-900 shadow-sm">
                  <HelpCircle className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h2 className={`${aire.className} text-2xl text-neutral-900 tracking-wide`}>
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-6 text-xs sm:text-sm text-neutral-700">
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-neutral-900">Are lifestyle shopping.uk watches and jewelry authentic?</h4>
                  <p className="text-neutral-600 leading-relaxed">Yes. Every piece in our men's watches, women's watches, clothing, and accessories collection is authentically imported straight from authorized British brand houses.</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-neutral-900">Will I have to pay any extra customs tax upon delivery?</h4>
                  <p className="text-neutral-600 leading-relaxed">Never. lifestyle shopping.uk covers 100% of international import duties and taxes. What you see at checkout is all you pay.</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-neutral-900">How do I track my planted tree?</h4>
                  <p className="text-neutral-600 leading-relaxed">With every completed order, our environmental partnership records your tree planting milestone directly in your customer portal profile.</p>
                </div>
              </div>
            </section>

            {/* 4. Privacy Policy */}
            <section id="privacy-policy" className="bg-contrast-beige/40 border border-black/10 rounded-xl p-6 sm:p-10 space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                <div className="p-2.5 bg-light-beige rounded-lg border border-black/5 text-neutral-900 shadow-sm">
                  <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h2 className={`${aire.className} text-2xl text-neutral-900 tracking-wide`}>
                  Privacy Policy
                </h2>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                <p>
                  Your privacy is paramount. lifestyle shopping.uk respects and protects your personal information in accordance with international data security standards.
                </p>
                <p className="text-neutral-600">
                  We collect only necessary information required to process orders, manage deliveries, and optimize your shopping experience. We never sell or distribute your private credentials.
                </p>
              </div>
            </section>

            {/* 5. Terms of Service */}
            <section id="terms" className="bg-contrast-beige/40 border border-black/10 rounded-xl p-6 sm:p-10 space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                <div className="p-2.5 bg-light-beige rounded-lg border border-black/5 text-neutral-900 shadow-sm">
                  <FileText className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h2 className={`${aire.className} text-2xl text-neutral-900 tracking-wide`}>
                  Terms of Service
                </h2>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                <p>
                  By accessing and purchasing from lifestyle shopping.uk, you agree to comply with our operating terms.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                  <li><strong>Pricing & Availability:</strong> All prices are listed in PKR and are subject to adjustment based on stock availability.</li>
                  <li><strong>Intellectual Property:</strong> All imagery, product designs, brand names, and typography associated with lifestyle shopping.uk are legally protected.</li>
                </ul>
              </div>
            </section>

          </main>

        </div>

      </div>
    </div>
  )
}

export default PoliciesPage