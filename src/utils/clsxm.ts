import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge classes with tailwind-merge with clsx full feature */
const clsxm = (...classes: ClassValue[]) => {
  return twMerge(clsx(...classes));
};

// Export cn as an alias for clsxm
export const cn = clsxm;

export default clsxm;
