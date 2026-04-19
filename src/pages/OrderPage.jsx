import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { api } from '../lib/api'

// TODO: Replace with real payment details before going live
const CBE_ACCOUNT     = '1000136789012'
const CBE_NAME        = 'SARBURGER'
const TELEBIRR_NUMBER = '0912345678'

export default function OrderPage() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm]         = useState({ name: '', phone: '' })
  const [screenshot, setScreenshot] = useState(null)
  const [preview, setPreview]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [orderId, setOrderId]   = useState(null)
  const fileRef                 = useRef()

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)')
      return
    }
    setScreenshot(file)
    setPreview(URL.createObjectURL(file))
    setError('')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) { setError('Your cart is empty.'); return }
    if (!screenshot) { setError('Please upload your payment screenshot.'); return }

    setLoading(true)
    setError('')

    try {
      // 1. Upload screenshot to Supabase Storage
      const screenshotUrl = await api.uploadScreenshot(screenshot)

      // 2. Place the order
      const order = await api.placeOrder({
        customerName: form.name,
        customerPhone: form.phone,
        items: items.map((i) => ({ menuItemId: i.id, quantity: i.quantity })),
        screenshotUrl,
      })

      setOrderId(order.id)
      clearCart()
    } catch (err) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ──────────────────────────────────────────
  if (orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0D0D0D' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="font-display text-5xl mb-3" style={{ color: '#FF6B35' }}>ORDER PLACED!</h1>
          <p className="text-lg mb-2" style={{ color: '#F5F0E8' }}>Order #{orderId}</p>
          <p className="text-sm mb-8" style={{ color: '#F5F0E880' }}>
            We received your order and payment screenshot. We&apos;ll confirm once payment is verified — usually within a few minutes.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 rounded-full font-semibold uppercase tracking-widest text-sm"
            style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}
          >
            Back to Menu
          </button>
        </motion.div>
      </div>
    )
  }

  // ── Empty cart redirect prompt ──────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0D0D0D' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="font-display text-4xl mb-4" style={{ color: '#F5F0E8' }}>CART IS EMPTY</h2>
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full font-semibold uppercase tracking-wide text-sm" style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}>
            Browse Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-8 text-sm transition-colors hover:text-[#FF6B35]" style={{ color: '#F5F0E860' }}>
          ← Back to menu
        </button>

        <h1 className="font-display text-5xl mb-8" style={{ color: '#F5F0E8' }}>CHECKOUT</h1>

        {/* Order summary */}
        <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}>
          <h2 className="font-semibold mb-4" style={{ color: '#F5F0E8' }}>Your Order</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span style={{ color: '#F5F0E8CC' }}>{item.quantity}× {item.name}</span>
                <span style={{ color: '#FF6B35' }}>{item.price != null ? `${item.price * item.quantity} ETB` : '—'}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '1px solid #2A2A2A' }}>
            <span className="font-semibold" style={{ color: '#F5F0E8' }}>Total</span>
            <span className="font-display text-3xl" style={{ color: '#FF6B35' }}>{total} ETB</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer details */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}>
            <h2 className="font-semibold mb-4" style={{ color: '#F5F0E8' }}>Your Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { key: 'name',  label: 'Full Name',    placeholder: 'Your name',         type: 'text' },
                { key: 'phone', label: 'Phone Number', placeholder: '09XX XXX XXXX',     type: 'tel' },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#F5F0E880' }}>{label}</label>
                  <input
                    type={type} required value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ backgroundColor: '#0D0D0D', border: '1px solid #2A2A2A', color: '#F5F0E8' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B35')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#2A2A2A')}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment instructions */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}>
            <h2 className="font-semibold mb-1" style={{ color: '#F5F0E8' }}>Pay Now</h2>
            <p className="text-sm mb-4" style={{ color: '#F5F0E860' }}>Transfer the exact amount to one of the options below, then upload your screenshot.</p>

            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {/* CBE */}
              <div className="rounded-xl p-4" style={{ backgroundColor: '#0D0D0D', border: '1px solid #2A2A2A' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🏦</span>
                  <span className="font-semibold text-sm" style={{ color: '#F5F0E8' }}>CBE Birr</span>
                </div>
                <p className="text-xs mb-1" style={{ color: '#F5F0E860' }}>Account Name</p>
                <p className="font-semibold text-sm mb-2" style={{ color: '#FF6B35' }}>{CBE_NAME}</p>
                <p className="text-xs mb-1" style={{ color: '#F5F0E860' }}>Account Number</p>
                <p className="font-mono font-bold text-sm" style={{ color: '#F5F0E8' }}>{CBE_ACCOUNT}</p>
              </div>

              {/* Telebirr */}
              <div className="rounded-xl p-4" style={{ backgroundColor: '#0D0D0D', border: '1px solid #2A2A2A' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📱</span>
                  <span className="font-semibold text-sm" style={{ color: '#F5F0E8' }}>Telebirr</span>
                </div>
                <p className="text-xs mb-1" style={{ color: '#F5F0E860' }}>Send to Number</p>
                <p className="font-mono font-bold text-sm" style={{ color: '#F5F0E8' }}>{TELEBIRR_NUMBER}</p>
              </div>
            </div>

            {/* Amount highlight */}
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#C1121F22', border: '1px solid #C1121F44' }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#F5F0E880' }}>Amount to Transfer</p>
              <p className="font-display text-4xl" style={{ color: '#FF6B35' }}>{total} ETB</p>
              <p className="text-xs mt-1" style={{ color: '#F5F0E860' }}>Transfer the exact amount shown</p>
            </div>
          </div>

          {/* Screenshot upload */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}>
            <h2 className="font-semibold mb-1" style={{ color: '#F5F0E8' }}>Upload Payment Screenshot</h2>
            <p className="text-sm mb-4" style={{ color: '#F5F0E860' }}>After transferring, take a screenshot of the confirmation and upload it here.</p>

            <div
              onClick={() => fileRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all"
              style={{ borderColor: preview ? '#22C55E' : '#2A2A2A' }}
            >
              {preview ? (
                <div>
                  <img src={preview} alt="Payment screenshot" className="max-h-48 mx-auto rounded-lg mb-3 object-contain" />
                  <p className="text-sm" style={{ color: '#22C55E' }}>✓ Screenshot ready</p>
                  <p className="text-xs mt-1" style={{ color: '#F5F0E860' }}>Click to change</p>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-3">📸</div>
                  <p className="font-semibold text-sm mb-1" style={{ color: '#F5F0E8' }}>Drop screenshot here</p>
                  <p className="text-xs" style={{ color: '#F5F0E860' }}>or click to browse</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          </div>

          {error && <p className="text-sm px-1" style={{ color: '#C1121F' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}
          >
            {loading ? 'Placing Order...' : `Confirm Order — ${total} ETB`}
          </button>
        </form>
      </div>
    </div>
  )
}
