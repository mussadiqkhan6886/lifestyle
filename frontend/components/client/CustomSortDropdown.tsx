'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

interface SortOption {
  label: string
  value: string
}

interface CustomSortDropdownProps {
  sortOptions: SortOption[]
  sort?: string
}

const CustomSortDropdown = ({ sortOptions, sort }: CustomSortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeSort = sort ?? 'featured'
  const activeOption =
    sortOptions.find((opt) => opt.value === activeSort) || sortOptions[0]

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Build href that keeps current path + other query params, only changes sort
  const getSortHref = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === 'featured') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }

    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium select-none">
          Sort by:
        </span>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="inline-flex items-center justify-between gap-3 border border-black/15 text-neutral-900 rounded-md px-4 py-2 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        >
          <span>{activeOption?.label}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-neutral-600 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div
          role="listbox"
          className="absolute sm:right-0 mt-2 w-48 bg-white border border-black/10 rounded-xl shadow-lg z-50 py-1 overflow-hidden"
        >
          {sortOptions.map((option) => {
            const active = activeSort === option.value
            return (
              <Link
                key={option.value}
                href={getSortHref(option.value)}
                scroll={false}
                onClick={() => setIsOpen(false)}
                role="option"
                aria-selected={active}
                className={`flex items-center justify-between w-full px-4 py-2.5 text-xs transition-colors ${
                  active
                    ? 'bg-contrast-beige text-neutral-900 font-medium'
                    : 'text-neutral-800 hover:bg-black/5'
                }`}
              >
                <span>{option.label}</span>
                {active && (
                  <span className="text-[10px] uppercase tracking-widest">•</span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CustomSortDropdown