'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Pause, Play, Square, Timer } from 'lucide-react';

export type TimerProject = {
  id: string;
  name: string;
  tasks: string[];
};

const formatElapsed = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return {
    h: h.toString(),
    m: m.toString().padStart(2, '0'),
    s: s.toString().padStart(2, '0'),
  };
};

interface CardsRunningTimerProps {
  projects: TimerProject[];
  projectId: string;
  task: string;
  isRunning: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  onProjectChange: (projectId: string) => void;
  onTaskChange: (task: string) => void;
  onStart: () => void;
  onPauseToggle: () => void;
  onStop: () => void;
  isBusy?: boolean;
}

export function CardsRunningTimer({
  projects,
  projectId,
  task,
  isRunning,
  isPaused,
  elapsedSeconds,
  onProjectChange,
  onTaskChange,
  onStart,
  onPauseToggle,
  onStop,
  isBusy = false,
}: CardsRunningTimerProps) {
  const selectedProject = projects.find((project) => project.id === projectId);

  const startDisabled = !projectId || !task || isRunning;
  const pauseDisabled = !isRunning;
  const stopDisabled = !isRunning && elapsedSeconds === 0;

  const time = formatElapsed(elapsedSeconds);
  const isActive = isRunning && !isPaused;

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card">
      {/* Subtle glow effect when recording */}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-timer-glow" />
        </div>
      )}

      <CardHeader className="pb-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex size-9 items-center justify-center rounded-lg transition-colors',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              <Timer className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base">Timer</CardTitle>
              <CardDescription className="text-xs">
                Track your work sessions
              </CardDescription>
            </div>
          </div>
          <StatusIndicator isRunning={isRunning} isPaused={isPaused} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* Timer Display */}
        <div className="flex flex-col items-center gap-2 py-4">
          <div className="flex items-baseline gap-1 font-mono">
            <TimerDigit value={time.h} />
            <span className="text-3xl text-muted-foreground/40 font-light">
              :
            </span>
            <TimerDigit value={time.m} />
            <span className="text-3xl text-muted-foreground/40 font-light">
              :
            </span>
            <TimerDigit value={time.s} />
          </div>
          <div className="flex gap-4 text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50">
            <span className="w-16 text-center">hrs</span>
            <span className="w-16 text-center">min</span>
            <span className="w-16 text-center">sec</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/50" />

        {/* Selectors */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground text-center">
              Project
            </label>
            <Select
              value={projectId}
              onValueChange={(value) => {
                onProjectChange(value);
                onTaskChange('');
              }}
              disabled={isRunning || isBusy}
            >
              <SelectTrigger className="h-10 w-full bg-muted/50 border-border/50 text-foreground">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground text-center">
              Task
            </label>
            <Select
              value={task}
              onValueChange={onTaskChange}
              disabled={!selectedProject || isRunning || isBusy}
            >
              <SelectTrigger className="h-10 w-full bg-muted/50 border-border/50 text-foreground">
                <SelectValue placeholder="Select task" />
              </SelectTrigger>
              <SelectContent>
                {(selectedProject?.tasks ?? []).map((projectTask) => (
                  <SelectItem key={projectTask} value={projectTask}>
                    {projectTask}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2 pt-0">
        {!isRunning ? (
          <Button
            className="flex-1 h-10 gap-2 font-medium"
            disabled={startDisabled || isBusy}
            onClick={onStart}
          >
            <Play className="size-3.5" />
            Start Session
          </Button>
        ) : (
          <>
            <Button
              className="flex-1 h-10 gap-2 font-medium"
              variant="secondary"
              disabled={pauseDisabled || isBusy}
              onClick={onPauseToggle}
            >
              {isPaused ? (
                <Play className="size-3.5" />
              ) : (
                <Pause className="size-3.5" />
              )}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              className="h-10 gap-2 px-5 font-medium"
              variant="outline"
              disabled={stopDisabled || isBusy}
              onClick={onStop}
            >
              <Square className="size-3" />
              Stop
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

function TimerDigit({ value }: { value: string }) {
  return (
    <span className="inline-flex w-16 items-center justify-center text-5xl font-semibold tracking-tight text-foreground tabular-nums">
      {value}
    </span>
  );
}

function StatusIndicator({
  isRunning,
  isPaused,
}: {
  isRunning: boolean;
  isPaused: boolean;
}) {
  const isActive = isRunning && !isPaused;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
        isActive
          ? 'bg-primary/15 text-primary'
          : isPaused
            ? 'bg-accent text-accent-foreground'
            : 'bg-muted text-muted-foreground',
      )}
    >
      <span className="relative flex size-1.5">
        {isActive && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        )}
        <span
          className={cn(
            'relative inline-flex size-1.5 rounded-full',
            isActive
              ? 'bg-primary'
              : isPaused
                ? 'bg-accent-foreground/50'
                : 'bg-muted-foreground/50',
          )}
        />
      </span>
      {isRunning ? (isPaused ? 'Paused' : 'Recording') : 'Idle'}
    </div>
  );
}
