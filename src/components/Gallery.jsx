import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { galleryImages } from '../data/menuItems'

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="uppercase tracking-[0.3em] text-sm mb-3" style={{ color: '#FF6B35' }}>
            No Filter Needed
          </p>
          <h2
            className="font-display leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', color: '#F5F0E8' }}
          >
            THE REAL THING
          </h2>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
          {galleryImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="break-inside-avoid overflow-hidden rounded-xl cursor-pointer group"
              onClick={() => setLightbox(img)}
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
              style={{ backgroundColor: '#1A1A1A', color: '#F5F0E8' }}
              onClick={() => setLightbox(null)}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
