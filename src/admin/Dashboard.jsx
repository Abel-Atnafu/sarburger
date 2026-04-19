import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { api } from '../lib/api'

function StatCard({ icon, value, label, to, color }) {
  return (
    <Link
      to={to}
      className="rounded-2xl p-6 flex items-center gap-5 transition-all duration-200 hover:scale-[1.02]"
      style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}
    >
      <div className="text-4xl w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#0D0D0D' }}>
        {icon}
      </div>
      <div>
        <div className="font-display text-4xl leading-none" style={{ color: color ?? '#FF6B35' }}>{value}</div>
        <div className="text-sm mt-1" style={{ color: '#F5F0E860' }}>{label}</div>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const [orderStats, setOrderStats] = useState({ total: 0, pending: 0, revenue: 0 })
  const [contactStats, setContactStats] = useState({ total: 0, unread: 0 })
  const [menuCount, setMenuCount] = useState(0)
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    Promise.all([
      api.getOrderStats(),
      api.getContactStats(),
      api.getAllMenu(),
      api.getOrders(),
    ]).then(([os, cs, menu, orders]) => {
      setOrderStats(os)
      setContactStats(cs)
      setMenuCount(menu.length)
      setRecentOrders(orders.slice(0, 5))
    }).catch(console.error)
  }, [])

  const statusColors = {
    pending: '#FF6B35',
    confirmed: '#3B82F6',
    ready: '#A855F7',
    done: '#22C55E',
    cancelled: '#6B7280',
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-4xl mb-8" style={{ color: '#F5F0E8' }}>DASHBOARD</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        <StatCard icon="📋" value={orderStats.total} label="Total Orders" to="/admin/orders" />
        <StatCard icon="⏳" value={orderStats.pending} label="Pending Orders" to="/admin/orders" color="#C1121F" />
        <StatCard icon="💰" value={`${orderStats.revenue.toLocaleString()} ETB`} label="Total Revenue" to="/admin/orders" color="#22C55E" />
        <StatCard icon="✉️" value={contactStats.unread} label="Unread Messages" to="/admin/contacts" color="#3B82F6" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold" style={{ color: '#F5F0E8' }}>Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs uppercase tracking-wide transition-colors" style={{ color: '#FF6B35' }}>View all →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm" style={{ color: '#F5F0E840' }}>No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #2A2A2A' }}>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#F5F0E8' }}>{order.customerName}</div>
                    <div className="text-xs" style={{ color: '#F5F0E860' }}>{order.customerPhone}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold" style={{ color: '#FF6B35' }}>{order.total} ETB</div>
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: `${statusColors[order.status]}22`, color: statusColors[order.status] }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}>
          <h2 className="font-semibold mb-5" style={{ color: '#F5F0E8' }}>Quick Info</h2>
          <div className="space-y-4">
            {[
              { label: 'Menu Items', value: menuCount, icon: '🍔' },
              { label: 'Total Messages', value: contactStats.total, icon: '✉️' },
              { label: 'Unread Messages', value: contactStats.unread, icon: '🔔' },
              { label: 'Total Orders', value: orderStats.total, icon: '📦' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm" style={{ color: '#F5F0E8CC' }}>
                  <span>{row.icon}</span>{row.label}
                </div>
                <span className="font-semibold" style={{ color: '#FF6B35' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
