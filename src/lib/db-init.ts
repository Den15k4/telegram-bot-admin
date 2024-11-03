// src/lib/db-init.ts
import { pool } from './db';
import bcrypt from 'bcryptjs';

export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Проверяем существование таблицы
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'admin_users'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log('Creating admin_users table...');
      
      // Создаем таблицу
      await client.query(`
        CREATE TABLE admin_users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('admin', 'support', 'viewer')),
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMPTZ
        );
      `);

      // Создаем первого администратора
      const defaultEmail = 'admin@example.com';
      const defaultPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      await client.query(`
        INSERT INTO admin_users (email, password_hash, role)
        VALUES ($1, $2, $3)
        ON CONFLICT (email) DO NOTHING;
      `, [defaultEmail, hashedPassword, 'admin']);

      console.log('Default admin user created');
    }

    await client.query('COMMIT');
    console.log('Database initialization completed');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}
