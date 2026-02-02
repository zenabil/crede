import { EditSupplierForm } from './edit-supplier-form';
import { FormDialog } from '@/components/forms/form-dialog';
import type { Supplier } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

export function EditSupplierDialog({
  supplier
}: {
  supplier: Supplier;
}) {
  return (
    <FormDialog
      title="Modifier le fournisseur"
      description="Mettez à jour les informations du fournisseur ci-dessous."
      trigger={
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      }
      form={<EditSupplierForm supplier={supplier} />}
    />
  );
}
