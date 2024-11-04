// prisma/init.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Starting database initialization...')

    // Создаем первого администратора
    const defaultEmail = 'admin@example.com'
    const defaultPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)

    const user = await prisma.adminUser.upsert({
      where: { email: defaultEmail },
      update: {},
      create: {
        email: defaultEmail,
        passwordHash: hashedPassword,
        role: 'admin'
      }
    })

    console.log('Admin user created or updated:', user)
  } catch (error) {
    console.error('Error during initialization:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()