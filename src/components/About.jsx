import { motion } from 'framer-motion'

const stats = [
  { icon: '🔥', value: '5+', label: 'Signature Burgers' },
  { icon: '🥩', value: '100%', label: 'Fresh Beef' },
  { icon: '⚡', value: '7 Days', label: 'A Week' },
]

export default function About() {
  return (
    <section
      id="about"
      className="py-24 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#111111' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5]">
              {/* TODO: Replace with real interior/vibe photo */}
              <img
                src="https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=1000&fit=crop&auto=format"
                alt="Our restaurant"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(193,18,31,0.15) 0%, transparent 60%)' }}
              />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-6 -right-4 md:-right-8 px-6 py-4 rounded-2xl text-center"
              style={{ backgroundColor: '#C1121F' }}
            >
              <p className="font-display text-4xl leading-none" style={{ color: '#F5F0E8' }}>
                EST.
              </p>
              <p className="font-display text-2xl" style={{ color: '#FF6B35' }}>
                2023 {/* TODO: Update founding year */}
              </p>
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="uppercase tracking-[0.3em] text-sm mb-4" style={{ color: '#FF6B35' }}>
              Who We Are
            </p>
            <h2
              className="font-display leading-none mb-8"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', color: '#F5F0E8' }}
            >
              OUR STORY
            </h2>
            <p className="text-lg leading-relaxed mb-10" style={{ color: '#F5F0E8CC' }}>
              {/* TODO: Replace with real story */}
              We started with one belief — that Addis deserved a real smash burger. Not frozen
              patties, not shortcuts. Just fresh beef, pressed hot, stacked right, served fast.
              Every burger we make is built from scratch, every time. That&apos;s the only way we
              know how.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="text-center p-4 rounded-xl"
                  style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="font-display text-2xl leading-tight" style={{ color: '#FF6B35' }}>
                    {stat.value}
                  </div>
                  <div className="text-xs mt-1 leading-tight" style={{ color: '#F5F0E880' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
