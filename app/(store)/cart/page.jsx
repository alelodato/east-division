import CartClient from '@/components/store/CartClient'

export const metadata = { title: 'Your Bag' }

export default function CartPage() {
  return (
    <div className="pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="section-label mb-2">East Division</p>
          <h1 className="display-heading text-5xl text-white">YOUR BAG</h1>
        </div>
        <CartClient />
      </div>
    </div>
  )
}
