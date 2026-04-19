import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { api } from '../lib/api'

const STATUSES = ['all', 'pending', 'confirmed', 'ready', 'done', 'cancelled']

const statusColors = {
  pending: '#FF6B35',
  confirmed: '#3B82F6',
  ready: '#A855F7',
  done: '#22C55E',
  cancelled: '#6B7280',
}

const nextStatus = {
  pending: 'confirmed',
  confirmed: 'ready',
  ready: 'done',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const load = () =>
    api.getOrders(filter === 'all' ? '' : filter).then(setOrders).catch(console.error)

  useEffect(() => { load() }, [filter])

  const advance = async (order) => {
    const next = nextStatus[order.status]
    if (!next) return
    await api.updateOrderStatus(order.id, next).catch(console.error)
    load()
  }

  const cancel = async (id) => {
    if (!confirm('Cancel this order?')) return
    await api.updateOrderStatus(id, 'cancelled').catch(console.error)
    load()
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-4xl mb-8" style={{ color: '#F5F0E8' }}>ORDERS</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide capitalize transition-all"
            style={
              filter === s
                ? { backgroundColor: s === 'all' ? '#C1121F' : statusColors[s], color: '#fff' }
                : { backgroundColor: '#1A1A1A', color: '#F5F0E860', border: '1px solid #2A2A2A' }
            }
          >
            {s}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="text-sm" style={{ color: '#F5F0E840' }}>No orders found.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}>
              {/* Header row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold" style={{ color: '#F5F0E8' }}>{order.customerName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: `${statusColors[order.status]}22`, color: statusColors[order.status] }}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#F5F0E860' }}>
                    {order.customerPhone} · {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold" style={{ color: '#FF6B35' }}>{order.total} ETB</div>
                  <div className="text-xs" style={{ color: '#F5F0E840' }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                </div>
                <span style={{ color: '#F5F0E840' }}>{expanded === order.id ? '▲' : '▼'}</span>
              </div>

              {/* Expanded detail */}
              {expanded === order.id && (
                <div className="px-5 pb-4" style={{ borderTop: '1px solid #2A2A2A' }}>
                  <div className="py-3 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span style={{ color: '#F5F0E8CC' }}>{item.quantity}× {item.menuItem.name}</span>
                        <span style={{ color: '#FF6B35' }}>{item.price * item.quantity} ETB</span>
                      </div>
                    ))}
                    {order.notes && (
                      <p className="text-xs mt-2 pt-2 italic" style={{ color: '#F5F0E860', borderTop: '1px solid #2A2A2A' }}>
                        Note: {order.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {nextStatus[order.status] && (
                      <button
                        onClick={() => advance(order)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all hover:scale-105"
                        style={{ backgroundColor: statusColors[nextStatus[order.status]], color: '#fff' }}
                      >
                        Mark {nextStatus[order.status]}
                      </button>
                    )}
                    {order.status !== 'cancelled' && order.status !== 'done' && (
                      <button
                        onClick={() => cancel(order.id)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide"
                        style={{ backgroundColor: '#2A2A2A', color: '#F5F0E860' }}
                      >
                        Cancel
                      </button>
                    )}
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
