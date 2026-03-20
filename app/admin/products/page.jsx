import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Package } from 'lucide-react'
import DeleteProductButton from '@/components/admin/DeleteProductButton'

async function getProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Inventory</p>
          <h1 className="display-heading text-4xl text-white">PRODUCTS</h1>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 btn-primary text-sm">
          <Plus size={16} />
          New Product
        </Link>
      </div>

      <div className="bg-zinc-900 border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/5">
            <tr>
              <th className="text-left text-xs tracking-widest uppercase text-white/40 px-5 py-4">Product</th>
              <th className="text-left text-xs tracking-widest uppercase text-white/40 px-5 py-4 hidden md:table-cell">Category</th>
              <th className="text-left text-xs tracking-widest uppercase text-white/40 px-5 py-4">Price</th>
              <th className="text-left text-xs tracking-widest uppercase text-white/40 px-5 py-4 hidden lg:table-cell">Stock</th>
              <th className="text-left text-xs tracking-widest uppercase text-white/40 px-5 py-4 hidden md:table-cell">Featured</th>
              <th className="px-5 py-4 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map(product => {
              const image = product.images?.[0]
              const totalStock = product.variants?.reduce((s, v) => s + v.stock, 0) ?? 0
              const isLowStock = totalStock > 0 && totalStock <= 5

              return (
                <tr key={product.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative flex-shrink-0 bg-zinc-800 overflow-hidden">
                        {image && (
                          <Image
                            src={image.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{product.name}</p>
                        <p className="text-xs text-white/30">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs tracking-widest uppercase text-white/50">{product.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-white">£{product.price.toFixed(2)}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className={`text-xs font-medium ${isLowStock ? 'text-yellow-400' : totalStock === 0 ? 'text-red-400' : 'text-white/50'}`}>
                      {totalStock === 0 ? 'Sold Out' : isLowStock ? `Low (${totalStock})` : totalStock}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className={`text-xs ${product.featured ? 'text-brand-accent' : 'text-white/20'}`}>
                      {product.featured ? '✓' : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-1.5 text-white/30 hover:text-white transition-colors"
                        title="Edit product"
                      >
                        <Pencil size={14} />
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <Package size={32} className="mx-auto mb-4 opacity-30" strokeWidth={1} />
            <p className="text-sm">No products yet.</p>
            <Link href="/admin/products/new" className="text-xs text-white/40 hover:text-white transition-colors mt-2 block">
              Add your first product →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
