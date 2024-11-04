import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';

async function ensureAdminExists() {
  try {
    const adminCount = await prisma.adminUser.count();
    
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.adminUser.create({
        data: {
          email: 'admin@example.com',
          passwordHash: hashedPassword,
          role: 'admin'
        }
      });
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error ensuring admin exists:', error);
  }
}

export async function POST(req: Request) {
  try {
    // Создаем админа если его нет
    await ensureAdminExists();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }

    const user = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Неверные учетные данные' },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return NextResponse.json(
        { message: 'Неверные учетные данные' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.createdAt
      }
    });

  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}