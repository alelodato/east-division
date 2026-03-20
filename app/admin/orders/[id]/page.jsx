import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import UpdateOrderStatus from '@/components/admin/UpdateOrderStatus'

const STATUS_COLOUR = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  paid: 'text-brand-accent bg-brand-accent/10 border-brand-accent/20',
  shipped: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  delivered: 'text-green-400 bg-green-400/10 border-green-400/20',
}

export default async function OrderDetailPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', id)
    .single()

  if (!data) notFound()
  const order = data

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link href="/admin/orders" className="text-xs text-white/30 hover:text-white transition-colors tracking-widest uppercase">
            ← Orders
          </Link>
          <h1 className="display-heading text-4xl text-white mt-2">ORDER DETAIL</h1>
        </div>
        <span className={`text-xs px-3 py-1 border tracking-widest uppercase font-medium mt-6 ${STATUS_COLOUR[order.status] ?? ''}`}>
          {order.status}
        </span>
      </div>

      <div className="space-y-6">
        {/* Customer */}
        <div className="bg-zinc-900 border border-white/5 p-6">
          <h2 className="text-xs tracking-widest uppercase text-white/40 mb-4">Customer</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/40 text-xs mb-1">Name</p>
              <p className="text-white">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">Email</p>
              <p className="text-white">{order.customer_email}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">Date</p>
              <p className="text-white">
                {new Date(order.created_at).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">Stripe Session</p>
              <p className="text-white/40 text-xs font-mono break-all">{order.stripe_session_id}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-zinc-900 border border-white/5 p-6">
          <h2 className="text-xs tracking-widest uppercase text-white/40 mb-4">Items</h2>
          <div className="space-y-3">
            {order.items?.map(item => (
              <div key={item.id} className="flex justify-between items-start py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm text-white">{item.product_name}</p>
                  <p className="text-xs text-white/30 mt-0.5">
                    Size: {item.size} · Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-sm text-white">£{(item.unit_price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4 border-t border-white/10 mt-2">
            <p className="text-sm font-semibold text-white">Total</p>
            <p className="text-sm font-semibold text-white">£{order.total_amount.toFixed(2)}</p>
          </div>
        </div>

        {/* Status Update */}
        <div className="bg-zinc-900 border border-white/5 p-6">
          <h2 className="text-xs tracking-widest uppercase text-white/40 mb-4">Update Status</h2>
          <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  )
}
