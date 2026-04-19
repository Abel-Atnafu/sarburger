import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { api } from '../lib/api'

const STATUSES = ['all', 'pending', 'confirmed', 'ready', 'done', 'cancelled']

const statusColors = {
  pending:   '#FF6B35',
  confirmed: '#3B82F6',
  ready:     '#A855F7',
  done:      '#22C55E',
  cancelled: '#6B7280',
}

const paymentColors = {
  pending:  '#6B7280',
  uploaded: '#FF6B35',
  verified: '#22C55E',
  rejected: '#C1121F',
}

const nextStatus = {
  pending:   'confirmed',
  confirmed: 'ready',
  ready:     'done',
}

export default function Orders() {
  const [orders, setOrders]     = useState([])
  const [filter, setFilter]     = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [lightbox, setLightbox] = useState(null)

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

  const verifyPayment = async (id) => {
    await api.verifyPayment(id).catch(console.error)
    load()
  }

  const rejectPayment = async (id) => {
    if (!confirm('Reject this payment? The order will be cancelled.')) return
    await api.rejectPayment(id).catch(console.error)
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold" style={{ color: '#F5F0E8' }}>{order.customerName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: `${statusColors[order.status]}22`, color: statusColors[order.status] }}>
                      {order.status}
                    </span>
                    {/* Payment status badge */}
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: `${paymentColors[order.paymentStatus]}22`, color: paymentColors[order.paymentStatus] }}>
                      💳 {order.paymentStatus}
                    </span>
                    {order.screenshotUrl && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#22C55E22', color: '#22C55E' }}>
                        📸 Screenshot
                      </span>
                    )}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#F5F0E860' }}>
                    {order.customerPhone} · {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold" style={{ color: '#FF6B35' }}>{order.total} ETB</div>
                  <div className="text-xs" style={{ color: '#F5F0E840' }}>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</div>
                </div>
                <span style={{ color: '#F5F0E840' }}>{expanded === order.id ? '▲' : '▼'}</span>
              </div>

              {/* Expanded detail */}
              {expanded === order.id && (
                <div className="px-5 pb-5" style={{ borderTop: '1px solid #2A2A2A' }}>
                  {/* Items */}
                  <div className="py-3 space-y-2">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span style={{ color: '#F5F0E8CC' }}>{item.quantity}× {item.menuItem?.name}</span>
                        <span style={{ color: '#FF6B35' }}>{item.price * item.quantity} ETB</span>
                      </div>
                    ))}
                    {order.notes && (
                      <p className="text-xs mt-2 pt-2 italic" style={{ color: '#F5F0E860', borderTop: '1px solid #2A2A2A' }}>
                        Note: {order.notes}
                      </p>
                    )}
                  </div>

                  {/* Payment screenshot */}
                  {order.screenshotUrl && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#F5F0E860' }}>Payment Screenshot</p>
                      <img
                        src={order.screenshotUrl}
                        alt="Payment proof"
                        className="max-h-48 rounded-xl object-contain cursor-pointer border"
                        style={{ borderColor: '#2A2A2A' }}
                        onClick={() => setLightbox(order.screenshotUrl)}
                      />
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {/* Payment verify/reject — only show if screenshot uploaded and not yet verified/rejected */}
                    {order.screenshotUrl && order.paymentStatus === 'uploaded' && (
                      <>
                        <button
                          onClick={() => verifyPayment(order.id)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide"
                          style={{ backgroundColor: '#22C55E22', color: '#22C55E', border: '1px solid #22C55E44' }}
                        >
                          ✓ Verify Payment
                        </button>
                        <button
                          onClick={() => rejectPayment(order.id)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide"
                          style={{ backgroundColor: '#C1121F22', color: '#C1121F', border: '1px solid #C1121F44' }}
                        >
                          ✕ Reject Payment
                        </button>
                      </>
                    )}

                    {/* Order status advance */}
                    {nextStatus[order.status] && (
                      <button
                        onClick={() => advance(order)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide"
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

      {/* Screenshot lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="Payment screenshot" className="max-w-full max-h-[90vh] rounded-2xl object-contain" />
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
            style={{ backgroundColor: '#1A1A1A', color: '#F5F0E8' }}
            onClick={() => setLightbox(null)}
          >×</button>
        </div>
      )}
    </AdminLayout>
  )
}
