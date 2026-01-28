import type { CustomerWithBalance } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone } from 'lucide-react';

export function CustomerHeader({
  customer,
}: {
  customer: CustomerWithBalance;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">{customer.name}</CardTitle>
            <CardDescription>
              Customer since{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            </CardDescription>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p
              className={`text-3xl font-bold ${
                customer.balance > 0
                  ? 'text-destructive'
                  : customer.balance < 0
                  ? 'text-green-600'
                  : 'text-foreground'
              }`}
            >
              {formatCurrency(customer.balance)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{customer.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{customer.phone}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
