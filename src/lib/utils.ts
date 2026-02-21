import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
// @ts-expect-error: owned by ngard
import { isEqual } from '@ngard/tiny-isequal';

// ts-prune-ignore-next
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isDeepEqual(a: unknown, b: unknown): boolean {
  return isEqual(a, b);
}
