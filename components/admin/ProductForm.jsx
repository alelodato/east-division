'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, Upload, X, ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import clsx from 'clsx'

const COLOR_OPTIONS = [
  'Black', 'White', 'Grey', 'Navy', 'Brown', 'Tan',
  'Olive', 'Red', 'Blue', 'Green', 'Orange', 'Pink',
  'Purple', 'Cream', 'Beige', 'Yellow', 'Burgundy', 'Khaki'
]

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function ProductForm({ product }) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product?.price?.toString() ?? '')
  const [category, setCategory] = useState(product?.category ?? 'sneakers')
  const [featured, setFeatured] = useState(product?.featured ?? false)
  const [discountPercent, setDiscountPercent] = useState(product?.discount_percent ?? 0)
  const [label, setLabel] = useState(product?.label ?? '')

  const [colors, setColors] = useState(
    product?.colors?.map(c => ({
      id: c.id,
      name: c.name,
      variants: c.variants ?? [{ size: '', stock: 0, sku: '' }],
      images: c.images?.map(img => ({ ...img, type: 'saved' })) ?? [],
    })) ?? [{ name: 'Black', variants: [{ size: '', stock: 0, sku: '' }], images: [] }]
  )

  const [expandedColor, setExpandedColor] = useState(0)
  const fileInputRefs = useRef([])

  const addColor = () => {
    setColors(prev => [...prev, { name: 'Black', variants: [{ size: '', stock: 0, sku: '' }], images: [] }])
    setExpandedColor(colors.length)
  }

  const removeColor = (ci) =>
    setColors(prev => prev.filter((_, i) => i !== ci))

  const updateColor = (ci, field, value) =>
    setColors(prev => prev.map((c, i) => i === ci ? { ...c, [field]: value } : c))

  const addVariant = (ci) =>
    setColors(prev => prev.map((c, i) => i === ci
      ? { ...c, variants: [...c.variants, { size: '', stock: 0, sku: '' }] }
      : c))

  const removeVariant = (ci, vi) =>
    setColors(prev => prev.map((c, i) => i === ci
      ? { ...c, variants: c.variants.filter((_, j) => j !== vi) }
      : c))

  const updateVariant = (ci, vi, field, value) =>
    setColors(prev => prev.map((c, i) => i === ci ? {
      ...c,
      variants: c.variants.map((v, j) => j === vi ? { ...v, [field]: value } : v)
    } : c))

  const handleImageSelect = (ci, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setColors(prev => prev.map((c, i) => i === ci ? {
      ...c,
      images: [...c.images, { file, previewUrl, type: 'pending' }]
    } : c))
    e.target.value = ''
  }

  const handleRemoveImage = async (ci, imgIndex) => {
    const img = colors[ci].images[imgIndex]
    if (img.id) {
      const supabase = createClient()
      await supabase.from('product_images').delete().eq('id', img.id)
    } else if (img.previewUrl) {
      URL.revokeObjectURL(img.previewUrl)
    }
    setColors(prev => prev.map((c, i) => i === ci ? {
      ...c,
      images: c.images.filter((_, j) => j !== imgIndex)
    } : c))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const slug = generateSlug(name)
    const productData = {
      name, slug, description,
      price: parseFloat(price),
      category, featured,
      discount_percent: discountPercent,
      label: label || null,
    }

    try {
      let productId = product?.id

      if (product) {
        const { error } = await supabase.from('products').update(productData).eq('id', product.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('products').insert(productData).select().single()
        if (error) throw error
        productId = data.id
      }

      for (let ci = 0; ci < colors.length; ci++) {
        const color = colors[ci]
        if (!color.name) continue

        let colorId = color.id

        if (colorId) {
          await supabase.from('product_colors').update({ name: color.name, sort_order: ci }).eq('id', colorId)
        } else {
          const { data: colorData, error: colorError } = await supabase
            .from('product_colors')
            .insert({ product_id: productId, name: color.name, sort_order: ci })
            .select().single()
          if (colorError) throw colorError
          colorId = colorData.id
        }

        // Upsert variants
        for (const v of color.variants) {
          if (!v.size) continue
          if (v.id) {
            await supabase.from('product_variants')
              .update({ size: v.size, stock: v.stock, sku: v.sku })
              .eq('id', v.id)
          } else {
            await supabase.from('product_variants').insert({
              product_id: productId,
              color_id: colorId,
              size: v.size,
              stock: v.stock,
              sku: v.sku,
            })
          }
        }

        // Upload immagini pending
        for (let i = 0; i < color.images.length; i++) {
          const img = color.images[i]
          if (!img.file) continue
          const ext = img.file.name.split('.').pop()
          const path = `${productId}/${colorId}/${Date.now()}-${i}.${ext}`

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(path, img.file)

          if (uploadError) continue

          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(uploadData.path)

          await supabase.from('product_images').insert({
            product_id: productId,
            color_id: colorId,
            image_url: publicUrl,
            alt_text: `${name} - ${color.name}`,
            sort_order: i,
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

  const inputClass = 'w-full bg-zinc-800 border border-white/10 text-white text-sm px-4 py-2.5 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/20'
  const labelClass = 'block text-xs tracking-widest uppercase text-white/40 mb-1.5'

  const discountedPrice = discountPercent > 0 && price
    ? (parseFloat(price) * (1 - discountPercent / 100)).toFixed(2)
    : null

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
          <input type="text" required value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="e.g. Air Force One Low" />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className={`${inputClass} resize-none`} placeholder="Product description..." />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Price (£) *</label>
            <input type="number" step="0.01" min="0" required value={price} onChange={e => setPrice(e.target.value)} className={inputClass} placeholder="99.95" />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
              <option value="sneakers">Sneakers</option>
              <option value="apparel">Apparel</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 accent-brand-accent" />
          <span className="text-sm text-white/70">Featured product (shown on homepage)</span>
        </label>
      </div>

      {/* Pricing & Label */}
      <div className="bg-zinc-900 border border-white/5 p-6 space-y-4">
        <h2 className="text-sm font-semibold tracking-widest uppercase mb-4">Pricing & Label</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Discount (%)</label>
            <input type="number" min="0" max="90" value={discountPercent} onChange={e => setDiscountPercent(parseInt(e.target.value) || 0)} className={inputClass} placeholder="0" />
            {discountedPrice && (
              <p className="text-xs mt-1.5 text-white/40">
                <span className="line-through text-white/20">£{parseFloat(price).toFixed(2)}</span>
                {' '}→ <span className="text-green-400">£{discountedPrice}</span> (-{discountPercent}%)
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>Label</label>
            <select value={label} onChange={e => setLabel(e.target.value)} className={inputClass}>
              <option value="">No label</option>
              <option value="new">New</option>
              <option value="sale">Sale</option>
            </select>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-zinc-900 border border-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold tracking-widest uppercase">Colors</h2>
          <button type="button" onClick={addColor} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
            <Plus size={13} /> Add Color
          </button>
        </div>

        <div className="space-y-3">
          {colors.map((color, ci) => (
            <div key={ci} className="border border-white/10">
              {/* Color header */}
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedColor(expandedColor === ci ? -1 : ci)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: getColorHex(color.name) }} />
                  <span className="text-sm text-white">{color.name || 'New Color'}</span>
                  <span className="text-xs text-white/30">{color.variants.length} sizes · {color.images.length} images</span>
                </div>
                <div className="flex items-center gap-2">
                  {colors.length > 1 && (
                    <button type="button" onClick={e => { e.stopPropagation(); removeColor(ci) }} className="text-white/20 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                  {expandedColor === ci ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
                </div>
              </div>

              {/* Color content */}
              {expandedColor === ci && (
                <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
                  {/* Color select */}
                  <div>
                    <label className={labelClass}>Color</label>
                    <select value={color.name} onChange={e => updateColor(ci, 'name', e.target.value)} className={inputClass}>
                      {COLOR_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Variants */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={labelClass}>Sizes & Stock</label>
                      <button type="button" onClick={() => addVariant(ci)} className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
                        <Plus size={12} /> Add Size
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-2 text-xs tracking-widest uppercase text-white/30 px-1">
                        <div className="col-span-4">Size</div>
                        <div className="col-span-3">Stock</div>
                        <div className="col-span-4">SKU</div>
                        <div className="col-span-1"></div>
                      </div>
                      {color.variants.map((v, vi) => (
                        <div key={vi} className="grid grid-cols-12 gap-2 items-center">
                          <input type="text" value={v.size} onChange={e => updateVariant(ci, vi, 'size', e.target.value)} placeholder="EU 41" className={`${inputClass} col-span-4 py-2`} />
                          <input type="number" min="0" value={v.stock} onChange={e => updateVariant(ci, vi, 'stock', parseInt(e.target.value) || 0)} className={`${inputClass} col-span-3 py-2`} />
                          <input type="text" value={v.sku} onChange={e => updateVariant(ci, vi, 'sku', e.target.value)} placeholder="SKU-001" className={`${inputClass} col-span-4 py-2`} />
                          <button type="button" onClick={() => removeVariant(ci, vi)} className="col-span-1 text-white/20 hover:text-red-400 transition-colors flex justify-center">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Images */}
                  <div>
                    <label className={labelClass}>Images</label>
                    <div className="flex flex-wrap gap-3">
                      {color.images.map((img, imgIndex) => (
                        <div key={imgIndex} className="relative w-20 h-20 group">
                          <Image
                            src={img.previewUrl ?? img.image_url}
                            alt={img.alt_text ?? color.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                          {img.type === 'pending' && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <span className="text-[9px] text-white/60 tracking-wider">PENDING</span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(ci, imgIndex)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[ci]?.click()}
                        className="w-20 h-20 border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-1 hover:border-white/40 transition-colors"
                      >
                        <Upload size={14} className="text-white/40" />
                        <span className="text-[10px] text-white/30">Upload</span>
                      </button>
                      <input
                        ref={el => fileInputRefs.current[ci] = el}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleImageSelect(ci, e)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : product ? 'Save Changes' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.push('/admin/products')} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  )
}

// Helper per mostrare un colore approssimativo nel swatch
function getColorHex(name) {
  const map = {
    Black: '#111', White: '#fff', Grey: '#888', Navy: '#1a2744',
    Brown: '#7c4a2d', Tan: '#c4a882', Olive: '#6b7c3a', Red: '#cc2222',
    Blue: '#2255cc', Green: '#2a7a3b', Orange: '#e06820', Pink: '#e87ab0',
    Purple: '#7744cc', Cream: '#f5f0e0', Beige: '#d4c9a8', Yellow: '#e8c830',
    Burgundy: '#6e1a2a', Khaki: '#b5a882',
  }
  return map[name] ?? '#888'
}