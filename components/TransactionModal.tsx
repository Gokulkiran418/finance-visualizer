'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TransactionForm from "@/components/TransactionForm";
import { type z } from "zod";
import { transactionSchema } from "@/lib/validation/transaction";

type TransactionFormData = z.infer<typeof transactionSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction?: TransactionFormData & { _id: string };
};

export default function TransactionModal({ open, onClose, onSuccess, transaction }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{transaction ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
        </DialogHeader>

        <TransactionForm
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
          defaultValues={transaction}
          mode={transaction ? "edit" : "add"}
        />
      </DialogContent>
    </Dialog>
  );
}
