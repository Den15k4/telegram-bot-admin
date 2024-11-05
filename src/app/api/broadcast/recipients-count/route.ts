import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { filter } = await req.json();

    // Формируем условия фильтрации
    const where: any = {};

    if (filter.hasCredits) {
      where.credits = {
        gt: 0
      };
    }

    if (filter.activeLastWeek) {
      where.last_used = {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      };
    }

    if (filter.hasReferrals) {
      where.total_referrals = {
        gt: 0
      };
    }

    // Получаем количество пользователей
    const count = await prisma.user.count({ where });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error counting recipients:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}