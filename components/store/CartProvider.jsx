'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const CartContext = createContext(null)
const CART_KEY = 'ed_cart_v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {}
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = useCallback((newItem) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.productId === newItem.productId && i.size === newItem.size
      )
      if (existing) {
        return prev.map(i =>
          i.productId === newItem.productId && i.size === newItem.size
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        )
      }
      return [...prev, newItem]
    })
  }, [])

  const removeItem = useCallback((productId, size) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.size === size)))
  }, [])

  const updateQty = useCallback((productId, size, qty) => {
    if (qty <= 0) {
      removeItem(productId, size)
      return
    }
    setItems(prev =>
      prev.map(i =>
        i.productId === productId && i.size === size ? { ...i, quantity: qty } : i
      )
    )
  }, [removeItem])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
