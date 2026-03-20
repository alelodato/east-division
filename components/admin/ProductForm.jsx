'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, Trash2, Upload, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import clsx from 'clsx'

export default function ProductForm({ product }) {
  const router = useRouter()
  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Form state
  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product?.price?.toString() ?? '')
  const [category, setCategory] = useState(product?.category ?? 'sneakers')
  const [featured, setFeatured] = useState(product?.featured ?? false)

  const [variants, setVariants] = useState(
    product?.variants?.map(v => ({ id: v.id, size: v.size, stock: v.stock, sku: v.sku })) ?? [
      { size: '', stock: 0, sku: '' },
    ]
  )

  const [images, setImages] = useState(product?.images ?? [])

  // Auto-generate slug from name
  const handleNameChange = (val) => {
    setName(val)
    if (!product) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }

  const addVariant = () =>
    setVariants(prev => [...prev, { size: '', stock: 0, sku: '' }])

  const removeVariant = (index) =>
    setVariants(prev => prev.filter((_, i) => i !== index))

  const updateVariant = (index, field, value) =>
    setVariants(prev => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)))

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !product?.id) return

    setUploadingImage(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${product.id}/${Date.now()}.${ext}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file)

    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`)
      setUploadingImage(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(uploadData.path)

    const { data: imgData } = await supabase
      .from('product_images')
      .insert({
        product_id: product.id,
        image_url: publicUrl,
        alt_text: name,
        sort_order: images.length,
      })
      .select()
      .single()

    if (imgData) setImages(prev => [...prev, imgData])
    setUploadingImage(false)
  }

  const handleRemoveImage = async (imgId) => {
    const supabase = createClient()
    await supabase.from('product_images').delete().eq('id', imgId)
    setImages(prev => prev.filter(i => i.id !== imgId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const productData = {
      name,
      slug,
      description,
      price: parseFloat(price),
      category,
      featured,
    }

    try {
      let productId = product?.id

      if (product) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single()
        if (error) throw error
        productId = data.id
      }

      // Upsert variants
      for (const v of variants) {
        if (!v.size) continue
        if (v.id) {
          await supabase
            .from('product_variants')
            .update({ size: v.size, stock: v.stock, sku: v.sku })
            .eq('id', v.id)
        } else {
          await supabase.from('product_variants').insert({
            product_id: productId,
            size: v.size,
            stock: v.stock,
            sku: v.sku,
          })
        }
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err?.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-zinc-800 border border-white/10 text-white text-sm px-4 py-2.5 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/20'
  const labelClass = 'block text-xs tracking-widest uppercase text-white/40 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-900/20 border border-red-500/20 text-red-400 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-zinc-900 border border-white/5 p-6 space-y-4">
        <h2 className="text-sm font-semibold tracking-widest uppercase mb-4">Product Info</h2>

        <div>
          <label className={labelClass}>Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => handleNameChange(e.target.value)}
            className={inputClass}
            placeholder="e.g. Air Force One Low White"
          />
        </div>

        <div>
          <label className={labelClass}>Slug *</label>
          <input
            type="text"
            required
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className={inputClass}
            placeholder="air-force-one-low-white"
          />
          <p className="text-xs text-white/20 mt-1">URL: /product/{slug || '...'}</p>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Product description..."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Price (£) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={price}
              onChange={e => setPrice(e.target.value)}
              className={inputClass}
              placeholder="99.95"
            />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={inputClass}
            >
              <option value="sneakers">Sneakers</option>
              <option value="apparel">Apparel</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={e => setFeatured(e.target.checked)}
            className="w-4 h-4 accent-brand-accent"
          />
          <span className="text-sm text-white/70">Featured product (shown on homepage)</span>
        </label>
      </div>

      {/* Variants */}
      <div className="bg-zinc-900 border border-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold tracking-widest uppercase">Sizes & Stock</h2>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
          >
            <Plus size={13} /> Add Size
          </button>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-2 text-xs tracking-widest uppercase text-white/30 px-1">
            <div className="col-span-4">Size</div>
            <div className="col-span-3">Stock</div>
            <div className="col-span-4">SKU</div>
            <div className="col-span-1"></div>
          </div>

          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input
                type="text"
                value={v.size}
                onChange={e => updateVariant(i, 'size', e.target.value)}
                placeholder="EU 41"
                className={`${inputClass} col-span-4 py-2`}
              />
              <input
                type="number"
                min="0"
                value={v.stock}
                onChange={e => updateVariant(i, 'stock', parseInt(e.target.value) || 0)}
                className={`${inputClass} col-span-3 py-2`}
              />
              <input
                type="text"
                value={v.sku}
                onChange={e => updateVariant(i, 'sku', e.target.value)}
                placeholder="SKU-001"
                className={`${inputClass} col-span-4 py-2`}
              />
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="col-span-1 text-white/20 hover:text-red-400 transition-colors flex justify-center"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      {product && (
        <div className="bg-zinc-900 border border-white/5 p-6">
          <h2 className="text-sm font-semibold tracking-widest uppercase mb-4">Images</h2>

          <div className="flex flex-wrap gap-3 mb-4">
            {images.map(img => (
              <div key={img.id} className="relative w-20 h-20 group">
                <Image
                  src={img.image_url}
                  alt={img.alt_text ?? ''}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img.id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className={clsx(
                'w-20 h-20 border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-1 hover:border-white/40 transition-colors',
                uploadingImage && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Upload size={14} className="text-white/40" />
              <span className="text-[10px] text-white/30">{uploadingImage ? 'Uploading' : 'Upload'}</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <p className="text-xs text-white/20">First image is used as the product thumbnail. Save the product first before uploading images.</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : product ? 'Save Changes' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="btn-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
