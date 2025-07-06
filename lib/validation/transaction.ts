import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().positive(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  description: z.string().min(1),
  type: z.enum(["income", "expense"]),
});
