import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().min(0.01),
  date: z.string(),
  description: z.string().min(1),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
});