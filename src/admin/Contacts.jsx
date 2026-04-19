import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { api } from '../lib/api'

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [expanded, setExpanded] = useState(null)

  const load = () => api.getContacts().then(setContacts).catch(console.error)
  useEffect(() => { load() }, [])

  const markRead = async (id) => {
    await api.markContactRead(id).catch(console.error)
    load()
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-4xl mb-8" style={{ color: '#F5F0E8' }}>MESSAGES</h1>

      {contacts.length === 0 ? (
        <p className="text-sm" style={{ color: '#F5F0E840' }}>No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: '#1A1A1A',
                border: `1px solid ${c.isRead ? '#2A2A2A' : '#C1121F44'}`,
              }}
            >
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                onClick={() => {
                  setExpanded(expanded === c.id ? null : c.id)
                  if (!c.isRead) markRead(c.id)
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {!c.isRead && (
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#C1121F' }} />
                    )}
                    <span className="font-semibold" style={{ color: '#F5F0E8' }}>{c.name}</span>
                  </div>
                  <div className="text-xs mt-0.5 truncate" style={{ color: '#F5F0E860' }}>
                    {c.contact} · {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
                <p className="text-sm truncate max-w-xs hidden md:block" style={{ color: '#F5F0E880' }}>
                  {c.message}
                </p>
                <span style={{ color: '#F5F0E840' }}>{expanded === c.id ? '▲' : '▼'}</span>
              </div>

              {expanded === c.id && (
                <div className="px-5 pb-5" style={{ borderTop: '1px solid #2A2A2A' }}>
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: '#F5F0E8CC' }}>{c.message}</p>
                  <div className="flex gap-3 mt-4">
                    <a
                      href={`tel:${c.contact.replace(/\s/g, '')}`}
                      className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide"
                      style={{ backgroundColor: '#FF6B3522', color: '#FF6B35', border: '1px solid #FF6B3544' }}
                    >
                      📞 Call
                    </a>
                    <a
                      href={`https://wa.me/${c.contact.replace(/[^0-9]/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide"
                      style={{ backgroundColor: '#25D36622', color: '#25D366', border: '1px solid #25D36644' }}
                    >
                      💬 WhatsApp
                    </a>
                    <a
                      href={`mailto:${c.contact}`}
                      className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide"
                      style={{ backgroundColor: '#3B82F622', color: '#3B82F6', border: '1px solid #3B82F644' }}
                    >
                      ✉️ Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
