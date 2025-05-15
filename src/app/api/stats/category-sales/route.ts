import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all categories first
    const categories = await prisma.categorie.findMany();

    // Get orders from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get previous orders with their products
    const orders = await prisma.previousOrder.findMany({
      where: {
        orderDate: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        produit: {
          include: {
            categorie: true,
          },
        },
      },
    });

    // Calculate sales by category
    const salesByCategory = categories.map((category) => {
      const categoryTotal = orders.reduce((total, order) => {
        // Check if order's product belongs to this category
        if (order.produit.categorieId === category.id) {
          return total + order.prixUnitaire * order.quantite;
        }
        return total;
      }, 0);

      return {
        category: category.nom,
        value: Math.round(categoryTotal / 100), // Convert cents to euros
        orderCount: orders.filter(
          (order) => order.produit.categorieId === category.id
        ).length,
      };
    });

    // Filter out categories with no sales and sort by value
    const filteredSales = salesByCategory
      .filter((sale) => sale.value > 0)
      .sort((a, b) => b.value - a.value);

    return NextResponse.json(filteredSales);
  } catch (error) {
    console.error('Error fetching category sales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category sales stats' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
