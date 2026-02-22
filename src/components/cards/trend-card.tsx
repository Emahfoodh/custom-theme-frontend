'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TrendPoint } from '../dashboard/types';

interface DashboardTrendCardProps {
  title: string;
  description?: string;
  data: TrendPoint[];
  periods: string[];
  selectedPeriod: string;
  onPeriodChange: (value: string) => void;
}

export function DashboardTrendCard({
  title,
  description,
  data,
  periods,
  selectedPeriod,
  onPeriodChange,
}: DashboardTrendCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>
          <Select value={selectedPeriod} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={36} />
              <Tooltip
                cursor={{ stroke: 'var(--border)', strokeDasharray: '4 4' }}
                contentStyle={{
                  backgroundColor: 'var(--popover)',
                  borderColor: 'var(--border)',
                  color: 'var(--popover-foreground)',
                  borderRadius: 'var(--radius)',
                }}
                labelStyle={{ color: 'var(--popover-foreground)' }}
                itemStyle={{ color: 'var(--popover-foreground)' }}
              />
              <Area
                type="monotone"
                dataKey="totalHours"
                name="Total"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.2}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: 'var(--primary)',
                  stroke: 'var(--background)',
                }}
              />
              <Area
                type="monotone"
                dataKey="billableHours"
                name="Billable"
                stroke="var(--secondary-foreground)"
                fill="var(--secondary-foreground)"
                fillOpacity={0.15}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: 'var(--secondary-foreground)',
                  stroke: 'var(--background)',
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
