import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

export default function Hero() {
  const navigate = useNavigate()
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Background image — TODO: Replace with real photo */}
      <img
        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&h=900&fit=crop&auto=format"
        alt="Signature burger"
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.3) 40%, rgba(13,13,13,0.85) 80%, #0D0D0D 100%)',
        }}
      />

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <motion.p
          variants={fadeUp}
          className="uppercase tracking-[0.3em] text-sm mb-4"
          style={{ color: '#FF6B35' }}
        >
          Addis Ababa's Finest Smash Burger {/* TODO: Update tagline */}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="font-display leading-none mb-6"
          style={{
            fontSize: 'clamp(4rem, 14vw, 12rem)',
            color: '#F5F0E8',
            textShadow: '0 4px 40px rgba(0,0,0,0.5)',
          }}
        >
          BUILT
          <br />
          <span style={{ color: '#FF6B35' }}>DIFFERENT.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed"
          style={{ color: '#F5F0E8CC' }}
        >
          Fresh beef, pressed hot, stacked right — served fast.
          {/* TODO: Update with restaurant's actual slogan */}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={scrollToMenu}
            className="px-8 py-4 rounded-full font-semibold uppercase tracking-widest text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#FF6B35')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#C1121F')}
          >
            See Our Menu
          </button>

          <button
            onClick={() => navigate('/order')}
            className="px-8 py-4 rounded-full font-semibold uppercase tracking-widest text-sm border-2 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ borderColor: '#F5F0E8', color: '#F5F0E8', backgroundColor: 'transparent' }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F0E8'
              e.currentTarget.style.color = '#0D0D0D'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#F5F0E8'
            }}
          >
            Order Now
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: '#F5F0E880' }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-0.5 h-8"
          style={{ backgroundColor: '#F5F0E840' }}
        />
      </motion.div>
    </section>
  )
}
