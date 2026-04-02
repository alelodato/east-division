import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductDetails from '@/components/store/ProductDetails'
import ProductCard from '@/components/store/ProductCard'

async function getProduct(slug) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, images:product_images(* , sort_order), variants:product_variants(*)')
    .eq('slug', slug)
    .single()
  return data
}

async function getRelated(category, currentId) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .eq('category', category)
    .neq('id', currentId)
    .limit(4)
  return data ?? []
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: product.images?.[0]?.image_url ? [{ url: product.images[0].image_url }] : [],
    },
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const related = await getRelated(product.category, product.id)

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <ProductDetails product={product} />

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24 pt-12 border-t border-white/5">
            <div className="mb-10">
              <p className="section-label mb-2">You Might Like</p>
              <h2 className="display-heading text-4xl text-white">RELATED</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
