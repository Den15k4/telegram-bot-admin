// src/lib/create-admin-table.ts
const bcrypt = require('bcryptjs')
const prisma = require('./prisma-client')

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
    const adminCount = await prisma.$queryRaw`
      SELECT COUNT(*)::int as count FROM admin_users WHERE email = 'admin@example.com';
    `

    if (adminCount[0].count === 0) {
      console.log('Creating admin user...')
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      // Создаем администратора
      await prisma.$executeRaw`
        INSERT INTO admin_users (email, password_hash, role)
        VALUES ('admin@example.com', ${hashedPassword}, 'admin')
        ON CONFLICT (email) DO NOTHING;
      `
      console.log('Admin user created')
    } else {
      console.log('Admin user already exists')
    }

    console.log('Admin table setup completed')
  } catch (error) {
    console.error('Error creating admin table:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminTable()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })