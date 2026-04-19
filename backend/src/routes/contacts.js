import { Router } from 'express'
import nodemailer from 'nodemailer'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

function makeTransport() {
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your@gmail.com') return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}

// Public: submit contact form
router.post('/', async (req, res) => {
  const { name, contact, message } = req.body
  if (!name || !contact || !message) {
    return res.status(400).json({ error: 'name, contact, and message are required' })
  }

  const entry = await prisma.contact.create({ data: { name, contact, message } })

  // Send email notification if SMTP is configured
  const transport = makeTransport()
  if (transport) {
    try {
      await transport.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.NOTIFY_EMAIL,
        subject: `New message from ${name}`,
        text: `Name: ${name}\nContact: ${contact}\n\n${message}`,
      })
    } catch (err) {
      console.error('Email send failed:', err.message)
    }
  }

  res.status(201).json(entry)
})

// Admin: list contacts
router.get('/', requireAuth, async (req, res) => {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(contacts)
})

// Admin: mark as read
router.patch('/:id/read', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const entry = await prisma.contact.update({ where: { id }, data: { isRead: true } })
    res.json(entry)
  } catch {
    res.status(404).json({ error: 'Contact not found' })
  }
})

// Admin: stats (unread count)
router.get('/stats', requireAuth, async (req, res) => {
  const [total, unread] = await Promise.all([
    prisma.contact.count(),
    prisma.contact.count({ where: { isRead: false } }),
  ])
  res.json({ total, unread })
})

export default router
