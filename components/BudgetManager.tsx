// components/BudgetManager.tsx
'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

type Budget = {
  _id: string;
  category: string;
  amount: number;
};

type Props = {
  onChange?: () => void; // ✅ Added prop
};

export default function BudgetManager({ onChange }: Props) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [newBudgets, setNewBudgets] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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

const handleSave = async (category: string) => {
  setLoading(true);
  const amount = parseFloat(newBudgets[category]);

  // Add current month in YYYY-MM format
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const existing = budgets.find((b) => b.category === category);
  const method = existing ? 'PUT' : 'POST';
  const url = existing ? `/api/budgets/${existing._id}` : '/api/budgets';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, amount, month }), // ✅ Add month
  });

  setNewBudgets((prev) => ({ ...prev, [category]: '' }));
  await fetchBudgets();
  setLoading(false);
  onChange?.(); // ✅ Notify parent after update
};


  return (
    <Card className="p-6 w-full max-w-2xl mx-auto space-y-6 mt-10">
      <h2 className="text-xl font-bold">Manage Monthly Budgets</h2>

      {categories.length === 0 ? (
        <p className="text-sm text-gray-500">No categories found.</p>
      ) : (
        <ul className="space-y-4">
          {categories.map((category) => {
            const existing = budgets.find((b) => b.category === category);
            return (
              <li key={category} className="space-y-2">
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
