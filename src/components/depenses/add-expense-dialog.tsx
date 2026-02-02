import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddExpenseForm } from './add-expense-form';
import { FormDialog } from '@/components/forms/form-dialog';

export function AddExpenseDialog() {
  return (
    <FormDialog
      title="Ajouter une dépense"
      description="Remplissez les détails ci-dessous pour enregistrer une nouvelle dépense."
      trigger={
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Ajouter une dépense
        </Button>
      }
      form={<AddExpenseForm />}
    />
  );
}
