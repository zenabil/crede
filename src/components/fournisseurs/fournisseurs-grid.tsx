import type { Supplier } from '@/lib/types';
import { FournisseurCard } from './fournisseur-card';

export function FournisseursGrid({
  suppliers,
  selectedSupplierIds,
  onSelectionChange,
}: {
  suppliers: Supplier[];
  selectedSupplierIds: string[];
  onSelectionChange: (supplierId: string, checked: boolean | 'indeterminate') => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {suppliers.map((supplier) => (
        <FournisseurCard
          key={supplier.id}
          supplier={supplier}
          isSelected={selectedSupplierIds.includes(supplier.id)}
          onSelectionChange={(checked) => onSelectionChange(supplier.id, checked)}
        />
      ))}
    </div>
  );
}
