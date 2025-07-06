'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { animate, stagger } from 'animejs';

type Budget = {
  _id: string;
  category: string;
  amount: number;
};

export default function BudgetManager() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [newBudgets, setNewBudgets] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchBudgets = async () => {
    const res = await fetch('/api/budgets');
    const data = await res.json();
    setBudgets(data.budgets);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    const catNames = data.categories.map((cat: any) => cat.name);
    setCategories(catNames);
  };

  useEffect(() => {
    fetchCategories();
    fetchBudgets();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      animate(containerRef.current, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        easing: 'easeOutExpo',
      });
    }

    animate('.budget-row', {
      opacity: [0, 1],
      translateX: [-20, 0],
      delay: stagger(100),
      duration: 500,
      easing: 'easeOutExpo',
    });
  }, [categories]);

  const handleSave = async (category: string) => {
    setLoading(true);
    const amount = parseFloat(newBudgets[category]);

    const existing = budgets.find((b) => b.category === category);
    const method = existing ? 'PUT' : 'POST';
    const url = existing ? `/api/budgets/${existing._id}` : '/api/budgets';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, amount }),
    });

    setNewBudgets((prev) => ({ ...prev, [category]: '' }));
    await fetchBudgets();
    setLoading(false);
  };

  return (
    <Card
      ref={containerRef}
      className="p-6 w-full max-w-2xl mx-auto space-y-6 mt-10 opacity-0"
    >
      <h2 className="text-xl font-bold">Manage Monthly Budgets</h2>

      {categories.length === 0 ? (
        <p className="text-sm text-gray-500">No categories found.</p>
      ) : (
        <ul className="space-y-4">
          {categories.map((category) => {
            const existing = budgets.find((b) => b.category === category);
            return (
              <li key={category} className="space-y-2 budget-row opacity-0">
                <Label className="block text-sm font-medium">{category}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Monthly limit"
                    value={newBudgets[category] ?? existing?.amount ?? ''}
                    onChange={(e) =>
                      setNewBudgets((prev) => ({
                        ...prev,
                        [category]: e.target.value,
                      }))
                    }
                  />
                  <Button
                    onClick={() => handleSave(category)}
                    disabled={loading || !newBudgets[category]}
                  >
                    {existing ? 'Update' : 'Set'}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
