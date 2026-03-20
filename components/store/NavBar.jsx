'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from './CartProvider'
import clsx from 'clsx'

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop?category=sneakers', label: 'Sneakers' },
  { href: '/shop?category=apparel', label: 'Apparel' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function NavBar() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-brand-black/95 backdrop-blur-sm border-b border-white/5' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="display-heading text-2xl text-white tracking-wider hover:text-brand-accent transition-colors">
          EAST DIVISION
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'text-xs tracking-widest uppercase font-medium transition-colors hover:text-white',
                pathname === link.href ? 'text-white' : 'text-white/50'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Cart + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 text-white/70 hover:text-white transition-colors">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-accent text-brand-black text-[10px] font-bold flex items-center justify-center rounded-full">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>
          <button
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-brand-black border-t border-white/5">
          <nav className="flex flex-col px-6 py-6 gap-5">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-widest uppercase font-medium text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
