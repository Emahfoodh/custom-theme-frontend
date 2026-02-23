'use client';

import { DashboardTrendCard } from '@/components/cards/trend-card';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { DashboardMetricsStrip } from '@/components/dashboard/metrics-strip';
import { DashboardProjectBreakdownCard } from '@/components/dashboard/project-breakdown-card';
import { DashboardQuickActions } from '@/components/dashboard/quick-actions';
import {
  DashboardRecentEntriesCard,
  type BillingFilter,
} from '@/components/dashboard/recent-entries-card';
import { SiteHeader } from '@/components/dashboard/site-header';
import type {
  DashboardEntryRow,
  DashboardMetric,
  DashboardQuickAction,
  ProjectBreakdownItem,
  TrendPoint,
} from '@/components/dashboard/types';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import {
  CalendarPlus2,
  Clock3,
  Download,
  FolderKanban,
  Plus,
  ReceiptText,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const periodOptions = ['Week', 'Month', 'Quarter'];

const metrics: DashboardMetric[] = [
  {
    id: 'm1',
    label: 'Tracked Hours',
    value: '38h 20m',
    delta: '+12%',
    trend: 'up',
    icon: Clock3,
  },
  {
    id: 'm2',
    label: 'Billable Ratio',
    value: '76%',
    delta: '+4%',
    trend: 'up',
    icon: ReceiptText,
  },
  {
    id: 'm3',
    label: 'Active Projects',
    value: '8',
    delta: '+2',
    trend: 'up',
    icon: FolderKanban,
  },
  {
    id: 'm4',
    label: 'Open Entries',
    value: '5',
    delta: '-1',
    trend: 'down',
    icon: CalendarPlus2,
  },
];

const trendByPeriod: Record<string, TrendPoint[]> = {
  Week: [
    { id: 'w1', label: 'Mon', totalHours: 5.5, billableHours: 4.1 },
    { id: 'w2', label: 'Tue', totalHours: 7.3, billableHours: 5.7 },
    { id: 'w3', label: 'Wed', totalHours: 8.0, billableHours: 6.2 },
    { id: 'w4', label: 'Thu', totalHours: 7.2, billableHours: 5.4 },
    { id: 'w5', label: 'Fri', totalHours: 5.3, billableHours: 4.0 },
    { id: 'w6', label: 'Sat', totalHours: 3.3, billableHours: 2.1 },
    { id: 'w7', label: 'Sun', totalHours: 2.1, billableHours: 1.3 },
  ],
  Month: [
    { id: 'm1', label: 'W1', totalHours: 34, billableHours: 24 },
    { id: 'm2', label: 'W2', totalHours: 38, billableHours: 29 },
    { id: 'm3', label: 'W3', totalHours: 36, billableHours: 27 },
    { id: 'm4', label: 'W4', totalHours: 42, billableHours: 31 },
  ],
  Quarter: [
    { id: 'q1', label: 'Jan', totalHours: 152, billableHours: 118 },
    { id: 'q2', label: 'Feb', totalHours: 164, billableHours: 125 },
    { id: 'q3', label: 'Mar', totalHours: 149, billableHours: 111 },
  ],
};

const projectsByPeriod: Record<string, ProjectBreakdownItem[]> = {
  Week: [
    {
      id: 'pr1',
      name: 'Acme Website Revamp',
      client: 'Acme Inc.',
      trackedHours: 42,
      budgetHours: 60,
    },
    {
      id: 'pr2',
      name: 'Internal Dashboard',
      client: 'RainTrack Ops',
      trackedHours: 27,
      budgetHours: 40,
    },
    {
      id: 'pr3',
      name: 'Mobile MVP',
      client: 'Nimble Labs',
      trackedHours: 19,
      budgetHours: 20,
    },
  ],
  Month: [
    {
      id: 'pr1',
      name: 'Acme Website Revamp',
      client: 'Acme Inc.',
      trackedHours: 128,
      budgetHours: 180,
    },
    {
      id: 'pr2',
      name: 'Internal Dashboard',
      client: 'RainTrack Ops',
      trackedHours: 106,
      budgetHours: 140,
    },
    {
      id: 'pr3',
      name: 'Mobile MVP',
      client: 'Nimble Labs',
      trackedHours: 84,
      budgetHours: 90,
    },
  ],
  Quarter: [
    {
      id: 'pr1',
      name: 'Acme Website Revamp',
      client: 'Acme Inc.',
      trackedHours: 355,
      budgetHours: 500,
    },
    {
      id: 'pr2',
      name: 'Internal Dashboard',
      client: 'RainTrack Ops',
      trackedHours: 284,
      budgetHours: 360,
    },
    {
      id: 'pr3',
      name: 'Mobile MVP',
      client: 'Nimble Labs',
      trackedHours: 252,
      budgetHours: 270,
    },
  ],
};

const allEntries: DashboardEntryRow[] = [
  {
    id: 'e1',
    project: 'Acme Website Revamp',
    task: 'Frontend',
    member: 'You',
    dateLabel: 'Feb 22',
    durationLabel: '2h 10m',
    billable: true,
  },
  {
    id: 'e2',
    project: 'Internal Dashboard',
    task: 'Planning',
    member: 'You',
    dateLabel: 'Feb 22',
    durationLabel: '1h 35m',
    billable: false,
  },
  {
    id: 'e3',
    project: 'Mobile MVP',
    task: 'API Integration',
    member: 'Omar',
    dateLabel: 'Feb 21',
    durationLabel: '3h 05m',
    billable: true,
  },
  {
    id: 'e4',
    project: 'Acme Website Revamp',
    task: 'QA',
    member: 'Lina',
    dateLabel: 'Feb 21',
    durationLabel: '1h 10m',
    billable: true,
  },
  {
    id: 'e5',
    project: 'Internal Dashboard',
    task: 'Review',
    member: 'You',
    dateLabel: 'Feb 20',
    durationLabel: '0h 45m',
    billable: false,
  },
];

// ts-prune-ignore next
export default function DashboardDemo() {
  const [period, setPeriod] = useState('Week');
  const [search, setSearch] = useState('');
  const [billingFilter, setBillingFilter] = useState<BillingFilter>('all');

  const filteredEntries = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allEntries.filter((entry) => {
      if (billingFilter === 'billable' && !entry.billable) return false;
      if (billingFilter === 'non-billable' && entry.billable) return false;
      if (!q) return true;
      return (
        entry.project.toLowerCase().includes(q) ||
        entry.task.toLowerCase().includes(q) ||
        entry.member.toLowerCase().includes(q) ||
        entry.dateLabel.toLowerCase().includes(q)
      );
    });
  }, [billingFilter, search]);

  const quickActions: DashboardQuickAction[] = [
    { id: 'qa1', label: 'Add Manual Entry', icon: Plus, onClick: () => {} },
    {
      id: 'qa2',
      label: 'Create Project',
      icon: FolderKanban,
      onClick: () => {},
    },
    { id: 'qa3', label: 'Export Timesheet', icon: Download, onClick: () => {} },
  ];

  return (
    <SidebarProvider className="relative size-full min-h-0">
      <AppSidebar
        variant="inset"
        className="absolute inset-y-0 left-0 h-full"
      />
      <SidebarInset>
        <SiteHeader />
        <div className="@container grid w-full gap-4 p-4 md:gap-6 md:p-6">
          <DashboardMetricsStrip metrics={metrics} />

          <div className="grid items-start gap-4">
            <DashboardTrendCard
              title="Hours Trend"
              description="Compare total and billable time."
              data={trendByPeriod[period]}
              periods={periodOptions}
              selectedPeriod={period}
              onPeriodChange={setPeriod}
            />
          </div>

          <div className="grid items-start gap-4 xl:grid-cols-[1.5fr_1fr]">
            <DashboardRecentEntriesCard
              rows={filteredEntries}
              search={search}
              billingFilter={billingFilter}
              onSearchChange={setSearch}
              onBillingFilterChange={setBillingFilter}
            />
            <div className="grid gap-4">
              <DashboardProjectBreakdownCard
                title="Project Utilization"
                description="Tracked hours against budget."
                items={projectsByPeriod[period]}
              />
              <DashboardQuickActions actions={quickActions} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
