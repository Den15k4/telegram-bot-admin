import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    // Получаем общее количество пользователей
    const totalUsers = await prisma.user.count();

    // Получаем количество активных пользователей (использовали бота за последние 7 дней)
    const activeUsers = await prisma.user.count({
      where: {
        last_used: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Получаем статистику платежей
    const payments = await prisma.payment.findMany({
      where: {
        status: 'paid'
      }
    });

    const totalPayments = payments.length;
    const revenue = payments.reduce((acc, payment) => acc + Number(payment.amount), 0);

    // Сгенерируем данные по использованию за последние 30 дней
    const usageData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        users: Math.floor(Math.random() * 100),
        images: Math.floor(Math.random() * 200)
      };
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        totalPayments,
        revenue,
        processedImages: totalPayments * 3, // Примерная статистика
        averageCredits: totalUsers > 0 ? Math.round(totalPayments * 3 / totalUsers) : 0
      },
      usageData
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}