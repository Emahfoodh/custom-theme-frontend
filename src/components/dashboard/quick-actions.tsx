'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { DashboardQuickAction } from './types';

interface DashboardQuickActionsProps {
  actions: DashboardQuickAction[];
}

export function DashboardQuickActions({ actions }: DashboardQuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common actions for day-to-day tracking workflow.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            className="justify-start"
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.icon ? <action.icon className="size-4" /> : null}
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
