// src/lib/create-admin-table.ts
import { prisma } from './prisma-client'
import bcrypt from 'bcryptjs'

async function createAdminTable() {
  try {
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

    // Проверяем существование админа
    const adminExists = await prisma.$executeRaw`
      SELECT COUNT(*) FROM admin_users WHERE email = 'admin@example.com';
    `

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      // Создаем администратора
      await prisma.$executeRaw`
        INSERT INTO admin_users (email, password_hash, role)
        VALUES ('admin@example.com', ${hashedPassword}, 'admin')
        ON CONFLICT (email) DO NOTHING;
      `
    }

    console.log('Admin table and user created successfully')
  } catch (error) {
    console.error('Error creating admin table:', error)
    throw error
  }
}

export { createAdminTable }