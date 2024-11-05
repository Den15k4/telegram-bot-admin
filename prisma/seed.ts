// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const seedPrisma = new PrismaClient();

async function main() {
  try {
    // Проверяем существование админа
    const adminCount = await seedPrisma.adminUser.count();
    
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Создаем первого администратора
      await seedPrisma.adminUser.create({
        data: {
          email: 'admin@example.com',
          passwordHash: hashedPassword,
          role: 'admin'
        }
      });

      console.log('Default admin user created');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during database seed:', error);
    throw error;
  } finally {
    await seedPrisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await seedPrisma.$disconnect();
  });