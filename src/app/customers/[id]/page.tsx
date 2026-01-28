'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { collection, doc, query, where } from 'firebase/firestore';
import { useCollectionOnce, useDocOnce, useFirestore } from '@/firebase';
import type { Customer, Transaction } from '@/lib/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  CUSTOMERS_COLLECTION,
  TRANSACTIONS_COLLECTION,
} from '@/lib/firestore-collections';
import { CustomerHeader } from '@/components/customers/customer-header';
import { TransactionsView } from '@/components/transactions/transactions-view';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CustomerDetailLoading from './loading';

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const firestore = useFirestore();

  const customerRef = useMemo(() => {
    if (!firestore || !id) return null;
    return doc(firestore, CUSTOMERS_COLLECTION, id);
  }, [firestore, id]);

  const transactionsQuery = useMemo(() => {
    if (!firestore || !id) return null;
    const transactionsCollection = collection(
      firestore,
      TRANSACTIONS_COLLECTION
    );
    return query(transactionsCollection, where('customerId', '==', id));
  }, [firestore, id]);

  const { data: customer, loading: customerLoading } =
    useDocOnce<Customer>(customerRef);
  const { data: transactions, loading: transactionsLoading } =
    useCollectionOnce<Transaction>(transactionsQuery);

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
