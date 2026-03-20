import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import ShopFilters from '@/components/store/ShopFilters'

export const metadata = {
  title: 'Shop',
  description: 'Browse the full East Division collection — sneakers, apparel and accessories.',
}

async function getProducts(params) {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')

  if (params.category) {
    query = query.eq('category', params.category)
  }

  if (params.sort === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (params.sort === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data } = await query
  let products = data ?? []

  if (params.size) {
    products = products.filter(p =>
      p.variants?.some(v => v.size === params.size && v.stock > 0)
    )
  }

  return products
}

export default async function ShopPage({ searchParams }) {
  const params = await searchParams
  const products = await getProducts(params)

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="section-label mb-2">East Division</p>
          <h1 className="display-heading text-6xl text-white">
            {params.category
              ? params.category.charAt(0).toUpperCase() + params.category.slice(1)
              : 'All Products'}
          </h1>
          <p className="text-white/40 text-sm mt-2">{products.length} products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters */}
          <aside className="lg:w-56 flex-shrink-0">
            <ShopFilters currentParams={params} />
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-24 text-white/30">
                <p className="display-heading text-4xl mb-3">NO PRODUCTS</p>
                <p className="text-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
