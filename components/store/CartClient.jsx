'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from './CartProvider'

export default function CartClient() {
  const { items, removeItem, updateQty, subtotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)

  const shipping = subtotal >= 100 ? 0 : 4.99
  const total = subtotal + shipping

  const handleCheckout = async () => {
    if (items.length === 0) return
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Checkout error', err)
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <ShoppingBag size={40} className="mx-auto text-white/10 mb-6" strokeWidth={1} />
        <p className="display-heading text-4xl text-white mb-3">BAG IS EMPTY</p>
        <p className="text-white/40 text-sm mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-10">
      {/* Items */}
      <div className="lg:col-span-2 space-y-0 divide-y divide-white/5">
        {items.map(item => (
          <div key={`${item.productId}-${item.size}`} className="flex gap-4 py-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-zinc-900 overflow-hidden">
              {item.image && (
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-2">
                <div>
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-sm font-medium text-white hover:text-brand-accent transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-white/40 mt-0.5">Size: {item.size}</p>
                </div>
                <p className="text-sm text-white flex-shrink-0">£{(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center border border-white/10">
                  <button
                    onClick={() => updateQty(item.productId, item.size, item.quantity - 1)}
                    className="p-2 text-white/50 hover:text-white transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-xs text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.productId, item.size, item.quantity + 1)}
                    className="p-2 text-white/50 hover:text-white transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.productId, item.size)}
                  className="text-white/30 hover:text-white transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4">
          <button
            onClick={clearCart}
            className="text-xs text-white/30 hover:text-white transition-colors tracking-widest uppercase"
          >
            Clear Bag
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="lg:col-span-1">
        <div className="bg-zinc-900 p-6 sticky top-24">
          <h2 className="text-sm font-semibold tracking-widest uppercase mb-6">Order Summary</h2>
          <div className="space-y-3 mb-6 text-sm">
            <div className="flex justify-between text-white/60">
              <span>Subtotal</span>
              <span>£{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `£${shipping.toFixed(2)}`}</span>
            </div>
            {shipping === 0 && (
              <p className="text-xs text-brand-accent">Free shipping applied ✓</p>
            )}
            <div className="border-t border-white/10 pt-3 flex justify-between font-medium text-white">
              <span>Total</span>
              <span>£{total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn-primary w-full justify-center"
          >
            {loading ? 'Redirecting...' : 'Proceed to Checkout'}
          </button>
          <p className="text-xs text-white/25 text-center mt-3">
            Secured by Stripe · SSL encrypted
          </p>
        </div>
      </div>
    </div>
  )
}
