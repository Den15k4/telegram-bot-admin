const prisma = require('./prisma-client');
const bcrypt = require('bcryptjs');

async function createAdminTable() {
  try {
    // Проверяем существование админа
    const adminExists = await prisma.adminUser.findFirst({
      where: { email: 'admin@example.com' }
    });

    if (!adminExists) {
      console.log('Creating default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await prisma.adminUser.create({
        data: {
          email: 'admin@example.com',
          passwordHash: hashedPassword,
          role: 'admin'
        }
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

  } catch (error) {
    console.error('Error during setup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем создание
createAdminTable()
  .then(() => console.log('Setup complete'))
  .catch(console.error)
  .finally(() => process.exit(0));