'use client'

import { useRouter, usePathname } from 'next/navigation'
import clsx from 'clsx'

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'sneakers', label: 'Sneakers' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
]

const SIZES_SNEAKERS = ['EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45']
const SIZES_APPAREL = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const SORT_OPTIONS = [
  { value: '', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export default function ShopFilters({ currentParams }) {
  const router = useRouter()
  const pathname = usePathname()

  const updateParam = (key, value) => {
    const params = new URLSearchParams()
    if (currentParams.category) params.set('category', currentParams.category)
    if (currentParams.size) params.set('size', currentParams.size)
    if (currentParams.sort) params.set('sort', currentParams.sort)

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const sizes = currentParams.category === 'apparel' ? SIZES_APPAREL : SIZES_SNEAKERS

  return (
    <div className="space-y-8">
      {/* Category */}
      <div>
        <p className="section-label mb-3">Category</p>
        <div className="space-y-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => updateParam('category', cat.value)}
              className={clsx(
                'block w-full text-left text-sm px-0 py-1 transition-colors',
                currentParams.category === cat.value || (!currentParams.category && !cat.value)
                  ? 'text-white font-medium'
                  : 'text-white/40 hover:text-white'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <p className="section-label mb-3">Size</p>
        <div className="grid grid-cols-2 gap-1.5">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() =>
                updateParam('size', currentParams.size === size ? '' : size)
              }
              className={clsx(
                'border text-xs py-1.5 px-2 text-center transition-colors',
                currentParams.size === size
                  ? 'border-white bg-white text-brand-black font-medium'
                  : 'border-white/10 text-white/50 hover:border-white/40 hover:text-white'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="section-label mb-3">Sort</p>
        <div className="space-y-1">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateParam('sort', opt.value)}
              className={clsx(
                'block w-full text-left text-sm py-1 transition-colors',
                currentParams.sort === opt.value || (!currentParams.sort && !opt.value)
                  ? 'text-white font-medium'
                  : 'text-white/40 hover:text-white'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
