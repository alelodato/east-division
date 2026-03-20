import { createClient } from '@/lib/supabase/server'
import { Package, ShoppingCart, PoundSterling, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

async function getDashboardData() {
  const supabase = await createClient()

  const [
    { count: productCount },
    { count: orderCount },
    { data: ordersRaw },
    { data: lowStockVariants },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total_amount').eq('status', 'paid'),
    supabase
      .from('product_variants')
      .select('*, product:products(name)')
      .gt('stock', 0)
      .lte('stock', 3),
    supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const revenue = ordersRaw?.reduce((sum, o) => sum + (o.total_amount ?? 0), 0) ?? 0

  return {
    productCount: productCount ?? 0,
    orderCount: orderCount ?? 0,
    revenue,
    lowStockVariants: lowStockVariants ?? [],
    recentOrders: recentOrders ?? [],
  }
}

const STATUS_COLOUR = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  paid: 'text-brand-accent bg-brand-accent/10',
  shipped: 'text-blue-400 bg-blue-400/10',
  delivered: 'text-green-400 bg-green-400/10',
}

export default async function AdminDashboard() {
  const { productCount, orderCount, revenue, lowStockVariants, recentOrders } =
    await getDashboardData()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Welcome back</p>
        <h1 className="display-heading text-4xl text-white">DASHBOARD</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Products', value: productCount, icon: Package, href: '/admin/products' },
          { label: 'Orders', value: orderCount, icon: ShoppingCart, href: '/admin/orders' },
          { label: 'Revenue (Paid)', value: `£${revenue.toFixed(2)}`, icon: PoundSterling, href: '/admin/orders' },
          { label: 'Low Stock', value: lowStockVariants.length, icon: AlertTriangle, href: '/admin/products', warn: lowStockVariants.length > 0 },
        ].map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-zinc-900 border border-white/5 p-5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <stat.icon
                size={18}
                className={stat.warn ? 'text-yellow-400' : 'text-white/30'}
              />
            </div>
            <p className={`text-2xl font-semibold mb-1 ${stat.warn ? 'text-yellow-400' : 'text-white'}`}>
              {stat.value}
            </p>
            <p className="text-xs text-white/40 tracking-widest uppercase">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-zinc-900 border border-white/5 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold tracking-widest uppercase">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-white/30 hover:text-white transition-colors tracking-widest uppercase">
              View All →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-white/30 text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 hover:bg-white/5 -mx-2 px-2 transition-colors"
                >
                  <div>
                    <p className="text-sm text-white font-medium">{order.customer_name}</p>
                    <p className="text-xs text-white/30 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2 py-0.5 tracking-widest uppercase font-medium ${STATUS_COLOUR[order.status] ?? 'text-white/40 bg-white/5'}`}>
                      {order.status}
                    </span>
                    <span className="text-sm text-white">£{order.total_amount.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-zinc-900 border border-white/5 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold tracking-widest uppercase flex items-center gap-2">
              <AlertTriangle size={14} className="text-yellow-400" />
              Low Stock Alerts
            </h2>
            <Link href="/admin/products" className="text-xs text-white/30 hover:text-white transition-colors tracking-widest uppercase">
              Manage →
            </Link>
          </div>
          {lowStockVariants.length === 0 ? (
            <p className="text-white/30 text-sm">All stock levels are healthy.</p>
          ) : (
            <div className="space-y-2">
              {lowStockVariants.slice(0, 8).map((v) => (
                <div key={v.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm text-white">{v.product?.name}</p>
                    <p className="text-xs text-white/30">Size {v.size}</p>
                  </div>
                  <span className="text-xs font-semibold text-yellow-400">
                    {v.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
