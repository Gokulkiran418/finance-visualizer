'use client';

import { useEffect, useRef, useState } from "react";
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

type Props = {
  refreshTrigger?: boolean;
};

export default function MonthlyExpensesChart({ refreshTrigger }: Props) {
  const [data, setData] = useState<ChartData[]>([]);
  const [error, setError] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/expenses/monthly")
      .then((res) => res.json())
      .then((json) => {
        setData(json.data || []);

        // Animate bars
        animate(".bar", {
          opacity: [0, 1],
          translateY: [20, 0],
          easing: "easeOutExpo",
          delay: stagger(100, { start: 300 }),
        });

        // Animate chart container
        if (chartRef.current) {
          animate(chartRef.current, {
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 700,
            easing: "easeOutExpo",
          });
        }
      })
      .catch(() => setError(true));
  }, [refreshTrigger]);

  if (error) {
    return <p className="text-center text-red-500">Failed to load chart.</p>;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-center text-gray-500">No expense data available.</p>;
  }

  return (
    <Card
      ref={chartRef}
      className="p-6 lg:p-8 mt-10 w-full max-w-7xl mx-auto bg-white dark:bg-zinc-900 shadow-lg opacity-0"
    >
      <h2 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-zinc-100">
        Monthly Expenses
      </h2>
      <div className="w-full h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              wrapperStyle={{ backgroundColor: "#fff", borderRadius: "6px", fontSize: "14px" }}
              contentStyle={{ backgroundColor: "#f9fafb", borderColor: "#e5e7eb" }}
              cursor={{ fill: "#f3f4f6" }}
            />
            <Bar
              dataKey="total"
              fill="#ef4444"
              radius={[6, 6, 0, 0]}
              className="bar"
              barSize={Math.max(24, 300 / data.length)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
