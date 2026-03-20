'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useCart } from '@/components/store/CartProvider'

export default function SuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 sm:px-6 text-center py-20">
        <CheckCircle size={48} className="mx-auto text-brand-accent mb-6" strokeWidth={1.5} />
        <p className="section-label mb-3">Payment Confirmed</p>
        <h1 className="display-heading text-5xl text-white mb-5">ORDER PLACED</h1>
        <p className="text-white/50 text-sm leading-relaxed mb-8">
          Thank you for your order. You&apos;ll receive a confirmation email shortly.
          We aim to dispatch within 1–2 working days.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop" className="btn-primary">
            Continue Shopping
          </Link>
          <Link href="/contact" className="btn-outline">
            Need Help?
          </Link>
        </div>
      </div>
    </div>
  )
}
