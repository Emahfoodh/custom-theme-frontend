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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMemo } from 'react';

export type KpiSnapshotItem = {
  id: string;
  title: string;
  target: string;
  ratings: Record<string, number>;
};

interface CardsKpiSnapshotProps {
  roles: string[];
  selectedRole: string;
  onRoleChange: (role: string) => void;
  kpis: KpiSnapshotItem[];
}

export function CardsKpiSnapshot({
  roles,
  selectedRole,
  onRoleChange,
  kpis,
}: CardsKpiSnapshotProps) {
  const safeRatings = useMemo(
    () =>
      kpis.map((kpi) => ({
        ...kpi,
        rating: Number(kpi.ratings[selectedRole] ?? 0),
      })),
    [kpis, selectedRole],
  );

  const average = useMemo(() => {
    if (safeRatings.length === 0) return 0;
    const total = safeRatings.reduce((sum, kpi) => sum + kpi.rating, 0);
    return Number((total / safeRatings.length).toFixed(1));
  }, [safeRatings]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>KPI Snapshot</CardTitle>
            <CardDescription>
              View score signals by reviewer role.
            </CardDescription>
          </div>
          <Select value={selectedRole} onValueChange={onRoleChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-md border p-3">
          <p className="text-sm text-muted-foreground">
            {selectedRole} Overall
          </p>
          <Badge variant="outline" className="text-base font-semibold">
            {average} / 5
          </Badge>
        </div>
        {safeRatings.map((kpi) => {
          const rating = kpi.rating;
          return (
            <div key={kpi.id} className="space-y-2 rounded-md border p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{kpi.title}</p>
                  <p className="text-xs text-muted-foreground">{kpi.target}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums">
                  {rating.toFixed(1)}
                </span>
              </div>
              <Progress value={rating * 20} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
