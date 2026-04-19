import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/menu',      label: 'Menu',       icon: '🍔' },
  { to: '/admin/orders',    label: 'Orders',     icon: '📋' },
  { to: '/admin/contacts',  label: 'Messages',   icon: '✉️' },
]

export default function AdminLayout({ children }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0D0D0D', color: '#F5F0E8' }}>
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col py-8 px-4" style={{ backgroundColor: '#111111', borderRight: '1px solid #1A1A1A' }}>
        <div className="font-display text-2xl mb-10 px-2" style={{ color: '#FF6B35' }}>
          SARBURGER
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive ? 'text-[#F5F0E8]' : 'text-[#F5F0E860] hover:text-[#F5F0E8]'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: '#C1121F' } : {}}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:text-[#F5F0E8]"
          style={{ color: '#F5F0E860' }}
        >
          <span>🚪</span> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
