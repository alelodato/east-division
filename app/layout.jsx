import './globals.css'

export const metadata = {
  title: {
    default: 'East Division — Streetwear & Sneakers, East London',
    template: '%s | East Division',
  },
  description:
    'Independent streetwear and sneaker store based in Shoreditch, East London. Curated selection of premium footwear and apparel.',
  keywords: ['streetwear', 'sneakers', 'East London', 'Shoreditch', 'independent'],
  openGraph: {
    title: 'East Division',
    description: 'Independent streetwear & sneaker store. Shoreditch, East London.',
    type: 'website',
    locale: 'en_GB',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  )
}
