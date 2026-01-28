import { EditTransactionForm } from './edit-transaction-form';
import { FormDialog } from '@/components/forms/form-dialog';
import type { Transaction } from '@/lib/types';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

export function EditTransactionDialog({
  transaction,
  buttonProps,
}: {
  transaction: Transaction;
  buttonProps?: Omit<ButtonProps, 'children' | 'onClick'>;
}) {
  return (
    <FormDialog
      title="Modifier la transaction"
      description="Mettez à jour les informations de la transaction ci-dessous."
      trigger={
        <Button variant="ghost" size="icon" {...buttonProps}>
          <Pencil />
          <span className="sr-only">Modifier la transaction</span>
        </Button>
      }
      form={<EditTransactionForm transaction={transaction} />}
    />
  );
}
