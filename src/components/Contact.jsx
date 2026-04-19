import { useState } from 'react'
import { motion } from 'framer-motion'
import { WHATSAPP_NUMBER } from '../data/menuItems'
import { api } from '../lib/api'

// TODO: Replace with real contact info
const PHONE = '+251 91 XXX XXXX'
const INSTAGRAM = 'https://instagram.com/sarburger'

const contactCards = [
  {
    icon: (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    label: 'WhatsApp',
    sublabel: 'Chat with us',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    color: '#25D366',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: 'Call Us',
    sublabel: PHONE,
    href: `tel:${PHONE.replace(/\s/g, '')}`,
    color: '#FF6B35',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    label: 'Instagram',
    sublabel: 'See our food',
    href: INSTAGRAM,
    color: '#E1306C',
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', contact: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.submitContact(form)
      setSubmitted(true)
    } catch (err) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <p className="uppercase tracking-[0.3em] text-sm mb-3" style={{ color: '#FF6B35' }}>
            Get In Touch
          </p>
          <h2
            className="font-display leading-none mb-4"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', color: '#F5F0E8' }}
          >
            HIT US UP
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#F5F0E8CC' }}>
            Got a question, want to pre-order, or just want to say hi — reach out.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-12">
          {contactCards.map((card, i) => (
            <motion.a
              key={card.label}
              href={card.href}
              target={card.href.startsWith('http') ? '_blank' : undefined}
              rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: `0 0 25px ${card.color}33` }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-200"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', color: card.color }}
            >
              {card.icon}
              <div className="text-center">
                <div className="font-semibold" style={{ color: '#F5F0E8' }}>{card.label}</div>
                <div className="text-sm" style={{ color: '#F5F0E880' }}>{card.sublabel}</div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl p-6 md:p-8"
          style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}
        >
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🙌</div>
              <h3 className="font-display text-3xl mb-2" style={{ color: '#FF6B35' }}>THANKS!</h3>
              <p style={{ color: '#F5F0E8CC' }}>We&apos;ll reach out soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#F5F0E880' }}>Name</label>
                  <input
                    type="text" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{ backgroundColor: '#0D0D0D', border: '1px solid #2A2A2A', color: '#F5F0E8' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B35')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#2A2A2A')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#F5F0E880' }}>Phone / Email</label>
                  <input
                    type="text" required value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    placeholder="How we reach you"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{ backgroundColor: '#0D0D0D', border: '1px solid #2A2A2A', color: '#F5F0E8' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B35')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#2A2A2A')}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#F5F0E880' }}>Message</label>
                <textarea
                  required rows={4} value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="What's on your mind?"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 resize-none"
                  style={{ backgroundColor: '#0D0D0D', border: '1px solid #2A2A2A', color: '#F5F0E8' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B35')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#2A2A2A')}
                />
              </div>
              {error && <p className="text-sm" style={{ color: '#C1121F' }}>{error}</p>}
              <button
                type="submit" disabled={loading}
                className="w-full py-4 rounded-xl font-semibold uppercase tracking-widest text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}
                onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#FF6B35')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#C1121F')}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
