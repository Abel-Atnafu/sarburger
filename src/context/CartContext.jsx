import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'sb_cart'

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id))

  const updateQty = (id, quantity) => {
    if (quantity < 1) return removeItem(id)
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i))
  }

  const clearCart = () => setItems([])

  const itemCount = items.reduce((s, i) => s + i.quantity, 0)
  const total = items.reduce((s, i) => s + (i.price ?? 0) * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
