'use client';

import { useEffect, useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionTable from "@/components/TransactionTable";
import MonthlyExpensesChart from "@/components/MonthlyExpensesChart";
import { animate } from "animejs";

export default function Home() {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleRefresh = () => {
    setRefreshFlag((prev) => !prev); // toggling to trigger useEffect
  };

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
      <TransactionForm onSuccess={handleRefresh} />
      <TransactionTable refreshTrigger={refreshFlag} />
      <MonthlyExpensesChart />
    </main>
  );
}
