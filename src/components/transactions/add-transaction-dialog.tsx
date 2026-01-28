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
    type === 'debt' ? 'Enregistrer une nouvelle dette' : 'Enregistrer un nouveau paiement';
  const description =
    type === 'debt'
      ? "Ajoutez une nouvelle dette due par le client. Cela augmentera le solde du client."
      : "Enregistrez un paiement reçu du client. Cela diminuera le solde du client.";

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
