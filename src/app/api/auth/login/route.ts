import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  console.log('Login request received');
  
  try {
    const { email, password } = await req.json();
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { message: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }

    const user = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { message: 'Неверные учетные данные' },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      console.log('Invalid password');
      return NextResponse.json(
        { message: 'Неверные учетные данные' },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set');
      throw new Error('JWT_SECRET is not configured');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    const response = {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.createdAt
      }
    };

    console.log('Login successful, sending response');

    // Устанавливаем cookie с токеном
    const cookieResponse = NextResponse.json(response);
    cookieResponse.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return cookieResponse;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}