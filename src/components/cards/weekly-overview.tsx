'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type WeeklyOverviewDay = {
  id: string;
  label: string;
  dateLabel: string;
  hours: number;
};

interface CardsWeeklyOverviewProps {
  totalHours: number;
  days: WeeklyOverviewDay[];
  onPreviousWeek?: () => void;
  onNextWeek?: () => void;
}

export function CardsWeeklyOverview({
  totalHours,
  days,
  onPreviousWeek,
  onNextWeek,
}: CardsWeeklyOverviewProps) {
  const maxHours = Math.max(...days.map((day) => day.hours), 1);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Weekly Overview</CardTitle>
            <CardDescription>
              Total tracked this week: {totalHours.toFixed(1)}h
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="size-8"
              onClick={onPreviousWeek}
              disabled={!onPreviousWeek}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-8"
              onClick={onNextWeek}
              disabled={!onNextWeek}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <div key={day.id} className="flex flex-col items-center gap-3">
              <div className="text-xs text-muted-foreground">{day.label}</div>
              <div className="text-xs font-medium">{day.dateLabel}</div>
              <div className="flex h-50 w-full items-end rounded-md bg-muted/30 p-1">
                <div
                  className="w-full rounded-sm bg-primary/80"
                  style={{ height: `${(day.hours / maxHours) * 100}%` }}
                />
              </div>
              <div className="text-xs tabular-nums">{day.hours}h</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
