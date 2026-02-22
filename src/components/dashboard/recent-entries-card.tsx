'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DashboardEntryRow } from './types';

export type BillingFilter = 'all' | 'billable' | 'non-billable';

interface DashboardRecentEntriesCardProps {
  rows: DashboardEntryRow[];
  search: string;
  billingFilter: BillingFilter;
  onSearchChange: (value: string) => void;
  onBillingFilterChange: (value: BillingFilter) => void;
}

export function DashboardRecentEntriesCard({
  rows,
  search,
  billingFilter,
  onSearchChange,
  onBillingFilterChange,
}: DashboardRecentEntriesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Entries</CardTitle>
        <CardDescription>
          Review tracked sessions across projects and members.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-3 @2xl:flex-row @2xl:items-center @2xl:justify-between">
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by project, task, member..."
            className="@2xl:max-w-sm"
          />
          <Tabs
            value={billingFilter}
            onValueChange={(value) =>
              onBillingFilterChange(value as BillingFilter)
            }
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="billable">Billable</TabsTrigger>
              <TabsTrigger value="non-billable">Non-Billable</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead className="text-right">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-20 text-center text-muted-foreground"
                  >
                    No matching entries.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.project}</TableCell>
                    <TableCell>{row.task}</TableCell>
                    <TableCell>{row.member}</TableCell>
                    <TableCell>{row.dateLabel}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.durationLabel}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={row.billable ? 'default' : 'secondary'}>
                        {row.billable ? 'Billable' : 'Non-Billable'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
