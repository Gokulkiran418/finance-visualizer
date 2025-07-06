'use client';
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "@/lib/validation/transaction";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { animate } from "animejs";

type TransactionFormData = z.infer<typeof transactionSchema>;
type Props = {
  onSuccess: () => void;
};

export default function TransactionForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense", // ✅ set default here
    },
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

   const onSubmit = async (data: TransactionFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error");

      setStatus("success");
      reset();
      onSuccess(); // 👈 trigger table refresh

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

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Adding..." : "Add Transaction"}
      </Button>

      <p id="formSuccess" className="text-green-500 text-sm opacity-0">
        Transaction added successfully!
      </p>
      {status === "error" && (
        <p className="text-red-500 text-sm">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
