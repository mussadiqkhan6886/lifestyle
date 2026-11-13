'use client'

import { companyLinks, helpLinks, socials } from '@/lib/constants'
import { aire } from '@/lib/fonts'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Footer = () => {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative bg-light-beige text-neutral-900 overflow-hidden px-3 sm:px-5 pt-16 sm:pt-24">
      {/* Dot texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#00000006_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ── Statement card ───────────────────────────── */}
        <div className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2.5rem] bg-neutral-950 text-light-beige px-6 sm:px-12 lg:px-16 py-7 md:py-12 lg:py-20">
          {/* Glow */}
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-amber-500/20 blur-[110px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:26px_26px] pointer-events-none" />

          <div className="relative grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8 space-y-6">
              <p className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-contrast-beige">
                Lifestyle Shopping UK
              </p>
              <h2
                className={`${aire.className} text-4xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight`}
              >
                Any query?
                <br />
                <span className="text-white/40 italic">We&apos;re here to help.</span>
              </h2>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                href="/contact-us"
                className="group relative inline-flex items-center gap-2 xl:gap-4 rounded-2xl bg-light-beige text-neutral-900 pl-6 lg:pl-8 pr-2 py-2 text-xs uppercase tracking-[0.25em] font-medium overflow-hidden transition-all duration-500 hover:bg-contrast-beige"
              >
                <span>Contact support</span>
                <span className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-neutral-900 text-light-beige flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Link columns ─────────────────────────────── */}
        <div className="grid md:grid-cols-12 gap-12 md:gap-8 py-16 sm:py-20">
          {/* Brand blurb */}
          <div className="md:col-span-4 space-y-5">
            <p className={`${aire.className} text-2xl tracking-wide`}>Lifestyle Shopping</p>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-xs">
              Watches, fashion and everyday luxuries, chosen with an eye for detail and delivered across pakistan imported from the UK.
            </p>
          </div>

          <LinkColumn title="Help" links={helpLinks} className="md:col-span-3 md:col-start-6" />
          <LinkColumn title="Company" links={companyLinks} className="md:col-span-2" />
          <LinkColumn title="Follow" links={socials} external className="md:col-span-2" />
        </div>

        {/* ── Giant wordmark ───────────────────────────── */}
        <div className="relative select-none border-t border-black/10 pt-6 sm:pt-10">
          <h2
            aria-hidden
            className={`${aire.className} text-center uppercase whitespace-nowrap leading-[0.82] tracking-tighter text-[10vw] text-neutral-900 transition-all duration-700 hover:tracking-[-0.02em]`}
          >
            Lifestyle Shopping
          </h2>
          <span
            aria-hidden
            className="absolute right-0 top-2 sm:top-4 rounded-full border border-black/20 px-3 py-1 text-[10px] sm:text-xs uppercase tracking-[0.35em] bg-light-beige"
          >
            UK
          </span>
        </div>

        {/* ── Bottom bar ───────────────────────────────── */}
        <div className="flex flex-col-reverse gap-6 sm:flex-row items-center sm:justify-between border-t border-black/10 mt-6 sm:mt-10 py-8 text-xs text-neutral-500">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <span>© {year} Lifestyle Shopping UK. All rights reserved.</span>
            <span className="hidden sm:inline h-3 w-px bg-black/15" />
            <span className='text-center'>
              Designed &amp; built with care by{' '}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://mussadiqkhan.vercel.app/"
                className="text-neutral-900 underline underline-offset-4 decoration-black/30 hover:decoration-neutral-900 transition-colors"
              >
                scrupulous
              </Link>
              .
            </span>
          </div>

          <button
            onClick={scrollTop}
            className="group inline-flex items-center gap-3 sm:self-auto uppercase tracking-[0.3em] text-neutral-700 hover:text-neutral-900 transition-colors"
          >
            Back to top
            <span className="h-10 w-10 rounded-full border border-black/20 flex items-center justify-center transition-all duration-500 group-hover:bg-neutral-900 group-hover:text-light-beige group-hover:-translate-y-1">
              <ArrowUp className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}


const LinkColumn = ({
  title,
  links,
  external = false,
  className = '',
}: {
  title: string
  links: { label: string; href: string }[]
  external?: boolean
  className?: string
}) => (
  <div className={className}>
    <p className="text-[11px] uppercase tracking-[0.4em] text-neutral-500 mb-6">{title}</p>
    <ul className="border-t border-black/10">
      {links.map((l) => (
        <li key={l.label} className="border-b border-black/10">
          <Link
            href={l.href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="group relative flex items-center justify-between overflow-hidden py-3.5 text-sm"
          >
            {/* Wipe fill */}
            <span className="absolute inset-0 -z-0 translate-y-full bg-contrast-beige transition-transform duration-500 ease-out group-hover:translate-y-0" />
            <span className="relative z-10 transition-all duration-500 group-hover:translate-x-3 group-hover:text-light-beige">
              {l.label}
            </span>
            <ArrowUpRight className="relative z-10 mr-3 h-4 w-4 opacity-0 -translate-x-2 translate-y-2 text-black transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

export default Footer