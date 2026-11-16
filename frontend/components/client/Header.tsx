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
  const [cartOpen, setCartOpen] = useState(false)
  const toggleDropdown = (index: number) => setActiveDropdown((prev) => (prev === index ? null : index))

  // Scroll behaviour: bar turns solid white after a little scroll, hides on scroll down, returns on scroll up
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

  // Single source of truth for the header look.
  //  solid = false -> transparent glass (blur) bar with white text, over the home hero
  //  solid = true  -> white bar with black text (scrolled, menu open, or any non-home page)
  const solid = scrolled || mobileMenuOpen || pathname !== '/'

  // Shared colour classes, so every element switches together
  const navText = (active: boolean) =>
    solid
      ? active
        ? 'text-black'
        : 'text-black/70 group-hover:text-black'
      : active
        ? 'text-white'
        : 'text-white/75 group-hover:text-white'

  const pillBtn = solid
    ? 'sm:bg-black/5 hover:bg-black/10'
    : 'sm:bg-white/10 hover:bg-white/20'
  const pillLabel = solid
    ? 'text-black/50 group-hover:text-black/80'
    : 'text-white/60 group-hover:text-white'
  const kbdStyle = solid
    ? 'border-black/15 text-black/40'
    : 'border-white/25 text-white/60'
  const iconBtn = solid ? 'hover:bg-black/5' : 'hover:bg-white/10'
  const burgerBtn = solid ? 'bg-black/5 hover:bg-black/10' : 'bg-white/10 hover:bg-white/20'
  const burgerLine = solid ? 'bg-black' : 'bg-white'

  return (
    <header className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      {/* Floating bar */}
      <div
        className={`relative z-10 px-1.5 sm:px-5 pt-3 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          hidden && !keepVisible ? '-translate-y-[130%]' : 'translate-y-0'
        }`}
      >
        <div
          className={`pointer-events-auto max-w-7xl mx-auto h-16 rounded-xl border px-2 sm:px-4 lg:px-6 flex lg:grid lg:grid-cols-[1fr_auto_1fr] items-center justify-between transition-all duration-500 backdrop-blur-xl ${
            solid
              ? 'bg-white border-black/10 text-black shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)]'
              : 'bg-white/10 border-white/20 text-white'
          }`}
        >
          {/* ── Left: desktop navigation ── */}
          <nav ref={navRef} className="hidden lg:flex items-center">
            <ul className="flex items-center gap-1 lg:gap-2">
              {navbarData.map((item, index) => {
                const isOpen = activeDropdown === index
                const isActive = !!(item.link
                  ? pathname === item.link
                  : item.children?.some((c) => c.link === pathname))

                return (
                  <li
                    key={index}
                    className="relative text-xs"
                    onMouseEnter={() => !item.link && setActiveDropdown(index)}
                    onMouseLeave={() => !item.link && setActiveDropdown(null)}
                  >
                    {item.link ? (
                      <Link href={item.link} className="group relative block px-3 lg:px-4 py-2 text-[13px] tracking-wide text-nowrap">
                        <span className={`transition-colors ${navText(isActive)}`}>
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
                          className={`group flex items-center gap-1 px-3 lg:px-4 py-2 text-[13px] tracking-wide focus:outline-none transition-colors ${navText(isOpen || isActive)}`}
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
                            <div
                              className={`w-64 rounded-xl border backdrop-blur-xl p-2 shadow-2xl transition-colors duration-500 ${
                                solid
                                  ? 'bg-white border-black/10 text-black'
                                  : 'bg-black/40 border-white/20 text-white'
                              }`}
                            >
                              <ul className="flex flex-col">
                                {item.children.map((child, childIndex) => (
                                  <li key={childIndex}>
                                    <Link
                                      href={child.link || '#'}
                                      onClick={() => setActiveDropdown(null)}
                                      className={`group/item flex items-center justify-between rounded-lg px-4 py-3 text-sm font-light transition-colors ${
                                        solid ? 'hover:bg-black/5' : 'hover:bg-white/10'
                                      }`}
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

          {/* Search (mobile / tablet: left side) */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className={`group lg:hidden flex items-center gap-3 h-10 rounded-lg px-3 sm:pl-4 sm:pr-3 transition-colors cursor-pointer ${pillBtn}`}
          >
            <Search className="w-[18px] h-[18px]" />
            <span className={`hidden sm:block text-xs transition-colors ${pillLabel}`}>
              Search
            </span>
          </button>

          {/* ── Center: logo ── */}
          <Link href="/" className="flex items-center gap-2 justify-self-center" aria-label="Lifestyle Shopping UK home">
            <Image
              src="/logo.jpg"
              alt="Lifestyle Shopping logo"
              width={80}
              height={80}
              className="block sm:hidden h-10 w-10 rounded-lg object-cover object-center"
            />
            <span
              className={`inline-block uppercase tracking-[0.25em] text-[11px] sm:text-sm lg:text-base whitespace-nowrap transition-colors duration-100 ${aire.className} font-semibold sm:font-normal`}
            >
              Lifestyle Shopping.uk
            </span>
          </Link>

          {/* ── Right: actions ── */}
          <div className="flex items-center gap-1 sm:gap-2 md:justify-self-end">
            {/* Search (desktop) */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className={`group hidden lg:flex items-center gap-3 h-10 rounded-lg px-3 sm:pl-4 sm:pr-3 transition-colors cursor-pointer ${pillBtn}`}
            >
              <Search className="w-[18px] h-[18px]" />
              <span className={`hidden sm:block text-xs transition-colors ${pillLabel}`}>
                Search
              </span>
              <kbd className={`hidden lg:block rounded-md border px-1.5 py-0.5 text-[10px] transition-colors ${kbdStyle}`}>
                Ctrl K
              </kbd>
            </button>

            <button
              onClick={() => setCartOpen(true)}
              aria-label="Shopping cart"
              className={`relative h-10 w-10 rounded-lg flex items-center justify-center transition-colors focus:outline-none ${iconBtn}`}
            >
              <ShoppingBag className="w-[16px] sm:w-[19px] h-[16px] sm:h-[19px]" />
            </button>

            {/* Animated hamburger (mobile) */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              className={`lg:hidden relative h-10 w-10 rounded-full transition-colors focus:outline-none ${burgerBtn}`}
            >
              <span
                className={`absolute left-1/2 top-1/2 h-px w-4 sm:w-5 -translate-x-1/2 ${burgerLine} transition-all duration-500 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-[4px]'
                }`}
              />
              <span
                className={`absolute left-1/2 top-1/2 h-px w-4 sm:w-5 -translate-x-1/2 ${burgerLine} transition-all duration-500 ${
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