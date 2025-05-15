import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get orders from PreviousOrder model
    const orders = await prisma.previousOrder.findMany({
      where: {
        orderDate: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: {
        orderDate: 'asc',
      },
    });

    // Create array of last 7 days for complete data
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return date.toISOString().split('T')[0];
    }).reverse();

    // Group orders by day and calculate totals
    const groupedData = orders.reduce(
      (acc: { [key: string]: { total: number; count: number } }, order) => {
        const date = order.orderDate.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { total: 0, count: 0 };
        }
        acc[date].total += order.prixTotalPasse;
        acc[date].count += 1;
        return acc;
      },
      {}
    );

    // Format data with all days, including those with no orders
    const formattedData = days.map((date) => {
      const dayData = groupedData[date] || { total: 0, count: 0 };
      const average = dayData.count > 0 ? dayData.total / dayData.count : 0;

      return {
        date,
        standard: Math.round(average / 100), // Convert cents to euros
        premium: Math.round((average * 1.2) / 100), // 20% more for premium, convert to euros
        orderCount: dayData.count,
      };
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching average carts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch average cart stats' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
