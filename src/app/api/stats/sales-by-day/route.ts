import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    // Set to start of day
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const subscriptions = await prisma.subscription.findMany({
      where: {
        AND: [
          {
            startDate: {
              gte: sevenDaysAgo,
            },
          },
          {
            status: 'active',
          },
          {
            payments: {
              some: {
                status: 'succeeded',
              },
            },
          },
        ],
      },
      include: {
        payments: {
          where: {
            status: 'succeeded',
            createdAt: {
              gte: sevenDaysAgo,
            },
          },
          select: {
            amount: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    // Create array of last 7 days for complete data
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return date.toISOString().split('T')[0];
    }).reverse();

    // Group subscriptions by day with revenue
    const groupedData = subscriptions.reduce(
      (acc: { [key: string]: { count: number; revenue: number } }, sub) => {
        const date = sub.startDate.toISOString().split('T')[0]; // Changed from createdAt to startDate
        if (!acc[date]) {
          acc[date] = { count: 0, revenue: 0 };
        }
        acc[date].count += 1;
        acc[date].revenue += sub.payments[0]?.amount || 0;
        return acc;
      },
      {}
    );

    // Format data with all days, even those without sales
    const formattedData = days.map((date) => ({
      date,
      subscriptions: groupedData[date]?.count || 0,
      revenue: groupedData[date]?.revenue || 0,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching sales by day:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
