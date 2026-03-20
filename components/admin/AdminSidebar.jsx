'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Plus,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import clsx from 'clsx'
import { useState } from 'react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const isActive = (href, exact) =>
    exact ? pathname === href : pathname.startsWith(href)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <p className="display-heading text-xl text-white tracking-wider">EAST DIVISION</p>
        <p className="text-xs text-white/30 mt-0.5 tracking-widest uppercase">Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded',
              isActive(item.href, item.exact)
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            )}
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Quick Actions */}
      <div className="px-3 pb-4 border-t border-white/5 pt-4">
        <Link
          href="/admin/products/new"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 px-3 py-2 text-xs tracking-widest uppercase text-brand-accent/80 hover:text-brand-accent transition-colors"
        >
          <Plus size={13} />
          New Product
        </Link>
      </div>

      {/* Footer */}
      <div className="px-3 pb-6 border-t border-white/5 pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/30 hover:text-white transition-colors"
        >
          ← View Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/30 hover:text-white transition-colors w-full text-left"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 text-white border border-white/10"
        onClick={() => setOpen(v => !v)}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-zinc-900 border-r border-white/5 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative w-64 h-full bg-zinc-900 border-r border-white/5">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
