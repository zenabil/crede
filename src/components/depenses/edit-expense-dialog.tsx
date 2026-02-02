import { EditExpenseForm } from './edit-expense-form';
import { FormDialog } from '@/components/forms/form-dialog';
import type { Expense } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

export function EditExpenseDialog({
  expense
}: {
  expense: Expense;
}) {
  return (
    <FormDialog
      title="Modifier la dépense"
      description="Mettez à jour les informations de la dépense ci-dessous."
      trigger={
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      }
      form={<EditExpenseForm expense={expense} />}
    />
  );
}
