import { motion } from 'framer-motion'
import { WHATSAPP_NUMBER } from '../data/menuItems'

export default function MenuCard({ item }) {
  const waText = encodeURIComponent(`Hi, I'd like to order: ${item.name}`)
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 0 30px rgba(255,107,53,0.25)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {item.savingLabel && (
          <span
            className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
            style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}
          >
            {item.savingLabel}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3
          className="font-display text-2xl tracking-wide leading-tight"
          style={{ color: '#F5F0E8' }}
        >
          {item.name}
        </h3>
        <p className="text-sm leading-relaxed flex-1" style={{ color: '#F5F0E899' }}>
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-semibold text-lg" style={{ color: '#FF6B35' }}>
            {item.price !== null ? `${item.price} ETB` : '—'}
          </span>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#FF6B35')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#C1121F')}
          >
            Add to Order
          </a>
        </div>
      </div>
    </motion.div>
  )
}
