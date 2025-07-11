'use client';

import { useEffect, useRef, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { animate, stagger } from "animejs";
import TransactionForm from "@/components/TransactionForm";
import { HiPencil, HiTrash } from "react-icons/hi";

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  description: string;
  type: "income" | "expense";
  category: string;
};

type Props = {
  refreshTrigger: boolean;
};

type Category = {
  _id: string;
  name: string;
};

export default function TransactionTable({ refreshTrigger }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const [typeFilter, setTypeFilter] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchData = async (pageNum: number) => {
    setLoading(true);
    setError(false);

    const params = new URLSearchParams({
      page: pageNum.toString(),
      limit: "5",
    });

    if (typeFilter) params.append("type", typeFilter);
    if (descriptionFilter) params.append("description", descriptionFilter);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (categoryFilter) params.append("category", categoryFilter);

    try {
      const res = await fetch(`/api/transactions?${params.toString()}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setLoading(false);

      // Animate rows
      animate(".transaction-row", {
        opacity: [0, 1],
        translateY: [20, 0],
        easing: "easeOutExpo",
        delay: stagger(40, { start: 200 }),
        duration: 400,
      });

      // Animate container
      if (containerRef.current) {
        animate(containerRef.current, {
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 700,
          easing: "easeOutExpo",
        });
      }
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page, refreshTrigger, typeFilter, descriptionFilter, startDate, endDate, categoryFilter]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data.categories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    fetchData(page);
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTx(null);
  };

  const handleEditSuccess = () => {
    handleCloseModal();
    fetchData(page);
  };

  const clearFilters = () => {
    setTypeFilter("");
    setDescriptionFilter("");
    setStartDate("");
    setEndDate("");
    setCategoryFilter("");
  };

  return (
    <div
      ref={containerRef}
      className="mt-10 max-w-4xl mx-auto overflow-x-auto space-y-4 opacity-0"
    >
      {/* Filter Toggle */}
      <div className="mb-4">
        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-zinc-800 rounded space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full mt-1 border rounded p-2 text-sm bg-white dark:bg-zinc-900"
                >
                  <option value="">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full mt-1 border rounded p-2 text-sm bg-white dark:bg-zinc-900"
                >
                  <option value="">All</option>
                  <option value="food">Food</option>
                  <option value="rent">Rent</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="utilities">Utilities</option>
                  <option value="salary">Salary</option>
                  <option value="shopping">Shopping</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  type="text"
                  value={descriptionFilter}
                  onChange={(e) => setDescriptionFilter(e.target.value)}
                  placeholder="Search..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Transaction Table */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Failed to load transactions.</p>
      ) : transactions.length === 0 ? (
        <p className="text-center">No transactions match your filters.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Modify</TableHead>
                <TableHead>Delete</TableHead>
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
                  <TableCell className="capitalize">{tx.category}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(tx)} className="flex items-center gap-1">
                      <HiPencil className="h-4 w-4" />
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(tx._id)}
                    >
                      <HiTrash className="h-5 w-5" />
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
        </>
      )}

      {/* Edit Modal */}
      {showModal && editingTx && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Transaction</h2>
            <TransactionForm
              defaultValues={editingTx}
              mode="edit"
              onSuccess={handleEditSuccess}
              categories={categories}
            />
            <Button variant="ghost" className="mt-4" onClick={handleCloseModal}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
