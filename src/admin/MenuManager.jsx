import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { api } from '../lib/api'

const CATEGORIES = ['burgers', 'sides', 'drinks', 'combos']

const emptyForm = { category: 'burgers', name: '', description: '', price: '', savingLabel: '', image: '', isActive: true }

export default function MenuManager() {
  const [items, setItems] = useState([])
  const [editItem, setEditItem] = useState(null) // null = closed, {} = new, {id,...} = editing
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => api.getAllMenu().then(setItems).catch(console.error)

  useEffect(() => { load() }, [])

  const openNew = () => { setForm(emptyForm); setEditItem({}); setError('') }
  const openEdit = (item) => {
    setForm({
      category: item.category,
      name: item.name,
      description: item.description,
      price: item.price ?? '',
      savingLabel: item.savingLabel ?? '',
      image: item.image,
      isActive: item.isActive,
    })
    setEditItem(item)
    setError('')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const data = { ...form, price: form.price === '' ? null : Number(form.price), savingLabel: form.savingLabel || null }
      if (editItem?.id) {
        await api.updateMenuItem(editItem.id, data)
      } else {
        await api.createMenuItem(data)
      }
      setEditItem(null)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return
    await api.deleteMenuItem(id).catch(console.error)
    load()
  }

  const categoryColors = { burgers: '#FF6B35', sides: '#F59E0B', drinks: '#3B82F6', combos: '#A855F7' }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl" style={{ color: '#F5F0E8' }}>MENU</h1>
        <button
          onClick={openNew}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold uppercase tracking-wide transition-all hover:scale-105"
          style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}
        >
          + Add Item
        </button>
      </div>

      {CATEGORIES.map((cat) => {
        const catItems = items.filter((i) => i.category === cat)
        if (!catItems.length) return null
        return (
          <div key={cat} className="mb-8">
            <h2 className="font-display text-2xl mb-3 capitalize" style={{ color: categoryColors[cat] }}>{cat}</h2>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #2A2A2A' }}>
              {catItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-4"
                  style={{ borderBottom: idx < catItems.length - 1 ? '1px solid #1A1A1A' : 'none', backgroundColor: item.isActive ? '#1A1A1A' : '#141414' }}
                >
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate" style={{ color: item.isActive ? '#F5F0E8' : '#F5F0E840' }}>{item.name}</span>
                      {!item.isActive && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#2A2A2A', color: '#F5F0E840' }}>Hidden</span>}
                    </div>
                    <div className="text-xs truncate" style={{ color: '#F5F0E860' }}>{item.description}</div>
                  </div>
                  <div className="text-sm font-semibold shrink-0" style={{ color: '#FF6B35' }}>
                    {item.price != null ? `${item.price} ETB` : item.savingLabel ?? '—'}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEdit(item)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-[#2A2A2A]" style={{ color: '#F5F0E8CC' }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ color: '#C1121F' }}>Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Modal */}
      {editItem !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}>
            <h2 className="font-display text-2xl mb-6" style={{ color: '#F5F0E8' }}>
              {editItem?.id ? 'Edit Item' : 'New Item'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#F5F0E860' }}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: '#0D0D0D', border: '1px solid #2A2A2A', color: '#F5F0E8' }}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#F5F0E860' }}>Price (ETB)</label>
                  <input
                    type="number" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="Leave blank for combos"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: '#0D0D0D', border: '1px solid #2A2A2A', color: '#F5F0E8' }}
                  />
                </div>
              </div>
              {[
                { key: 'name', label: 'Name', required: true },
                { key: 'description', label: 'Description', required: true },
                { key: 'savingLabel', label: 'Saving Label (combos only)', required: false },
                { key: 'image', label: 'Image URL', required: true },
              ].map(({ key, label, required }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#F5F0E860' }}>{label}</label>
                  <input
                    type="text" required={required} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: '#0D0D0D', border: '1px solid #2A2A2A', color: '#F5F0E8' }}
                  />
                </div>
              ))}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                <span className="text-sm" style={{ color: '#F5F0E8CC' }}>Visible on menu</span>
              </label>
              {error && <p className="text-sm" style={{ color: '#C1121F' }}>{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditItem(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: '#2A2A2A', color: '#F5F0E8' }}>Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50" style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
