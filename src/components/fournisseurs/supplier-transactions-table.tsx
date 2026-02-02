import type { SupplierTransaction } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { EditSupplierTransactionDialog } from './edit-supplier-transaction-dialog';
import { DeleteSupplierTransactionDialog } from './delete-supplier-transaction-dialog';


export function SupplierTransactionsTable({
  transactions,
}: {
  transactions: SupplierTransaction[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead className="text-right no-print">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {transaction.description}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    transaction.type === 'purchase' ? 'destructive' : 'success'
                  }
                  className="capitalize"
                >
                  {transaction.type === 'purchase' ? (
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDownLeft className="mr-1 h-3 w-3" />
                  )}
                  {transaction.type === 'purchase' ? 'Achat' : 'Paiement'}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(transaction.date), 'dd MMM yyyy', {
                  locale: fr,
                })}
              </TableCell>
              <TableCell
                className={`text-right font-mono font-medium ${
                  transaction.type === 'purchase'
                    ? 'text-destructive'
                    : 'text-accent'
                }`}
              >
                {transaction.type === 'purchase' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell className="text-right no-print">
                <div className="flex items-center justify-end gap-0.5">
                  <EditSupplierTransactionDialog transaction={transaction} />
                  <DeleteSupplierTransactionDialog
                    transactionId={transaction.id}
                    transactionDescription={transaction.description}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
