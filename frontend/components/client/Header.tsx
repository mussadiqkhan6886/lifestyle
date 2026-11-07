'use client'

import { navbarData } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronDown, Search, ShoppingBag } from 'lucide-react'
import { aire } from '@/lib/fonts'
import SideBarMenu from './SideBarMenu'
import SearchOverlay from './Search'
import SideBarCart from './SideBarCart'

const Header = () => {
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const lastY = useRef(0)

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
const [cartOpen, setCartOpen] = useState(false);
  const toggleDropdown = (index: number) => setActiveDropdown((prev) => (prev === index ? null : index))

  // Scroll behaviour: glass bar gets solid after a little scroll, hides on scroll down, returns on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      setHidden(y > 140 && y > lastY.current)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close desktop dropdown on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setActiveDropdown(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // Ctrl/⌘ + K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const keepVisible = mobileMenuOpen || searchOpen || activeDropdown !== null

  return (
    <header className="fixed top-0 left-0 w-full z-50 text-white pointer-events-none">
      {/* Floating bar */}
      <div
        className={`relative z-10 px-3 sm:px-5 pt-3 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          hidden && !keepVisible ? '-translate-y-[130%]' : 'translate-y-0'
        }`}
      >
        <div
          className={`pointer-events-auto max-w-7xl mx-auto h-16 rounded-xl border px-3 sm:px-4 lg:px-6 flex lg:grid lg:grid-cols-[1fr_auto_1fr] items-center justify-between transition-all duration-500 backdrop-blur-xl ${
            scrolled || mobileMenuOpen || pathname !== "/"
              ? 'bg-neutral-950/85 border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]'
              : 'bg-white/5 border-white/15'
          }`}
        >
          {/* ── Left: desktop navigation ── */}
          <nav ref={navRef} className="hidden lg:flex items-center">
            <ul className="flex items-center gap-1 lg:gap-2">
              {navbarData.map((item, index) => {
                const isOpen = activeDropdown === index
                const isActive = item.link
                  ? pathname === item.link
                  : item.children?.some((c) => c.link === pathname)

                return (
                  <li
                    key={index}
                    className="relative text-xs"
                    onMouseEnter={() => !item.link && setActiveDropdown(index)}
                    onMouseLeave={() => !item.link && setActiveDropdown(null)}
                  >
                    {item.link ? (
                      <Link href={item.link} className="group relative block px-3 lg:px-4 py-2 text-[13px] tracking-wide text-nowrap">
                        <span className={isActive ? 'text-white' : 'text-white/75 group-hover:text-white transition-colors'}>
                          {item.title}
                        </span>
                        <span
                          className={`absolute left-3 right-3 lg:left-4 lg:right-4 -bottom-0.5 h-px origin-left bg-contrast-beige transition-transform duration-500 ${
                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                        />
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleDropdown(index)}
                          aria-expanded={isOpen}
                          className={`group flex items-center gap-1 px-3 lg:px-4 py-2 text-[13px] tracking-wide focus:outline-none transition-colors ${
                            isOpen || isActive ? 'text-white' : 'text-white/75 hover:text-white'
                          }`}
                        >
                          {item.title}
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                          />
                        </button>

                        {/* Dropdown (padding-top bridges the hover gap) */}
                        {item.children && (
                          <div
                            className={`absolute left-0 top-full pt-4 transition-all duration-300 ease-out ${
                              isOpen
                                ? 'opacity-100 translate-y-0 visible'
                                : 'opacity-0 translate-y-2 invisible pointer-events-none'
                            }`}
                          >
                            <div className="w-64 rounded-xl border border-white/10 bg-neutral-950/95 backdrop-blur-xl p-2 shadow-2xl">
                              <ul className="flex flex-col">
                                {item.children.map((child, childIndex) => (
                                  <li key={childIndex}>
                                    <Link
                                      href={child.link || '#'}
                                      onClick={() => setActiveDropdown(null)}
                                      className="group/item flex items-center justify-between rounded-lg px-4 py-3 text-sm font-light text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                      <span className="transition-transform duration-300 group-hover/item:translate-x-1">
                                        {child.title}
                                      </span>
                                      <ArrowUpRight className="w-4 h-4 text-contrast-beige opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:translate-y-0" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* ── Center: logo ── */}
          <Link href="/" className="flex items-center justify-self-center" aria-label="Lifestyle Shopping UK home">
            <Image
              src="/logo.jpg"
              alt="Lifestyle Shopping logo"
              width={80}
              height={80}
              className="block sm:hidden h-10 w-10 rounded-full object-cover object-center"
            />
            <span
              className={`hidden sm:inline-block uppercase tracking-[0.25em] text-sm lg:text-base whitespace-nowrap ${aire.className}`}
            >
              Lifestyle Shopping.uk
            </span>
          </Link>

          {/* ── Right: actions ── */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:justify-self-end">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="group flex items-center gap-3 h-10 rounded-lg px-3 sm:pl-4 sm:pr-3 sm:bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <Search className="w-[18px] h-[18px]" />
              <span className="hidden sm:block text-xs text-white/50 group-hover:text-white/80 transition-colors">
                Search
              </span>
              <kbd className="hidden lg:block rounded-md border border-white/15 px-1.5 py-0.5 text-[10px] text-white/40">
                Ctrl K
              </kbd>
            </button>

           <button
                onClick={() => setCartOpen(true)}
                aria-label="Shopping cart"
                className="relative h-10 w-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors focus:outline-none"
                >
                <ShoppingBag className="w-[18px] h-[18px]" />
            </button>

            {/* Animated hamburger (mobile) */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden relative h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none"
            >
              <span
                className={`absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 bg-white transition-all duration-500 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-[4px]'
                }`}
              />
              <span
                className={`absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 bg-white transition-all duration-500 ${
                  mobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-[4px]'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Overlays (always mounted so their open/close animations play) */}
      <div className="pointer-events-auto">
        <SideBarMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
        <SideBarCart open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </header>
  )
}

export default Header