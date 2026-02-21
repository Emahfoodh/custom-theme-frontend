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

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

export function TooltipWrapper({
  label,
  command,
  className,
  children,
  ...props
}: ComponentProps<typeof TooltipTrigger> & {
  label: string;
  command?: React.ReactNode;
}) {
  return (
    <Tooltip key={label}>
      <TooltipTrigger className={cn(className)} {...props}>
        {children}
      </TooltipTrigger>

      <TooltipContent>
        <span className="flex items-center gap-[1ch]">
          {label}
          {command && (
            <kbd className="bg-muted text-muted-foreground flex items-center gap-[0.5ch] rounded px-1.5 py-0.5 font-mono text-xs [&>svg]:size-3">
              {command}
            </kbd>
          )}
        </span>
      </TooltipContent>
    </Tooltip>
  );
}
