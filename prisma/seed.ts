// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    const adminExists = await prisma.adminUser.findFirst({
      where: { email: 'admin@example.com' }
    })

    if (!adminExists) {
      console.log('Creating default admin user...')
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      await prisma.adminUser.create({
        data: {
          email: 'admin@example.com',
          passwordHash: hashedPassword,
          role: 'admin'
        }
      })
      console.log('Default admin user created')
    } else {
      console.log('Admin user already exists')
    }
  } catch (error) {
    console.error('Error during seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })