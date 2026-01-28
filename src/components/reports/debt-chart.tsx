'use client';

import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip } from 'recharts';
import type { CustomerWithBalance } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  balance: {
    label: 'Balance',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function DebtChart({ data }: { data: CustomerWithBalance[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <RechartsBarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value as number)}
        />
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          content={
            <ChartTooltipContent
              formatter={(value) => formatCurrency(value as number)}
              nameKey="balance"
            />
          }
        />
        <Bar
          dataKey="balance"
          fill="var(--color-balance)"
          radius={[4, 4, 0, 0]}
        />
      </RechartsBarChart>
    </ChartContainer>
  );
}
