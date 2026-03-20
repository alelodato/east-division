import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function CancelPage() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 sm:px-6 text-center py-20">
        <XCircle size={48} className="mx-auto text-white/20 mb-6" strokeWidth={1.5} />
        <p className="section-label mb-3">Payment Cancelled</p>
        <h1 className="display-heading text-5xl text-white mb-5">ORDER CANCELLED</h1>
        <p className="text-white/50 text-sm leading-relaxed mb-8">
          Your payment was cancelled and no charge was made. Your bag has been saved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/cart" className="btn-primary">
            Back to Bag
          </Link>
          <Link href="/shop" className="btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
