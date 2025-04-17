import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// A utility function for merging Tailwind CSS classes with clsx and tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
