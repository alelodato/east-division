import ContactForm from '@/components/store/ContactForm'

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with East Division — we\'re based in Shoreditch, East London.',
}

export default function ContactPage() {
  return (
    <div className="pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <p className="section-label mb-2">Get In Touch</p>
          <h1 className="display-heading text-6xl text-white">CONTACT</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              Have a question about an order, a product, or just want to say hello?
              Fill out the form below and we&apos;ll get back to you within 24 hours.
            </p>
            <ContactForm />
          </div>

          {/* Info */}
          <div className="space-y-10">
            <div>
              <h2 className="display-heading text-2xl text-white mb-4">STORE</h2>
              <address className="not-italic text-sm text-white/50 space-y-1 leading-loose">
                <p>14 Redchurch Street</p>
                <p>Shoreditch, London E2 7DP</p>
                <p>United Kingdom</p>
              </address>
            </div>

            <div>
              <h2 className="display-heading text-2xl text-white mb-4">HOURS</h2>
              <div className="text-sm text-white/50 space-y-1">
                <div className="flex justify-between gap-8">
                  <span>Monday – Saturday</span>
                  <span>10:00 – 19:00</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span>Sunday</span>
                  <span>11:00 – 17:00</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="display-heading text-2xl text-white mb-4">CONTACT</h2>
              <div className="text-sm text-white/50 space-y-2">
                <p>
                  Email:{' '}
                  <a href="mailto:hello@eastdivision.co.uk" className="text-white hover:text-brand-accent transition-colors">
                    hello@eastdivision.co.uk
                  </a>
                </p>
                <p>
                  Phone:{' '}
                  <a href="tel:+442079460123" className="text-white hover:text-brand-accent transition-colors">
                    +44 20 7946 0123
                  </a>
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 p-6">
              <p className="section-label mb-2">Response Time</p>
              <p className="text-sm text-white/50">
                We aim to reply within <strong className="text-white">24 hours</strong> during business days.
                For urgent order queries, please include your order number.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
