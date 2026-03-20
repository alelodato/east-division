import ProductForm from '@/components/admin/ProductForm'

export const metadata = { title: 'New Product — Admin' }

export default function NewProductPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Products</p>
        <h1 className="display-heading text-4xl text-white">NEW PRODUCT</h1>
      </div>
      <ProductForm />
    </div>
  )
}
