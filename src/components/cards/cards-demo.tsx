'use client';

import {
  CardsKpiSnapshot,
  type KpiSnapshotItem,
} from '@/components/cards/kpi-snapshot';
import {
  CardsRecentEntries,
  type RecentTimeEntry,
} from '@/components/cards/recent-entries';
import {
  CardsRunningTimer,
  type TimerProject,
} from '@/components/cards/running-timer';
import {
  CardsWeeklyOverview,
  type WeeklyOverviewDay,
} from '@/components/cards/weekly-overview';
import { DashboardMetricsStrip } from '@/components/dashboard/metrics-strip';
import type { DashboardMetric } from '@/components/dashboard/types';
import {
  BriefcaseBusiness,
  Clock3,
  FileClock,
  FolderKanban,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const summaryItems: DashboardMetric[] = [
  {
    id: 'total-hours',
    label: 'Total Hours',
    value: '38h 20m',
    delta: '+12%',
    trend: 'up',
    icon: Clock3,
  },
  {
    id: 'billable-hours',
    label: 'Billable Hours',
    value: '29h 10m',
    delta: '+7%',
    trend: 'up',
    icon: BriefcaseBusiness,
  },
  {
    id: 'entries',
    label: 'Entries',
    value: '42',
    delta: '+5',
    trend: 'up',
    icon: FileClock,
  },
  {
    id: 'active-projects',
    label: 'Active Projects',
    value: '8',
    delta: '+2',
    trend: 'up',
    icon: FolderKanban,
  },
];

const timerProjects: TimerProject[] = [
  {
    id: 'p1',
    name: 'Acme Website Revamp',
    tasks: ['Design', 'Frontend', 'QA'],
  },
  {
    id: 'p2',
    name: 'Internal Dashboard',
    tasks: ['Planning', 'Implementation', 'Review'],
  },
  {
    id: 'p3',
    name: 'Mobile MVP',
    tasks: ['Research', 'API Integration', 'Testing'],
  },
];

const recentEntries: RecentTimeEntry[] = [
  {
    id: '1',
    project: 'Acme Website Revamp',
    task: 'Frontend',
    duration: '2h 10m',
    dateLabel: 'Feb 22',
    billable: true,
  },
  {
    id: '2',
    project: 'Internal Dashboard',
    task: 'Planning',
    duration: '1h 35m',
    dateLabel: 'Feb 22',
    billable: false,
  },
  {
    id: '3',
    project: 'Mobile MVP',
    task: 'API Integration',
    duration: '3h 05m',
    dateLabel: 'Feb 21',
    billable: true,
  },
  {
    id: '4',
    project: 'Acme Website Revamp',
    task: 'QA',
    duration: '1h 10m',
    dateLabel: 'Feb 21',
    billable: true,
  },
  {
    id: '5',
    project: 'Internal Dashboard',
    task: 'Review',
    duration: '0h 45m',
    dateLabel: 'Feb 20',
    billable: false,
  },
];

const kpiRoles = ['Employee', 'Manager', 'HR', 'Director'];

const kpiItems: KpiSnapshotItem[] = [
  {
    id: 'kpi1',
    title: 'Delivery Quality',
    target: 'Keep defect leakage below 3%',
    ratings: { Employee: 4.4, Manager: 4.1, HR: 4.0, Director: 4.2 },
  },
  {
    id: 'kpi2',
    title: 'Ownership',
    target: 'Own high-priority tickets end-to-end',
    ratings: { Employee: 4.1, Manager: 4.3, HR: 4.0, Director: 3.8 },
  },
  {
    id: 'kpi3',
    title: 'Communication',
    target: 'Daily updates and risk escalation',
    ratings: { Employee: 3.9, Manager: 4.0, HR: 3.8, Director: 4.1 },
  },
];

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getStartOfWeek = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() - next.getDay());
  return next;
};

const makeHours = (seed: number, dayOffset: number) => {
  const raw = Math.sin(seed * 17 + dayOffset * 7) * 3 + 5;
  return Math.max(0, Number(raw.toFixed(1)));
};

export default function CardsDemo() {
  const [timerProjectId, setTimerProjectId] = useState('');
  const [timerTask, setTimerTask] = useState('');
  const [timerElapsed, setTimerElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Manager');
  const [weekAnchor, setWeekAnchor] = useState(new Date());

  useEffect(() => {
    if (!timerRunning || timerPaused) return;
    const interval = window.setInterval(
      () => setTimerElapsed((prev) => prev + 1),
      1000,
    );
    return () => window.clearInterval(interval);
  }, [timerPaused, timerRunning]);

  const weekDays = useMemo<WeeklyOverviewDay[]>(() => {
    const start = getStartOfWeek(weekAnchor);
    const seed = Math.floor(start.getTime() / (1000 * 60 * 60 * 24));
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return {
        id: `${date.toISOString()}-${index}`,
        label: dayLabels[date.getDay()],
        dateLabel: String(date.getDate()),
        hours: makeHours(seed, index),
      };
    });
  }, [weekAnchor]);

  const totalWeekHours = useMemo(
    () => weekDays.reduce((sum, day) => sum + day.hours, 0),
    [weekDays],
  );

  return (
    <div className="@container grid gap-4 p-2 md:p-4">
      <DashboardMetricsStrip metrics={summaryItems} />
      <div className="grid items-start gap-4 @5xl:grid-cols-2">
        <CardsRunningTimer
          projects={timerProjects}
          projectId={timerProjectId}
          task={timerTask}
          isRunning={timerRunning}
          isPaused={timerPaused}
          elapsedSeconds={timerElapsed}
          onProjectChange={setTimerProjectId}
          onTaskChange={setTimerTask}
          onStart={() => {
            setTimerRunning(true);
            setTimerPaused(false);
          }}
          onPauseToggle={() => setTimerPaused((prev) => !prev)}
          onStop={() => {
            setTimerRunning(false);
            setTimerPaused(false);
            setTimerElapsed(0);
          }}
        />
        <CardsWeeklyOverview
          days={weekDays}
          totalHours={totalWeekHours}
          onPreviousWeek={() => {
            const prev = new Date(weekAnchor);
            prev.setDate(prev.getDate() - 7);
            setWeekAnchor(prev);
          }}
          onNextWeek={() => {
            const next = new Date(weekAnchor);
            next.setDate(next.getDate() + 7);
            setWeekAnchor(next);
          }}
        />
      </div>
      <div className="grid gap-4 @6xl:grid-cols-[1.15fr_1fr]">
        <div className="self-start">
          <CardsRecentEntries entries={recentEntries} />
        </div>
        <div className="flex flex-col gap-4">
          <CardsKpiSnapshot
            roles={kpiRoles}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            kpis={kpiItems}
          />
        </div>
      </div>
    </div>
  );
}
