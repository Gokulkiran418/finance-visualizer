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
type Props = {
  refreshTrigger: boolean;
};

export default function TransactionTable({ refreshTrigger }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async (pageNum: number) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/transactions?page=${pageNum}&limit=5`);
      const data = await res.json();
      setTransactions(data.transactions || []);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setLoading(false);

     animate(".transaction-row", {
      opacity: [0, 1],
      translateY: [20, 0],
      easing: "easeOutExpo",
      delay: stagger(40, { start: 100 }),
      duration: 400,
      });
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page, refreshTrigger]);

  const handleDelete = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    fetchData(page); // Refresh current page
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load transactions.</p>;
  if (transactions.length === 0) return <p className="text-center">No transactions yet, add your first transaction.</p>;

  return (
    <div className="mt-10 max-w-4xl mx-auto overflow-x-auto space-y-4">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
