import Link from 'next/link'
import Image from 'next/image'

export default function ProductCard({ product }) {
  const primaryImage = product.images?.[0]
  const hoverImage = product.images?.[1]
  const lowestStock = product.variants
    ? Math.max(...product.variants.map(v => v.stock))
    : 0
  const isSoldOut = lowestStock === 0

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-zinc-900">
        {primaryImage ? (
          <>
            <Image
              src={primaryImage.image_url}
              alt={primaryImage.alt_text ?? product.name}
              fill
              className="object-cover transition-opacity duration-500 group-hover:opacity-0"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {hoverImage && (
              <Image
                src={hoverImage.image_url}
                alt={hoverImage.alt_text ?? product.name}
                fill
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/10 text-xs tracking-widest uppercase">
            No image
          </div>
        )}

        {isSoldOut && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-xs tracking-widest uppercase text-white/70 border border-white/20 px-3 py-1">
              Sold Out
            </span>
          </div>
        )}

        {product.featured && !isSoldOut && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] tracking-widest uppercase bg-brand-accent text-brand-black px-2 py-0.5 font-semibold">
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-xs text-white/40 tracking-widest uppercase">{product.category}</p>
        <p className="text-sm font-medium text-white leading-tight">{product.name}</p>
        <p className="text-sm text-white/70">£{product.price.toFixed(2)}</p>
      </div>
    </Link>
  )
}
