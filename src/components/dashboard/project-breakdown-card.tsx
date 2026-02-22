'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { ProjectBreakdownItem } from './types';

interface DashboardProjectBreakdownCardProps {
  title: string;
  description?: string;
  items: ProjectBreakdownItem[];
}

export function DashboardProjectBreakdownCard({
  title,
  description,
  items,
}: DashboardProjectBreakdownCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const utilization =
            item.budgetHours <= 0
              ? 0
              : Math.min(
                  100,
                  Math.round((item.trackedHours / item.budgetHours) * 100),
                );
          return (
            <div key={item.id} className="space-y-2 rounded-md border p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  {item.client ? (
                    <p className="text-xs text-muted-foreground">
                      {item.client}
                    </p>
                  ) : null}
                </div>
                <Badge
                  variant={utilization >= 95 ? 'destructive' : 'secondary'}
                >
                  {item.trackedHours}h / {item.budgetHours}h
                </Badge>
              </div>
              <Progress value={utilization} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
