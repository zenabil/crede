import { EditSupplierTransactionForm } from './edit-supplier-transaction-form';
import { FormDialog } from '@/components/forms/form-dialog';
import type { SupplierTransaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

export function EditSupplierTransactionDialog({
  transaction,
}: {
  transaction: SupplierTransaction;
}) {
  return (
    <FormDialog
      title="Modifier la transaction"
      description="Mettez à jour les informations de la transaction ci-dessous."
      trigger={
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Modifier la transaction</span>
        </Button>
      }
      form={<EditSupplierTransactionForm transaction={transaction} />}
    />
  );
}
