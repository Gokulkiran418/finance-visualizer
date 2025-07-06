// page.tsx
'use client';

import { useEffect, useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionTable from "@/components/TransactionTable";
import MonthlyExpensesChart from "@/components/MonthlyExpensesChart";
import CategoryManager from "@/components/CategoryManager";
import BudgetManager from "@/components/BudgetManager";
import { animate, stagger } from "animejs";
import BudgetVsActualChart from "@/components/BudgetVsActualChart";
import BudgetProgressIndicator from '@/components/BudgetProgressIndicator';


type Category = { _id: string; name: string };

export default function Home() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

 const handleRefresh = () => {
  setRefreshFlag((prev) => !prev);
  fetchCategories();
};

  useEffect(() => {
    fetchCategories();

    animate("h1", {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      easing: "easeOutQuad",
    });

    animate(".left-panel > *", {
      opacity: [0, 1],
      translateX: [-20, 0],
      duration: 500,
      delay: stagger(150, { start: 300 }),
      easing: "easeOutQuad",
    });

    animate(".right-panel > *", {
      opacity: [0, 1],
      translateX: [20, 0],
      duration: 500,
      delay: stagger(150, { start: 500 }),
      easing: "easeOutQuad",
    });
  }, []);

  return (
    <main className="min-h-screen p-6 pt-24 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 text-zinc-800 dark:text-zinc-100">
      <h1 className="text-4xl font-extrabold text-center mb-12">
        Personal Finance Visualizer
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left Panel */}
        <div className="left-panel flex flex-col gap-6">
          <BudgetManager onChange={handleRefresh} />
          <CategoryManager onChange={fetchCategories} />
        </div>

        {/* Right Panel */}
        <div className="right-panel flex flex-col gap-6">
          <TransactionForm onSuccess={handleRefresh} categories={categories} />
          <TransactionTable refreshTrigger={refreshFlag} />
          <MonthlyExpensesChart refreshTrigger={refreshFlag} />
          <BudgetProgressIndicator refreshTrigger={refreshFlag} />
            <BudgetVsActualChart refreshTrigger={refreshFlag} />

        </div>
      </div>
    </main>
  );
}
