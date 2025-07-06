'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { animate } from 'animejs';

type DataPoint = {
  category: string;
  budget: number;
  spent: number;
};
type Props = {
  refreshTrigger?: boolean;
};


export default function BudgetVsActualChart({ refreshTrigger }: Props) {
  const [data, setData] = useState<DataPoint[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/expenses/budget-vs-actual')
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        animate('.bar-vs-actual', {
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 600,
          easing: 'easeOutExpo',
          delay: 100,
        });
      })
      .catch(() => setError(true));
  }, [refreshTrigger]); // ✅ Triggers on change

  if (error) return <p className="text-center text-red-500">Failed to load budget vs actual chart.</p>;
  if (data.length === 0) return <p className="text-center">No budget data available.</p>;

  return (
    <Card className="p-8 w-full max-w-7xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6">Budget vs Actual (This Month)</h2>
      <div className="w-full h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#6366f1" className="bar-vs-actual" radius={[4, 4, 0, 0]} />
            <Bar dataKey="spent" fill="#ef4444" className="bar-vs-actual" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
