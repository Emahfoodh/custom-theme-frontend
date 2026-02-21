'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/third_party/tweakcn/components/theme-provider';
import { TooltipWrapper } from '@/third_party/tweakcn/components/tooltip-wrapper';
import { Moon, Sun } from 'lucide-react';
import type { ComponentProps, MouseEvent } from 'react';
import { useSyncExternalStore } from 'react';

type ThemeToggleProps = ComponentProps<typeof Button>;
const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isClient = useIsClient();

  const handleThemeToggle = (event: MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;
    toggleTheme({ x, y });
  };

  return (
    <TooltipWrapper label="Toggle theme" asChild>
      <Button
        className={cn('cursor-pointer', className)}
        {...props}
        onClick={handleThemeToggle}
      >
        {!isClient || theme === 'light' ? <Sun /> : <Moon />}
      </Button>
    </TooltipWrapper>
  );
}
