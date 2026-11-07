'use client'

import { navbarData } from '@/lib/constants'
import { aire } from '@/lib/fonts'
import { ArrowUpRight, Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

const socials = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'TikTok', href: 'https://tiktok.com' },
]

const SideBarMenu = ({ open, onClose }: Props) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)

  const toggle = (i: number) => setActiveDropdown((prev) => (prev === i ? null : i))

  const handleNavigate = () => {
    setActiveDropdown(null)
    onClose()
  }

  // Lock page scroll while open + close on Escape
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && handleNavigate()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Staggered entrance helper
  const reveal = (i: number) => ({
    transitionDelay: open ? `${180 + i * 70}ms` : '0ms',
  })
  const revealClass = open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'

  return (
    <div
      aria-hidden={!open}
      className={`md:hidden fixed inset-0 z-0 transition-[visibility] duration-700 ${
        open ? 'visible' : 'invisible delay-700'
      }`}
    >
      {/* Backdrop that wipes down from the top */}
      <div
        className={`absolute inset-0 bg-contrast-beige origin-top transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          open ? 'scale-y-100' : 'scale-y-0'
        }`}
      >
        {/* Texture + glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:26px_26px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-amber-500/15 blur-[100px] pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative h-full overflow-y-auto px-6 pt-28 pb-10 flex flex-col">

        <nav className="flex-1">
          <ul className="border-t border-white/10">
            {navbarData.map((item, index) => {
              const isOpen = activeDropdown === index
              const hasChildren = !item.link && item.children

              return (
                <li
                  key={index}
                  style={reveal(index + 1)}
                  className={`border-b border-white/10 transition-all duration-700 ease-out ${revealClass}`}
                >
                  {item.link ? (
                    <Link
                      href={item.link}
                      onClick={handleNavigate}
                      className="group flex items-center justify-between py-5"
                    >
                      <span className="flex items-baseline gap-4">
                        <span
                          className={`${aire.className} text-3xl tracking-tight text-light-beige transition-transform duration-300 group-active:translate-x-2`}
                        >
                          {item.title}
                        </span>
                      </span>
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </Link>
                  ) : (
                    <div>
                      <button
                        onClick={() => toggle(index)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between py-5 text-left focus:outline-none"
                      >
                        <span className="flex items-baseline gap-4">
                          <span
                            className={`${aire.className} text-3xl tracking-tight transition-colors duration-300 ${
                              isOpen ? 'text-white' : 'text-light-beige'
                            }`}
                          >
                            {item.title}
                          </span>
                        </span>
                        <span
                          className={`h-9 w-9 rounded-full border flex items-center justify-center transition-all duration-500 ${
                            isOpen
                              ? 'rotate-45 border-white text-white'
                              : 'border-light-beige text-light-beige'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                        </span>
                      </button>

                      {/* Smooth accordion */}
                      {hasChildren && (
                        <div
                          className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <ul className="pb-5 pl-9 space-y-1">
                              {item.children!.map((child, cIdx) => (
                                <li
                                  key={cIdx}
                                  style={{ transitionDelay: isOpen ? `${cIdx * 50 + 100}ms` : '0ms' }}
                                  className={`transition-all duration-500 ${
                                    isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                                  }`}
                                >
                                  <Link
                                    href={child.link || '#'}
                                    onClick={handleNavigate}
                                    className="group flex items-center justify-between py-2.5 text-base font-light text-white active:text-white"
                                  >
                                    <span className="flex items-center gap-3">
                                      <span className="h-px w-4 bg-white/25 transition-all duration-300 group-active:w-7 group-active:bg-amber-500" />
                                      {child.title}
                                    </span>
                                    <ArrowUpRight className="w-4 h-4 text-white/30" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer block */}
        <div
          style={reveal(navbarData.length + 2)}
          className={`mt-10 space-y-6 transition-all duration-700 ${revealClass}`}
        >
          <Link
            href="/contact-us"
            onClick={handleNavigate}
            className="flex items-center justify-between rounded-xl bg-light-beige text-neutral-900 pl-6 pr-1.5 py-1.5 text-[11px] uppercase tracking-[0.25em] font-medium"
          >
            Contact support
            <span className="h-10 w-10 rounded-full bg-neutral-900 text-light-beige flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </Link>

          <div className="flex items-center justify-between text-xs text-white/50">
            <div className="flex gap-5">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {s.label}
                </Link>
              ))}
            </div>
            <span className="uppercase tracking-[0.3em] text-[10px]">Lifestyle Shopping UK</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBarMenu