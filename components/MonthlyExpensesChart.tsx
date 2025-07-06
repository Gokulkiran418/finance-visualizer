'use client';

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/card";
import { animate, stagger } from "animejs";

type ChartData = {
  month: string;
  total: number;
};
type Props = { refreshTrigger?: boolean };

export default function MonthlyExpensesChart({ refreshTrigger }: Props) {
  const [data, setData] = useState<ChartData[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/expenses/monthly")
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        animate(".bar", {
          opacity: [0, 1],
          translateY: [10, 0],
          easing: "easeOutExpo",
          delay: stagger(100),
        });
      })
      .catch(() => setError(true));
  }, [refreshTrigger]);

  if (error) return <p className="text-center text-red-500">Failed to load chart.</p>;
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-center">No expense data available.</p>;
  }

  return (
    <Card className="p-8 mt-10 w-full max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Monthly Expenses</h2>
      <div className="w-full h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar
            dataKey="total"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            className="bar"
            barSize={Math.max(20, 300 / data.length)} // Scales down as months increase
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
