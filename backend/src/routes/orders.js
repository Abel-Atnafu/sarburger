import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const VALID_STATUSES = ['pending', 'confirmed', 'ready', 'done', 'cancelled']

// Public: place an order
router.post('/', async (req, res) => {
  const { customerName, customerPhone, notes, items } = req.body
  if (!customerName || !customerPhone || !items?.length) {
    return res.status(400).json({ error: 'customerName, customerPhone, and items are required' })
  }

  // Fetch prices from DB to prevent tampering
  const menuIds = items.map((i) => i.menuItemId)
  const menuItems = await prisma.menuItem.findMany({ where: { id: { in: menuIds }, isActive: true } })
  const menuMap = Object.fromEntries(menuItems.map((m) => [m.id, m]))

  for (const item of items) {
    if (!menuMap[item.menuItemId]) {
      return res.status(400).json({ error: `Menu item ${item.menuItemId} not found` })
    }
  }

  const total = items.reduce((sum, item) => {
    const price = menuMap[item.menuItemId].price ?? 0
    return sum + price * (item.quantity ?? 1)
  }, 0)

  const order = await prisma.order.create({
    data: {
      customerName,
      customerPhone,
      notes: notes ?? null,
      total,
      items: {
        create: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity ?? 1,
          price: menuMap[item.menuItemId].price ?? 0,
        })),
      },
    },
    include: { items: { include: { menuItem: true } } },
  })

  res.status(201).json(order)
})

// Admin: list all orders
router.get('/', requireAuth, async (req, res) => {
  const { status } = req.query
  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { menuItem: true } } },
  })
  res.json(orders)
})

// Admin: update order status
router.patch('/:id/status', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id)
  const { status } = req.body
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` })
  }
  try {
    const order = await prisma.order.update({ where: { id }, data: { status } })
    res.json(order)
  } catch {
    res.status(404).json({ error: 'Order not found' })
  }
})

// Admin: dashboard stats
router.get('/stats', requireAuth, async (req, res) => {
  const [total, pending, revenue] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'cancelled' } } }),
  ])
  res.json({ total, pending, revenue: revenue._sum.total ?? 0 })
})

export default router
