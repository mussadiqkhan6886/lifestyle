'use client'

import { aire } from '@/lib/fonts'
import { Truck, RotateCcw, HelpCircle, ShieldCheck, FileText, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Shipping & delivery', href: '#shipping', icon: Truck },
  { label: 'Returns & exchanges', href: '#returns', icon: RotateCcw },
  { label: 'FAQs', href: '#faq', icon: HelpCircle },
  { label: 'Privacy policy', href: '#privacy-policy', icon: ShieldCheck },
  { label: 'Terms of service', href: '#terms', icon: FileText },
  { label: 'Payment', href: '#payment', icon: FileText },
{ label: 'Business information', href: '#business-info', icon: HelpCircle },
]

const PolicyNav = () => {
  const [activeHash, setActiveHash] = useState('#shipping')

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160

      navLinks.forEach((link) => {
        const section = document.querySelector<HTMLElement>(link.href)
        if (!section) return

        const top = section.offsetTop
        const height = section.offsetHeight

        if (scrollPosition >= top && scrollPosition < top + height) {
          setActiveHash(link.href)
        }
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <aside className="lg:col-span-4 relative lg:sticky lg:top-28 z-20 self-start">
      <div className="bg-contrast-beige/80 backdrop-blur-sm border border-black/10 rounded-xl p-4 sm:p-6 shadow-sm">
        <h3 className={`${aire.className} text-lg text-neutral-900 mb-4 tracking-wide`}>
          Quick Navigation
        </h3>

        <nav className="flex flex-col space-y-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon
            const isActive = activeHash === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActiveHash(item.href)}
                className={`group flex items-center justify-between p-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-neutral-900 text-light-beige shadow-sm'
                    : 'text-black hover:bg-neutral-900/10'
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
              </Link>
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
  )
}

export default PolicyNav