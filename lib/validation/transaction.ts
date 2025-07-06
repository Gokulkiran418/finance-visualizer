import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date",
  }),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
});