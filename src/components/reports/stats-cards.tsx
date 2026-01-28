import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Users, CreditCard, Landmark, CircleDollarSign } from 'lucide-react';

type ReportData = {
  totalDebts: number;
  totalPayments: number;
  netBalance: number;
  customerCount: number;
};

export function StatsCards({ data }: { data: ReportData }) {
  const stats = [
    {
      title: 'Net Balance',
      value: formatCurrency(data.netBalance),
      icon: CircleDollarSign,
      description: 'Total debts minus total payments',
    },
    {
      title: 'Total Debts',
      value: formatCurrency(data.totalDebts),
      icon: CreditCard,
      description: 'Sum of all recorded debts',
    },
    {
      title: 'Total Payments',
      value: formatCurrency(data.totalPayments),
      icon: Landmark,
      description: 'Sum of all payments received',
    },
    {
      title: 'Total Customers',
      value: data.customerCount,
      icon: Users,
      description: 'Total number of customer profiles',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
