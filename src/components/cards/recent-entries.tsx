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
import { useMemo, useState } from 'react';

export type RecentTimeEntry = {
  id: string;
  project: string;
  task: string;
  duration: string;
  dateLabel: string;
  billable: boolean;
};

interface CardsRecentEntriesProps {
  entries: RecentTimeEntry[];
}

type FilterMode = 'all' | 'billable' | 'non-billable';

export function CardsRecentEntries({ entries }: CardsRecentEntriesProps) {
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<FilterMode>('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesMode =
        mode === 'all' ||
        (mode === 'billable' ? entry.billable : !entry.billable);
      if (!matchesMode) return false;
      if (!q) return true;
      return (
        entry.project.toLowerCase().includes(q) ||
        entry.task.toLowerCase().includes(q) ||
        entry.dateLabel.toLowerCase().includes(q)
      );
    });
  }, [entries, mode, search]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Entries</CardTitle>
        <CardDescription>
          Filter by billing state and search project/task names.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-3 @2xl:flex-row @2xl:items-center @2xl:justify-between">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search entries..."
            className="@2xl:max-w-sm"
          />
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value as FilterMode)}
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
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead className="text-right">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-16 text-center text-muted-foreground"
                  >
                    No matching entries.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {entry.project}
                    </TableCell>
                    <TableCell>{entry.task}</TableCell>
                    <TableCell>{entry.dateLabel}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {entry.duration}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={entry.billable ? 'default' : 'secondary'}>
                        {entry.billable ? 'Billable' : 'Non-Billable'}
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
