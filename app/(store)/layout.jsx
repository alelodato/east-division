import NavBar from '@/components/store/NavBar'
import Footer from '@/components/store/Footer'
import { CartProvider } from '@/components/store/CartProvider'

export default function StoreLayout({ children }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  )
}
