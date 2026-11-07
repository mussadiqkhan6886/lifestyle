import { collections } from '@/lib/constants'
import { aire } from '@/lib/fonts'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: 'Page not found | Lifestyle Shopping UK',
}

const NotFound = () => {
  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 sm:px-6 pt-28 pb-20">
      <div className="relative z-10 w-full max-w-4xl text-center space-y-12">
        <div
          className="flex items-center justify-center gap-2 sm:gap-6"
          aria-label="404"
        >
          <span
            aria-hidden
            className={`${aire.className} text-[28vw] sm:text-[11rem] lg:text-[14rem] leading-none tracking-tighter`}
          >
            404
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-[11px] uppercase tracking-[0.4em]">Page not found</h1>
          <p className="text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            The link may be broken, or the page may have moved. Let&apos;s get you back to something worth your time.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-4 rounded-full text-neutral-900 pl-8 pr-1.5 py-1.5 text-xs uppercase tracking-[0.25em] font-medium transition-colors hover:bg-contrast-beige border border-black"
          >
            Back to home
            <span className="h-11 w-11 rounded-full bg-neutral-900 text-light-beige flex items-center justify-center transition-transform duration-500 group-hover:translate-x-0.5">
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/collections/all"
            className="inline-flex items-center gap-2 rounded-full border border-black px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-black "
          >
            Browse all collections
          </Link>
        </div>

        {/* Quick links */}
        <div className="space-y-4 pt-4">
          <p className="text-[10px] uppercase tracking-[0.4em]">Or jump to</p>
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {collections.map((c) => (
              <li key={c.link}>
                <Link
                  href={c.link}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-black bg-white/5 px-4 py-2 text-xs text-black "
                >
                  {c.title}
                  <ArrowUpRight className="w-3 h-3 text-black opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}

export default NotFound