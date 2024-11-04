// src/lib/create-admin-table.ts
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminTable() {
  try {
    console.log('Starting admin table setup...')

    // Создаем таблицу с помощью raw SQL
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMPTZ
      );
    `

    console.log('Admin table created or already exists')

    // Проверяем существование админа
    const result = await prisma.$queryRaw`
      SELECT COUNT(*)::int as count FROM admin_users WHERE email = 'admin@example.com';
    `

    const count = result[0].count

    if (count === 0) {
      console.log('Creating admin user...')
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      // Создаем администратора
      await prisma.$executeRaw`
        INSERT INTO admin_users (email, password_hash, role)
        VALUES ('admin@example.com', ${hashedPassword}, 'admin')
        ON CONFLICT (email) DO NOTHING;
      `
      console.log('Admin user created successfully')
    } else {
      console.log('Admin user already exists')
    }

    console.log('Admin table setup completed')
  } catch (error) {
    console.error('Error during admin setup:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminTable()
  .catch((error) => {
    console.error('Fatal error during setup:', error)
    process.exit(1)
  })