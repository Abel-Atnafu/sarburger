import { motion } from 'framer-motion'
import { WHATSAPP_NUMBER } from '../data/menuItems'

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

            {/* WhatsApp button */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold uppercase tracking-wide text-sm transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: '#25D366', color: '#fff' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
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
