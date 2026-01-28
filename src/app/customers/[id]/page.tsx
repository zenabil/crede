'use client';

import { useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import type { Customer, Transaction } from '@/lib/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CustomerHeader } from '@/components/customers/customer-header';
import { TransactionsView } from '@/components/transactions/transactions-view';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CustomerDetailLoading from './loading';
import { useDocOnce } from '@/hooks/use-doc-once';
import { useCollectionOnce } from '@/hooks/use-collection-once';
import {
  getCustomerById,
  getTransactionsByCustomerId,
} from '@/lib/mock-data/api';

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const fetchCustomer = useCallback(() => {
    if (!id) return Promise.resolve(null);
    return getCustomerById(id);
  }, [id]);

  const fetchTransactions = useCallback(() => {
    if (!id) return Promise.resolve(null);
    return getTransactionsByCustomerId(id);
  }, [id]);

  const { data: customer, loading: customerLoading } =
    useDocOnce<Customer>(fetchCustomer);
  const { data: transactions, loading: transactionsLoading } =
    useCollectionOnce<Transaction>(fetchTransactions);

  const sortedTransactions = useMemo(() => {
    if (!transactions) return [];
    return [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions]);

  const loading = customerLoading || transactionsLoading;

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
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">
            <ArrowLeft />
            Retour aux clients
          </Link>
        </Button>
        <CustomerHeader customer={customer} />
      </div>
      <TransactionsView
        transactions={sortedTransactions}
        customerId={customer.id}
      />
    </div>
  );
}
