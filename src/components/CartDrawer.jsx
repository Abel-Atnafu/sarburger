import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQty, total, clearCart } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    onClose()
    navigate('/order')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm flex flex-col"
            style={{ backgroundColor: '#111111', borderLeft: '1px solid #2A2A2A' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #2A2A2A' }}>
              <h2 className="font-display text-2xl tracking-wide" style={{ color: '#F5F0E8' }}>YOUR CART</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: '#1A1A1A', color: '#F5F0E8' }}>×</button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center pt-16">
                  <div className="text-5xl mb-4">🛒</div>
                  <p className="font-display text-2xl mb-2" style={{ color: '#F5F0E8' }}>EMPTY</p>
                  <p className="text-sm" style={{ color: '#F5F0E860' }}>Add something from the menu</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: '#F5F0E8' }}>{item.name}</p>
                      <p className="text-sm" style={{ color: '#FF6B35' }}>
                        {item.price != null ? `${item.price * item.quantity} ETB` : '—'}
                      </p>
                    </div>
                    {/* Qty controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{ backgroundColor: '#2A2A2A', color: '#F5F0E8' }}
                      >−</button>
                      <span className="w-5 text-center text-sm font-semibold" style={{ color: '#F5F0E8' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{ backgroundColor: '#2A2A2A', color: '#F5F0E8' }}
                      >+</button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs ml-1"
                        style={{ color: '#C1121F' }}
                      >✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-5 space-y-3" style={{ borderTop: '1px solid #2A2A2A' }}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold" style={{ color: '#F5F0E8' }}>Total</span>
                  <span className="font-display text-2xl" style={{ color: '#FF6B35' }}>{total} ETB</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-xl font-semibold uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}
                >
                  Checkout →
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2 text-xs uppercase tracking-wide transition-colors"
                  style={{ color: '#F5F0E840' }}
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
