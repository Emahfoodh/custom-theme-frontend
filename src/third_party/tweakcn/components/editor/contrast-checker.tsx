/*
 * This file is part of tweakcn
 * Copyright (c) Sahaj J.
 * Licensed under the Apache License 2.0
 *
 * Modifications 2026:
 * - Code formatting adjustments
 * - Updated import paths to match project structure
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useTheme } from '@/third_party/tweakcn/components/theme-provider';
import { useContrastChecker } from '@/third_party/tweakcn/hooks/use-contrast-checker';
import { ThemeStyleProps } from '@/third_party/tweakcn/types/theme';
import { AlertTriangle, Check, Contrast, Moon, Sun } from 'lucide-react';
import { useMemo, useState } from 'react';

type ContrastCheckerProps = {
  currentStyles: ThemeStyleProps;
};

type ColorCategory = 'content' | 'interactive' | 'functional';

type ColorPair = {
  id: string;
  foreground: string | undefined;
  background: string | undefined;
  label: string;
  category: ColorCategory;
};

const MIN_CONTRAST_RATIO = 4.5;

const categoryLabel: Record<ColorCategory, string> = {
  content: 'Content & Containers',
  interactive: 'Interactive Elements',
  functional: 'Navigation & Functional',
};

const categories: ColorCategory[] = ['content', 'interactive', 'functional'];

const ContrastChecker = ({ currentStyles }: ContrastCheckerProps) => {
  const { theme, toggleTheme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'issues'>('all');

  const colorPairsToCheck: ColorPair[] = [
    {
      id: 'base',
      foreground: currentStyles?.foreground,
      background: currentStyles?.background,
      label: 'Base',
      category: 'content',
    },
    {
      id: 'card',
      foreground: currentStyles?.['card-foreground'],
      background: currentStyles?.card,
      label: 'Card',
      category: 'content',
    },
    {
      id: 'popover',
      foreground: currentStyles?.['popover-foreground'],
      background: currentStyles?.popover,
      label: 'Popover',
      category: 'content',
    },
    {
      id: 'muted',
      foreground: currentStyles?.['muted-foreground'],
      background: currentStyles?.muted,
      label: 'Muted',
      category: 'content',
    },
    {
      id: 'primary',
      foreground: currentStyles?.['primary-foreground'],
      background: currentStyles?.primary,
      label: 'Primary',
      category: 'interactive',
    },
    {
      id: 'secondary',
      foreground: currentStyles?.['secondary-foreground'],
      background: currentStyles?.secondary,
      label: 'Secondary',
      category: 'interactive',
    },
    {
      id: 'accent',
      foreground: currentStyles?.['accent-foreground'],
      background: currentStyles?.accent,
      label: 'Accent',
      category: 'interactive',
    },
    {
      id: 'destructive',
      foreground: currentStyles?.['destructive-foreground'],
      background: currentStyles?.destructive,
      label: 'Destructive',
      category: 'functional',
    },
    {
      id: 'sidebar',
      foreground: currentStyles?.['sidebar-foreground'],
      background: currentStyles?.sidebar,
      label: 'Sidebar Base',
      category: 'functional',
    },
    {
      id: 'sidebar-primary',
      foreground: currentStyles?.['sidebar-primary-foreground'],
      background: currentStyles?.['sidebar-primary'],
      label: 'Sidebar Primary',
      category: 'functional',
    },
    {
      id: 'sidebar-accent',
      foreground: currentStyles?.['sidebar-accent-foreground'],
      background: currentStyles?.['sidebar-accent'],
      label: 'Sidebar Accent',
      category: 'functional',
    },
  ];

  const validPairs = colorPairsToCheck.filter(
    (pair): pair is ColorPair & { foreground: string; background: string } =>
      !!pair.foreground && !!pair.background,
  );
  const contrastResults = useContrastChecker(validPairs);

  const totalIssues = useMemo(
    () =>
      contrastResults.filter(
        (result) => result.contrastRatio < MIN_CONTRAST_RATIO,
      ).length,
    [contrastResults],
  );

  const visiblePairs = useMemo(() => {
    if (filter === 'all') return colorPairsToCheck;

    return colorPairsToCheck.filter((pair) => {
      const result = contrastResults.find((entry) => entry.id === pair.id);
      return !!result && result.contrastRatio < MIN_CONTRAST_RATIO;
    });
  }, [filter, colorPairsToCheck, contrastResults]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start px-2">
          <Contrast className="h-4 w-4" />
          <span className="text-sm">Contrast</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle>Contrast Checker</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
            >
              {theme === 'light' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
          <DialogDescription>
            WCAG AA recommends at least {MIN_CONTRAST_RATIO}:1 for normal text.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === 'issues' ? 'default' : 'outline'}
            onClick={() => setFilter('issues')}
            disabled={totalIssues === 0}
          >
            <AlertTriangle className="mr-1 h-3.5 w-3.5" />
            Issues ({totalIssues})
          </Button>
        </div>

        <ScrollArea className="max-h-[60vh] pr-3">
          <div className="space-y-4">
            {categories.map((category) => {
              const pairsInCategory = visiblePairs.filter(
                (pair) => pair.category === category,
              );
              if (pairsInCategory.length === 0) return null;

              return (
                <section key={category} className="space-y-2">
                  <h4 className="text-sm font-medium">
                    {categoryLabel[category]}
                  </h4>
                  <div className="space-y-2">
                    {pairsInCategory.map((pair) => {
                      const result = contrastResults.find(
                        (entry) => entry.id === pair.id,
                      );
                      const ratio = result?.contrastRatio;
                      const isPass =
                        typeof ratio === 'number' &&
                        ratio >= MIN_CONTRAST_RATIO;

                      return (
                        <div
                          key={pair.id}
                          className="bg-muted/30 flex items-center justify-between rounded-md border px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{pair.label}</span>
                            {pair.foreground && pair.background ? (
                              <div className="flex overflow-hidden rounded border">
                                <span
                                  className="h-4 w-5"
                                  style={{ backgroundColor: pair.foreground }}
                                  title={`Foreground: ${pair.foreground}`}
                                />
                                <span
                                  className="h-4 w-5"
                                  style={{ backgroundColor: pair.background }}
                                  title={`Background: ${pair.background}`}
                                />
                              </div>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-xs tabular-nums">
                              {typeof ratio === 'number'
                                ? `${ratio.toFixed(2)}:1`
                                : 'N/A'}
                            </span>
                            <Badge
                              variant={isPass ? 'default' : 'destructive'}
                              className={cn('h-6')}
                            >
                              {isPass ? (
                                <>
                                  <Check className="mr-1 h-3.5 w-3.5" />
                                  Pass
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                                  Fail
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Separator />
                </section>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ContrastChecker;
