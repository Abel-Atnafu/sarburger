import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const menuItems = [
  { category: 'burgers', name: 'Classic Smash', description: 'Double smash patty, american cheese, pickles, special sauce', price: 280, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format' },
  { category: 'burgers', name: 'Spicy Volcano', description: 'Jalapeño, pepper jack, crispy onions, sriracha mayo', price: 320, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop&auto=format' },
  { category: 'burgers', name: 'BBQ Smokehouse', description: 'Pulled beef, cheddar, coleslaw, BBQ glaze', price: 350, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop&auto=format' },
  { category: 'burgers', name: 'Mushroom Swiss', description: 'Sautéed mushrooms, swiss cheese, garlic aioli', price: 300, image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop&auto=format' },
  { category: 'burgers', name: 'The OG', description: 'Simple classic: lettuce, tomato, onion, house sauce', price: 240, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop&auto=format' },
  { category: 'sides', name: 'Seasoned Fries', description: 'Crispy fries with our signature seasoning blend', price: 80, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&auto=format' },
  { category: 'sides', name: 'Loaded Fries', description: 'Cheese sauce, jalapeños, bacon bits', price: 140, image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&h=300&fit=crop&auto=format' },
  { category: 'sides', name: 'Onion Rings', description: 'Golden-fried rings with dipping sauce', price: 90, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop&auto=format' },
  { category: 'sides', name: 'Coleslaw', description: 'Fresh-cut cabbage in creamy house dressing', price: 60, image: 'https://images.unsplash.com/photo-1564834724105-918b73d2af9e?w=400&h=300&fit=crop&auto=format' },
  { category: 'drinks', name: 'Fresh Juice', description: 'Orange / Mango / Avocado — made fresh daily', price: 70, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop&auto=format' },
  { category: 'drinks', name: 'Soft Drinks', description: 'Coke, Fanta, Sprite — ice cold', price: 50, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop&auto=format' },
  { category: 'drinks', name: 'Milkshake', description: 'Vanilla / Chocolate / Strawberry — thick and creamy', price: 150, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop&auto=format' },
  { category: 'combos', name: 'Classic Combo', description: 'Any burger + seasoned fries + soft drink', price: null, savingLabel: 'Save 50 ETB', image: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=400&h=300&fit=crop&auto=format' },
  { category: 'combos', name: 'Feast Combo', description: 'Any burger + loaded fries + milkshake', price: null, savingLabel: 'Save 80 ETB', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&auto=format' },
]

async function main() {
  console.log('Seeding database...')

  // Create admin user — TODO: Change password before going live
  const hash = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@sarburger.com' },
    update: {},
    create: { email: 'admin@sarburger.com', passwordHash: hash },
  })
  console.log('Admin user: admin@sarburger.com / admin123')

  // Seed menu
  await prisma.menuItem.deleteMany()
  await prisma.menuItem.createMany({ data: menuItems })
  console.log(`Seeded ${menuItems.length} menu items`)

  console.log('Done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
