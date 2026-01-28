import { db } from '@/lib/data';
import { CustomersTable } from '@/components/customers/customers-table';
import { AddCustomerDialog } from '@/components/customers/add-customer-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const customers = await db.getCustomers();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Customers
        </h1>
        <AddCustomerDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomersTable customers={customers} />
        </CardContent>
      </Card>
    </div>
  );
}
