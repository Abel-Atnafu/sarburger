import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Public: get all active menu items
router.get('/', async (req, res) => {
  const items = await prisma.menuItem.findMany({
    where: { isActive: true },
    orderBy: [{ category: 'asc' }, { id: 'asc' }],
  })
  res.json(items)
})

// Admin: get all items including inactive
router.get('/all', requireAuth, async (req, res) => {
  const items = await prisma.menuItem.findMany({
    orderBy: [{ category: 'asc' }, { id: 'asc' }],
  })
  res.json(items)
})

// Admin: create item
router.post('/', requireAuth, async (req, res) => {
  const { category, name, description, price, savingLabel, image } = req.body
  if (!category || !name || !description || !image) {
    return res.status(400).json({ error: 'category, name, description, image are required' })
  }
  const item = await prisma.menuItem.create({
    data: { category, name, description, price: price ?? null, savingLabel: savingLabel ?? null, image },
  })
  res.status(201).json(item)
})

// Admin: update item
router.put('/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id)
  const { category, name, description, price, savingLabel, image, isActive } = req.body
  try {
    const item = await prisma.menuItem.update({
      where: { id },
      data: { category, name, description, price: price ?? null, savingLabel: savingLabel ?? null, image, isActive },
    })
    res.json(item)
  } catch {
    res.status(404).json({ error: 'Item not found' })
  }
})

// Admin: delete item
router.delete('/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    await prisma.menuItem.delete({ where: { id } })
    res.json({ ok: true })
  } catch {
    res.status(404).json({ error: 'Item not found' })
  }
})

export default router
