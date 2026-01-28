'use client';

import { AddTransactionForm } from './add-transaction-form';
import type { TransactionType } from '@/lib/types';
import { FormDialog } from '@/components/forms/form-dialog';

export function AddTransactionDialog({
  type,
  customerId,
  children,
}: {
  type: TransactionType;
  customerId: string;
  children: React.ReactNode;
}) {
  const title =
    type === 'debt'
      ? 'Ajouter une nouvelle dette'
      : 'Ajouter un nouveau paiement';
  const description =
    type === 'debt'
      ? "Ajoutez une nouvelle dette due par le client. Cela augmentera le solde du client."
      : "Ajoutez un paiement reçu du client. Cela diminuera le solde du client.";

  return (
    <FormDialog
      title={title}
      description={description}
      trigger={children}
      form={<AddTransactionForm type={type} customerId={customerId} />}
    />
  );
}
