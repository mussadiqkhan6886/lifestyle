'use client'

import useDebounce from '@/hooks/useDebounce'
import { collections } from '@/lib/constants'
import { aire } from '@/lib/fonts'
import { ArrowRight, ArrowUpRight, Clock, Search as SearchIcon, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useRef, useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

const RECENT_KEY = 'ls-recent-searches'
const MAX_RECENT = 5

const SearchOverlay = ({ open, onClose }: Props) => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState<string>('')
  const [recent, setRecent] = useState<string[]>([])
  const debounceSearch = useDebounce(query, 500)
  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY)
      if (stored) setRecent(JSON.parse(stored))
    } catch {}
  }, [])

  // Focus, scroll-lock and Escape handling
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => inputRef.current?.focus(), 250)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const trimmed = debounceSearch.trim()

  const matches = useMemo(() => {
    if (!trimmed) return []
    const q = trimmed.toLowerCase()
    return collections.filter((c) => c.title.toLowerCase().includes(q))
  }, [trimmed])

  const saveRecent = (term: string) => {
    const next = [term, ...recent.filter((r) => r.toLowerCase() !== term.toLowerCase())].slice(0, MAX_RECENT)
    setRecent(next)
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
    } catch {}
  }

  const clearRecent = () => {
    setRecent([])
    try {
      localStorage.removeItem(RECENT_KEY)
    } catch {}
  }

  const runSearch = (term: string) => {
    const t = term.trim()
    if (!t) return
    saveRecent(t)
    onClose()
    setQuery('')
    router.push(`/search?q=${encodeURIComponent(t)}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    runSearch(query)
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      aria-hidden={!open}
      className={`fixed inset-0 z-[60] ${open ? 'visible' : 'invisible delay-500'} transition-[visibility]`}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel */}
      <div
        className={`relative bg-light-beige text-neutral-900 max-h-[95vh] overflow-y-auto rounded-b-[1.75rem] sm:rounded-b-[2.5rem] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          open ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(#00000006_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-10 sm:pt-8 sm:pb-12">
          {/* Top row */}
          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-500">Search</p>
            <button
              onClick={handleClose}
              aria-label="Close search"
              className="group h-10 w-10 rounded-full border border-black/15 flex items-center justify-center transition-all duration-300 hover:bg-neutral-900 hover:text-light-beige hover:rotate-90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="relative flex items-center gap-4 border-b-2 border-neutral-900 pb-4">
            <SearchIcon className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 text-neutral-900" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search watches, bags, clothing…"
              aria-label="Search products"
              autoComplete="off"
              className={`${aire.className} w-full bg-transparent outline-none text-xl sm:text-4xl tracking-tight placeholder:text-neutral-900/25`}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  inputRef.current?.focus()
                }}
                aria-label="Clear search"
                className="shrink-0 text-[10px] uppercase tracking-[0.25em] text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              aria-label="Submit search"
              disabled={!trimmed}
              className="shrink-0 h-11 w-11 rounded-full bg-neutral-900 text-light-beige flex items-center justify-center transition-all duration-300 hover:bg-contrast-beige hover:text-neutral-900 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* ── Empty state: recent, popular, collections ── */}
          {!trimmed && (
            <div className="mt-10 space-y-10">
              {recent.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-500">Recent</p>
                    <button
                      onClick={clearRecent}
                      className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {recent.map((term) => (
                      <li key={term}>
                        <button
                          onClick={() => runSearch(term)}
                          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-contrast-beige/60 px-4 py-2 text-sm hover:border-neutral-900 transition-colors"
                        >
                          <Clock className="w-3.5 h-3.5 text-neutral-500" />
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}


              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-500">Shop by collection</p>
                <ul className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {collections.map((c) => (
                    <li key={c.link}>
                      <Link href={c.link} onClick={handleClose} className="group block space-y-2">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-contrast-beige">
                          <Image
                            src={c.image}
                            alt={c.title}
                            fill
                            sizes="(min-width: 768px) 120px, 30vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <p className="text-[11px] sm:text-xs leading-tight text-neutral-700 group-hover:text-neutral-900 transition-colors">
                          {c.title}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ── Typing state: matching collections + search-all row ── */}
          {trimmed && (
            <div className="mt-8 space-y-6">
              {matches.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-500 mb-3">
                    Collections
                  </p>
                  <ul className="border-t border-black/10">
                    {matches.map((c) => (
                      <li key={c.link} className="border-b border-black/10">
                        <Link
                          href={c.link}
                          onClick={() => {
                            saveRecent(trimmed)
                            handleClose()
                          }}
                          className="group flex items-center gap-4 py-3"
                        >
                          <span className="relative h-14 w-12 shrink-0 overflow-hidden rounded-sm bg-contrast-beige">
                            <Image src={c.image} alt={c.title} fill sizes="48px" className="object-cover" />
                          </span>
                          <span
                            className={`${aire.className} flex-1 text-xl sm:text-2xl tracking-tight transition-transform duration-300 group-hover:translate-x-2`}
                          >
                            {c.title}
                          </span>
                          <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:text-contrast-beige transition-colors" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => runSearch(trimmed)}
                className="group flex w-full items-center justify-between rounded-xl bg-neutral-900 text-light-beige px-5 py-4 text-left transition-colors hover:bg-neutral-800"
              >
                <span className="text-sm">
                  Search all products for{' '}
                  <span className="text-contrast-beige font-medium">&ldquo;{trimmed}&rdquo;</span>
                </span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          )}

          {/* Keyboard hint (desktop) */}
          <p className="hidden sm:flex items-center gap-4 mt-10 text-[11px] text-neutral-500">
            <span>
              <kbd className="rounded border border-black/15 px-1.5 py-0.5">Enter</kbd> to search
            </span>
            <span>
              <kbd className="rounded border border-black/15 px-1.5 py-0.5">Esc</kbd> to close
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SearchOverlay