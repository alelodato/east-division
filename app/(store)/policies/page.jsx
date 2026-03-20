import Link from 'next/link'

export const metadata = {
  title: 'Policies',
  description: 'East Division shipping, returns, and terms policies.',
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="display-heading text-4xl text-white mb-6">{title}</h2>
      <div className="text-white/50 text-sm leading-relaxed space-y-4">{children}</div>
    </section>
  )
}

export default function PoliciesPage() {
  return (
    <div className="pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <p className="section-label mb-2">Legal & Info</p>
          <h1 className="display-heading text-6xl text-white">POLICIES</h1>
        </div>

        {/* Nav */}
        <nav className="flex gap-6 mb-16 pb-6 border-b border-white/5">
          {[
            { href: '#shipping', label: 'Shipping' },
            { href: '#returns', label: 'Returns' },
            { href: '#terms', label: 'Terms' },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs tracking-widest uppercase text-white/40 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="space-y-16 divide-y divide-white/5">
          <Section id="shipping" title="SHIPPING POLICY">
            <p>
              East Division ships all UK orders via Royal Mail Tracked 48 or DPD, depending on order
              value and availability. We aim to dispatch all orders placed before 2pm Monday–Friday on
              the same working day.
            </p>
            <div className="bg-zinc-900 p-5 space-y-3">
              <div className="flex justify-between font-medium text-white">
                <span>UK Standard (2–3 working days)</span>
                <span>£4.99</span>
              </div>
              <div className="flex justify-between font-medium text-white">
                <span>UK Express (1 working day)</span>
                <span>£9.99</span>
              </div>
              <div className="flex justify-between font-medium text-brand-accent">
                <span>Free UK Standard (orders over £100)</span>
                <span>£0.00</span>
              </div>
            </div>
            <p>
              Orders are shipped from our warehouse in East London. You will receive a tracking
              confirmation email as soon as your order has been dispatched. All orders are fully
              insured during transit.
            </p>
            <p>
              We currently ship to mainland UK only. Northern Ireland, Scottish Highlands, and
              Channel Islands may require additional delivery time. International shipping coming soon.
            </p>
          </Section>

          <Section id="returns" title="RETURNS POLICY">
            <p className="pt-16">
              We accept returns within <strong className="text-white">30 days</strong> of delivery.
              Items must be returned in their original, unworn condition with all tags attached and in
              original packaging.
            </p>
            <p>
              To initiate a return, please email us at{' '}
              <a href="mailto:returns@eastdivision.co.uk" className="text-white hover:text-brand-accent transition-colors">
                returns@eastdivision.co.uk
              </a>{' '}
              with your order number and reason for return.
            </p>
            <p>
              <strong className="text-white">Condition requirements:</strong> Shoes must be tried on
              indoors only. Soles must show no signs of wear. All original packaging must be intact.
              Returns that do not meet these conditions will be refused and returned to the customer.
            </p>
            <p>
              <strong className="text-white">Refunds:</strong> Once we receive and inspect your return,
              we will process a refund to your original payment method within 5–10 working days.
              Stripe payments are typically refunded within 5–7 business days.
            </p>
            <p>
              Return shipping costs are the responsibility of the customer unless the item is faulty
              or incorrectly sent.
            </p>
          </Section>

          <Section id="terms" title="TERMS & CONDITIONS">
            <p className="pt-16">
              These terms and conditions apply to all purchases made through the East Division website
              (eastdivision.co.uk). By placing an order, you agree to these terms.
            </p>
            <p>
              <strong className="text-white">Company:</strong> East Division Ltd is registered in
              England and Wales. Our registered address is 14 Redchurch Street, Shoreditch,
              London E2 7DP.
            </p>
            <p>
              <strong className="text-white">Pricing:</strong> All prices are displayed in British
              Pounds Sterling (GBP) and include VAT at the current UK rate where applicable. We
              reserve the right to change prices without notice.
            </p>
            <p>
              <strong className="text-white">Payment:</strong> We accept all major credit and debit
              cards via Stripe. Payment is processed at the time of order. We do not store card
              details.
            </p>
            <p>
              <strong className="text-white">Product availability:</strong> We make every effort to
              ensure products listed are in stock. In the rare event that an item becomes unavailable
              after your order, we will contact you immediately to offer an alternative or full refund.
            </p>
            <p>
              <strong className="text-white">Intellectual property:</strong> All content on this site
              including images, text, and branding is the property of East Division Ltd. Unauthorised
              use is prohibited.
            </p>
            <p>
              <strong className="text-white">Governing law:</strong> These terms are governed by the
              laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction
              of the courts of England and Wales.
            </p>
          </Section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-xs text-white/25">
            Last updated: {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}.
            Questions? <Link href="/contact" className="text-white/40 hover:text-white transition-colors">Contact us</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
