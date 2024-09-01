import * as React from 'react';

import clsxm from '@utils/clsxm';

const badgeVariants = (variant?: BadgeVariant) =>
  clsxm(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    !variant ||
      (variant === 'default' &&
        'border-transparent bg-pink-600 text-white shadow hover:bg-primary/80'),
    variant === 'secondary' &&
      'border-transparent bg-gray-200 text-gray-600 hover:bg-gray-200/80',
    variant === 'destructive' &&
      'border-transparent bg-red-600 text-white shadow hover:bg-red-700',
    variant === 'outline' && 'text-foreground'
  );

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

type BadgeProps = {
  variant?: BadgeVariant;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Badge: React.FC<BadgeProps> = ({ className, variant, ...props }) => {
  return (
    <div className={clsxm(badgeVariants(variant), className)} {...props} />
  );
};

export { Badge, type BadgeVariant };
