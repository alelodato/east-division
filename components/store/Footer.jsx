import Link from 'next/link'

const LINKS = {
  Shop: [
    { href: '/shop?category=sneakers', label: 'Sneakers' },
    { href: '/shop?category=apparel', label: 'Apparel' },
    { href: '/shop?category=accessories', label: 'Accessories' },
  ],
  Info: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/policies', label: 'Policies' },
  ],
  Legal: [
    { href: '/policies#shipping', label: 'Shipping' },
    { href: '/policies#returns', label: 'Returns' },
    { href: '/policies#terms', label: 'Terms & Conditions' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-brand-black mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="display-heading text-2xl tracking-wider text-white mb-3">EAST DIVISION</p>
            <p className="text-sm text-white/40 leading-relaxed">
              Independent streetwear &<br />sneaker store.<br />Shoreditch, East London.
            </p>
            <address className="not-italic mt-5 text-xs text-white/30 leading-loose">
              14 Redchurch Street<br />
              London E2 7DP<br />
              United Kingdom
            </address>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="section-label mb-5">{section}</p>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} East Division Ltd. Registered in England & Wales.
          </p>
          <p className="text-xs text-white/25">
            Prices in GBP (£). VAT included where applicable.
          </p>
        </div>
      </div>
    </footer>
  )
}
