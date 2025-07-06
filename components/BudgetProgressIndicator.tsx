'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { animate, stagger } from 'animejs';

type Budget = {
  category: string;
  amount: number;
};

type Spending = {
  category: string;
  spent: number;
};

type Props = {
  refreshTrigger?: boolean;
};

export default function BudgetProgressIndicator({ refreshTrigger }: Props) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [spending, setSpending] = useState<Spending[]>([]);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      const [budgetsRes, spendingRes] = await Promise.all([
        fetch('/api/budgets'),
        fetch('/api/expenses/summary-by-category'),
      ]);

      const budgetsJson = await budgetsRes.json();
      const spendingJson = await spendingRes.json();

      setBudgets(budgetsJson.budgets);
      setSpending(spendingJson.data);

      animate('.budget-progress-row', {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: stagger(100),
        duration: 500,
        easing: 'easeOutExpo',
      });
    } catch (err) {
      console.error('BudgetProgressIndicator fetch error:', err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  if (error) {
    return <p className="text-center text-red-500">Failed to load budget progress.</p>;
  }

  if (budgets.length === 0) {
    return <p className="text-center">No budgets available.</p>;
  }

  return (
    <Card className="p-6 mt-10 w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold">Budget Usage This Month</h2>

      {budgets.map((budget) => {
        const spent = spending.find((s) => s.category === budget.category)?.spent || 0;
        const percent = Math.min((spent / budget.amount) * 100, 100);

        // 🎨 Color class based on percentage
        let color = 'bg-green-500';
        if (percent >= 90) color = 'bg-red-500';
        else if (percent >= 70) color = 'bg-yellow-500';

        return (
          <div key={budget.category} className="space-y-1 budget-progress-row opacity-0">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{budget.category}</span>
              <span>
                ₹{spent.toFixed(2)} / ₹{budget.amount.toFixed(2)} ({Math.round(percent)}%)
              </span>
            </div>

            {/* 🔥 Colored progress wrapper */}
            <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${color}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </Card>
  );
}
