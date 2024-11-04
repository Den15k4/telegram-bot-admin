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

// src/app/api/broadcast/send/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN!);

export async function POST(req: Request) {
  try {
    const { message, filter } = await req.json();

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

    // Получаем пользователей
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true
      }
    });

    // Отправляем сообщения асинхронно
    users.forEach(async (user) => {
      try {
        await bot.telegram.sendMessage(user.id, message, {
          parse_mode: 'Markdown'
        });
        
        // Добавляем задержку чтобы не превысить лимиты Telegram
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`Error sending message to user ${user.id}:`, error);
      }
    });

    return NextResponse.json({
      success: true,
      recipientCount: users.length
    });
  } catch (error) {
    console.error('Error sending broadcast:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}