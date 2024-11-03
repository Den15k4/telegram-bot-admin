// src/lib/db-init.ts
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export async function initDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Проверяем существование админа
    const adminExists = await prisma.adminUser.findFirst({
      where: { role: 'admin' }
    });

    if (!adminExists) {
      console.log('Creating default admin user...');
      
      // Создаем первого администратора
      const defaultEmail = 'admin@example.com';
      const defaultPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      await prisma.adminUser.create({
        data: {
          email: defaultEmail,
          passwordHash: hashedPassword,
          role: 'admin'
        }
      });

      console.log('Default admin user created');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
