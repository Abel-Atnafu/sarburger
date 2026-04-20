import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { api } from '../lib/api'

// TODO: Replace with real payment details before going live
const CBE_ACCOUNT     = '1000136789012'
const CBE_NAME        = 'SARBURGER'
const TELEBIRR_NUMBER = '0912345678'

const STEPS = ['Review', 'Details', 'Payment']

const slide = {
  enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (d) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
}

export default function OrderPage() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [step, setStep]               = useState(0)
  const [dir, setDir]                 = useState(1)
  const [form, setForm]               = useState({ name: '', phone: '' })
  const [payMethod, setPayMethod]     = useState('cbe')
  const [screenshot, setScreenshot]   = useState(null)
  const [preview, setPreview]         = useState(null)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [orderId, setOrderId]         = useState(null)
  const fileRef                       = useRef()

  const go = (n) => { setDir(n > step ? 1 : -1); setStep(n) }

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please upload an image file'); return }
    setScreenshot(file)
    setPreview(URL.createObjectURL(file))
    setError('')
  }

  const handleSubmit = async () => {
    if (!screenshot) { setError('Please upload your payment screenshot.'); return }
    setLoading(true)
    setError('')
    try {
      const screenshotUrl = await api.uploadScreenshot(screenshot)
      const order = await api.placeOrder({
        customerName:  form.name,
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

  // ── Success ────────────────────────────────────────────────────────────────
  if (orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0D0D0D' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          className="text-center max-w-sm w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 220 }}
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: '#22C55E18', border: '2px solid #22C55E66' }}
          >
            <span className="text-5xl" style={{ color: '#22C55E' }}>✓</span>
          </motion.div>
          <h1 className="font-display text-6xl mb-2" style={{ color: '#FF6B35' }}>ORDER PLACED!</h1>
          <p className="text-base mb-2 font-semibold" style={{ color: '#F5F0E8' }}>Order #{orderId}</p>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: '#F5F0E860' }}>
            We received your order and payment screenshot.<br />
            We'll confirm once payment is verified — usually within a few minutes.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-10 py-3 rounded-full font-semibold uppercase tracking-widest text-sm"
            style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}
          >
            Back to Menu
          </button>
        </motion.div>
      </div>
    )
  }

  // ── Empty cart ─────────────────────────────────────────────────────────────
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
    <div className="min-h-screen py-16 px-4" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="max-w-lg mx-auto">

        {/* Back */}
        <button
          onClick={() => step === 0 ? navigate('/') : go(step - 1)}
          className="flex items-center gap-2 mb-10 text-sm transition-colors hover:text-[#FF6B35]"
          style={{ color: '#F5F0E850' }}
        >
          ← {step === 0 ? 'Back to menu' : 'Back'}
        </button>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={
                    i < step
                      ? { backgroundColor: '#22C55E', borderColor: '#22C55E' }
                      : i === step
                        ? { backgroundColor: '#C1121F', borderColor: '#C1121F' }
                        : { backgroundColor: 'transparent', borderColor: '#2A2A2A' }
                  }
                  transition={{ duration: 0.3 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2"
                  style={{ color: i <= step ? '#fff' : '#F5F0E840' }}
                >
                  {i < step ? '✓' : i + 1}
                </motion.div>
                <span className="text-xs font-medium tracking-wide uppercase hidden sm:block" style={{ color: i === step ? '#F5F0E8' : '#F5F0E840' }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <motion.div
                  className="h-px mx-3 mb-5"
                  style={{ width: 64 }}
                  animate={{ backgroundColor: i < step ? '#22C55E' : '#2A2A2A' }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait" custom={dir}>

          {/* ── STEP 0: Review ── */}
          {step === 0 && (
            <motion.div key="s0" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }}>
              <h2 className="font-display text-4xl mb-5" style={{ color: '#F5F0E8' }}>YOUR ORDER</h2>
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 px-5 py-4"
                    style={{ borderTop: idx > 0 ? '1px solid #2A2A2A' : 'none' }}
                  >
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: '#F5F0E8' }}>{item.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#F5F0E860' }}>Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold shrink-0" style={{ color: '#FF6B35' }}>
                      {item.price != null ? `${item.price * item.quantity} ETB` : '—'}
                    </p>
                  </div>
                ))}
                <div
                  className="flex justify-between items-center px-5 py-4"
                  style={{ borderTop: '1px solid #2A2A2A', backgroundColor: '#111' }}
                >
                  <span className="font-semibold" style={{ color: '#F5F0E8' }}>Total</span>
                  <span className="font-display text-3xl" style={{ color: '#FF6B35' }}>{total} ETB</span>
                </div>
              </div>
              <button
                onClick={() => go(1)}
                className="w-full mt-5 py-4 rounded-xl font-semibold uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}
              >
                Continue →
              </button>
            </motion.div>
          )}

          {/* ── STEP 1: Details ── */}
          {step === 1 && (
            <motion.div key="s1" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }}>
              <h2 className="font-display text-4xl mb-5" style={{ color: '#F5F0E8' }}>YOUR DETAILS</h2>
              <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                {[
                  { key: 'name',  label: 'Full Name',    placeholder: 'Your name',     type: 'text' },
                  { key: 'phone', label: 'Phone Number', placeholder: '09XX XXX XXXX', type: 'tel' },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#F5F0E860' }}>{label}</label>
                    <input
                      type={type}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ backgroundColor: '#0D0D0D', border: '1px solid #2A2A2A', color: '#F5F0E8' }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B35')}
                      onBlur={(e)  => (e.currentTarget.style.borderColor = '#2A2A2A')}
                    />
                  </div>
                ))}
              </div>
              {error && <p className="text-sm mt-3 px-1" style={{ color: '#C1121F' }}>{error}</p>}
              <button
                onClick={() => {
                  if (!form.name.trim() || !form.phone.trim()) { setError('Please fill in your name and phone number.'); return }
                  setError('')
                  go(2)
                }}
                className="w-full mt-5 py-4 rounded-xl font-semibold uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}
              >
                Continue →
              </button>
            </motion.div>
          )}

          {/* ── STEP 2: Payment ── */}
          {step === 2 && (
            <motion.div key="s2" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }}>
              <h2 className="font-display text-4xl mb-5" style={{ color: '#F5F0E8' }}>PAYMENT</h2>

              {/* Amount */}
              <div className="rounded-2xl p-5 mb-4 text-center" style={{ backgroundColor: '#C1121F18', border: '1px solid #C1121F44' }}>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#F5F0E860' }}>Amount to Transfer</p>
                <p className="font-display text-5xl" style={{ color: '#FF6B35' }}>{total} ETB</p>
                <p className="text-xs mt-1" style={{ color: '#F5F0E860' }}>Transfer the exact amount shown</p>
              </div>

              {/* Method tabs */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { key: 'cbe',      icon: '🏦', label: 'CBE Birr' },
                  { key: 'telebirr', icon: '📱', label: 'Telebirr' },
                ].map(({ key, icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setPayMethod(key)}
                    className="p-4 rounded-xl text-left transition-all"
                    style={
                      payMethod === key
                        ? { backgroundColor: '#FF6B3518', border: '2px solid #FF6B35' }
                        : { backgroundColor: '#1A1A1A',   border: '2px solid #2A2A2A' }
                    }
                  >
                    <div className="text-2xl mb-1">{icon}</div>
                    <div className="font-semibold text-sm" style={{ color: payMethod === key ? '#FF6B35' : '#F5F0E8' }}>{label}</div>
                  </button>
                ))}
              </div>

              {/* Payment details */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={payMethod}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-xl p-4 mb-4"
                  style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}
                >
                  {payMethod === 'cbe' ? (
                    <>
                      <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#F5F0E860' }}>Account Name</p>
                      <p className="font-bold mb-3" style={{ color: '#FF6B35' }}>{CBE_NAME}</p>
                      <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#F5F0E860' }}>Account Number</p>
                      <p className="font-mono font-bold text-xl tracking-widest" style={{ color: '#F5F0E8' }}>{CBE_ACCOUNT}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#F5F0E860' }}>Send to Number</p>
                      <p className="font-mono font-bold text-xl tracking-widest" style={{ color: '#F5F0E8' }}>{TELEBIRR_NUMBER}</p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Screenshot upload */}
              <div className="rounded-2xl p-5" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                <p className="font-semibold text-sm mb-1" style={{ color: '#F5F0E8' }}>Upload Payment Screenshot</p>
                <p className="text-xs mb-4" style={{ color: '#F5F0E860' }}>After transferring, upload the confirmation screenshot.</p>
                <div
                  onClick={() => fileRef.current?.click()}
                  onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
                  onDragOver={(e) => e.preventDefault()}
                  className="rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all"
                  style={{ borderColor: preview ? '#22C55E' : '#2A2A2A' }}
                >
                  {preview ? (
                    <>
                      <img src={preview} alt="Payment" className="max-h-40 mx-auto rounded-lg mb-3 object-contain" />
                      <p className="text-sm font-semibold" style={{ color: '#22C55E' }}>✓ Screenshot ready</p>
                      <p className="text-xs mt-1" style={{ color: '#F5F0E860' }}>Click to change</p>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl mb-3">📸</div>
                      <p className="font-semibold text-sm mb-1" style={{ color: '#F5F0E8' }}>Drop screenshot here</p>
                      <p className="text-xs" style={{ color: '#F5F0E860' }}>or click to browse</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
              </div>

              {error && <p className="text-sm mt-3 px-1" style={{ color: '#C1121F' }}>{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-5 py-4 rounded-xl font-semibold uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}
              >
                {loading ? 'Placing Order...' : `Confirm Order — ${total} ETB`}
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
