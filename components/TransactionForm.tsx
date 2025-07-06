'use client';

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "@/lib/validation/transaction";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { animate } from "animejs";

type TransactionFormData = z.infer<typeof transactionSchema>;

type Props = {
  onSuccess: () => void;
  defaultValues?: TransactionFormData & { _id?: string };
  mode?: "add" | "edit";
  categories: { _id: string; name: string }[]; // ✅ Receive from props
};

export default function TransactionForm({
  onSuccess,
  defaultValues,
  mode = "add",
  categories,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues || { type: "expense" },
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        setValue(key as keyof TransactionFormData, value as any);
      });
    }
  }, [defaultValues, setValue]);

  const onSubmit = async (data: TransactionFormData) => {
    setStatus("loading");
    try {
      const res = await fetch(
        mode === "edit" && defaultValues?._id
          ? `/api/transactions/${defaultValues._id}`
          : `/api/transactions`,
        {
          method: mode === "edit" ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error("Error");

      setStatus("success");
      reset();
      onSuccess();

      animate("#formSuccess", {
        opacity: [0, 1],
        translateY: [10, 0],
        easing: "easeOutExpo",
        duration: 500,
      });
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 max-w-md mx-auto">
      <div>
        <Label>Amount</Label>
        <Input type="number" step="0.01" {...register("amount", { valueAsNumber: true })} />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
      </div>

      <div>
        <Label>Date</Label>
        <Input type="date" {...register("date")} />
        {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
      </div>

      <div>
        <Label>Description</Label>
        <Input type="text" {...register("description")} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <Label>Type</Label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <RadioGroup onValueChange={field.onChange} value={field.value} defaultValue="expense">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income">Income</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense">Expense</Label>
              </div>
            </RadioGroup>
          )}
        />
        {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
      </div>

      <div>
        <Label>Category</Label>
        <select
          {...register("category")}
          className="w-full border border-gray-300 dark:border-zinc-700 rounded p-2"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
      </div>

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading"
          ? mode === "edit"
            ? "Updating..."
            : "Adding..."
          : mode === "edit"
          ? "Update Transaction"
          : "Add Transaction"}
      </Button>

      <p id="formSuccess" className="text-green-500 text-sm opacity-0">
        {mode === "edit" ? "Transaction updated successfully!" : "Transaction added successfully!"}
      </p>
      {status === "error" && (
        <p className="text-red-500 text-sm">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
