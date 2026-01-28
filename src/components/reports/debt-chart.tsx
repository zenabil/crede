'use client';

import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import type { CustomerWithBalance } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { ChartTooltipContent } from '@/components/ui/chart';

export function DebtChart({ data }: { data: CustomerWithBalance[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
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
            cursor={{fill: 'hsl(var(--muted))'}}
            content={<ChartTooltipContent
                formatter={(value) => formatCurrency(value as number)}
                nameKey='balance'
            />}
        />
        <Bar dataKey="balance" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
