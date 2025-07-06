import { z } from "zod";

export const budgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"),
});

export type BudgetInput = z.infer<typeof budgetSchema>;
