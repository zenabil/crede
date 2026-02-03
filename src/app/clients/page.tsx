'use client';

import { useMemo, useState } from 'react';
import { useMockData } from '@/hooks/use-mock-data';
import type { Customer } from '@/lib/types';
import CustomersLoading from './loading';
import { AddCustomerDialog } from '@/components/customers/add-customer-dialog';
import { Input } from '@/components/ui/input';
import {
  Search,
  Users,
  List,
  LayoutGrid,
  Wallet,
  UserCheck,
  UserX,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomersGrid } from '@/components/customers/customers-grid';
import { CustomersTable } from '@/components/customers/customers-table';
import { StatCard } from '@/components/dashboard/stat-card';
import { formatCurrency } from '@/lib/utils';
import { CsvImportDialog } from '@/components/customers/csv-import-dialog';
import { exportCustomersToCsv } from '@/lib/mock-data/api';

type SortKey = keyof Customer;
type SortDirection = 'ascending' | 'descending';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export default function ClientsPage() {
  const { customers, transactions: rawTransactions, loading } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'createdAt',
    direction: 'descending',
  });

  const { totalCustomers, totalBalance, customersInDebt, customersWithCredit } =
    useMemo(() => {
      if (!customers)
        return {
          totalCustomers: 0,
          totalBalance: 0,
          customersInDebt: 0,
          customersWithCredit: 0,
        };
      return {
        totalCustomers: customers.length,
        totalBalance: customers.reduce((sum, c) => sum + c.balance, 0),
        customersInDebt: customers.filter((c) => c.balance > 0).length,
        customersWithCredit: customers.filter((c) => c.balance < 0).length,
      };
    }, [customers]);

  const customersWithTotals = useMemo(() => {
    if (!customers || !rawTransactions) return [];

    const financialsByCustomer = rawTransactions.reduce(
      (acc, t) => {
        if (!acc[t.customerId]) {
          acc[t.customerId] = { debts: 0, payments: 0 };
        }
        if (t.type === 'debt') {
          acc[t.customerId].debts += t.amount;
        } else {
          acc[t.customerId].payments += t.amount;
        }
        return acc;
      },
      {} as Record<string, { debts: number; payments: number }>
    );

    return customers.map((customer) => ({
      ...customer,
      totalDebts: financialsByCustomer[customer.id]?.debts || 0,
      totalPayments: financialsByCustomer[customer.id]?.payments || 0,
    }));
  }, [customers, rawTransactions]);

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredCustomers = useMemo(() => {
    let filtered = customersWithTotals.filter(
      (customer) =>
        (customer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a] as any;
      const bValue = b[sortConfig.key as keyof typeof b] as any;

      if (aValue === undefined || aValue === null)
        return sortConfig.direction === 'ascending' ? -1 : 1;
      if (bValue === undefined || bValue === null)
        return sortConfig.direction === 'ascending' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [customersWithTotals, searchTerm, sortConfig]);

  if (loading) {
    return <CustomersLoading />;
  }

  const hasCustomers = customers.length > 0;
  const hasResults = sortedAndFilteredCustomers.length > 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des Clients
        </h1>
        <p className="text-muted-foreground">
          Affichez, recherchez et gérez tous vos clients.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Clients" value={totalCustomers} icon={Users} />
        <StatCard
          title="Solde Total"
          value={formatCurrency(totalBalance)}
          description={totalBalance > 0 ? 'Dette globale' : 'Crédit global'}
          icon={Wallet}
        />
        <StatCard
          title="Clients en Dette"
          value={customersInDebt}
          icon={UserX}
        />
        <StatCard
          title="Clients avec Crédit"
          value={customersWithCredit}
          icon={UserCheck}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 justify-between">
          <div className="relative w-full sm:w-auto sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="customer-search-input"
              placeholder="Rechercher des clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
              disabled={!hasCustomers}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="h-8 w-8"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            <CsvImportDialog />
            <Button
              variant="outline"
              onClick={exportCustomersToCsv}
              disabled={!hasCustomers}
            >
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <AddCustomerDialog />
          </div>
        </div>
      </div>

      {hasResults ? (
        viewMode === 'grid' ? (
          <CustomersGrid customers={sortedAndFilteredCustomers} />
        ) : (
          <CustomersTable
            customers={sortedAndFilteredCustomers}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
        )
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-4">
          <Users className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-xl font-semibold">
              {hasCustomers
                ? 'Aucun client trouvé'
                : 'Aucun client pour le moment'}
            </h3>
            <p className="text-muted-foreground mt-2">
              {hasCustomers
                ? 'Essayez un autre terme de recherche.'
                : 'Cliquez sur le bouton "Ajouter un client" pour commencer.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
