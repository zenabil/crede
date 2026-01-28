'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddTransactionForm } from './add-transaction-form';
import type { TransactionType } from '@/lib/types';

export function AddTransactionDialog({
  type,
  customerId,
  children,
}: {
  type: TransactionType;
  customerId: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const title =
    type === 'debt' ? 'Record New Debt' : 'Record New Payment';
  const description =
    type === 'debt'
      ? "Add a new debt owed by the customer. This will increase the customer's balance."
      : "Record a payment received from the customer. This will decrease the customer's balance.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AddTransactionForm
            type={type}
            customerId={customerId}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
