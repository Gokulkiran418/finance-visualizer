'use client';

import { useEffect, useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionTable from "@/components/TransactionTable";
import MonthlyExpensesChart from "@/components/MonthlyExpensesChart";
import CategoryManager from "@/components/CategoryManager";
import BudgetManager from "@/components/BudgetManager"; // 👈 Import BudgetManager
import { animate } from "animejs";

type Category = {
  _id: string;
  name: string;
};

export default function Home() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleRefresh = () => {
    setRefreshFlag((prev) => !prev);
    fetchCategories(); // 👈 Refresh categories along with transactions
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    animate("h1", {
      opacity: [0, 1],
      translateY: [40, 0],
      easing: "easeOutExpo",
      duration: 800,
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 pt-24 space-y-10">
      <h1 className="text-4xl font-bold mb-4">Personal Finance Visualizer</h1>

      <CategoryManager onChange={fetchCategories} />
      <TransactionForm onSuccess={handleRefresh} categories={categories} />
      <TransactionTable refreshTrigger={refreshFlag} />
      <MonthlyExpensesChart refreshTrigger={refreshFlag} />
      <BudgetManager />
    </main>
  );
}
