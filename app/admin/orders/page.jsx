import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const STATUS_COLOUR = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  paid: 'text-brand-accent bg-brand-accent/10 border-brand-accent/20',
  shipped: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  delivered: 'text-green-400 bg-green-400/10 border-green-400/20',
}

async function getOrders() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Fulfilment</p>
        <h1 className="display-heading text-4xl text-white">ORDERS</h1>
        <p className="text-white/30 text-sm mt-1">{orders.length} total orders</p>
      </div>

      <div className="bg-zinc-900 border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/5">
            <tr>
              <th className="text-left text-xs tracking-widest uppercase text-white/40 px-5 py-4">Customer</th>
              <th className="text-left text-xs tracking-widest uppercase text-white/40 px-5 py-4 hidden md:table-cell">Date</th>
              <th className="text-left text-xs tracking-widest uppercase text-white/40 px-5 py-4">Total</th>
              <th className="text-left text-xs tracking-widest uppercase text-white/40 px-5 py-4">Status</th>
              <th className="px-5 py-4 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-white/2 transition-colors">
                <td className="px-5 py-4">
                  <p className="text-sm text-white font-medium">{order.customer_name}</p>
                  <p className="text-xs text-white/30 mt-0.5">{order.customer_email}</p>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="text-sm text-white/50">
                    {new Date(order.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-white">£{order.total_amount.toFixed(2)}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] px-2 py-0.5 border tracking-widest uppercase font-medium ${STATUS_COLOUR[order.status] ?? 'text-white/40 bg-white/5 border-white/10'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-xs text-white/30 hover:text-white transition-colors tracking-widest uppercase"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <p className="text-sm">No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
