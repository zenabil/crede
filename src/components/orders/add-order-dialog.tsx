import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AddOrderForm } from './add-order-form';
import { FormDialog } from '@/components/forms/form-dialog';

export function AddOrderDialog() {
  return (
    <FormDialog
      title="Ajouter une commande"
      description="Remplissez les détails pour créer une nouvelle commande de pain."
      trigger={
        <Button id="add-order-btn">
          <PlusCircle />
          Ajouter une commande
        </Button>
      }
      form={<AddOrderForm />}
    />
  );
}
