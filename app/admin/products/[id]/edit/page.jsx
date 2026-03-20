import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'

export default async function EditProductPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .eq('id', id)
    .single()

  if (!data) notFound()

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Products</p>
        <h1 className="display-heading text-4xl text-white">EDIT PRODUCT</h1>
        <p className="text-white/30 text-sm mt-1">{data.name}</p>
      </div>
      <ProductForm product={data} />
    </div>
  )
}
