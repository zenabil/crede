'use client';

import { useMemo } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import { useMockData } from '@/hooks/use-mock-data';
import type { Customer, Transaction } from '@/lib/types';
import Link from 'next/link';

import { CustomerHeader } from '@/components/customers/customer-header';
import { TransactionsView } from '@/components/transactions/transactions-view';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CustomerDetailLoading from './loading';
import { BalanceHistoryChart } from '@/components/customers/balance-history-chart';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { customers, transactions, loading } = useMockData();

  const customer = useMemo(() => {
    return customers.find(c => c.id === id);
  }, [customers, id]);

  const customerTransactions = useMemo(() => {
    return transactions
      .filter(t => t.customerId === id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, id]);


  const handleDeleteSuccess = () => {
    router.push('/clients');
  };

  if (loading) {
    return <CustomerDetailLoading />;
  }

  // After loading, if there's no customer, it's a 404
  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Button asChild variant="ghost" className="mb-4 no-print">
          <Link href="/clients">
            <ArrowLeft />
            Retour aux clients
          </Link>
        </Button>
        <CustomerHeader
          customer={customer}
          transactions={customerTransactions || []}
          onDeleteSuccess={handleDeleteSuccess}
        />
      </div>

      <BalanceHistoryChart
        customer={customer}
        transactions={customerTransactions || []}
        className="no-print"
      />

      <TransactionsView
        transactions={customerTransactions || []}
        customerId={customer.id}
        customerBalance={customer.balance}
      />
    </div>
  );
}
