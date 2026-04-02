'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from './CartProvider'
import clsx from 'clsx'

export default function ProductDetails({ product }) {
  const { addItem } = useCart()
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [added, setAdded] = useState(false)

  const images = product.images ?? []
  const variants = product.variants ?? []
  const currentImage = images[imageIndex]

  const discount = product.discount_percent ?? 0
  const originalPrice = product.price
  const discountedPrice = discount > 0
    ? (originalPrice * (1 - discount / 100))
    : null

  const cartPrice = discountedPrice ?? originalPrice

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock === 0) return
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      size: selectedVariant.size,
      price: cartPrice,
      quantity: 1,
      image: images[0]?.image_url ?? '',
      slug: product.slug,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
      {/* Images */}
      <div>
        <div className="relative aspect-square overflow-hidden bg-zinc-900 mb-3">
          {currentImage ? (
            <Image
              src={currentImage.image_url}
              alt={currentImage.alt_text ?? product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/10 text-xs tracking-widest uppercase">
              No image
            </div>
          )}

          {/* Label badge sull'immagine */}
          {product.label && (
            <div className="absolute top-3 left-3">
              {product.label === 'new' && (
                <span className="text-[10px] tracking-widest uppercase bg-white text-black px-2 py-0.5 font-semibold">
                  New
                </span>
              )}
              {product.label === 'sale' && (
                <span className="text-[10px] tracking-widest uppercase bg-red-500 text-white px-2 py-0.5 font-semibold">
                  Sale
                </span>
              )}
            </div>
          )}

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-3 right-3">
              <span className="text-[10px] tracking-widest uppercase bg-red-500 text-white px-2 py-0.5 font-semibold">
                -{discount}%
              </span>
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                onClick={() => setImageIndex(i => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setImageIndex(i => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setImageIndex(i)}
                className={clsx(
                  'relative w-16 h-16 overflow-hidden flex-shrink-0 border-2 transition-colors',
                  i === imageIndex ? 'border-white' : 'border-transparent'
                )}
              >
                <Image
                  src={img.image_url}
                  alt={img.alt_text ?? ''}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        <p className="section-label mb-3">{product.category}</p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-3 leading-tight">
          {product.name}
        </h1>

        {/* Prezzo */}
        <div className="flex items-center gap-3 mb-6">
          {discountedPrice ? (
            <>
              <span className="text-2xl text-white/30 line-through">£{originalPrice.toFixed(2)}</span>
              <span className="text-2xl text-red-400 font-medium">£{discountedPrice.toFixed(2)}</span>
              <span className="text-xs bg-red-500 text-white px-2 py-0.5 tracking-widest uppercase font-semibold">
                -{discount}%
              </span>
            </>
          ) : (
            <span className="text-2xl text-white">£{originalPrice.toFixed(2)}</span>
          )}
        </div>

        {product.description && (
          <p className="text-white/50 leading-relaxed mb-8 text-sm">{product.description}</p>
        )}

        {/* Size Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">Select Size</p>
            {selectedVariant && (
              <span className="text-xs text-white/40">
                {selectedVariant.stock > 0
                  ? selectedVariant.stock <= 3
                    ? `Only ${selectedVariant.stock} left`
                    : 'In stock'
                  : 'Out of stock'}
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {variants.map(variant => {
              const isOutOfStock = variant.stock === 0
              const isSelected = selectedVariant?.id === variant.id
              return (
                <button
                  key={variant.id}
                  onClick={() => !isOutOfStock && setSelectedVariant(variant)}
                  disabled={isOutOfStock}
                  className={clsx(
                    'border py-2 text-xs text-center transition-all',
                    isSelected
                      ? 'border-white bg-white text-brand-black font-semibold'
                      : isOutOfStock
                        ? 'border-white/5 text-white/15 cursor-not-allowed line-through'
                        : 'border-white/20 text-white/70 hover:border-white hover:text-white'
                  )}
                >
                  {variant.size}
                </button>
              )
            })}
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock === 0}
          className={clsx(
            'w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold tracking-widest uppercase transition-all',
            added ? 'bg-brand-accent text-brand-black' : 'btn-primary'
          )}
        >
          <ShoppingBag size={16} />
          {added ? 'Added to Bag' : !selectedVariant ? 'Select a Size' : 'Add to Bag'}
        </button>

        {/* Delivery Info */}
        <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
          <div className="flex gap-3 text-sm">
            <span className="text-white/30">🚚</span>
            <div>
              <p className="text-white/70">Free UK delivery on orders over £100</p>
              <p className="text-white/30 text-xs">Royal Mail Tracked · 2–3 working days</p>
            </div>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="text-white/30">↩</span>
            <div>
              <p className="text-white/70">Free returns within 30 days</p>
              <p className="text-white/30 text-xs">Unworn, original packaging required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}