import { supabase } from './supabase'

// ── helpers ──────────────────────────────────────────────────

const MENU_FIELDS = `
  id, category, name, description, price,
  savingLabel:saving_label,
  image,
  isActive:is_active,
  createdAt:created_at,
  updatedAt:updated_at
`

const ORDER_FIELDS = `
  id,
  customerName:customer_name,
  customerPhone:customer_phone,
  notes, status, total,
  createdAt:created_at,
  updatedAt:updated_at,
  items:order_items (
    id, quantity, price,
    menuItem:menu_items ( id, name, category, price )
  )
`

const CONTACT_FIELDS = `
  id, name, contact, message,
  isRead:is_read,
  createdAt:created_at
`

function raise(error) {
  if (error) throw new Error(error.message)
}

// ── AUTH ─────────────────────────────────────────────────────

export const api = {
  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    raise(error)
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut()
    raise(error)
  },

  getSession: () => supabase.auth.getSession(),

  onAuthChange: (cb) => supabase.auth.onAuthStateChange(cb),

  // ── MENU (public) ───────────────────────────────────────────

  getMenu: async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select(MENU_FIELDS)
      .eq('is_active', true)
      .order('category')
      .order('id')
    raise(error)
    return data
  },

  // ── MENU (admin) ────────────────────────────────────────────

  getAllMenu: async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select(MENU_FIELDS)
      .order('category')
      .order('id')
    raise(error)
    return data
  },

  createMenuItem: async (item) => {
    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        category: item.category,
        name: item.name,
        description: item.description,
        price: item.price ?? null,
        saving_label: item.savingLabel ?? null,
        image: item.image,
        is_active: item.isActive ?? true,
      })
      .select(MENU_FIELDS)
      .single()
    raise(error)
    return data
  },

  updateMenuItem: async (id, item) => {
    const { data, error } = await supabase
      .from('menu_items')
      .update({
        category: item.category,
        name: item.name,
        description: item.description,
        price: item.price ?? null,
        saving_label: item.savingLabel ?? null,
        image: item.image,
        is_active: item.isActive ?? true,
      })
      .eq('id', id)
      .select(MENU_FIELDS)
      .single()
    raise(error)
    return data
  },

  deleteMenuItem: async (id) => {
    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    raise(error)
  },

  // ── ORDERS (public) ─────────────────────────────────────────

  placeOrder: async ({ customerName, customerPhone, notes, items }) => {
    // Fetch live prices to calculate total server-side
    const menuIds = items.map((i) => i.menuItemId)
    const { data: menuItems, error: menuErr } = await supabase
      .from('menu_items')
      .select('id, price')
      .in('id', menuIds)
      .eq('is_active', true)
    raise(menuErr)

    const priceMap = Object.fromEntries(menuItems.map((m) => [m.id, m.price ?? 0]))
    const total = items.reduce((sum, i) => sum + (priceMap[i.menuItemId] ?? 0) * i.quantity, 0)

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({ customer_name: customerName, customer_phone: customerPhone, notes: notes ?? null, total })
      .select('id')
      .single()
    raise(orderErr)

    const { error: itemsErr } = await supabase.from('order_items').insert(
      items.map((i) => ({
        order_id: order.id,
        menu_item_id: i.menuItemId,
        quantity: i.quantity,
        price: priceMap[i.menuItemId] ?? 0,
      }))
    )
    raise(itemsErr)

    return order
  },

  // ── ORDERS (admin) ──────────────────────────────────────────

  getOrders: async (status) => {
    let q = supabase.from('orders').select(ORDER_FIELDS).order('created_at', { ascending: false })
    if (status) q = q.eq('status', status)
    const { data, error } = await q
    raise(error)
    return data
  },

  updateOrderStatus: async (id, status) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select('id, status')
      .single()
    raise(error)
    return data
  },

  getOrderStats: async () => {
    const [{ count: total }, { count: pending }, { data: revenue }] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('orders').select('total').neq('status', 'cancelled'),
    ])
    const revenueTotal = revenue?.reduce((s, r) => s + (r.total ?? 0), 0) ?? 0
    return { total: total ?? 0, pending: pending ?? 0, revenue: revenueTotal }
  },

  // ── CONTACTS (public) ───────────────────────────────────────

  submitContact: async ({ name, contact, message }) => {
    const { data, error } = await supabase
      .from('contacts')
      .insert({ name, contact, message })
      .select(CONTACT_FIELDS)
      .single()
    raise(error)
    return data
  },

  // ── CONTACTS (admin) ────────────────────────────────────────

  getContacts: async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select(CONTACT_FIELDS)
      .order('created_at', { ascending: false })
    raise(error)
    return data
  },

  markContactRead: async (id) => {
    const { data, error } = await supabase
      .from('contacts')
      .update({ is_read: true })
      .eq('id', id)
      .select(CONTACT_FIELDS)
      .single()
    raise(error)
    return data
  },

  getContactStats: async () => {
    const [{ count: total }, { count: unread }] = await Promise.all([
      supabase.from('contacts').select('*', { count: 'exact', head: true }),
      supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('is_read', false),
    ])
    return { total: total ?? 0, unread: unread ?? 0 }
  },
}
