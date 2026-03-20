import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'About Us',
  description: 'The story behind East Division — independent streetwear & sneaker store from Shoreditch, East London.',
}

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="relative h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent z-10" />
        <Image
          src="https://images.unsplash.com/photo-1556906781-9a412961a28c?w=1400&q=80"
          alt="East Division store"
          fill
          className="object-cover"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pb-12 w-full">
          <p className="section-label mb-2">Shoreditch, East London</p>
          <h1 className="display-heading text-6xl text-white">OUR STORY</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-20">
        {/* Intro */}
        <div>
          <p className="text-2xl text-white leading-relaxed font-light">
            East Division started as two people with a shared obsession — great shoes and genuine culture.
            What began as a market stall on Brick Lane is now one of East London&apos;s most respected
            independent streetwear destinations.
          </p>
        </div>

        {/* Story blocks */}
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="display-heading text-3xl text-white mb-4">WHY WE EXIST</h2>
            <p className="text-white/50 leading-relaxed text-sm">
              We got tired of the same generic high-street stores selling the same rotations to the same
              crowds. East Division was built to offer something different: a curated edit of the shoes
              and pieces that actually matter to us — not whatever the algorithm says is trending.
            </p>
          </div>
          <div>
            <h2 className="display-heading text-3xl text-white mb-4">HOW WE WORK</h2>
            <p className="text-white/50 leading-relaxed text-sm">
              We work directly with brands and trusted distributors to bring you authentic product.
              No fakes. No grey market. Every pair we sell has been through our quality check. If it
              doesn&apos;t meet our standard, it doesn&apos;t hit the shelves.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 py-12 border-y border-white/5">
          {[
            { stat: '2019', label: 'Founded' },
            { stat: '500+', label: 'Styles Stocked' },
            { stat: '10k+', label: 'Happy Customers' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className="display-heading text-4xl sm:text-5xl text-white mb-1">{item.stat}</p>
              <p className="section-label">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Location */}
        <div className="bg-zinc-900 p-8">
          <h2 className="display-heading text-3xl text-white mb-6">FIND US</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="text-sm text-white/50 space-y-2">
              <p className="text-white font-medium">East Division</p>
              <p>14 Redchurch Street</p>
              <p>Shoreditch</p>
              <p>London E2 7DP</p>
              <p className="pt-2">Mon–Sat: 10am – 7pm</p>
              <p>Sunday: 11am – 5pm</p>
            </div>
            <div className="text-sm text-white/50 space-y-2">
              <p className="text-white font-medium">Get in Touch</p>
              <p>hello@eastdivision.co.uk</p>
              <p>+44 20 7946 0123</p>
              <div className="pt-4 flex gap-4">
                <a href="#" className="text-xs tracking-widest uppercase text-white/30 hover:text-white transition-colors">Instagram</a>
                <a href="#" className="text-xs tracking-widest uppercase text-white/30 hover:text-white transition-colors">Twitter</a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="display-heading text-5xl text-white mb-6">READY TO SHOP?</h2>
          <Link href="/shop" className="btn-primary">
            Browse the Collection
          </Link>
        </div>
      </div>
    </div>
  )
}
