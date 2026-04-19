import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="font-display text-5xl mb-2" style={{ color: '#FF6B35' }}>SARBURGER</div>
          <p className="text-sm uppercase tracking-widest" style={{ color: '#F5F0E860' }}>Admin Panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8 space-y-4"
          style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}
        >
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#F5F0E880' }}>Email</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@sarburger.com"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: '#0D0D0D', border: '1px solid #2A2A2A', color: '#F5F0E8' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B35')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#2A2A2A')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#F5F0E880' }}>Password</label>
            <input
              type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: '#0D0D0D', border: '1px solid #2A2A2A', color: '#F5F0E8' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B35')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#2A2A2A')}
            />
          </div>
          {error && <p className="text-sm" style={{ color: '#C1121F' }}>{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-semibold uppercase tracking-widest text-sm transition-all duration-200 disabled:opacity-50"
            style={{ backgroundColor: '#C1121F', color: '#F5F0E8' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
