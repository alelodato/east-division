import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import { ArrowRight } from 'lucide-react'

async function getFeaturedProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(4)
  return data ?? []
}

async function getLatestProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .order('created_at', { ascending: false })
    .limit(8)
  return data ?? []
}

export default async function HomePage() {
  const [featured, latest] = await Promise.all([getFeaturedProducts(), getLatestProducts()])

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen flex flex-col justify-end overflow-hidden">
        {/* Overlays */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/70 via-transparent to-brand-black/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/50 via-transparent to-transparent" />
        </div>

        <Image
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80"
          alt="East Division hero — premium sneakers"
          fill
          priority
          className="object-cover object-center"
        />

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-24">
          <p className="section-label mb-4 tracking-[0.25em] text-white/50 text-xs uppercase">
            East London — Est. 2019
          </p>
          <h1
            className="display-heading leading-[0.88] text-white mb-6"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8.5rem)' }}
          >
            <span className="block">EAST</span>
            <span className="block">DIVISION</span>
          </h1>
          <div className="w-14 h-px bg-white/30 mb-6" />
          <p className="text-base text-white/55 max-w-sm mb-10 leading-relaxed">
            Independent streetwear & sneaker store.
            <br />Curated selection. Authentic culture.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary">Shop Now</Link>
            <Link href="/about" className="btn-outline">Our Story</Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-6 z-20 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 bg-white/50" />
          <span className="text-white text-[10px] tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-2">Handpicked</p>
            <h2 className="display-heading text-5xl text-white">FEATURED</h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-xs tracking-widest uppercase text-white/50 hover:text-white transition-colors"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="bg-zinc-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label mb-4">The East Division Edit</p>
              <h2 className="display-heading text-6xl text-white leading-none mb-6">
                STREET.<br />CULTURE.<br />CRAFT.
              </h2>
              <p className="text-white/50 leading-relaxed max-w-sm mb-8">
                We source the best in contemporary footwear and streetwear — from heritage silhouettes to
                limited drops. No hype. Just quality.
              </p>
              <Link href="/shop?category=sneakers" className="btn-primary">
                Shop Sneakers
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&q=80"
                alt="Streetwear editorial"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-2">Just Landed</p>
            <h2 className="display-heading text-5xl text-white">NEW IN</h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-xs tracking-widest uppercase text-white/50 hover:text-white transition-colors"
          >
            See All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {latest.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand Story */}
      <section className="border-t border-white/5 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-label mb-6">Our Story</p>
          <h2 className="display-heading text-6xl text-white mb-8">ROOTED IN THE EAST</h2>
          <p className="text-white/50 leading-relaxed text-lg max-w-2xl mx-auto mb-10">
            Born in Shoreditch, East Division started as a passion project between sneakerheads.
            Today, we operate from our flagship store on Redchurch Street — stocking the silhouettes
            that matter, built for people who actually wear them.
          </p>
          <Link href="/about" className="btn-outline">
            Read Our Story
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-brand-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="display-heading text-4xl text-brand-black">FREE UK DELIVERY OVER £100</h3>
            <p className="text-brand-black/60 text-sm mt-1">Royal Mail Tracked. 2–3 working days.</p>
          </div>
          <Link href="/shop" className="bg-brand-black text-white px-8 py-3 text-sm tracking-widest uppercase font-semibold hover:bg-zinc-800 transition-colors whitespace-nowrap">
            Shop Now
          </Link>
        </div>
      </section>
    </>
  )
}
