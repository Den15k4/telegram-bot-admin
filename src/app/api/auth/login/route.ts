// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma-client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }

    // Проверяем существование пользователя
    const user = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Неверные учетные данные' },
        { status: 401 }
      );
    }

    // Проверяем пароль
    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return NextResponse.json(
        { message: 'Неверные учетные данные' },
        { status: 401 }
      );
    }

    // Обновляем время последнего входа
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Создаем JWT токен
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

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