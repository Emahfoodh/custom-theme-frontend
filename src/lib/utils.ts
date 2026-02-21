import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ts-prune-ignore-next
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
