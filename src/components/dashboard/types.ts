import type { LucideIcon } from 'lucide-react';

export type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
};

export type TrendPoint = {
  id: string;
  label: string;
  totalHours: number;
  billableHours: number;
};

export type ProjectBreakdownItem = {
  id: string;
  name: string;
  client?: string;
  trackedHours: number;
  budgetHours: number;
};

export type DashboardEntryRow = {
  id: string;
  project: string;
  task: string;
  member: string;
  dateLabel: string;
  durationLabel: string;
  billable: boolean;
};

export type DashboardQuickAction = {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
};
