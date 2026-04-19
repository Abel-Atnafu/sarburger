import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const navLinks = [
  { label: 'Menu',    href: '#menu' },
  { label: 'About',   href: '#about' },
  { label: 'Find Us', href: '#find-us' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ onCartOpen }) {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const { itemCount }             = useCart()
  const navigate                  = useNavigate()
  const location                  = useLocation()
  const isHome                    = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (href) => {
    setMenuOpen(false)
    if (!isHome) {
      navigate('/')
      setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 100)
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#0D0D0D]/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            className="font-display text-3xl tracking-wider"
            onClick={(e) => { e.preventDefault(); navigate('/') }}
            style={{ color: '#FF6B35' }}
          >
            SARBURGER
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                  className="text-[#F5F0E8] hover:text-[#FF6B35] transition-colors duration-200 font-medium text-sm tracking-wide uppercase"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right side: cart + order button */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart icon */}
            <button
              onClick={onCartOpen}
              className="relative p-2 rounded-full transition-colors hover:bg-white/10"
              aria-label="Open cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="#F5F0E8" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ backgroundColor: '#C1121F', color: '#fff' }}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/order')}
              className="px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition-all duration-200"
              style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#FF6B35')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#C1121F')}
            >
              Order Now
            </button>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={onCartOpen} className="relative p-2" aria-label="Open cart">
              <svg className="w-6 h-6" fill="none" stroke="#F5F0E8" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center" style={{ backgroundColor: '#C1121F', color: '#fff' }}>
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
            <button
              className="flex flex-col gap-1.5 p-2 z-50"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block h-0.5 w-6 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ backgroundColor: '#F5F0E8' }} />
              <span className={`block h-0.5 w-6 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} style={{ backgroundColor: '#F5F0E8' }} />
              <span className={`block h-0.5 w-6 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ backgroundColor: '#F5F0E8' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ backgroundColor: '#111111' }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-10">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                  className="font-display text-5xl tracking-wider"
                  style={{ color: '#F5F0E8' }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => { setMenuOpen(false); navigate('/order') }}
                className="mt-4 px-8 py-3 rounded-full font-semibold uppercase tracking-wide text-lg"
                style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}
              >
                Order Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
