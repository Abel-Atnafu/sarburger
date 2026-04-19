import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { menuItems as staticItems, categories } from '../data/menuItems'
import { api } from '../lib/api'
import MenuCard from './MenuCard'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [items, setItems] = useState(staticItems)

  useEffect(() => {
    api.getMenu()
      .then(setItems)
      .catch(() => setItems(staticItems)) // fallback to static data
  }, [])

  const filtered =
    activeCategory === 'all'
      ? items
      : items.filter((item) => item.category === activeCategory)

  return (
    <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="uppercase tracking-[0.3em] text-sm mb-3" style={{ color: '#FF6B35' }}>
            What We Serve
          </p>
          <h2
            className="font-display leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', color: '#F5F0E8' }}
          >
            THE MENU
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition-all duration-200"
              style={
                activeCategory === cat.key
                  ? { backgroundColor: '#C1121F', color: '#F5F0E8' }
                  : { backgroundColor: '#1A1A1A', color: '#F5F0E880', border: '1px solid #2A2A2A' }
              }
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        >
          {filtered.map((item) => (
            <motion.div key={item.id} variants={cardVariants}>
              <MenuCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
