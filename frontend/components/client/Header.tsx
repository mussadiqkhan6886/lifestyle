'use client';

import { navbarData } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { ChevronDown, Search, ShoppingBag, Menu, X } from 'lucide-react';
import { aire } from '@/lib/fonts';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-light-beige/80 text-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
        
        <nav className="hidden md:flex items-center">
          <ul className="flex items-center space-x-6 lg:space-x-7">
            {navbarData.map((item, index) => (
              <li key={index} className="tracking-wide relative">
                {item.link ? (
                  <Link 
                    href={item.link} 
                    className="text-xs py-2"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <div className="relative">
                    <button 
                      onClick={() => toggleDropdown(index)}
                      className="flex items-center gap-1 text-xs py-2 cursor-pointer focus:outline-none"
                    >
                      {item.title} 
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>

                    {activeDropdown === index && item.children && (
                      <div className="absolute top-full left-0 mt-2 w-48 rounded-lg bg-light-beige/10 border border-white/10 shadow-xl backdrop-blur-md py-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <ul className="flex flex-col">
                          {item.children.map((child, childIndex) => (
                            <li key={childIndex}>
                              <Link 
                                href={child.link || '#'} 
                                onClick={() => setActiveDropdown(null)}
                                className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors font-light"
                              >
                                {child.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            {/* <Image 
              src="/logo.jpg" 
              alt="header logo" 
              width={80} 
              height={80} 
              className="object-center object-cover"
            /> */}
            <span className={` text-md lg:text-xl tracking-widest hidden sm:inline-block uppercase ${aire.className}`}>Lifestyle Shopping.uk</span>
          </Link>
        </div>

        <div className="flex items-center space-x-5">
          <button 
            aria-label="Search" 
            className="flex items-end gap-2 p-2 bg-white/10 rounded-full pr-4"
          >
            <Search className="w-5 h-5" />
            <span className='text-xs text-white/50'>Search</span>
          </button>
          
          <Link 
            href="/cart" 
            aria-label="Shopping Cart" 
            className="relative p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu" 
            className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-light-beige/10 border-b border-white/10 px-4 py-6 space-y-3 backdrop-blur-lg">
          {navbarData.map((item, index) => (
            <div key={index} className="py-2">
              {item.link ? (
                <Link 
                  href={item.link} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base"
                >
                  {item.title}
                </Link>
              ) : (
                <div>
                  <button 
                    onClick={() => toggleDropdown(index)}
                    className="flex items-center cursor-pointer justify-between w-full text-base py-1"
                  >
                    {item.title}
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === index && item.children && (
                    <div className="pl-4 mt-2 space-y-3 border-l border-white/20">
                      {item.children.map((child, cIdx) => (
                        <Link 
                          key={cIdx} 
                          href={child.link || '#'} 
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setActiveDropdown(null);
                          }}
                          className="block text-sm font-light "
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;