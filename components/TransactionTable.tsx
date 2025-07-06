'use client';

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { animate, stagger } from "animejs";

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  description: string;
  type: "income" | "expense";
};

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.transactions || []);
        setLoading(false);

      animate(".transaction-row", {
      opacity: [0, 1],
      translateY: [20, 0],
      easing: "easeOutExpo",
      delay: stagger(50), // ✅ now works
      duration: 400,
      });
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load transactions.</p>;
  if (transactions.length === 0) return <p className="text-center">No transactions yet, add your first transaction.</p>;

  return (
    <div className="mt-10 max-w-4xl mx-auto overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx._id} className="transaction-row">
              <TableCell>${tx.amount.toFixed(2)}</TableCell>
              <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
              <TableCell>{tx.description}</TableCell>
              <TableCell className={tx.type === "income" ? "text-green-600" : "text-red-500"}>
                {tx.type}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => handleDelete(tx._id)}>
                  Delete
                </Button>
                {/* Placeholder for Edit in future */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
