const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

function getToken() {
  return localStorage.getItem('sb_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? 'Request failed')
  }
  return res.json()
}

export const api = {
  // Auth
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),

  // Menu (public)
  getMenu: () => request('/api/menu'),
  // Menu (admin)
  getAllMenu: () => request('/api/menu/all'),
  createMenuItem: (data) => request('/api/menu', { method: 'POST', body: data }),
  updateMenuItem: (id, data) => request(`/api/menu/${id}`, { method: 'PUT', body: data }),
  deleteMenuItem: (id) => request(`/api/menu/${id}`, { method: 'DELETE' }),

  // Orders (public)
  placeOrder: (data) => request('/api/orders', { method: 'POST', body: data }),
  // Orders (admin)
  getOrders: (status) => request(`/api/orders${status ? `?status=${status}` : ''}`),
  updateOrderStatus: (id, status) => request(`/api/orders/${id}/status`, { method: 'PATCH', body: { status } }),
  getOrderStats: () => request('/api/orders/stats'),

  // Contacts (public)
  submitContact: (data) => request('/api/contacts', { method: 'POST', body: data }),
  // Contacts (admin)
  getContacts: () => request('/api/contacts'),
  markContactRead: (id) => request(`/api/contacts/${id}/read`, { method: 'PATCH' }),
  getContactStats: () => request('/api/contacts/stats'),
}
