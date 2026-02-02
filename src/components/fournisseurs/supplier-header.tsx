'use client';

import { useMemo } from 'react';
import type { Supplier, SupplierTransaction } from '@/lib/types';
import { formatCurrency, getBalanceColorClassName } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, WalletCards, HandCoins, Printer, Mail, Building } from 'lucide-react';
import { EditSupplierDialog } from './edit-supplier-dialog';
import { DeleteSupplierDialog } from './delete-supplier-dialog';

export function SupplierHeader({
  supplier,
  transactions,
  onDeleteSuccess,
}: {
  supplier: Supplier;
  transactions: SupplierTransaction[];
  onDeleteSuccess?: () => void;
}) {
  const { totalPurchases, totalPayments } = useMemo(() => {
    if (!transactions) return { totalPurchases: 0, totalPayments: 0 };
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'purchase') {
          acc.totalPurchases += transaction.amount;
        } else {
          acc.totalPayments += transaction.amount;
        }
        return acc;
      },
      { totalPurchases: 0, totalPayments: 0 }
    );
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <CardTitle>{supplier.name}</CardTitle>
            <CardDescription>
              Catégorie: {supplier.category}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-left sm:text-right">
              <p className="text-sm text-muted-foreground">Solde actuel</p>
              <p
                className={`text-3xl font-bold ${getBalanceColorClassName(
                  supplier.balance
                )}`}
              >
                {formatCurrency(supplier.balance)}
              </p>
            </div>
            <div className="flex items-center gap-1 border-l pl-4 no-print">
              <Button variant="outline" onClick={() => window.print()}>
                <Printer />
                Imprimer le relevé
              </Button>
              <EditSupplierDialog supplier={supplier} />
              <DeleteSupplierDialog
                supplierId={supplier.id}
                supplierName={supplier.name}
                onSuccess={onDeleteSuccess}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground border-t pt-4">
          {supplier.phone && <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{supplier.phone}</span>
          </div>}
          {supplier.contact && <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{supplier.contact}</span>
          </div>}
          <div className="flex items-center gap-2">
            <WalletCards className="h-4 w-4" />
            <span className="mr-1">Total des achats:</span>
            <span className="font-medium text-destructive">
              {formatCurrency(totalPurchases)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HandCoins className="h-4 w-4" />
            <span className="mr-1">Total des paiements:</span>
            <span className="font-medium text-accent">
              {formatCurrency(totalPayments)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
