import type { ClassValue } from 'clsx';
import clsxm from './clsxm';

/** Alias for clsxm - merges classes with tailwind-merge and clsx */
export const cn = (...classes: ClassValue[]) => {
  return clsxm(...classes);
};
