import { db } from '@/lib/data';
import { StatsCards } from '@/components/reports/stats-cards';
import { DebtChart } from '@/components/reports/debt-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomersTable } from '@/components/customers/customers-table';

export default async function ReportsPage() {
  const reportData = await db.getReportData();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Reports
      </h1>
      <StatsCards data={reportData} />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Top Customer Debts</CardTitle>
          </CardHeader>
          <CardContent>
            <DebtChart
              data={reportData.customersWithDebt.slice(0, 5)}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Customers with Outstanding Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomersTable customers={reportData.customersWithDebt} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
