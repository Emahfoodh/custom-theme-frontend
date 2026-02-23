/*
 * This file is part of tweakcn
 * Copyright (c) Sahaj J.
 * Licensed under the Apache License 2.0
 *
 * Modifications 2026:
 * - Code formatting adjustments
 * - Updated import paths to match project structure
 */

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): T & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout;

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  } as T & { cancel: () => void };

  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debounced;
}
