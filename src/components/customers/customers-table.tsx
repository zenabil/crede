'use client';

import { useRouter } from 'next/navigation';
import type { CustomerWithBalance } from '@/lib/types';
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
import { ArrowRight } from 'lucide-react';

export function CustomersTable({
  customers,
}: {
  customers: CustomerWithBalance[];
}) {
  const router = useRouter();

  const handleRowClick = (customerId: string) => {
    router.push(`/customers/${customerId}`);
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead className="hidden sm:table-cell">Téléphone</TableHead>
            <TableHead className="text-right">Solde</TableHead>
            <TableHead>
              <span className="sr-only">Voir</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <TableRow
                key={customer.id}
                onClick={() => handleRowClick(customer.id)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {customer.phone}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      customer.balance > 0
                        ? 'destructive'
                        : customer.balance < 0
                        ? 'secondary'
                        : 'default'
                    }
                    className="font-mono"
                  >
                    {formatCurrency(customer.balance)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                Aucun client trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
