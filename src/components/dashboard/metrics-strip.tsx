'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { DashboardMetric } from './types';

interface DashboardMetricsStripProps {
  metrics: DashboardMetric[];
}

export function DashboardMetricsStrip({ metrics }: DashboardMetricsStripProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              {metric.icon ? (
                <metric.icon className="size-4 text-muted-foreground" />
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-semibold tabular-nums">
              {metric.value}
            </p>
            {metric.delta ? (
              <Badge variant="secondary" className="gap-1">
                {metric.trend === 'down' ? (
                  <TrendingDown className="size-3" />
                ) : (
                  <TrendingUp className="size-3" />
                )}
                {metric.delta}
              </Badge>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
