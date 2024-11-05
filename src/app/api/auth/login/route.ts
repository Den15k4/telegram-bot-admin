import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

export async function POST(req: Request) {
  console.log('Login request received');
  
  try {
    const { email, password } = await req.json();
    console.log('Login attempt for:', email);

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
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    console.log('Login successful for:', email);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.createdAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}