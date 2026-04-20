import { motion } from 'framer-motion'

// TODO: Replace all placeholder contact info with real data
const PHONE = '+251 91 XXX XXXX'
const ADDRESS = 'Bole Road, Near [Landmark], Addis Ababa, Ethiopia'

// TODO: Replace iframe src with real Google Maps embed for your location
const MAPS_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15762.345!2d38.7638!3d9.0192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8f6c31b38dc7%3A0x7649a51b28df7285!2sBole%2C%20Addis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2s!4v1700000000000'

export default function FindUs() {
  return (
    <section
      id="find-us"
      className="py-24 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#111111' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="uppercase tracking-[0.3em] text-sm mb-3" style={{ color: '#FF6B35' }}>
            We&apos;re Waiting
          </p>
          <h2
            className="font-display leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', color: '#F5F0E8' }}
          >
            COME FIND US
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            {/* Address */}
            <div className="flex gap-4 items-start">
              <span className="text-2xl mt-1">📍</span>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#FF6B35' }}>Address</h3>
                <p style={{ color: '#F5F0E8CC' }}>{ADDRESS}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4 items-start">
              <span className="text-2xl mt-1">📞</span>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#FF6B35' }}>Phone</h3>
                <a
                  href={`tel:${PHONE.replace(/\s/g, '')}`}
                  className="transition-colors duration-200 hover:text-[#FF6B35]"
                  style={{ color: '#F5F0E8CC' }}
                >
                  {PHONE}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-4 items-start">
              <span className="text-2xl mt-1">🕐</span>
              <div>
                <h3 className="font-semibold mb-2" style={{ color: '#FF6B35' }}>Opening Hours</h3>
                <div className="space-y-1" style={{ color: '#F5F0E8CC' }}>
                  <div className="flex justify-between gap-8">
                    <span>Mon – Sat</span>
                    <span>11:00 AM – 10:00 PM</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span>Sunday</span>
                    <span>12:00 PM – 9:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="/order"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold uppercase tracking-wide text-sm transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: '#C1121F', color: '#fff' }}
            >
              Order Online →
            </a>
          </motion.div>

          {/* Map column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-2xl"
            style={{ border: '1px solid #2A2A2A' }}
          >
            <iframe
              src={MAPS_SRC}
              width="100%"
              height="420"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our location"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
