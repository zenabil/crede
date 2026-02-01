'use client';

import { useMemo } from 'react';
import { useMockData } from '@/hooks/use-mock-data';
import type { Customer, Transaction } from '@/lib/types';
import { AddCustomerDialog } from '@/components/customers/add-customer-dialog';
import { formatCurrency } from '@/lib/utils';
import { Users, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { CustomerOverview } from '@/components/customers/customer-overview';
import { StatCard } from '@/components/dashboard/stat-card';
import Loading from './loading';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';

export default function DashboardPage() {
  const { customers, transactions: rawTransactions, loading } = useMockData();

  const customersWithTotals = useMemo(() => {
    if (!customers || !rawTransactions) return [];

    const financialsByCustomer = rawTransactions.reduce((acc, t) => {
      if (!acc[t.customerId]) {
        acc[t.customerId] = { debts: 0, payments: 0 };
      }
      if (t.type === 'debt') {
        acc[t.customerId].debts += t.amount;
      } else {
        acc[t.customerId].payments += t.amount;
      }
      return acc;
    }, {} as Record<string, { debts: number; payments: number }>);

    return customers.map((customer) => ({
      ...customer,
      totalDebts: financialsByCustomer[customer.id]?.debts || 0,
      totalPayments: financialsByCustomer[customer.id]?.payments || 0,
    }));
  }, [customers, rawTransactions]);

  const { totalBalance, customersInDebt, customersWithCredit } = useMemo(() => {
    if (!customers) {
      return { totalBalance: 0, customersInDebt: 0, customersWithCredit: 0 };
    }

    return customers.reduce(
      (acc, customer) => {
        acc.totalBalance += customer.balance;
        if (customer.balance > 0) {
          acc.customersInDebt++;
        } else if (customer.balance < 0) {
          acc.customersWithCredit++;
        }
        return acc;
      },
      { totalBalance: 0, customersInDebt: 0, customersWithCredit: 0 }
    );
  }, [customers]);

  const totalCustomers = customers?.length || 0;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Tableau de bord
        </h1>
        <AddCustomerDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total des clients"
          value={totalCustomers}
          description="Tous les clients enregistrés"
          Icon={Users}
        />
        <StatCard
          title="Solde total impayé"
          value={formatCurrency(totalBalance)}
          description="Somme de tous les soldes clients"
          Icon={Wallet}
        />
        <StatCard
          title="Clients endettés"
          value={`+${customersInDebt}`}
          description="Clients qui doivent de l'argent"
          Icon={TrendingUp}
        />
        <StatCard
          title="Clients avec crédit"
          value={customersWithCredit}
          description="Clients avec un solde négatif"
          Icon={TrendingDown}
        />
      </div>

      <div className="flex flex-col gap-8">
        <CustomerOverview customers={customersWithTotals || []} />
        <RecentTransactions
          transactions={rawTransactions || []}
          customers={customers || []}
        />
      </div>
    </div>
  );
}
