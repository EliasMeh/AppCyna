'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface SalesByDay {
  date: string;
  subscriptions: number;
}

interface AverageCart {
  date: string;
  standard: number;
  premium: number;
}

interface CategorySales {
  category: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DashboardStats = () => {
  const [salesByDay, setSalesByDay] = useState<SalesByDay[]>([]);
  const [averageCarts, setAverageCarts] = useState<AverageCart[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [salesResponse, cartsResponse, categoryResponse] =
          await Promise.all([
            fetch('/api/stats/sales-by-day'),
            fetch('/api/stats/average-carts'),
            fetch('/api/stats/category-sales'),
          ]);

        const sales = await salesResponse.json();
        const carts = await cartsResponse.json();
        const categories = await categoryResponse.json();

        setSalesByDay(sales);
        setAverageCarts(carts);
        setCategorySales(categories);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Daily Subscriptions */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Abonnements par jour</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="subscriptions" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Average Cart Values */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Paniers moyens</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={averageCarts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="standard" fill="#82ca9d" stackId="a" />
            <Bar dataKey="premium" fill="#8884d8" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Sales */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Ventes par catégories</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categorySales}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {categorySales.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardStats;
