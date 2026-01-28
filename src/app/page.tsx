import { db } from '@/lib/data';
import { AddCustomerDialog } from '@/components/customers/add-customer-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Users, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { CustomerOverview } from '@/components/customers/customer-overview';

export default async function DashboardPage() {
  const customers = await db.getCustomers();

  const totalCustomers = customers.length;
  const totalBalance = customers.reduce(
    (acc, customer) => acc + customer.balance,
    0
  );
  const customersInDebt = customers.filter((c) => c.balance > 0).length;
  const customersWithCredit = customers.filter((c) => c.balance < 0).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Tableau de bord
        </h1>
        <AddCustomerDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total des clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Tous les clients enregistrés
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solde total impayé
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Somme de tous les soldes clients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clients endettés
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{customersInDebt}</div>
            <p className="text-xs text-muted-foreground">
              Clients qui doivent de l'argent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clients avec crédit
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersWithCredit}</div>
            <p className="text-xs text-muted-foreground">
              Clients avec un solde négatif
            </p>
          </CardContent>
        </Card>
      </div>

      <CustomerOverview customers={customers} />
    </div>
  );
}
